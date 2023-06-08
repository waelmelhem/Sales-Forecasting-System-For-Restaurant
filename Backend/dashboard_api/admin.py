from .models import Product, Order, ProductOrder,Files
from django.contrib import admin

admin.site.register(Product)
admin.site.register(Order)
admin.site.register(ProductOrder)
admin.site.register(Files)

