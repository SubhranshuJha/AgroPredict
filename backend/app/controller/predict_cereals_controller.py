from sqlalchemy.orm import Session

from app.controller.predict_category_controller import predict_category


def predict(db: Session, days: int = 7):
    return predict_category(db, category="cereals", days=days)
