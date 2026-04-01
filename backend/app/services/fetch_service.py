import requests
import pandas as pd
from datetime import datetime, timedelta

API_URL = "https://api.agmarknet.gov.in/v1/all-type-report/all-type-report"


def get_date_range(last_date):
    today = datetime.today().date()

    if last_date is None:
        # first time → fetch 30 days
        from_date = today - timedelta(days=30)
    else:
        from_date = last_date + timedelta(days=1)

    return from_date, today


def fetch_data(from_date, to_date):
    params = {
        "type": 2,
        "from_date": from_date.strftime("%Y-%m-%d"),
        "to_date": to_date.strftime("%Y-%m-%d"),
        "msp": 0,
        "period": "date",
        "group": 1,
        "commodity": 99999,
        "state": 99999,
        "district": "",
        "market": "",
        "page": 1,
        "options": 3,
        "limit": 1000
    }

    headers = {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://agmarknet.gov.in/",
        "Accept": "application/json, text/plain, */*",
        "X-Requested-With": "XMLHttpRequest"
    }

    res = requests.get(API_URL, params=params, headers=headers)

    if res.status_code != 200:
        raise Exception("Failed to fetch data")

    data = res.json()

    if "rows" not in data:
        return pd.DataFrame()

    return pd.DataFrame(data["rows"])

def process_raw_data(df):
    if df.empty:
        return df

    df = df.rename(columns={
        "rep_date": "Date",
        "cmdt_name": "Commodity",
        "min_price_wt": "Min_Price",
        "max_price_wt": "Max_Price",
        "model_price_wt": "Modal_Price"
    })

    df["Date"] = pd.to_datetime(df["Date"], format="%d-%m-%Y")

    for col in ["Min_Price", "Max_Price", "Modal_Price"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    df["Avg_Price"] = (df["Min_Price"] + df["Max_Price"]) / 2

    # 🔥 MUST (as per training)
    df = df.groupby(["Date", "Commodity"]).agg({
        "Avg_Price": "mean",
        "Min_Price": "mean",
        "Max_Price": "mean",
        "Modal_Price": "mean"
    }).reset_index()

    return df