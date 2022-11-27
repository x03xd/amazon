from django.contrib import admin
from .models import User, Test, Product, Category, SubCategory
# Register your models here.
admin.site.register(User)
admin.site.register(Test)
admin.site.register(Product)

admin.site.register(Category)
admin.site.register(SubCategory)

