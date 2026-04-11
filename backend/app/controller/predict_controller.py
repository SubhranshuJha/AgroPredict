from datetime import datetime, timedelta

import pandas as pd
from sqlalchemy.orm import Session

from app.models.historical import HistoricalData
from app.services.fetch_service import fetch_data, get_date_range, process_raw_data
from app.services.prediction_service import predict_next_days
from app.utils.check_prediction import predictions_exist
from app.utils.get_all_data import get_all_data
from app.utils.save_data_to_db import save_historical_data, save_prediction_data


def _build_prediction_input_from_db(db: Session) -> tuple[pd.DataFrame, object] | tuple[None, None]:
    latest_row = db.query(HistoricalData).order_by(HistoricalData.date.desc()).first()
    if not latest_row:
        return None, None

    latest_date = latest_row.date
    cutoff_date = latest_date - timedelta(days=120)

    rows = db.query(HistoricalData).filter(
        HistoricalData.date >= cutoff_date
    ).order_by(HistoricalData.date.asc()).all()
    if not rows:
        return None, None

    records = [{
        "Date": row.date,
        "Commodity": row.commodity,
        "Avg_Price": row.avg_price,
        "Min_Price": row.min_price,
        "Max_Price": row.max_price,
        "Modal_Price": row.modal_price,
    } for row in rows]
    return pd.DataFrame(records), latest_date


def _generate_predictions(db: Session, prediction_df: pd.DataFrame, latest_date, days: int) -> None:
    future_predictions = predict_next_days(prediction_df, days=days)
    for day_offset, prediction in enumerate(future_predictions, start=1):
        save_prediction_data(db, prediction, prediction_date=latest_date + timedelta(days=day_offset))


def predict(db: Session, days: int = 7):
    try:
        days = max(1, days)
        latest_row = db.query(HistoricalData).order_by(HistoricalData.date.desc()).first()
        last_date = latest_row.date if latest_row else None
        today = datetime.today().date()

        # Refresh history when DB is stale, and also refresh today's rows
        # because the upstream market feed can publish late updates.
        if last_date is None or last_date <= today:
            if last_date == today:
                from_date, to_date = today, today
            else:
                from_date, to_date = get_date_range(last_date)
            raw_df = fetch_data(from_date, to_date)
            df = process_raw_data(raw_df)

            if not df.empty:
                save_historical_data(db, df)

            latest_row = db.query(HistoricalData).order_by(HistoricalData.date.desc()).first()
            last_date = latest_row.date if latest_row else None

        # Generate predictions for the latest available historical date only.
        target_prediction_date = last_date + timedelta(days=days) if last_date is not None else None
        if target_prediction_date is None or not predictions_exist(db, target_prediction_date):
            prediction_df, latest_date = _build_prediction_input_from_db(db)
            if prediction_df is not None and latest_date is not None:
                _generate_predictions(db, prediction_df, latest_date, days)

        past_data, pred_data = get_all_data(db, prediction_days=days)
        return {
            "success": True,
            "live_fetch": True,
            "historical": past_data,
            "predictions": pred_data,
        }

    except Exception as e:
        cached_df, latest_date = _build_prediction_input_from_db(db)

        if cached_df is not None and latest_date is not None:
            try:
                _generate_predictions(db, cached_df, latest_date, days)
            except Exception:
                pass

        past_data, pred_data = get_all_data(db, prediction_days=days)

        if past_data or pred_data:
            return {
                "success": True,
                "live_fetch": False,
                "message": "Live market data is unavailable, returning cached data.",
                "historical": past_data,
                "predictions": pred_data,
                "warning": str(e),
            }

        return {
            "success": False,
            "live_fetch": False,
            "message": "Live market data is unavailable and no cached data exists.",
            "historical": [],
            "predictions": [],
            "error": str(e),
        }
