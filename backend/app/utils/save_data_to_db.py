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

    for row in records:
        exists = db.query(HistoricalData).filter_by(
            date=row["date"],
            commodity=row["commodity"]
        ).first()

        if not exists:
            db.add(HistoricalData(**row))

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
