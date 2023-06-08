from django.contrib import admin
from django.urls import path
from dashboard_api.views import *
app_name = 'dashboard_api'

urlpatterns = [
    path('allproduct/', get_product.as_view()),
    path('predict/<int:product_id>/', PredictProductsView.as_view(), name='predict_products'),
    path('predict/orders', PredictOrdersView.as_view(), name='predict_orders'),
    path('correlations/<int:product_id>/', CorrelatedView.as_view(), name='correlated_products'),
    path('makemodel',my_view.as_view(), name='predict'),
    path('file/', UplodeFileView.as_view(), name='file-upload'),
    path('file/<uuid>/', FileView.as_view(), name='file-detail'),
    
    path('user/files/', UserFilesView.as_view(), name='get-files'),
]
