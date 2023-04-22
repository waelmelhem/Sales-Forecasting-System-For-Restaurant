from rest_framework import serializers
from .models import Product, Order, ProductOrder
from rest_framework import permissions


class ProductSerializer(serializers.ModelSerializer):
    permission_classes = permissions.IsAuthenticated,
    class Meta:
        model = Product
        fields = ['id', 'name', 'price']

from rest_framework import serializers



class ProductOrderSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = ProductOrder
        fields = ['order', 'product', 'quantity']
        

from .models import UploadedFile
class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = ('file',)