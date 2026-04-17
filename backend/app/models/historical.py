from sqlalchemy import Column, Integer, Float, String, Date, UniqueConstraint, Index
from app.config.database import Base


class HistoricalBase:
    id = Column(Integer, primary_key=True, index=True)

    date = Column(Date, nullable=False)
    commodity = Column(String, nullable=False)

    avg_price = Column(Float, nullable=True)
    min_price = Column(Float, nullable=True)
    max_price = Column(Float, nullable=True)
    modal_price = Column(Float, nullable=False)


class HistoricalCerealsData(HistoricalBase, Base):
    __tablename__ = "historical_cereals_data"

    __table_args__ = (
        UniqueConstraint("date", "commodity", name="uix_cereals_date_commodity"),
        Index("idx_cereals_date_commodity", "date", "commodity"),
    )


class HistoricalFruitsData(HistoricalBase, Base):
    __tablename__ = "historical_fruits_data"

    __table_args__ = (
        UniqueConstraint("date", "commodity", name="uix_fruits_date_commodity"),
        Index("idx_fruits_date_commodity", "date", "commodity"),
    )


class HistoricalVegetablesData(HistoricalBase, Base):
    __tablename__ = "historical_vegetables_data"

    __table_args__ = (
        UniqueConstraint("date", "commodity", name="uix_vegetables_date_commodity"),
        Index("idx_vegetables_date_commodity", "date", "commodity"),
    )


# Backward-compatible default used by older scripts/alerts.
HistoricalData = HistoricalCerealsData
