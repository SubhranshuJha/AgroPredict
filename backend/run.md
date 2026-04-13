# 🚀 FastAPI Backend Setup Guide

## 📦 Prerequisites

### Install PostgreSQL

1. Download PostgreSQL from the official website:
   https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

2. Run the installer and follow the default steps (`Next → Next → ...`)

3. ⚠️ After installation completes:

   * **Uncheck** the option to install **StackBuilder**

4. 🔑 Important Notes:

   * Remember the password you set during installation
   * Default username: `postgres`

5. Open **pgAdmin** and create a new database named:

   ```sql
   agropredict
   ```

---

## ⚙️ Backend Initialization

### 1. Environment Setup

* Create a `.env` file using the provided `.env.sample`
* Update the database password in `.env` with your actual PostgreSQL password

---

### 2. Create Virtual Environment

Open a terminal in the `backend` folder and run:

```bash
python -m venv venv
```

---

### 3. Activate Virtual Environment

```bash
venv\Scripts\activate
```
### Create table with this Command

```bash
python -m app.create_table
```

---

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```
### remember to install version 1.6.1 of scikit-learn. --> Do chatgpt for that
---

## ▶️ Run the Backend Server
after one initialization run only these two command on backend folder
```bash
venv\Scripts\activate
uvicorn app.main:app --reload
```

---

## ✅ You're All Set!

* Backend will run at:
  `http://127.0.0.1:8000`

* API Documentation (Swagger UI):
  `http://127.0.0.1:8000/docs`


