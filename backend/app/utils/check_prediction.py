from datetime import date

from sqlalchemy.orm import Session

from app.models.prediction import Prediction


def predictions_exist(db: Session, prediction_date: date):
    existing = db.query(Prediction).filter(
        Prediction.date == prediction_date
    ).first()

    return existing is not None
