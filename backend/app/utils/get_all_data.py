from datetime import timedelta

from app.models.historical import HistoricalData
from app.models.prediction import Prediction

EXCLUDED_COMMODITIES = {
    "mint(pudina)",
    "spinach",
    "lemon",
    "raddish",
    "coriander(leaves)",
}


def _is_excluded_commodity(name):
    if not isinstance(name, str):
        return False
    return name.strip().lower() in EXCLUDED_COMMODITIES


def get_all_data(db, prediction_days=1, historical_model=HistoricalData, prediction_model=Prediction):
    latest_row = db.query(historical_model).order_by(historical_model.date.desc()).first()
    if latest_row:
        cutoff_date = latest_row.date - timedelta(days=29)
        hist = db.query(historical_model).filter(
            historical_model.date >= cutoff_date
        ).all()
    else:
        hist = []

    hist_data = [{
        "date": h.date,
        "commodity": h.commodity,
        "avg_price": h.avg_price,
        "min_price": h.min_price,
        "max_price": h.max_price,
        "modal_price": h.modal_price
    } for h in hist if not _is_excluded_commodity(h.commodity)]

    if latest_row:
        start_pred_date = latest_row.date + timedelta(days=1)
        end_pred_date = latest_row.date + timedelta(days=prediction_days)
        preds = db.query(prediction_model).filter(
            prediction_model.date >= start_pred_date,
            prediction_model.date <= end_pred_date
        ).order_by(prediction_model.date.asc(), prediction_model.commodity.asc()).all()
    else:
        preds = []

    pred_data = [{
        "date": p.date,
        "commodity": p.commodity,
        "predicted_price": p.predicted_price
    } for p in preds if not _is_excluded_commodity(p.commodity)]

    return hist_data, pred_data
