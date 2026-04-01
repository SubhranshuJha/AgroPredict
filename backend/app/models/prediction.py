from sqlalchemy import Column, Integer, Float, String, Date, UniqueConstraint, Index
from app.config.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    date = Column(Date, nullable=False)
    commodity = Column(String, nullable=False)

    predicted_price = Column(Float, nullable=False)

    # Constraints + indexing
    __table_args__ = (
        UniqueConstraint('date', 'commodity', name='uix_prediction_date_commodity'),
        Index('idx_prediction_date_commodity', 'date', 'commodity'),
    )