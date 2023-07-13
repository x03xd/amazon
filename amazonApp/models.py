from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save
from datetime import datetime
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MinValueValidator, MaxValueValidator


date = datetime.now()


class Category(models.Model):
    name = models.CharField(max_length=100, null=True)

    def __str__(self):
        return self.name

class Brand(models.Model):
    brand_name = models.CharField(max_length=100, null=True)
    belong_to_category = models.ForeignKey(Category, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.brand_name
    

class Product(models.Model):
    title = models.CharField(max_length = 140, null = True)
    description = models.CharField(max_length = 1040, null = True)
    price = models.FloatField(null = True)

    image = models.ImageField(null = True)
    gallery1 = models.ImageField(null=True, blank=True)

    status = models.BooleanField(null = True, blank = True)
    quantity = models.PositiveIntegerField(null = True, blank = True)

    category_name = models.ForeignKey(Category, on_delete = models.CASCADE, null = True)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, null=True)


    def __str__(self):
        return self.title
    



class User(AbstractUser):
    email = models.EmailField(max_length=30, null=True)
    coins = models.IntegerField(null=True, blank = True)
    
    username_change_allowed = models.DateField(null=True, blank = True)
    email_change_allowed = models.DateField(null=True, blank = True)

    groups = models.ManyToManyField(Group, related_name='amazon_users', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='amazon_users', blank=True)


    def __str__(self):
        return self.username
    

class Rate(models.Model):
    rate = models.IntegerField(null=True, blank=True,
        validators=[
            MinValueValidator(1, message="Value must be greater than or equal to 0."),
            MaxValueValidator(5, message="Value must be less than or equal to 5.")
        ])
    rated_products = models.ForeignKey(Product, null=True, blank=True, on_delete = models.CASCADE)
    rated_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True)



class Cart(models.Model):
    test_name = models.CharField(max_length = 30, null = True)
    owner = models.OneToOneField(User, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return str(self.owner)


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=8, decimal_places=2, null=True)

    def __str__(self):
        return f"{self.cart}, {self.product}, {self.quantity}"


class Transaction(models.Model):
    bought_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    bought_products = ArrayField(models.IntegerField())
    date = models.DateField()


@receiver(post_save, sender=User)
def create_one_to_one(sender, instance, created, **kwargs):
    if created:
        one_to_one = Cart.objects.create(test_name=f"{instance}'s cart", owner = instance)
        instance.one_to_one = one_to_one
        instance.save()


@receiver(post_save, sender=Product)
def create_one_to_one(sender, instance, created, **kwargs):
    if created:
        rating = Rate.objects.create(rated_products = instance, rate = None)
        instance.rating = rating
        instance.save()


@receiver(post_save, sender=User)
def create_one_to_one(sender, instance, created, **kwargs):
    if created:
        instance.username_change_allowed = date.date()
        instance.email_change_allowed = date.date()
        instance.save()





