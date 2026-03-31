from sqlalchemy import Column, Integer, Float, String, Date
from app.config.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    date = Column(Date, index=True)
    commodity = Column(String, index=True)

    predicted_price = Column(Float)