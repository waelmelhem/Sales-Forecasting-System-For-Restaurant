from django.db import models

from django.db import models
import uuid
class Files(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False, unique=True)
    file = models.FileField(upload_to='store/')
    label = models.CharField(max_length=255)
    status= models.CharField(max_length=255,default="File Uploaded")
    user = models.ForeignKey('users.NewUser', on_delete=models.CASCADE)
    

    def __str__(self):
        return self.label

class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    can_predict= models.BooleanField(default=False)
    fields = '__all__'
    def __str__(self):
        return self.name


class Order(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateTimeField(auto_now_add=False, db_index=True)
    files = models.ForeignKey(Files, on_delete=models.CASCADE, default=0)
    
    def __str__(self):
        return f"Order {self.id} - {self.date}"

class ProductOrder(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    class Meta:
        unique_together = ('order', 'product')

    def __str__(self):
        return f"Order {self.order.id} - {self.product.name} ({self.quantity})"
    

class UploadedFile(models.Model):
    file = models.FileField(upload_to='uploads/')
import uuid

