from django.db import models
from django.contrib.auth.models import AbstractUser
import base64, os, requests, json
from django.dispatch import receiver
from django.db.models.signals import post_save
# Create your models here.

from rest_framework.response import Response
from django.http.response import JsonResponse
class Category(models.Model):

    CHOICES = (
        ("elektronika", "Elektronika"),
        ("książki", "Książki"),
        ("instrumenty muzyczne" ,"Instrumenty muzyczne"),
        ("dom i kuchnia", "Dom i kuchnia"),
    )

    category = models.CharField(null = True, choices = CHOICES, max_length = 50)

    def __str__(self):
        return self.category




class SubCategory(models.Model):

    category_name = models.ForeignKey(Category, null=True, on_delete=models.CASCADE)
    sub_category = models.CharField(null=True, max_length=50)

    def __str__(self):
        return self.sub_category






class Product(models.Model):
    subcategory_name = models.ForeignKey(SubCategory, on_delete = models.CASCADE, null = True)
    title = models.CharField(max_length = 140, null = True)
    description = models.CharField(max_length = 1040, null = True)
    price = models.FloatField(null = True)
    rating = models.DecimalField(null = True, decimal_places = 2, max_digits = 10, blank = True)
    image = models.ImageField(null = True)

    gallery1 = models.ImageField(null = True, blank = True)
    gallery2 = models.ImageField(null=True, blank=True)
    gallery3 = models.ImageField(null=True, blank=True)

    status = models.BooleanField(null = True, blank = True)
    quantity = models.PositiveIntegerField(null = True, blank = True)

    brand = models.CharField(max_length = 40, null = True)


    def __str__(self):
        return self.title


class User(AbstractUser):
    email = models.EmailField(max_length=30, null=True)
    coins = models.IntegerField(null=True, blank = True)


    def __str__(self):
        return self.username


'''
    @classmethod
    def post_create(cls, sender, instance, created, *args, **kwargs):
        if not created:
            return
'''

class Cart(models.Model):
    test_name = models.CharField(max_length = 30, null = True)
    products = models.ManyToManyField(Product, related_name='products', blank=True)
    owner = models.OneToOneField(User, on_delete=models.CASCADE, null=True)


    def __str__(self):
        return self.test_name


class Transaction(models.Model):
    pass

@receiver(post_save, sender=User)
def create_one_to_one(sender, instance, created, **kwargs):
    if created:
        one_to_one = Cart.objects.create(test_name=f"{instance}'s cart", owner = instance)
        instance.one_to_one = one_to_one
        instance.save()

