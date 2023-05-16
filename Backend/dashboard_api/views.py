import csv
from django.db import transaction
import pandas as pd
from django.db.models.functions import TruncWeek
from rest_framework.parsers import MultiPartParser, FormParser
import xgboost as xgb
from .models import Product, ProductOrder
from django.db.models import Sum
import os
from django.http import FileResponse
from django.http import HttpResponseNotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import status
from .serializers import *
from .models import Files
from concurrent.futures import ThreadPoolExecutor
import time
from .models import *
from .serializers import ProductSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from datetime import timedelta
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound
import joblib
from .helper import predict_product_for_one_week, predict_orders_for_one_week
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.db.models import Q
from django.db.models import Max
# get all product


class get_product(generics.ListAPIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        min_weekly_sales = 20
        # group ProductOrder by week and product, and annotate with the sum of quantity
        sales_by_week = (
            ProductOrder.objects
            .annotate(week=TruncWeek('order__date'))
            .values('product', 'week')
            .annotate(sales=Sum('quantity'))
            .filter(
                Q(sales__gt=20))
            .values('product')
            .distinct()
        )
        queryset = Product.objects.filter(
            id__in=[i["product"] for i in sales_by_week])
        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)


class PredictProductsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, product_id):
        product = get_object_or_404(Product, pk=product_id)
        if not product:
            raise NotFound("Product does not exist")
        # Extract the actual sales values from the sales data
        actual_values = [None]

        last_order_date = Order.objects.last().date
        last_monday = last_order_date - \
            timedelta(days=last_order_date.weekday())
        last_week_monday = (last_monday - timedelta(days=7)
                            ).replace(hour=0, minute=0, second=0, microsecond=0)
        result = []
        for i in range(9):
            result.append({last_monday.strftime(
                "%Y-%m-%d"): predict_product_for_one_week(product_id, last_monday)})
            result[len(result)-1][last_monday.strftime("%Y-%m-%d")
                                  ]["actual"] = actual_values[len(actual_values)-1]
            actual_values.append(
                result[len(result)-1][last_monday.strftime("%Y-%m-%d")]["input"]["Last_week"][0])
            last_monday = (last_monday - timedelta(days=7)
                           ).replace(hour=0, minute=0, second=0, microsecond=0)
        for dic in result:
            dic[[*dic][0]].pop("input")
        result.reverse()
        response_data = {
            # "last_order_date":last_order_date,
            # "last_monday":last_monday,
            # "last_week_monday":last_week_monday,
            "product": ProductSerializer(product).data,
            "result": result,
        }

        return Response(response_data)


class PredictOrdersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        actual_values = [None]

        last_order_date = Order.objects.last().date
        tom = (last_order_date + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)

        yesterday = (tom - timedelta(days=1)).replace(hour=0,
                                                      minute=0, second=0, microsecond=0)
        result = [None]
        for i in range(8):
            result.append(
                {tom.strftime("%Y-%m-%d"): predict_orders_for_one_week(tom)})
            result[len(result)-1][tom.strftime("%Y-%m-%d")
                                  ]["actual"] = actual_values[len(actual_values)-1]
            actual_values.append(
                result[len(result)-1][tom.strftime("%Y-%m-%d")]["input"]["yesterday_number"][0])
            tom = (tom - timedelta(days=1)).replace(hour=0,minute=0, second=0, microsecond=0)

        for result_dict in result:
            if result_dict is not None:
                for date_str, predict_actual_dict in result_dict.items():
                    predict_actual_dict.pop("input", None)
        result.reverse()
        response_data = {
            "result": result,

        }

        return Response(response_data)


def train_model():
    time.sleep(10)
    f = open("myfile.txt", "w")
    california = pd.read_csv("housing.csv")
    forx = ['longitude', 'latitude', 'housing_median_age',
            'total_bedrooms', 'population', 'median_income', 'households']
    fory = ['median_house_value']
    X, y = california[forx], california[fory]
    # await asyncio.sleep(1)
    # Split the data into training and testing sets
    train_size = int(len(X) * 0.8)
    X_train, y_train = X[:train_size], y[:train_size]
    X_test, y_test = X[train_size:], y[train_size:]

    # Train an XGBoost regressor model
    model = xgb.XGBRegressor(objective='reg:squarederror')
    model.fit(X_train, y_train)
    score = model.score(X_test, y_test)
    import pickle
    with open('model.pkl', "wb") as f:
        pickle.dump(model, f)
    model = joblib.load('model.pkl')
    data = pd.DataFrame({
        'longitude': [-121.22],
        "latitude": [37.72],
        'housing_median_age': [34.0],
        'total_bedrooms': [387.0],
        'population': [1310.0],
        'median_income': [2.6368],
        'households': [368.0]
    })


executor = ThreadPoolExecutor()

# from .serializers import UploadedFileSerializer
# from rest_framework.parsers import FileUploadParser


class my_view(APIView):
    # permission_classes = [IsAdminUser]
    def get(self, request):

        # # task = sync_to_async(train_model)()
        # executor.submit(train_model)

        return Response({"1": 1})
        # parser_classes = (FileUploadParser,)

    # def post(self, request, *args, **kwargs):
    #     file_serializer = UploadedFileSerializer(data=request.data)
    #     if file_serializer.is_valid():
    #         file_serializer.save()
    #         return Response(file_serializer.data, status=201)
    #     else:
    #         return Response(file_serializer.errors, status=400)


class UplodeFileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        user_id = request.user.id
        file = request.data.get('file')
        if not file.name.endswith('.csv'):
            return Response({'error': 'Invalid file extension. Only CSV files are allowed.'}, status=status.HTTP_400_BAD_REQUEST)

        file_serializer = FileSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save(user_id=user_id)
            file_id = file_serializer.instance.id
            with transaction.atomic():
                try:
                    with open(file_serializer.instance.file.path, 'r') as f:
                        reader = csv.DictReader(f)
                        for row in reader:
                            order_id = row['order_id']
                            product_id = row['Item_ID']
                            # Check if order id is unique
                            # Create order
                            order_data = {
                                'id': order_id, 'date': row['date'], "files_id": file_id}
                            order = Order.objects.update_or_create(
                                **order_data)

                            # Create product order
                            product_order_data = {
                                'order_id': order_id, 'product_id': product_id, 'quantity': row['Quantity']}
                            ProductOrder.objects.create(**product_order_data)
                    file_serializer.save(status="File uploaded successfully")
                    return Response({'success': 'File uploaded successfully.'}, status=status.HTTP_201_CREATED)
                except Exception as e:
                    file_serializer.save(status="Invalid file Data")
                    return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserFilesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        files = Files.objects.all()
        serializer = FileListSerializer(files, many=True)
        return Response(serializer.data)


class FileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, uuid):
        try:
            # Get the file object by UUID and user
            file = Files.objects.get(id=uuid)
        except Files.DoesNotExist:
            return HttpResponseNotFound()

        # Open the file and create a response with the file contents
        file_handle = file.file.open('rb')
        response = FileResponse(file_handle)
        response['Content-Disposition'] = f'attachment; filename="{file.label}"'
        return response

    def delete(self, request, uuid):

        user = request.user
        file = get_object_or_404(Files, id=uuid)
        file_path = file.file.path
        if os.path.exists(file_path):
            os.remove(file_path)
        file.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
