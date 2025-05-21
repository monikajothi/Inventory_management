import joblib
import pandas as pd
from datetime import datetime
import numpy as np
import matplotlib.pyplot as plt
from io import BytesIO
import base64

class SalesPredictor:
    def __init__(self):
        self.model = joblib.load('sales_prediction_model.pkl')
        self.le_product = joblib.load('product_encoder.pkl')
        self.le_store = joblib.load('store_encoder.pkl')
    
    def predict_sales(self, product_name, store_id, date):
        date = pd.to_datetime(date)
        day_of_week = date.dayofweek
        month = date.month
        day = date.day
        
        try:
            product_encoded = self.le_product.transform([product_name])[0]
            store_encoded = self.le_store.transform([str(store_id)])[0]
        except ValueError:
            product_encoded = 0
            store_encoded = 0
        
        X = pd.DataFrame([[product_encoded, store_encoded, day_of_week, month, day]],
                         columns=['product_encoded', 'store_encoded', 'day_of_week', 'month', 'day'])
        
        prediction = self.model.predict(X)
        return max(0, round(prediction[0]))

    def predict_top_products(self, store_id, date, top_n=5):
        all_products = list(self.le_product.classes_)
        predictions = []
        
        for product in all_products:
            pred = self.predict_sales(product, store_id, date)
            predictions.append((product, pred))
        
        predictions.sort(key=lambda x: x[1], reverse=True)
        return predictions[:top_n]

    def generate_sales_bar_chart(self, predictions, title="Top Selling Products Prediction"):
        products = [p[0] for p in predictions]
        sales = [p[1] for p in predictions]
        
        plt.figure(figsize=(10, 6))
        bars = plt.bar(products, sales, color='skyblue')
        plt.title(title, fontsize=14)
        plt.xlabel('Products', fontsize=12)
        plt.ylabel('Predicted Sales (units)', fontsize=12)
        plt.xticks(rotation=45, ha='right')
        
        for bar in bars:
            height = bar.get_height()
            plt.text(bar.get_x() + bar.get_width()/2., height,
                    f'{int(height)}',
                    ha='center', va='bottom')
        
        plt.tight_layout()
        
        buffer = BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        plt.close()
        
        img_base64 = base64.b64encode(buffer.read()).decode('utf-8')
        return img_base64

    def generate_sales_trend_chart(self, product_name, store_id, start_date, end_date):
        date_range = pd.date_range(start=start_date, end=end_date)
        predictions = []
        
        for date in date_range:
            pred = self.predict_sales(product_name, store_id, date.strftime('%Y-%m-%d'))
            predictions.append((date.strftime('%Y-%m-%d'), pred))
        
        dates = [p[0] for p in predictions]
        sales = [p[1] for p in predictions]
        
        plt.figure(figsize=(12, 6))
        plt.plot(dates, sales, marker='o', linestyle='-', color='green')
        plt.title(f'Sales Trend Prediction for {product_name}', fontsize=14)
        plt.xlabel('Date', fontsize=12)
        plt.ylabel('Predicted Sales (units)', fontsize=12)
        plt.xticks(rotation=45)
        plt.grid(True, linestyle='--', alpha=0.7)
        
        max_sales = max(sales)
        max_index = sales.index(max_sales)
        plt.scatter(dates[max_index], max_sales, color='red', s=100, 
                   label=f'Peak: {max_sales} on {dates[max_index]}')
        plt.legend()
        
        plt.tight_layout()
        
        buffer = BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        plt.close()
        img_base64 = base64.b64encode(buffer.read()).decode('utf-8')
        return img_base64