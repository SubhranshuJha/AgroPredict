from statistics import pstdev

from sqlalchemy.orm import Session

from app.models.historical import HistoricalData


MAX_ALERTS = 10
MAX_ALERTS_PER_COMMODITY = 2


def _build_alert_id(source_id: int, suffix: str) -> str:
    return f"{source_id}_{suffix}"


def get_market_alerts(db: Session):
    alerts = []
    latest_date = None

    commodities = db.query(HistoricalData.commodity).distinct().all()
    commodity_names = [row[0] for row in commodities]

    for name in commodity_names:
        rows = (
            db.query(HistoricalData)
            .filter(HistoricalData.commodity == name)
            .order_by(HistoricalData.date.asc())
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
                "commodity": name,
                "title": f"{name}: Unusual 1-day {direction}",
                "detail": (
                    f"Price moved {day_chg:+.1f}% today "
                    f"(Rs.{prev_day:,.0f} -> Rs.{current:,.0f})."
                ),
                "generated_at": date_tag,
                "priority_score": (95 if day_chg < 0 else 65) + abs(day_chg) * 2,
            })

        order = {"danger": 0, "warn": 1, "info": 2}

        def sort_key(alert):
            priority = alert.get("priority_score", 0)
            type_order = order.get(alert["type"], 3)
            commodity = alert["commodity"]

            return (-priority, type_order, commodity)

        alerts.sort(key=sort_key)

    commodity_alert_count = {}
    selected_alerts = []
    for alert in alerts:
        commodity = alert["commodity"]
        count = commodity_alert_count.get(commodity, 0)
        if count >= MAX_ALERTS_PER_COMMODITY:
            continue

        commodity_alert_count[commodity] = count + 1
        selected_alerts.append(alert)
        if len(selected_alerts) >= MAX_ALERTS:
            break

    for alert in selected_alerts:
        alert.pop("priority_score", None)

    selected_alerts.sort(key=lambda a: order.get(a["type"], 3))
    return {
        "alerts": selected_alerts,
        "count": len(selected_alerts),
        "max_alerts": MAX_ALERTS,
        "as_of_date": latest_date,
        "scope": "general_market_alerts",
    }
