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
aqi-dashboard/
├── frontend/                       # React frontend for AQI dashboard
│   ├── public/
│   ├── src/
│   │   ├── components/             # Reusable React components
│   │   ├── pages/                  # UI pages (Dashboard, Upload, History)
│   │   ├── services/               # API integration services
│   │   └── App.js
│   └── package.json
│
├── backend/                        # FastAPI backend
│   ├── api/                        # API routes and endpoints
│   ├── models/                     # Pydantic models or DB schemas
│   ├── ml/                         # Prediction scripts using LSTM/XGBoost
│   ├── database/                   # MongoDB connection & queries
│   ├── utils/                      # Helpers (e.g., CSV processing)
│   └── main.py                     # FastAPI main app
│
├── ml_models/                      # Pretrained model files
│   ├── lstm_model.h5
│   └── xgboost_model.json
│
├── data/                           # Sample and user-uploaded datasets
│   ├── sample_dataset.csv
│   └── uploaded_data/
│
├── exports/                        # Exported prediction results
│   └── predictions.csv
│
├── Dockerfile                      # Containerization support
├── requirements.txt                # Python dependencies
├── README.md                       # Project documentation
└── LICENSE                         # MIT License


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



## 🧪 Usage

1. **Upload your AQI dataset**  
   Accepts `.csv` files or connects via real-time AQI APIs (e.g., IQAir, OpenWeather).

2. **Choose prediction model**
   - LSTM (for time-series forecasting)
   - XGBoost (for feature-based prediction)
   - Hybrid (combines both for improved accuracy)

3. **View results**
   - Visualize real-time AQI graphs (PM2.5, PM10, etc.)
   - Explore historical trends and predictions up to 90 days

4. **Export predictions**
   - Download forecast data as `.csv`
   - View past uploads and predictions from history tab

---

## 📊 Model Details

- **LSTM**  
  Long Short-Term Memory network trained on sequential AQI data. Ideal for forecasting based on past pollution trends.

- **XGBoost**  
  Gradient Boosted Trees trained on feature-rich datasets (temperature, humidity, traffic levels, etc.).

- **Hybrid Approach**  
  Combines temporal sequence learning from LSTM and feature importance ranking from XGBoost for more robust predictions.

---

## 🔐 License

This project is licensed under the **MIT License**.  
See the [`LICENSE`](./LICENSE) file for detailed terms.

---

## 🙌 Contributors

- **Rishabh Raj**  
  Developer, AI Researcher  
  *Central University of South Bihar (CUSB)*

- **Dr. Rina Singh**  
  Project Supervisor, Scientist (TPE Division), CSIR-CRRI

---

## 📬 Contact

- 📧 Email: [rishabh079singh@gmail.com](mailto:rishabh079singh@gmail.com)  
- 🌍 Website: _coming soon_  
- 🏫 Institution: Central University of South Bihar (CUSB)

---
