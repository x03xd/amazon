from django.contrib import admin
from .models import User, Cart, Product, SubCategory, Rate, Transaction, CartItem

admin.site.register(User)
admin.site.register(Cart)
admin.site.register(Product)
admin.site.register(SubCategory)
admin.site.register(Rate)
admin.site.register(Transaction)
admin.site.register(CartItem)