from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.controller.predict_controller import predict as predict_controller

router = APIRouter()

@router.get("/predict")
def predict_route(db: Session = Depends(get_db)):
    return predict_controller(db)
