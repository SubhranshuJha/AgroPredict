from datetime import date
from sqlalchemy.orm import Session

from app.models.prediction import Prediction


def predictions_exist(db: Session):
    today = date.today()
    existing = db.query(Prediction).filter(
        Prediction.date == today
    ).first()

    return existing is not None
