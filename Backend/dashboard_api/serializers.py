from rest_framework import serializers
from .models import Product, Order, ProductOrder,Files
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
class FileSerializer(serializers.ModelSerializer):
    def get_user(self, obj):
        return self.context.get('user')
    class Meta:
        model = Files
        fields = ['id', 'label', 'file']
    
class FileListSerializer(FileSerializer):
    class Meta:
        model = Files
        fields = ('id', 'label','status')