from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import (
    alerts_route,
    predict_cereals_route,
    predict_fruits_route,
    predict_vegetable_route,
)

app = FastAPI(title="AgroPredict API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_cereals_route.router, prefix="/api")
app.include_router(predict_fruits_route.router, prefix="/api")
app.include_router(predict_vegetable_route.router, prefix="/api")
app.include_router(alerts_route.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "AgroPredict API is running successfully!"}
