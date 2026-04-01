from sqlalchemy import Column, Integer, Float, String, Date, UniqueConstraint, Index
from app.config.database import Base


class HistoricalData(Base):
    __tablename__ = "historical_data"

    id = Column(Integer, primary_key=True, index=True)

    date = Column(Date, nullable=False)
    commodity = Column(String, nullable=False)

    avg_price = Column(Float, nullable=True)
    min_price = Column(Float, nullable=True)
    max_price = Column(Float, nullable=True)
    modal_price = Column(Float, nullable=False)

    # Prevent duplicate entries
    __table_args__ = (
        UniqueConstraint('date', 'commodity', name='uix_date_commodity'),
        Index('idx_date_commodity', 'date', 'commodity'),
    )