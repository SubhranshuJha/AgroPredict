from datetime import datetime, timedelta

import pandas as pd
from sqlalchemy.orm import Session

from app.models.historical import (
    HistoricalCerealsData,
    HistoricalFruitsData,
    HistoricalVegetablesData,
)
from app.models.prediction import PredictionCereals, PredictionFruits, PredictionVegetables
from app.services.fetch_service import fetch_data, get_date_range, process_raw_data
from app.services.prediction_service import get_category_commodities, predict_next_days
from app.utils.check_prediction import predictions_exist
from app.utils.get_all_data import get_all_data
from app.utils.save_data_to_db import save_historical_data, save_prediction_data


CATEGORY_CONFIG = {
    "cereals": {
        "historical_model": HistoricalCerealsData,
        "prediction_model": PredictionCereals,
    },
    "fruits": {
        "historical_model": HistoricalFruitsData,
        "prediction_model": PredictionFruits,
    },
    "vegetables": {
        "historical_model": HistoricalVegetablesData,
        "prediction_model": PredictionVegetables,
    },
}


def _get_config(category: str):
    config = CATEGORY_CONFIG.get(category)
    if config is None:
        raise ValueError(f"Unknown category: {category}")
    return config


def _build_prediction_input_from_db(
    db: Session,
    historical_model,
) -> tuple[pd.DataFrame, object] | tuple[None, None]:
    latest_row = db.query(historical_model).order_by(historical_model.date.desc()).first()
    if not latest_row:
        return None, None

    latest_date = latest_row.date
    cutoff_date = latest_date - timedelta(days=120)

    rows = db.query(historical_model).filter(
        historical_model.date >= cutoff_date
    ).order_by(historical_model.date.asc()).all()
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


def _generate_predictions(
    db: Session,
    prediction_df: pd.DataFrame,
    latest_date,
    days: int,
    category: str,
    prediction_model,
) -> None:
    future_predictions = predict_next_days(prediction_df, days=days, category=category)
    for day_offset, prediction in enumerate(future_predictions, start=1):
        save_prediction_data(
            db,
            prediction,
            prediction_date=latest_date + timedelta(days=day_offset),
            model_class=prediction_model,
        )


def predict_category(db: Session, category: str, days: int = 7):
    config = _get_config(category)
    historical_model = config["historical_model"]
    prediction_model = config["prediction_model"]

    try:
        days = max(1, days)
        latest_row = db.query(historical_model).order_by(historical_model.date.desc()).first()
        last_date = latest_row.date if latest_row else None
        today = datetime.today().date()

        # Refresh history when DB is stale, and also refresh today's rows
        # because the upstream market feed can publish late updates.
        if last_date is None or last_date <= today:
            if last_date == today:
                from_date, to_date = today, today
            else:
                from_date, to_date = get_date_range(last_date)
            raw_df = fetch_data(from_date, to_date, category=category)
            df = process_raw_data(raw_df)

            if not df.empty:
                category_commodities = set(get_category_commodities(category))
                df = df[df["Commodity"].isin(category_commodities)]
                save_historical_data(db, df, model_class=historical_model)

            latest_row = db.query(historical_model).order_by(historical_model.date.desc()).first()
            last_date = latest_row.date if latest_row else None

        # Generate predictions for the latest available historical date only.
        target_prediction_date = last_date + timedelta(days=days) if last_date is not None else None
        if target_prediction_date is None or not predictions_exist(db, target_prediction_date, model_class=prediction_model):
            prediction_df, latest_date = _build_prediction_input_from_db(db, historical_model)
            if prediction_df is not None and latest_date is not None:
                _generate_predictions(db, prediction_df, latest_date, days, category, prediction_model)

        past_data, pred_data = get_all_data(
            db,
            prediction_days=days,
            historical_model=historical_model,
            prediction_model=prediction_model,
        )
        return {
            "success": True,
            "category": category,
            "live_fetch": True,
            "historical": past_data,
            "predictions": pred_data,
        }

    except Exception as e:
        cached_df, latest_date = _build_prediction_input_from_db(db, historical_model)

        if cached_df is not None and latest_date is not None:
            try:
                _generate_predictions(db, cached_df, latest_date, days, category, prediction_model)
            except Exception:
                pass

        past_data, pred_data = get_all_data(
            db,
            prediction_days=days,
            historical_model=historical_model,
            prediction_model=prediction_model,
        )

        if past_data or pred_data:
            return {
                "success": True,
                "category": category,
                "live_fetch": False,
                "message": "Live market data is unavailable, returning cached data.",
                "historical": past_data,
                "predictions": pred_data,
                "warning": str(e),
            }

        return {
            "success": False,
            "category": category,
            "live_fetch": False,
            "message": "Live market data is unavailable and no cached data exists.",
            "historical": [],
            "predictions": [],
            "error": str(e),
        }
