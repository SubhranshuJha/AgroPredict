import requests
import json


url = "https://api.agmarknet.gov.in/v1/all-type-report/all-type-report-agm"

params = {
    "type": 2,
    "from_date": "2026-04-01",
    "to_date": "2026-04-07",
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
    "Referer": "https://agmarknet.gov.in/",
    "Content-Type": "application/json"
}

res = requests.post(url, json=params, headers=headers)

print("Status Code:", res.status_code)
print(res.text)  # or res.json()
formatted_data = res.json()
print(json.dumps(formatted_data, indent=4))