from datetime import date

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

    # Query existing rows once for the incoming window to avoid N queries.
    min_date = min(row["date"] for row in records)
    max_date = max(row["date"] for row in records)
    incoming_commodities = {row["commodity"] for row in records}

    existing_rows = db.query(HistoricalData).filter(
        HistoricalData.date >= min_date,
        HistoricalData.date <= max_date,
        HistoricalData.commodity.in_(incoming_commodities)
    ).all()
    existing_map = {(r.date, r.commodity): r for r in existing_rows}

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
