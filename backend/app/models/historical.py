from sqlalchemy import Column, Integer, Float, String, Date
from app.config.database import Base


class HistoricalData(Base):
    __tablename__ = "historical_data"

    id = Column(Integer, primary_key=True, index=True)

    date = Column(Date, index=True)
    commodity = Column(String, index=True)

    avg_price = Column(Float)
    min_price = Column(Float)
    max_price = Column(Float)
    modal_price = Column(Float)