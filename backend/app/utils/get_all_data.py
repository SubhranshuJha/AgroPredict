from datetime import timedelta

from app.models.historical import HistoricalData
from app.models.prediction import Prediction

def get_all_data(db):
    latest_row = db.query(HistoricalData).order_by(HistoricalData.date.desc()).first()
    if latest_row:
        cutoff_date = latest_row.date - timedelta(days=29)
        hist = db.query(HistoricalData).filter(
            HistoricalData.date >= cutoff_date
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
    } for h in hist]

    # 🔹 Predictions
    preds = db.query(Prediction).all()

    pred_data = [{
        "date": p.date,
        "commodity": p.commodity,
        "predicted_price": p.predicted_price
    } for p in preds]

    return hist_data, pred_data
