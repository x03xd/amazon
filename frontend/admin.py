from django.contrib import admin
from .models import User, Cart, Product, Category, SubCategory, UserRate

# Register your models here.
admin.site.register(User)
admin.site.register(Cart)
admin.site.register(Product)

admin.site.register(Category)
admin.site.register(SubCategory)

admin.site.register(UserRate)