from datetime import date

from sqlalchemy.orm import Session

from app.models.prediction import Prediction


def predictions_exist(db: Session, prediction_date: date, model_class=Prediction):
    existing = db.query(model_class).filter(
        model_class.date == prediction_date
    ).first()

    return existing is not None
