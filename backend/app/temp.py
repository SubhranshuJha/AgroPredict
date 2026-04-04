import requests
import json

url = "https://api.agmarknet.gov.in/v1/all-type-report/all-type-report"

params = {
    "type": 2,
    "from_date": "2026-03-27",
    "to_date": "2026-03-27",
    "msp": 0,
    "period": "date",
    "group": "[1]",
    "commodity": "[99999]",
    "state": "[99999]",   
    "district": "[]",
    "market": "[]",
    "page": 1,
    "options": 3,
    "limit": 10
}

headers = {
    "User-Agent": "Mozilla/5.0",
    "Referer": "https://agmarknet.gov.in/"
}

res = requests.get(url, params=params, headers=headers)
print("Request URL:", res.url)
print("Status Code:", res.status_code)

# data = res.json()

# print("Status:", res.status_code)
# print(json.dumps(data, indent=2))

# import joblib

# cols = joblib.load(r"D:\AgroPredict\AgroPredict_Dev\AgroPredict\backend\app\ml\columns.pkl")
# print(type(cols))
# print(list(cols.keys())[:20])

# print(len(cols["feature_cols"]))
# print(cols["feature_cols"][:20])