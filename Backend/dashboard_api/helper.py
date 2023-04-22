from datetime import datetime, timedelta
import joblib
import numpy as np
import pandas as pd
from .models import ProductOrder
from django.db.models import Sum


def predict_product_for_one_week(product_id, week_date):
    day_of_year = week_date.timetuple().tm_yday
    year = week_date.year
    day_of_month = week_date.day

    last_week_sales = sales_of_last_week(product_id, week_date)
    
    last_month_sales = sales_of_last_month(product_id, week_date)
    data = pd.DataFrame({
        'Last_month': [last_month_sales],
        'Item': [product_id],
        'Last_week': [last_week_sales],
        'dayofmonth': [day_of_month],
        'year': [year],
        'dayofyear': [day_of_year]
    })
    model = joblib.load('AI_models/Forcasting_product_sales.pkl')
    return {
        "predict": model.predict(data).tolist()[0],
        "input": {
        'Last_month': [last_month_sales],
        'Item': [product_id],
        'Last_week': [last_week_sales],
        'dayofmonth': [day_of_month],
        'year': [year],
        'dayofyear': [day_of_year]
    }}


def sales_of_last_week(product_id, week_date):
    last_week_monday = (week_date - timedelta(days=7)
    ).replace(hour=0, minute=0, second=0, microsecond=0)
    last_sunday = (week_date - timedelta(days=1)
    ).replace(hour=23,minute=59, second=59, microsecond=999999)
    last_week_sales = ProductOrder.objects.filter(
        product_id=product_id,
        order__date__range=[last_week_monday, last_sunday]
    ).aggregate(Sum('quantity'))['quantity__sum'] or 0
    return last_week_sales


def sales_of_last_month(product_id, Week_date):
    
    last_month_end = (Week_date.replace(day=1) - timedelta(days=1))
    last_month_end = last_month_end.replace(
        hour=23, minute=59, second=59, microsecond=999999)
    last_month_start = last_month_end.replace(
        day=1, hour=0, minute=0, second=0, microsecond=0)
    last_month_sales = ProductOrder.objects.filter(
        product_id=product_id,
        order__date__range=[last_month_start, last_month_end]
    ).aggregate(Sum('quantity'))['quantity__sum'] or 0
    return last_month_sales
