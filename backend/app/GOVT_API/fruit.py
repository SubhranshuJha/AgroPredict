import requests
import json

url = "https://api.agmarknet.gov.in/v1/all-type-report/all-type-report-agm"

payload = {
    "type": 1,
    "from_date": "2026-04-14",
    "to_date": "2026-04-15",
    "msp": 0,
    "period": "date",

    "group": [5],  

    "commodity": [
        303, 17, 19, 304, 464, 22, 156, 58, 424, 153,
        155, 157, 299, 20, 64, 18, 59, 21, 160, 529,
        60, 492
    ],

    "state": [],
    "district": [],
    "market": [],

    "page": 1,
    "options": "3",
    "limit": 10,
    "itemsPerPage": 10,

    "from": "/alltypeofreportmainmenu" 
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