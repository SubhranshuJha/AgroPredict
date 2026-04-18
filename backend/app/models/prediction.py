from sqlalchemy import Column, Integer, Float, String, Date, UniqueConstraint, Index
from app.config.database import Base


class PredictionBase:
    id = Column(Integer, primary_key=True, index=True)

    date = Column(Date, nullable=False)
    commodity = Column(String, nullable=False)

    predicted_price = Column(Float, nullable=False)


class PredictionCereals(PredictionBase, Base):
    __tablename__ = "predictions_cereals"

    __table_args__ = (
        UniqueConstraint("date", "commodity", name="uix_prediction_cereals_date_commodity"),
        Index("idx_prediction_cereals_date_commodity", "date", "commodity"),
    )


class PredictionFruits(PredictionBase, Base):
    __tablename__ = "predictions_fruits"

    __table_args__ = (
        UniqueConstraint("date", "commodity", name="uix_prediction_fruits_date_commodity"),
        Index("idx_prediction_fruits_date_commodity", "date", "commodity"),
    )


class PredictionVegetables(PredictionBase, Base):
    __tablename__ = "predictions_vegetables"

    __table_args__ = (
        UniqueConstraint("date", "commodity", name="uix_prediction_vegetables_date_commodity"),
        Index("idx_prediction_vegetables_date_commodity", "date", "commodity"),
    )


# Backward-compatible default used by older cereal-only code.
Prediction = PredictionCereals
