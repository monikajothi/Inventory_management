import pandas as pd
import numpy as np
from pymongo import MongoClient
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import xgboost as xgb
from skopt import BayesSearchCV

# --- Data Loading ---
client = MongoClient("mongodb+srv://monikajothi07:HJXUxZZnEwXGtJbT@cluster0.2sqz0.mongodb.net/inventory-management?retryWrites=true&w=majority&appName=Cluster0")
db = client['inventory-management']
collection = db['sales']
data = list(collection.find({}))
df = pd.DataFrame(data)

# --- Feature Engineering ---
df['SaleDate'] = pd.to_datetime(df['SaleDate'])
df['day_of_week'] = df['SaleDate'].dt.dayofweek
df['month'] = df['SaleDate'].dt.month
df['day'] = df['SaleDate'].dt.day
df['lag_sales'] = df['StockSold'].shift(1).fillna(0)  # Lag feature
df['rolling_avg_7d'] = df['StockSold'].rolling(7).mean().fillna(0)  # Moving average
df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)

# Encoding categorical variables
le_product = LabelEncoder()
le_store = LabelEncoder()
df['product_encoded'] = le_product.fit_transform(df['productName'])
df['store_encoded'] = le_store.fit_transform(df['StoreID'].astype(str))

# Feature Selection
X = df[['product_encoded', 'store_encoded', 'day_of_week', 'month', 'day', 'lag_sales', 'rolling_avg_7d', 'month_sin', 'month_cos']]
y = df['StockSold']

# --- Data Preprocessing ---
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# --- Hyperparameter Optimization (Bayesian) ---
param_space = {
    'n_estimators': (100, 500),
    'learning_rate': (0.01, 0.1),
    'max_depth': (4, 12),
    'subsample': (0.7, 1.0),
    'colsample_bytree': (0.7, 1.0),
    'reg_alpha': (0, 1),  # L1 regularization
    'reg_lambda': (0, 1)  # L2 regularization
}

opt_model = xgb.XGBRegressor(random_state=42)
bayes_opt = BayesSearchCV(opt_model, param_space, n_iter=30, cv=5, scoring='neg_mean_absolute_error', n_jobs=-1)
bayes_opt.fit(X_train, y_train)

best_model = bayes_opt.best_estimator_

# --- Model Evaluation ---
y_pred = best_model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print(f"Optimized Mean Absolute Error (MAE): {mae}")
print(f"Optimized Mean Squared Error (MSE): {mse}")
print(f"Optimized Root Mean Squared Error (RMSE): {rmse}")
print(f"Optimized R² Score: {r2}")

# --- Model Saving ---
joblib.dump(best_model, 'optimized_sales_xgb_model.pkl')
joblib.dump(le_product, 'product_encoder.pkl')
joblib.dump(le_store, 'store_encoder.pkl')
joblib.dump(scaler, 'scaler.pkl')

print("Optimized XGBoost model training completed and saved.")
