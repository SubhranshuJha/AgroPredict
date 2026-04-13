# AgroPredict Frontend API Handoff

## Base URL

Local development:

```txt
http://127.0.0.1:8000
```

## CORS

The backend currently allows all origins.

## Available Endpoints

### `GET /`

Health check endpoint.

Example response:

```json
{
  "message": "AgroPredict API is running successfully!"
}
```

### `GET /api/predict`

Main endpoint for frontend consumption.

This endpoint currently returns:

- historical market data
- prediction data from the database
- a flag showing whether live data fetch succeeded

## Current Backend Behavior

The backend first tries to fetch live market data.

If live fetch works:

- data may be processed and saved
- predictions may be generated and saved
- response includes `"live_fetch": true`

If live fetch fails:

- backend falls back to cached database data
- backend may generate predictions from cached historical DB data
- response includes `"live_fetch": false`
- frontend should still render available cached data

## Important Current Limitation

The government market API is currently unstable/unavailable from the backend environment.

Because of that:

- frontend must not assume live data is always available
- frontend must support cached responses
- frontend should still handle empty `predictions` safely

### `GET /api/alerts`

General market alerts for the dashboard.

This endpoint returns only meaningful alerts generated from the latest historical market data.

Frontend expectations:

- maximum of 10 alerts per request
- alerts are prioritized by severity and impact
- alert ids are derived from the backend database row id
- no personalized user alerts are included for now

Example response:

```json
{
  "alerts": [
    {
      "id": "128_drop7",
      "source_id": 128,
      "type": "danger",
      "commodity": "Wheat",
      "title": "Wheat: Sharp 7-day fall",
      "detail": "Down 9.4% this week (Rs.2,710 -> Rs.2,455).",
      "generated_at": "2026-04-12"
    }
  ],
  "count": 1,
  "max_alerts": 10,
  "as_of_date": "2026-04-12",
  "scope": "general_market_alerts"
}
```

Field notes:

- `alerts`: list of general market alerts to render in the UI
- `count`: number of alerts returned in the current response
- `max_alerts`: hard cap enforced by the backend
- `as_of_date`: latest historical date used to generate the alerts
- `scope`: fixed marker for this general alert feed

## Response Shape

Successful live or cached response:

```json
{
  "success": true,
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
  "warning": "Failed to fetch data: status=503 ..."
}
```

Failure response when no cached data exists:

```json
{
  "success": false,
  "live_fetch": false,
  "message": "Live market data is unavailable and no cached data exists.",
  "historical": [],
  "predictions": [],
  "error": "Failed to fetch data: status=503 ..."
}
```

## Field Notes

### `success`

- `true` means the frontend can render the returned payload
- `false` means no usable data is available

### `live_fetch`

- `true` means data came from live backend fetch flow
- `false` means cached fallback was used

### `historical`

- array of historical rows
- currently limited to the latest 30 days available in the database

Historical row shape:

```json
{
  "date": "2026-03-28",
  "commodity": "Wheat",
  "avg_price": 2447.805,
  "min_price": 2178.79,
  "max_price": 2716.82,
  "modal_price": 2441.66
}
```

### `predictions`

- array of prediction rows from the database
- may still be empty in some failure/bootstrap cases
- during prototype fallback, predictions may be generated from cached historical DB data when live fetch fails

Prediction row shape:

```json
{
  "date": "2026-03-29",
  "commodity": "Wheat",
  "predicted_price": 2450.64
}
```

### `message`

- present mainly during fallback/error situations
- should be shown as a user-friendly status banner if helpful

### `warning`

- optional technical detail for fallback situations
- frontend can ignore this for normal UI

### `error`

- present when there is no usable data
- can be shown in an error state UI

## Frontend Recommendations

- Treat `/api/predict` as the single source for now.
- Treat `/api/alerts` as the single alert feed for now.
- Do not assume `predictions` is always non-empty, even though backend now tries to generate them from cached data during fallback.
- Do not assume `live_fetch` is always `true`.
- Render historical data even when predictions are empty.
- Show a lightweight fallback banner when `live_fetch` is `false`.
- Avoid hard-failing the page when `warning` exists.

Suggested fallback copy:

```txt
Live market data is temporarily unavailable. Showing cached market data.
```

## Recommended UI States

### Loading

- show spinner/skeleton while waiting for `/api/predict`

### Success with Live Data

- `success === true`
- `live_fetch === true`

### Success with Cached Data

- `success === true`
- `live_fetch === false`
- show fallback notice
- predictions may still be present because backend can generate them from cached historical DB data

### Alerts Feed

- `GET /api/alerts` returns up to 10 alerts
- render them sorted in the order returned by the backend
- use `type` to style severity
- use `generated_at` to show freshness if needed

### Empty Predictions

- render historical charts/tables
- show text like:

```txt
Predictions are not available yet.
```

### Hard Error

- `success === false`
- show retry button and error message

## Example Frontend Handling

Pseudo-logic:

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

- backend startup is working
- cached historical data flow is working
- prediction service itself has been tested successfully from CSV input
- when live fetch fails, backend can attempt prediction generation from cached DB history in prototype mode
- live external market source is unreliable at the moment
- historical API output is currently limited to the latest 30 days

## Current Files Relevant To Frontend Integration

- [main.py](/d:/AgroPredict/AgroPredict_Dev/AgroPredict/backend/app/main.py)
- [predict_route.py](/d:/AgroPredict/AgroPredict_Dev/AgroPredict/backend/app/routes/predict_route.py)
- [predict_controller.py](/d:/AgroPredict/AgroPredict_Dev/AgroPredict/backend/app/controller/predict_controller.py)
- [alerts_route.py](/d:/AgroPredict/AgroPredict_Dev/AgroPredict/backend/app/routes/alerts_route.py)
- [alerts_controller.py](/d:/AgroPredict/AgroPredict_Dev/AgroPredict/backend/app/controller/alerts_controller.py)
- [get_all_data.py](/d:/AgroPredict/AgroPredict_Dev/AgroPredict/backend/app/utils/get_all_data.py)
