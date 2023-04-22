from django.contrib import admin
from django.urls import path
from dashboard_api.views import *
app_name = 'dashboard_api'

urlpatterns = [
    path('allproduct/', get_product.as_view()),
    path('predict/<int:product_id>/', PredictView.as_view(), name='predict'),
    path('makemodel',my_view.as_view(), name='predict'),
]
