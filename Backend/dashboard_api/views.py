from .models import *
from .serializers import ProductSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from datetime import  timedelta
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound
import joblib
from .helper import predict_product_for_one_week
from rest_framework.permissions import IsAdminUser,IsAuthenticated
# get all product
class get_product( generics.ListAPIView):
    permission_classes = [IsAdminUser]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    


class PredictView(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request, product_id):
        product = get_object_or_404(Product, pk=product_id)
        # if not product:
        #     raise NotFound("Product does not exist")
        # # Extract the actual sales values from the sales data
        # actual_values = [None]

        # last_order_date = Order.objects.last().date
        # last_monday=last_order_date - timedelta(days=last_order_date.weekday())
        # last_week_monday = (last_monday - timedelta(days=7)).replace(hour=0, minute=0, second=0, microsecond=0)
        # result=[]
        # for i in range(9):
        #     result.append({last_monday.strftime("%Y-%m-%d"):predict_product_for_one_week(product_id,last_monday)})
        #     result[len(result)-1][last_monday.strftime("%Y-%m-%d")]["actual"]=actual_values[len(actual_values)-1]
        #     actual_values.append(result[len(result)-1][last_monday.strftime("%Y-%m-%d")]["input"]["Last_week"][0])
        #     last_monday=(last_monday - timedelta(days=7)).replace(hour=0, minute=0, second=0, microsecond=0)
        # for dic in result:
        #     dic[[*dic][0]].pop("input")
        # result.reverse()
        response_data = {
            # "last_order_date":last_order_date,
            # "last_monday":last_monday,
            # "last_week_monday":last_week_monday,
            "product":ProductSerializer(product).data,
            # "result":result,
        }

        return Response(response_data)
import pandas as pd 
import xgboost as xgb 
import time
from concurrent.futures import ThreadPoolExecutor
def train_model():
    time.sleep(10)
    f = open("myfile.txt", "w")
    california = pd.read_csv("housing.csv")
    forx = ['longitude' , 'latitude' , 'housing_median_age' , 'total_bedrooms','population','median_income' , 'households']
    fory = ['median_house_value']
    X, y = california[forx] , california[fory]   
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
    with open ('model.pkl',"wb") as f:
        pickle.dump(model,f)
    model = joblib.load('model.pkl')
    data = pd.DataFrame({
    'longitude': [-121.22],
    "latitude":[37.72],
    'housing_median_age': [34.0],
    'total_bedrooms': [387.0],
    'population': [1310.0],
    'median_income': [2.6368],
    'households': [368.0]
})
executor = ThreadPoolExecutor()

from .serializers import UploadedFileSerializer
from rest_framework.parsers import FileUploadParser
class my_view(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        
        # task = sync_to_async(train_model)()
        executor.submit(train_model)
        
        return Response({"1":1})
    parser_classes = (FileUploadParser,)

    def post(self, request, *args, **kwargs):
        file_serializer = UploadedFileSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=201)
        else:
            return Response(file_serializer.errors, status=400)
        