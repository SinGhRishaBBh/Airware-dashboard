# Airware-dashboard
# AQI-Predictor-Dashboard 🌫️📊

An AI-powered Air Quality Index (AQI) monitoring and forecasting dashboard using Machine Learning (XGBoost, LSTM) and real-time data visualization. Built with React, FastAPI, MongoDB, and Python to help urban citizens track, predict, and understand air pollution trends (PM2.5, PM10, etc.).

---

## 🔍 Features

- 🧠 **AQI Forecasting**: Predict air quality up to 90 days using hybrid LSTM + XGBoost models.
- 📈 **Dynamic Dashboard**: Real-time charts and graphs for PM2.5, PM10, temperature, humidity, etc.
- 📂 **Data Upload**: Upload CSV, Excel, or API-based datasets.
- 🌐 **API Integration**: Pulls data from IQAir, OpenWeather, or CPCB APIs.
- 💾 **Offline Storage**: MongoDB backend to store user predictions and history.
- 🔒 **User Module**: Supports login, history tracking, notifications.
- 🗂️ **Prediction Export**: Export predictions to `.csv` or `.json`.

---

## 🚀 Tech Stack

| Layer         | Technology                          |
|--------------|--------------------------------------|
| Frontend     | React.js, Chart.js, Tailwind CSS     |
| Backend      | FastAPI, Python, Pandas, NumPy       |
| ML Models    | LSTM (TensorFlow), XGBoost           |
| Database     | MongoDB, Local CSV History           |
| DevOps       | Docker, Replit/Render Support        |

---

## 📁 Folder Structure


---

## ⚙️ Installation

### 🐍 Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

cd frontend
npm install
npm start


---

Let me know if you'd like:

- The `LICENSE` file generated as well
- A `.zip` of `README.md` and `LICENSE`
- Help pushing it to GitHub step-by-step

I'm ready when you are!
