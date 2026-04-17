# AgroPredict

AgroPredict is a full-stack market intelligence app for agricultural commodities.
It combines a FastAPI backend with a React + Vite frontend to provide:

- historical commodity price data
- LSTM based predictions
- market alerts derived from recent trends

## What The App Does

AgroPredict helps users track market movement and estimate near-future prices for key agriculture commodities across three groups: cereals, fruits, and vegetables.

At a high level, the app works like this:

1. Collects market data from external sources and stores normalized records in PostgreSQL.
2. Organizes data by category and commodity so each group can be analyzed separately.
3. Uses category-specific trained models to generate multi-day forecasts from recent historical trends.
4. Returns a unified API payload that includes both latest history and upcoming predictions.
5. Computes market alerts from recent volatility and trend changes to highlight risk/opportunity signals.
6. Serves all of this to a React dashboard for charts, tables, and category views.


## Tech Stack

- Frontend: React, Vite, Axios, Recharts, Tailwind CSS
- Backend: FastAPI, SQLAlchemy, Pandas, scikit-learn, TensorFlow
- Database: PostgreSQL

## Repository Structure

- `frontend/` React dashboard and UI
- `backend/` FastAPI API, data processing, prediction services, DB models
- `ML_model/` category model artifacts and related data assets


## Environment Variables

### Backend

1. Copy `backend/.env.sample` to `backend/.env`
2. Set a valid PostgreSQL connection string:

```env
DATABASE_URL=postgresql://postgres:<your_password>@localhost:5432/agropredict
```

### Frontend

1. Copy `frontend/.env.sample` to `frontend/.env`
2. Set backend URL:

```env
VITE_BACKEND_URL=http://127.0.0.1:8000
```

## First-Time Backend Setup

Run from the `backend` folder:

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m app.create_table
```

## Run Backend

From the `backend` folder:

```bash
venv\Scripts\activate
uvicorn app.main:app --reload
```

Backend URLs:

- API base: http://127.0.0.1:8000
- Swagger docs: http://127.0.0.1:8000/docs

## Run Frontend

From the `frontend` folder:

```bash
npm install
npm run dev
```

Frontend default URL:

- http://127.0.0.1:5173

## API Endpoints (Current)

- `GET /` health check
- `GET /api/predict/cereals` cereals data + predictions
- `GET /api/predict/fruits` fruits data + predictions
- `GET /api/predict/vegetables` vegetables data + predictions
- `GET /api/alerts` general market alerts

Predict endpoints return:

- `success`
- `category`
- `live_fetch`
- `historical`
- `predictions`
- optional `message` / `warning` / `error`

## Current Integration Note

The backend now exposes category-specific prediction routes.

If your frontend still calls `GET /api/predict`, update it to call one of:

- `/api/predict/cereals`
- `/api/predict/fruits`
- `/api/predict/vegetables`

## Helpful Backend Scripts

- `python -m app.check_model` quick model check
- `python -m app.create_table` create DB tables
- `python -m app.GOVT_API.(particular)` to check the govt api services 


## Related Docs

- Frontend API handoff: `FRONTEND_API_HANDOFF.md`
- Backend setup notes: `backend/run.md`