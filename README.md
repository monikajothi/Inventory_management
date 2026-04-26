# 🛒 Inventory Management System with Real-Time Sales Prediction

## 📌 Overview

This project is a full-stack **Inventory Management System** designed to help businesses efficiently manage products, stores, purchases, and sales. It also integrates **machine learning-based sales prediction** to provide insights for better inventory planning and decision-making.

The system offers a centralized dashboard for monitoring stock levels, tracking transactions, and visualizing monthly sales performance.

---

## 🚀 Features

### 🔹 Core Functionalities

* Manage Products (Add, Update, Delete)
* Store Management (Multiple store support)
* Purchase Tracking
* Sales Management
* Inventory Monitoring (Low stock alerts)
* Search and filter products

### 📊 Dashboard & Analytics

* Total Sales & Purchase overview
* Total Products & Stores count
* Monthly Sales Visualization (Chart)
* Real-time data updates

### 🤖 Machine Learning

* Predicts future sales based on historical data
* Helps in demand forecasting and stock optimization

### 🔐 Authentication

* Secure Admin Login (JWT-based authentication)
* Role-based access control

---

## 🏗️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* ApexCharts (for data visualization)

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Machine Learning

* Python (Model for sales prediction)
* Integration with backend APIs

---

## 📂 Project Structure

```bash
Inventory-Management/
│
├── Frontend/         # React frontend
├── Backend/          # Node.js + Express backend
├── ML-Model/         # Sales prediction model
├── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/your-username/inventory-management.git
cd inventory-management
```

---

### 🔹 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file:

```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:

```bash
node server.js
```

---

### 🔹 3. Frontend Setup

```bash
cd Frontend
npm install
npm start
```

---

### 🔹 4. ML Model Setup (Optional)

```bash
cd ML-Model
pip install -r requirements.txt
python app.py
```

---

## 🌐 Live Demo

👉 https://inventory-management-s29k.onrender.com

---

## 📸 Screenshots

* Dashboard with monthly sales chart
* Inventory management page
* Store management interface
* Purchase tracking page

---

## 🛡️ Security Features

* JWT Authentication
* Encrypted password storage (bcrypt)
* Secure API endpoints

---

## 🤝 Contribution

Contributions are welcome!
Feel free to fork the repo and submit a pull request.

---

## 📧 Contact

**Monika Jothi**
📩 Feel free to reach out for collaboration or queries

---

## ⭐ Acknowledgment

This project was developed as part of a full-stack and machine learning integration initiative to build intelligent business solutions.

---
