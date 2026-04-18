from statistics import pstdev

from sqlalchemy.orm import Session

from app.models.historical import HistoricalCerealsData, HistoricalFruitsData, HistoricalVegetablesData


MAX_ALERTS = 15
MAX_ALERTS_PER_CATEGORY = 5
MAX_ALERTS_PER_COMMODITY = 2
CATEGORY_MODELS = {
    "cereals": HistoricalCerealsData,
    "fruits": HistoricalFruitsData,
    "vegetables": HistoricalVegetablesData,
}


def _build_alerts_for_category(db: Session, category: str, historical_model):
    alerts = []
    latest_date = None

    commodities = db.query(historical_model.commodity).distinct().all()
    commodity_names = [row[0] for row in commodities]

    for name in commodity_names:
        rows = (
            db.query(historical_model)
            .filter(historical_model.commodity == name)
            .order_by(historical_model.date.asc())
            .all()
        )

        if len(rows) < 8:
            continue

        prices = [float(r.modal_price) for r in rows]
        current = prices[-1]
        prev_day = prices[-2]
        week_ago = prices[-8]
        last_30 = prices[-30:] if len(prices) >= 30 else prices

        if not last_30:
            continue

        high_30 = max(last_30)
        low_30 = min(last_30)
        avg_30 = sum(last_30) / len(last_30)
        date_tag = rows[-1].date
        latest_date = date_tag if latest_date is None or date_tag > latest_date else latest_date

        week_chg = (current - week_ago) / week_ago * 100 if week_ago else 0
        day_chg = (current - prev_day) / prev_day * 100 if prev_day else 0
        vol = (pstdev(last_30) / avg_30 * 100) if avg_30 else 0

        if week_chg < -8:
            alerts.append({
                "type": "danger",
                "category": category,
                "commodity": name,
                "title": f"{name}: Sharp 7-day fall",
                "detail": (
                    f"Down {abs(week_chg):.1f}% this week "
                    f"(Rs.{week_ago:,.0f} -> Rs.{current:,.0f})."
                ),
                "generated_at": date_tag,
                "priority_score": 100 + abs(week_chg),
            })
        elif week_chg > 8:
            alerts.append({
                "type": "info",
                "category": category,
                "commodity": name,
                "title": f"{name}: Strong 7-day rally",
                "detail": (
                    f"Up {week_chg:.1f}% this week "
                    f"(Rs.{week_ago:,.0f} -> Rs.{current:,.0f})."
                ),
                "generated_at": date_tag,
                "priority_score": 60 + week_chg,
            })

        if high_30 > 0 and (high_30 - current) / high_30 < 0.02:
            near_high_gap_pct = (high_30 - current) / high_30 * 100
            alerts.append({
                "type": "info",
                "category": category,
                "commodity": name,
                "title": f"{name}: Near 30-day high",
                "detail": (
                    f"Current Rs.{current:,.0f} is within 2% of "
                    f"30-day peak Rs.{high_30:,.0f}."
                ),
                "generated_at": date_tag,
                "priority_score": 45 + max(0, 2 - near_high_gap_pct) * 10,
            })

        if low_30 > 0 and (current - low_30) / low_30 < 0.02:
            near_low_gap_pct = (current - low_30) / low_30 * 100
            alerts.append({

                "type": "warn",
                "category": category,
                "commodity": name,
                "title": f"{name}: Near 30-day low",
                "detail": (
                    f"Current Rs.{current:,.0f} is near "
                    f"30-day floor Rs.{low_30:,.0f}."
                ),
                "generated_at": date_tag,
                "priority_score": 75 + max(0, 2 - near_low_gap_pct) * 10,
            })

        if vol > 6:
            alerts.append({

                "type": "warn",
                "category": category,
                "commodity": name,
                "title": f"{name}: High volatility detected",
                "detail": f"30-day volatility is {vol:.1f}% (avg Rs.{avg_30:,.0f}).",
                "generated_at": date_tag,
                "priority_score": 70 + vol,
            })

        if abs(day_chg) > 5:
            direction = "spike" if day_chg > 0 else "drop"
            alerts.append({

                "type": "danger" if day_chg < 0 else "info",
                "category": category,
                "commodity": name,
                "title": f"{name}: Unusual 1-day {direction}",
                "detail": (
                    f"Price moved {day_chg:+.1f}% today "
                    f"(Rs.{prev_day:,.0f} -> Rs.{current:,.0f})."
                ),
                "generated_at": date_tag,
                "priority_score": (95 if day_chg < 0 else 65) + abs(day_chg) * 2,
            })

    return alerts, latest_date


def _sort_alerts(alerts):
    order = {"danger": 0, "warn": 1, "info": 2}

    def sort_key(alert):
        priority = alert.get("priority_score", 0)
        type_order = order.get(alert["type"], 3)
        category = alert.get("category", "")
        commodity = alert["commodity"]

        return (-priority, type_order, category, commodity)

    return sorted(alerts, key=sort_key)


def _select_alerts(alerts, max_alerts):
    commodity_alert_count = {}
    selected_alerts = []

    for alert in _sort_alerts(alerts):
        commodity_key = (alert.get("category"), alert["commodity"])
        count = commodity_alert_count.get(commodity_key, 0)
        if count >= MAX_ALERTS_PER_COMMODITY:
            continue

        commodity_alert_count[commodity_key] = count + 1
        selected_alerts.append(alert)
        if len(selected_alerts) >= max_alerts:
            break

    return selected_alerts


def get_market_alerts(db: Session):

    try:
        selected_alerts = []
        latest_date = None

        for category, historical_model in CATEGORY_MODELS.items():
            category_alerts, category_latest_date = _build_alerts_for_category(
                db,
                category,
                historical_model,
            )
            selected_alerts.extend(_select_alerts(category_alerts, MAX_ALERTS_PER_CATEGORY))

            if category_latest_date is not None:
                latest_date = (
                    category_latest_date
                    if latest_date is None or category_latest_date > latest_date
                    else latest_date
                )

        selected_alerts = _sort_alerts(selected_alerts)[:MAX_ALERTS]

        for alert in selected_alerts:
            alert.pop("priority_score", None)

        order = {"danger": 0, "warn": 1, "info": 2}
        selected_alerts.sort(key=lambda a: order.get(a["type"], 3))
        return {
            "success": True,
            "alerts": selected_alerts,
            "count": len(selected_alerts),
            "max_alerts": MAX_ALERTS,
            "max_alerts_per_category": MAX_ALERTS_PER_CATEGORY,
            "as_of_date": latest_date,
            "scope": "general_market_alerts",
        }
    except Exception as e:
        return {

            "success": False,
            "alerts": [],
            "count": 0,
            "max_alerts": MAX_ALERTS,
            "as_of_date": None,
            "scope": "general_market_alerts",
            "error": str(e),
        }
    
