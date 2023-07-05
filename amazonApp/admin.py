from django.contrib import admin
from .models import User, Cart, Product, SubCategory, UserRate, Transaction

admin.site.register(User)
admin.site.register(Cart)
admin.site.register(Product)
admin.site.register(SubCategory)
admin.site.register(UserRate)
admin.site.register(Transaction)