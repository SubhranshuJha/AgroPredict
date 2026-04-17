from datetime import datetime, timedelta

import pandas as pd
import requests

API_URL = "https://api.agmarknet.gov.in/v1/all-type-report/all-type-report-agm"
MAX_FETCH_PAGES = 100
MAX_FETCH_SECONDS = 90
CATEGORY_PAYLOADS = {
    "cereals": {
        "type": 2,
        "group": "[1]",
        "commodity": "[99999]",
        "state": "[99999]",
        "district": "[]",
        "market": "[]",
        "options": 3,
        "limit": 1000,
    },
    "fruits": {
        "type": 1,
        "group": [5],
        "commodity": [
            303, 17, 19, 304, 464, 22, 156, 58, 424, 153, 155,
            157, 299, 20, 64, 18, 59, 21, 160, 529, 60, 492,
        ],
        "state": [],
        "district": [],
        "market": [],
        "options": "3",
        "limit": 1000,
        "itemsPerPage": 1000,
        "from": "/alltypeofreportmainmenu",
    },
    "vegetables": {
        "type": 1,
        "group": [6],
        "commodity": [
            129, 420, 71, 67, 68, 32, 416, 126, 136, 125, 31, 74,
            39, 131, 415, 75, 140, 247, 53, 298, 25, 87, 73, 306,
            62, 292, 127, 261, 253, 255, 288, 500, 23, 307, 264,
            24, 254, 70, 133, 422, 290, 523, 251, 124, 145, 297,
            65, 260, 248,
        ],
        "state": [],
        "district": [],
        "market": [],
        "options": "3",
        "limit": 1000,
        "itemsPerPage": 1000,
        "from": "/pricearrivalreportlist",
    },
}


class FetchDataError(Exception):
    pass


def get_date_range(last_date):
    today = datetime.today().date()

    if last_date is None:
        from_date = today - timedelta(days=30)
    else:
        from_date = last_date + timedelta(days=1)

    return from_date, today


def fetch_data(from_date, to_date, category="cereals"):
    if from_date > to_date:
        return pd.DataFrame()

    category_payload = CATEGORY_PAYLOADS.get(category)
    if category_payload is None:
        raise FetchDataError(f"Unknown category: {category}")

    all_data = []
    start_time = datetime.now()

    payload = {
        "from_date": from_date.strftime("%Y-%m-%d"),
        "to_date": to_date.strftime("%Y-%m-%d"),
        "msp": 0,
        "period": "date",
        "page": 1,
    }
    payload.update(category_payload)

    headers = {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://agmarknet.gov.in/",
        "Content-Type": "application/json"
    }

    session = requests.Session()
    # Avoid broken machine-level proxy settings causing stale cached responses.
    session.trust_env = False

    while True:
        if payload["page"] > MAX_FETCH_PAGES:
            if all_data:
                break
            raise FetchDataError(f"Fetch aborted after {MAX_FETCH_PAGES} pages")
        if (datetime.now() - start_time).total_seconds() > MAX_FETCH_SECONDS:
            if all_data:
                break
            raise FetchDataError(f"Fetch timed out after {MAX_FETCH_SECONDS} seconds")

        try:
            res = session.post(API_URL, json=payload, headers=headers, timeout=30)
        except requests.RequestException as exc:
            if all_data:
                break
            raise FetchDataError(f"Request failed: {exc}") from exc

        if res.status_code != 200:
            if res.status_code == 404 and "No data available for the selected date range" in res.text:
                return pd.DataFrame()

            # Agmarknet occasionally returns a 500 on follow-up pages with
            # "strptime() argument 1 must be str, not None". If we already
            # collected rows, keep partial data instead of failing hard.
            if all_data:
                break
            raise FetchDataError(f"Error {res.status_code}: {res.text[:200]}")

        try:
            data = res.json()
        except ValueError as exc:
            raise FetchDataError(f"Invalid JSON response: {exc}") from exc

        rows = data.get("rows", [])
        if not rows:
            break

        all_data.extend(rows)

        # Keep sending full filter payload on each page; switching payload to
        # None can cause server-side date parsing errors.
        if not data.get("pagination", {}).get("next_page"):
            break
        payload["page"] += 1

    return pd.DataFrame(all_data)


def process_raw_data(df):
    if df.empty:
        return df

    if "model_price_wt" in df.columns:
        modal_col = "model_price_wt"
    else:
        modal_col = "modal_price_wt"

    df = df.rename(columns={
        "rep_date": "Date",
        "cmdt_name": "Commodity",
        "min_price_wt": "Min_Price",
        "max_price_wt": "Max_Price",
        modal_col: "Modal_Price"
    })

    # Convert date
    df["Date"] = pd.to_datetime(df["Date"], format="%d-%m-%Y", errors="coerce")

    # Convert numeric
    for col in ["Min_Price", "Max_Price", "Modal_Price"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # Remove invalid rows
    df = df.dropna(subset=["Date", "Commodity", "Modal_Price"])

    # Avg price
    df["Avg_Price"] = (df["Min_Price"] + df["Max_Price"]) / 2

    # Grouping 
    df = df.groupby(["Date", "Commodity"]).agg({
        "Avg_Price": "mean",
        "Min_Price": "mean",
        "Max_Price": "mean",
        "Modal_Price": "mean"
    }).reset_index()

    # Sort
    df = df.sort_values(by="Date")

    return df
