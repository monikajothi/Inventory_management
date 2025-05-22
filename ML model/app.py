from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from predict import SalesPredictor
from datetime import datetime, timedelta
import json
from typing import List, Dict, Any
import pandas as pd
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://inventory-management-4.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = SalesPredictor()

@app.get("/predict/top-products", response_class=JSONResponse)
async def get_top_predicted_products(store_id: str, date: str, top_n: int = 5):
    try:
        top_products = predictor.predict_top_products(store_id, date, top_n)
        chart_image = predictor.generate_sales_bar_chart(
            top_products,
            title=f"Top {top_n} Predicted Products for {date}"
        )
        
        return {
            "store_id": store_id,
            "date": date,
            "predictions": [{"product": p[0], "predicted_sales": p[1]} for p in top_products],
            "chart_image": chart_image
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/predict/product-trend", response_class=JSONResponse)
async def get_product_trend(
    product_name: str, 
    store_id: str, 
    start_date: str, 
    end_date: str = None
):
    try:
        if end_date is None:
            end_date = (datetime.strptime(start_date, '%Y-%m-%d') + timedelta(days=30)).strftime('%Y-%m-%d')
        
        chart_image = predictor.generate_sales_trend_chart(
            product_name, store_id, start_date, end_date
        )
        
        return {
            "product": product_name,
            "store_id": store_id,
            "date_range": f"{start_date} to {end_date}",
            "chart_image": chart_image
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/predict/future-peaks", response_class=JSONResponse)
async def get_future_sales_peaks(
    store_id: str,
    days_ahead: int = 30,
    top_n: int = 3
):
    try:
        today = datetime.now()
        end_date = (today + timedelta(days=days_ahead)).strftime('%Y-%m-%d')
        
        all_products = list(predictor.le_product.classes_)
        peak_days = []
        
        for product in all_products:
            date_range = pd.date_range(start=today, end=end_date)
            max_sales = 0
            peak_date = today.strftime('%Y-%m-%d')
            
            for date in date_range:
                pred = predictor.predict_sales(product, store_id, date.strftime('%Y-%m-%d'))
                if pred > max_sales:
                    max_sales = pred
                    peak_date = date.strftime('%Y-%m-%d')
            
            peak_days.append({
                "product": product,
                "peak_date": peak_date,
                "predicted_sales": max_sales
            })
        
        peak_days.sort(key=lambda x: x["predicted_sales"], reverse=True)
        
        top_peaks = peak_days[:top_n]
        chart_data = [(f"{p['product']}\n({p['peak_date']})", p['predicted_sales']) for p in top_peaks]
        chart_image = predictor.generate_sales_bar_chart(
            chart_data,
            title=f"Top {top_n} Products with Highest Predicted Sales in Next {days_ahead} Days"
        )
        
        return {
            "store_id": store_id,
            "period": f"Next {days_ahead} days",
            "peaks": peak_days[:top_n],
            "chart_image": chart_image
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/stores")
async def get_stores():
    try:
        return {"stores": ["67fd59bb093b7a81c1a485c0"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/products")
async def get_products():
    try:
        return {"products": ["rice", "wheat", "sugar", "oil", "salt"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == '__main__':
    app.run(5000, debug=True)