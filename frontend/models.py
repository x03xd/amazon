from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.

class User(AbstractUser):
    email = models.EmailField(max_length = 30, null = True)
    coins = models.IntegerField(null = True)


class Test(models.Model):
    test_name = models.CharField(max_length = 30, null = True)



class Product(models.Model):
    title = models.CharField(max_length = 40, null = True)
    category = models.CharField(max_length = 25, null = True)
    desc = models.CharField(max_length = 40, null = True)
    price = models.DecimalField(null = True)
    image = models.IntegerField(null=True)
    rating = models.DecimalField(null = True)
