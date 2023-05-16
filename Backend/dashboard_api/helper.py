from datetime import datetime, timedelta
import joblib
import numpy as np
import pandas as pd
from .models import ProductOrder, Order
from django.db.models import Sum


def predict_orders_for_one_week(day_date):
    last_week_day = (day_date - timedelta(days=7)).replace(hour=0, minute=0, second=0, microsecond=0)
    yesterday = yesterday = (day_date - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
    day_of_year = day_date.timetuple().tm_yday
    year = day_date.year
    day_of_month = day_date.day
    last_week_value = day_orders(last_week_day)
    yesterday_number = day_orders(yesterday)
    dayofweek = day_date.weekday()
    weekofyear = day_date.isocalendar()[1]
    last_week_sum = week_orders(day_date)
    month=day_date.month
    data = pd.DataFrame({
        'last_week_value': [last_week_value],
        'dayofweek': [dayofweek],
        'year': [year],
        'dayofyear': [day_of_year],
        "weekofyear": [weekofyear],
        'dayofmonth': [day_of_month],
        "last_week_sum":[last_week_sum],
        'yesterday_number': [yesterday_number],
        "month":[month],
    })
    model = joblib.load('AI_models/Forcasting_orders_sales.pkl')
    
    return {
        "predict": model.predict(data).tolist()[0],
        "input": {
            'last_week_value': [last_week_value],
            'dayofweek': [dayofweek],
            'year': [year],
            'dayofyear': [day_of_year],
            "weekofyear": [weekofyear],
            'last_week_sum': [last_week_sum],
            'dayofmonth': [day_of_month],
            'yesterday_number': [yesterday_number],
            "month":[month],
        }
    }

from django.db.models.functions import Trunc
def day_orders(day_date):
    next_day = day_date + timedelta(days=1)
    return Order.objects.filter(date__range=(day_date, next_day)).count()
    # return orders_count


def week_orders(day_date):
    start_date = day_date - timedelta(days=7)
    end_date = day_date
    return Order.objects.filter(date__range=(start_date, end_date)).count()


def predict_product_for_one_week(product_id, week_date):
    day_of_year = week_date.timetuple().tm_yday
    year = week_date.year
    day_of_month = week_date.day

    last_week_sales = sales_of_last_week(product_id, week_date)

    last_month_sales = sales_of_last_month(product_id, week_date)
    week_num = week_date.isocalendar()[1]
    data = pd.DataFrame({
        'Last_week': [last_week_sales],
        'Last_month': [last_month_sales],
        'Item_ID': [product_id],
        'dayofmonth': [day_of_month],
        'year': [year],
        "weekofyear": week_num,
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
            'dayofyear': [day_of_year],
            "weekOfYear": week_date.isocalendar()[1]
        }}


def sales_of_last_week(product_id, week_date):
    last_week_monday = (week_date - timedelta(days=7)
                        ).replace(hour=0, minute=0, second=0, microsecond=0)
    last_sunday = (week_date - timedelta(days=1)
                   ).replace(hour=23, minute=59, second=59, microsecond=999999)
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
