from datetime import date

import pandas as pd
from sqlalchemy.orm import Session

from app.models.historical import HistoricalData
from app.models.prediction import Prediction


def save_historical_data(db: Session, df):
    normalized_df = df.rename(columns={
        "Date": "date",
        "Commodity": "commodity",
        "Avg_Price": "avg_price",
        "Min_Price": "min_price",
        "Max_Price": "max_price",
        "Modal_Price": "modal_price",
    })
    records = normalized_df.to_dict(orient="records")
    if not records:
        return

    # Normalize key fields so comparisons match DB types exactly.
    cleaned_records = []
    for row in records:
        row_date = row.get("date")
        if isinstance(row_date, pd.Timestamp):
            row["date"] = row_date.date()
        elif hasattr(row_date, "to_pydatetime"):
            row["date"] = row_date.to_pydatetime().date()

        commodity = row.get("commodity")
        if isinstance(commodity, str):
            row["commodity"] = commodity.strip()

        cleaned_records.append(row)
    records = cleaned_records

    # Query existing rows once for the incoming window to avoid N queries.
    min_date = min(row["date"] for row in records)
    max_date = max(row["date"] for row in records)
    incoming_dates = {row["date"] for row in records}
    incoming_by_date = {}
    for row in records:
        incoming_by_date.setdefault(row["date"], set()).add(row["commodity"])

    existing_rows = db.query(HistoricalData).filter(
        HistoricalData.date >= min_date,
        HistoricalData.date <= max_date,
    ).all()
    # If duplicates already exist in DB for same (date, commodity), keep one and delete others.
    existing_map = {}
    duplicates_to_delete = []
    for r in existing_rows:
        key = (r.date, (r.commodity or "").strip())
        if key in existing_map:
            keep = existing_map[key]
            if r.id > keep.id:
                duplicates_to_delete.append(keep)
                existing_map[key] = r
            else:
                duplicates_to_delete.append(r)
        else:
            existing_map[key] = r

    for dup in duplicates_to_delete:
        db.delete(dup)

    # Reconcile snapshots: for each fetched date, remove stale commodities
    # that are no longer present in the latest source response for that date.
    for key, existing in list(existing_map.items()):
        row_date, row_commodity = key
        if row_date in incoming_dates and row_commodity not in incoming_by_date[row_date]:
            db.delete(existing)
            existing_map.pop(key, None)

    for row in records:
        key = (row["date"], row["commodity"])
        existing = existing_map.get(key)
        if existing is None:
            db.add(HistoricalData(**row))
        else:
            # Keep same-day commodities fresh when source prices are revised.
            existing.avg_price = row["avg_price"]
            existing.min_price = row["min_price"]
            existing.max_price = row["max_price"]
            existing.modal_price = row["modal_price"]

    db.commit()

def save_prediction_data(
    db: Session,
    prediction: dict[str, float],
    prediction_date: date | None = None,
):
    target_date = prediction_date or date.today()

    for target_name, price in prediction.items():
        commodity = target_name.removesuffix("_Modal")
        existing = db.query(Prediction).filter(
            Prediction.date == target_date,
            Prediction.commodity == commodity
        ).first()

        if existing:
            existing.predicted_price = float(price)
        else:
            db.add(Prediction(
                date=target_date,
                commodity=commodity,
                predicted_price=float(price)
            ))

    db.commit()
