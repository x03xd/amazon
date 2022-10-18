from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.

class User(AbstractUser):
    email = models.EmailField(max_length = 30, null = True)
    coins = models.IntegerField(null = True)


class Test(models.Model):
    test_name = models.CharField(max_length = 30, null = True)
