# AgroPredict Frontend API Handoff

## Base URL

Local development:

```txt
http://127.0.0.1:8000
```

## CORS

The backend currently allows all origins.

## Available Endpoints

### GET /

Health check endpoint.

Example response:

```json
{
  "message": "AgroPredict API is running successfully!"
}
```

### GET /api/predict/cereals

Returns historical + predicted data for cereals.

### GET /api/predict/fruits

Returns historical + predicted data for fruits.

### GET /api/predict/vegetables

Returns historical + predicted data for vegetables.

Common behavior for all three category endpoints:

- returns latest available historical rows (up to 30 days)
- returns predictions for the next 7 days
- tries live fetch first
- falls back to cached DB data if live fetch fails

### GET /api/alerts

General market alerts generated from latest historical data across categories.

Backend caps and selection behavior:

- maximum 15 alerts per response
- up to 5 alerts selected per category before final merge
- up to 2 alerts per commodity
- sorted by severity in final output (danger, warn, info)

## Predict Endpoint Response Shape

These fields are shared by all category predict endpoints.

Success response (live fetch path):

```json
{
  "success": true,
  "category": "cereals",
  "live_fetch": true,
  "historical": [
    {
      "date": "2026-03-28",
      "commodity": "Wheat",
      "avg_price": 2447.805,
      "min_price": 2178.79,
      "max_price": 2716.82,
      "modal_price": 2441.66
    }
  ],
  "predictions": [
    {
      "date": "2026-03-29",
      "commodity": "Wheat",
      "predicted_price": 2450.64
    }
  ]
}
```

Success response (cached fallback path):

```json
{
  "success": true,
  "category": "cereals",
  "live_fetch": false,
  "message": "Live market data is unavailable, returning cached data.",
  "historical": [
    {
      "date": "2026-03-28",
      "commodity": "Wheat",
      "avg_price": 2447.805,
      "min_price": 2178.79,
      "max_price": 2716.82,
      "modal_price": 2441.66
    }
  ],
  "predictions": [
    {
      "date": "2026-03-29",
      "commodity": "Wheat",
      "predicted_price": 2450.64
    }
  ],
  "warning": "..."
}
```

Failure response when no usable cached data exists:

```json
{
  "success": false,
  "category": "cereals",
  "live_fetch": false,
  "message": "Live market data is unavailable and no cached data exists.",
  "historical": [],
  "predictions": [],
  "error": "..."
}
```

## Alerts Endpoint Response Shape

Success example:

```json
{
  "success": true,
  "alerts": [
    {
      "type": "danger",
      "category": "cereals",
      "commodity": "Wheat",
      "title": "Wheat: Sharp 7-day fall",
      "detail": "Down 9.4% this week (Rs.2,710 -> Rs.2,455).",
      "generated_at": "2026-04-12"
    }
  ],
  "count": 1,
  "max_alerts": 15,
  "max_alerts_per_category": 5,
  "as_of_date": "2026-04-12",
  "scope": "general_market_alerts"
}
```

Failure example:

```json
{
  "success": false,
  "alerts": [],
  "count": 0,
  "max_alerts": 15,
  "as_of_date": null,
  "scope": "general_market_alerts",
  "error": "..."
}
```

## Field Notes

### success

- true means frontend can render the returned payload
- false means no usable data is available

### category

- present in predict endpoint responses
- one of cereals, fruits, vegetables

### live_fetch

- true means latest request path completed live fetch flow
- false means cached fallback flow was used

### historical

- array of historical rows
- currently limited to latest 30 days available in DB

### predictions

- array of prediction rows
- may be empty during bootstrap/failure edge cases
- backend attempts regeneration from cached historical rows on fallback

### message

- informational status text, mainly in fallback or hard failure responses

### warning

- optional technical detail for fallback success
- frontend can ignore for normal UX

### error

- present when there is no usable data
- can be shown in an error UI state

## Frontend Integration Recommendations

- call exactly one category endpoint based on selected category
- do not assume live_fetch is always true
- do not assume predictions is always non-empty
- render historical data even when predictions is empty
- show a lightweight fallback banner when live_fetch is false
- do not hard-fail page rendering because warning exists

Suggested fallback copy:

```txt
Live market data is temporarily unavailable. Showing cached market data.
```

## Recommended UI States

### Loading

- show spinner/skeleton while waiting for predict endpoint

### Success with Live Data

- success === true
- live_fetch === true

### Success with Cached Data

- success === true
- live_fetch === false
- show fallback notice

### Alerts Feed

- GET /api/alerts returns up to 15 alerts
- render in backend returned order (already severity-sorted)
- use type for severity styling
- use generated_at to show freshness

### Empty Predictions

- still render historical charts/tables
- show text such as: Predictions are not available yet.

### Hard Error

- success === false
- show retry button + error message

## Example Frontend Handling (Pseudo Logic)

```ts
if (!data.success) {
  showError(data.message || "Unable to load market data");
} else {
  renderHistorical(data.historical);
  renderPredictions(data.predictions);

  if (!data.live_fetch) {
    showBanner("Live market data is temporarily unavailable. Showing cached market data.");
  }
}
```

## Known Backend Status

- backend startup path is functional
- cached historical fallback path is functional
- prediction generation runs from live data and fallback cached data flows
- live external market source can still be unreliable
- historical API output is currently limited to latest 30 days

## Backend Files Relevant To Frontend Integration

- [backend/app/main.py](backend/app/main.py)
- [backend/app/routes/predict_cereals_route.py](backend/app/routes/predict_cereals_route.py)
- [backend/app/routes/predict_fruits_route.py](backend/app/routes/predict_fruits_route.py)
- [backend/app/routes/predict_vegetable_route.py](backend/app/routes/predict_vegetable_route.py)
- [backend/app/controller/predict_category_controller.py](backend/app/controller/predict_category_controller.py)
- [backend/app/routes/alerts_route.py](backend/app/routes/alerts_route.py)
- [backend/app/controller/alerts_controller.py](backend/app/controller/alerts_controller.py)
- [backend/app/utils/get_all_data.py](backend/app/utils/get_all_data.py)
