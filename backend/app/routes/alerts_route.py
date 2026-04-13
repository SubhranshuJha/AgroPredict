from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.controller.alerts_controller import get_market_alerts

router = APIRouter() ;


@router.get("/alerts")
def market_alerts(db: Session = Depends(get_db)):
    """General market alerts based on latest daily data in historical_data."""
    return get_market_alerts(db)
