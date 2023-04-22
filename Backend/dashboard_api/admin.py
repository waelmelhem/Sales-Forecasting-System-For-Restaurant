from .models import Product, Order, ProductOrder
from django.contrib import admin

admin.site.register(Product)
admin.site.register(Order)
admin.site.register(ProductOrder)

