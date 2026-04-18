from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.controller.predict_fruits_controller import predict as predict_controller

router = APIRouter()


@router.get("/predict/fruits")
def predict_fruits_route(db: Session = Depends(get_db)):
    return predict_controller(db, days=7)
