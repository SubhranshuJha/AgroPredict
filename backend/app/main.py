from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import predict_route

app = FastAPI(title="AgroPredict API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_route.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "AgroPredict API is running successfully!"}
