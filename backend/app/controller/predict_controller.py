from sqlalchemy.orm import Session

from app.services.fetch_service import fetch_data, get_date_range, process_raw_data
from app.services.prediction_service import predict_next_day
from app.utils.check_prediction import predictions_exist
from app.utils.get_all_data import get_all_data
from app.utils.save_data_to_db import save_historical_data, save_prediction_data


def predict(db: Session):
    try:
        if not predictions_exist(db):
            from_date, to_date = get_date_range(None)
            raw_df = fetch_data(from_date, to_date)
            df = process_raw_data(raw_df)

            if not df.empty:
                save_historical_data(db, df)
                prediction = predict_next_day(df)
                save_prediction_data(db, prediction)

        past_data, pred_data = get_all_data(db)
        return {
            "success": True,
            "live_fetch": True,
            "historical": past_data,
            "predictions": pred_data,
        }

    except Exception as e:
        past_data, pred_data = get_all_data(db)

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
