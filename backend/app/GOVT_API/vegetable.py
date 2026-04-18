import requests
import json

url = "https://api.agmarknet.gov.in/v1/all-type-report/all-type-report-agm"

payload = {
    "type": 1,
    "from_date": "2026-04-14",
    "to_date": "2026-04-15",
    "msp": 0,
    "period": "date",

    "group": [6],

    "commodity": [
        129, 420, 71, 67, 68, 32, 416, 126, 136, 125, 31, 74,
        39, 131, 415, 75, 140, 247, 53, 298, 25, 87, 73, 306,
        62, 292, 127, 261, 253, 255, 288, 500, 23, 307, 264,
        24, 254, 70, 133, 422, 290, 523, 251, 124, 145, 297,
        65, 260, 248
    ],

    "state": [],
    "district": [],
    "market": [],

    "page": 1,
    "options": "3",
    "limit": 10,
    "itemsPerPage": 10,

    "from": "/pricearrivalreportlist"
}

headers = {
    "User-Agent": "Mozilla/5.0",
    "Referer": "https://agmarknet.gov.in/",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)

print("Status Code:", response.status_code)

try:
    data = response.json()
    print(json.dumps(data, indent=4))
except:
    print(response.text)