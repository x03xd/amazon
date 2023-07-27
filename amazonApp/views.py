from rest_framework import generics, status
from .models import Product, Category, Rate, User, Transaction, CartItem, Brand, Cart
from .serializers import ProductSerializer, CategorySerializer, RateSerializer, TransactionSerializer, CartItemSerializer, GetterRateSerializer, BrandsByCategoriesSerializer, BrandsByIdSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http.response import JsonResponse
import json
from rest_framework.generics import ListAPIView
from django.db.models import Avg, Sum
from datetime import datetime, timedelta, date
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from decimal import Decimal
from django.contrib.auth.models import update_last_login

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['email'] = user.email

        return token
    

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        if user:
            update_last_login(None, user)
     
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



class CartAPI(APIView):

    def post(self, request):

        try:
            username = request.data.get("username")

            cart = CartItem.objects.filter(cart__owner__username = username).order_by('product__title')
            serializer = CartItemSerializer(cart, many=True)
            
            for cart_item in serializer.data:
                prod = Product.objects.get(id=cart_item["product"])
                p_serializer = ProductSerializer(prod)
                cart_item["product_data"] = p_serializer.data

            sum_ = cart.aggregate(total_price_sum=Sum('total_price'))
        
            return JsonResponse({"cart_items": serializer.data, "sum": sum_['total_price_sum']})

        except CartItem.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return JsonResponse({"error": "Internal Server Error", "detail": str(e)}, status=500)
        

    def patch(self, request, *args, **kwargs):

        try:
            product_id = request.data.get("product_id")
            user_id = request.data.get("user_id")
            quantity = request.data.get("quantity")

            product = Product.objects.get(id=product_id)
            cart = CartItem.objects.get(cart__owner__id = user_id, product = product)
            
            if product.quantity < quantity:
                raise ValueError("Quantity exceeds available stock")

            new_total_price = (cart.total_price * quantity) / cart.quantity

            cart.quantity = quantity
            cart.total_price = new_total_price

            cart.save()
   
            return Response(product_id)
        
        except CartItem.DoesNotExist as e:
            return JsonResponse({"error": "Error message", "detail": str(e)}, status=404)
        
        except Exception as e:
            return JsonResponse({"error": "Internal Server Error", "detail": str(e)}, status=500)



class ProcessAPI(APIView):

    def post(self, request):

        try:
            product_id = request.data.get("product_id")
            user_id = request.data.get("user_id")
            quantity = int(request.data.get("quantity"), 0)

            try: 
                product = Product.objects.get(id=product_id) 
 
            except Product.DoesNotExist:
                return JsonResponse({"error": "Object does not exist"}, status=404)
            
            if quantity > product.quantity:
                raise ValueError({"status": False, "info": "Quantity exceeds available stock"})

            if 10 > quantity < 1:
                raise ValueError({"status": False, "info": "Quantity is not in range 1-10"})

            total_quantity = CartItem.objects.filter(cart__owner__id=user_id).aggregate(Sum('quantity'))['quantity__sum']

            if isinstance(total_quantity, int) and total_quantity + quantity > 10:
                raise ValueError({"status": False, "info": "Maximum quantity of single item exceeded"})

            cart = Cart.objects.get(owner__id=user_id)  

            try:
                obj = CartItem.objects.get(cart=cart, product=product)
                obj.quantity += quantity
                obj.total_price += Decimal(product.price) * quantity
                obj.save()

            except CartItem.DoesNotExist:
                obj = CartItem.objects.create(
                    cart = cart,
                    product = product,
                    quantity = quantity,
                    total_price = float(product.price) * quantity
                )

            return Response({"status": True})

        except Product.DoesNotExist as e:
            return JsonResponse({"error": "Error message", "detail": str(e)}, status=404)
        
        except Exception as e:
            return JsonResponse({"error": "Internal Server Error", "detail": str(e)}, status=500)
        
        



class RemoveItemCart(APIView):

    def post(self, request):
  
        try:
            json_data = json.load(request)

            username = request.data.get("username")
            item_id = request.data.get("item_id")

            cart = CartItem.objects.get(cart__owner__id = username, product__id = item_id)
            cart.delete()

            return JsonResponse({"done": True, "product_id": item_id})


        except Product.DoesNotExistc as e:
            return JsonResponse({"error": "Error message", "detail": str(e)}, status=404)

        except Exception as e:
            return JsonResponse({"error": "Internal Server Error", "detail": str(e)}, status=500)




class CategoriesAPI(ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        try:
            queryset = Category.objects.all()
            return queryset

        except Category.DoesNotExist:
            return JsonResponse({'authenticated': False, "error": "Object does not exist"}, status=404)

        except Exception as e:
            return JsonResponse({"error": "Internal Server Error", "detail": str(e)}, status=500)
        

class LoginAPI(APIView):
    def post(self, request):
        
        try:
            username = request.data.get("username")

            user_object = User.objects.get(username=username)
            return JsonResponse({'authenticated': True, 'email': user_object.email, 'username': username})
        
        except User.DoesNotExist as e:
            return JsonResponse({"error": "Error message", "detail": str(e)}, status=404)
        
        except Exception as e:
            return JsonResponse({'authenticated': False, "error": "Internal Server Error", "detail": str(e)}, status=500)



class LogoutView(APIView):
    def get(self, request, format = None):
        pass



class UserRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate(self, data):
        password = data.get('password')
        password2 = data.get('password2')
        email = data.get('email')

        if password != password2:
            raise serializers.ValidationError("Passwords do not match.")

        validate_password(password)
        validate_email(email)

        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('password2')

        hashed_password = make_password(password)
        user = User.objects.create(password=hashed_password, **validated_data)
        return user
    

class RegisterSystem(APIView):
    def post(self, request, *args, **kwargs):
        try:
            serializer = UserRegistrationSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"status": True}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


        except serializers.ValidationError as e:  
            return Response({"error": "Password is too weak", "detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": "An error occurred during user registration", "detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class ProductsBySubsAPI(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        q = self.request.query_params.get('q')

        try:
            if q is not None:
                queryset = Product.objects.filter(category_name__name=q)
                return queryset
            else:
                raise ValueError("Parameter 'q' is missing.")
            
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)




class CountAvgRate(generics.ListAPIView):
    serializer_class = RateSerializer

    def get_queryset(self):
        try:
            return Rate.objects.values("rated_products").annotate(average_rate=Avg("rate"))

        except Rate.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)


class ProductsAPI(APIView):

    def get(self, request):
    
        r = self.request.query_params.get('rating')
        q = self.request.query_params.get('q')
        c = self.request.query_params.get('c')
        u = self.request.query_params.get('u')
        
        lst = []

        if r is not None:
            try:
                rates = Rate.objects.values("rated_products").annotate(average_rate=Avg("rate")).filter(average_rate__gte=r)
                serializer = RateSerializer(rates, many = True)

                for rate in rates:
                    lst.append(rate["rated_products"])

            except Rate.DoesNotExist:
                return Response({"error": "Object does not exist"}, status=404)

            except Exception as e:
                return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        

        if c is not None:
            multiple_brands_filter = c.split(",")

        if u is not None:
            multiple_prices_filter = u.split(",")
            first_lst, second_lst = [], []

            for index, s in enumerate(multiple_prices_filter):
                first, second = s.split('-')
                first_lst.append(float(first))
                second_lst.append(float(second))


        try:
            queryset = Product.objects.all()

        except Rate.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)
        
        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)

  
        if q is None:

            if (c is not None) and (u is not None) and (r is not None):
                queryset = queryset.filter(id__in = lst, brand__brand_name__in = multiple_brands_filter, price__range=(first_lst[0], second_lst[-1]))

            if (c is not None) and (u is not None) and (r is None):
                queryset = queryset.filter(brand__brand_name__in = multiple_brands_filter, price__range=(first_lst[0], second_lst[-1]))

            if (c is not None) and (u is None) and (r is not None):
                queryset = queryset.filter(id__in = lst, brand__brand_name__in = multiple_brands_filter)

            if (c is None) and (u is not None) and (r is not None):
                queryset = queryset.filter(id__in = lst, price__range=(first_lst[0], second_lst[-1]))
            
            if (c is None) and (u is None) and (r is not None):
                queryset = queryset.filter(id__in = lst)

            if (c is not None) and (u is None) and (r is None):
                queryset = queryset.filter(brand__brand_name__in = multiple_brands_filter)

            if (c is None) and (u is not None) and (r is None):
                queryset = queryset.filter(price__range=(first_lst[0], second_lst[-1]))

        
        else:

            if (c is not None) and (u is not None) and (r is not None):
                queryset = queryset.filter(category_name__name__icontains=q, id__in = lst, brand__brand_name__in = multiple_brands_filter, price__range=(first_lst[0], second_lst[-1]))

            if (c is not None) and (u is not None) and (r is None):
                queryset = queryset.filter(category_name__name__icontains=q, brand__brand_name__in = multiple_brands_filter, price__range=(first_lst[0], second_lst[-1]))

            if (c is not None) and (u is None) and (r is not None):
                queryset = queryset.filter(category_name__name__icontains=q, id__in = lst, brand__brand_name__in = multiple_brands_filter)

            if (c is None) and (u is not None) and (r is not None):
                queryset = queryset.filter(category_name__name__icontains=q, id__in = lst, price__range=(first_lst[0], second_lst[-1]))
            
            if (c is None) and (u is None) and (r is not None):
                queryset = queryset.filter(category_name__name__icontains=q, id__in = lst)

            if (c is not None) and (u is None) and (r is None):
                queryset = queryset.filter(category_name__name__icontains=q, brand__brand_name__in = multiple_brands_filter)

            if (c is None) and (u is not None) and (r is None):
                queryset = queryset.filter(category_name__name__icontains=q, price__range=(first_lst[0], second_lst[-1]))

            if (c is None) and (u is None) and (r is None):
                queryset = queryset.filter(category_name__name__icontains=q)
   
   
        serializer = ProductSerializer(queryset, many=True)

        return Response(serializer.data)
 


    def post(self, request):
                
        try:
            lst = request.data.get("lst")
            products = []

            for product, quantity in lst:
                instance = Product.objects.get(id=product)
                products.append(instance)

            serializer = ProductSerializer(products, many=True)

            return JsonResponse({"products": serializer.data})

        except Product.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
   

class AccessToChangeStatus(APIView):
        
    def get(self, request, *args, **kwargs):
        today_date = date.today()

        try:
            user = User.objects.get(id = self.kwargs.get("id"))

            if user.username_change_allowed >= today_date:
                status_username = False

            elif user.username_change_allowed < today_date:
                status_username = True


            if user.email_change_allowed >= today_date:
                status_email = False

            elif user.email_change_allowed < today_date:
                status_email = True


            if user.password_change_allowed >= today_date:
                status_password = False

            elif user.password_change_allowed < today_date:
                status_password = True

            return JsonResponse({
                                    "username": [status_username, user.username_change_allowed],
                                    "email": [status_email, user.email_change_allowed],
                                    "password": [status_password, user.password_change_allowed]
                                })


        except User.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return JsonResponse({"error": "Internal Server Error", "detail": str(e)}, status=500)





class EditUsername(APIView):
    
    def patch(self, request, **kwargs):

        try:
            change = request.data.get("change")

            user = User.objects.get(id = self.kwargs.get("id"))
            today_date = date.today()

            if user.username_change_allowed >= today_date:
                raise Exception("You cannot change username")

            if User.objects.filter(email=change).exists():
                raise Exception("User with passed username already exists")
            
            user.username = change

            new_date = date.today() + timedelta(days=30) 
            user.username_change_allowed = new_date

            user.save()

            return JsonResponse({"status": True})

        except User.DoesNotExist as e:
            return JsonResponse({"error": "Error message", "detail": str(e)}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)



class EditEmail(APIView):

    def patch(self, request, **kwargs):

        try:
            change = request.data.get("change")

            user = User.objects.get(id = self.kwargs.get("id"))
            today_date = date.today()

            if user.email_change_allowed >= today_date:
                raise Exception("You cannot change email")

            if User.objects.filter(email=change).exists():
                raise Exception("User with passed email already exists")
            
            user.email = change

            new_date = date.today() + timedelta(days=30) 
            user.email_change_allowed = new_date

            user.save()

            return JsonResponse({"status": True})

        except User.DoesNotExist as e:
            return JsonResponse({"error": "Error message", "detail": str(e)}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)

        


class FinalizeOrder(APIView):

    def post(self, request):

        try:
            user = request.data.get("user")
            quantity = request.data.get("quantity")
            location = request.data.get("location")
            product_id = request.data.get("product_id")

            if location == "cart":
                cart_items = CartItem.objects.filter(cart__owner__id = user)
                serializer = CartItemSerializer(cart_items, many=True)
                bought = []

                for record in serializer.data:
                    product = Product.objects.get(title=record["product"])

                    if product.quantity >= record["quantity"]:
                        bought += [record["product"]] * record["quantity"]
                    else:
                        raise Exception("User's input greater than product's quantity")

                cart_items.delete()
 
            elif location == "lobby":
                bought = product_id * int(quantity)
                product = Product.objects.get(id=product_id[0])

                if product.quantity >= len(bought):
                    product.quantity -= len(bought)

                else:
                    raise Exception("User's input greater than product's quantity")

            try:
                user = User.objects.get(id = user)

            except User.DoesNotExist:
                return Response({"error": "Object does not exist"}, status=404)    

            Transaction.objects.create(
                bought_by = user,
                bought_products = bought,
                date = datetime.now().date()
            )

            return Response("The user's cart has been cleared and transaction has been saved")
                

        except Cart.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)    

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        
            

class TransactionsAPI(ListAPIView):
    serializer_class = TransactionSerializer

    def get_queryset(self):
      
        try:
            queryset = Transaction.objects.filter(bought_by__id = self.kwargs.get("id"))
            return queryset

        except Transaction.DoesNotExist:
            return JsonResponse({'authenticated': False, "error": "Object does not exist"}, status=404)
        
        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        
    
        
class ProductsFromTransactions(APIView):

    def post(self, request):
        table, lst = {}, []

        try:
            pages = request.data.get("pages")
            lst = request.data.get("lst")

            start, end = pages, pages + 5

            flattened_lst = [[item, sublist["date"]] for sublist in lst for item in sublist["bought_products"]]

            for index, date in flattened_lst:
                table[(index, date)] = table.get((index, date), 0) + 1

            counter = 0
            for (index, date), count in table.items():
                product = Product.objects.get(id=index)
                serializer = ProductSerializer(product)
                lst.append((count, serializer.data, date))
                counter += 1

                if counter == end:
                    break

            return Response(lst)

        except Product.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)
        
        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        

class RateProduct(APIView):

    def get(self, request, **kwargs):

        try:
            rate_of_product = Rate.objects.get(rated_by__id = self.kwargs.get("id"), rated_products__id = self.kwargs.get("pid"))
            serializer = GetterRateSerializer(rate_of_product)

            return Response(serializer.data["rate"])

        except Rate.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)
        
        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)


    
    def patch(self, request, **kwargs):
        created = False

        try:
            try:
                user = User.objects.get(id = self.kwargs.get("id"))

            except User.DoesNotExist:
                return JsonResponse({"error": "Object does not exist"}, status=404)
            
            try:
                product = Product.objects.get(id = self.kwargs.get("pid"))
            
            except Product.DoesNotExist:
                return JsonResponse({"error": "Object does not exist"}, status=404)
            

            rate_of_user, created = Rate.objects.get_or_create(
                rated_by = user,
                rated_products = product,
                defaults={'rate': self.kwargs.get("rate")}
            )

            if not created:
                rate_of_user.rate = self.kwargs.get("rate")
                rate_of_user.save()

            return Response("The rate for the specific item has been changed/created")
    

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        

class DeleteRate(APIView):

    def post(self, request, **kwargs):

        try:
            user_id = request.data.get("user_id")
            product_id = request.data.get("product_id")

            rate = Rate.objects.get(rated_by__id = user_id, rated_products__id = product_id)
            rate.delete()

        except Rate.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)



class BrandsByCategoriesAPI(APIView):

    def get(self, request, *args, **kwargs):

        try:
            brands = Brand.objects.filter(belongs_to_category__name__icontains = self.kwargs.get("category"))
            serializer = BrandsByCategoriesSerializer(brands, many=True)

            return Response(serializer.data)

        except Brand.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        


class BrandsByIdAPI(APIView):

    def get(self, request, **kwargs):

        try:
            brand = Brand.objects.get(id = self.kwargs.get("id"))
            serializer = BrandsByIdSerializer(brand)

            return Response(serializer.data)


        except Brand.DoesNotExist as e:
            return JsonResponse({"error": "Error message", "detail": str(e)}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        



class EditPassword(APIView):
    def patch(self, request, *args, **kwargs):

        try:
            password = request.data.get("password")
            password2 = request.data.get("password2")

            if password != password2:
                raise ValidationError("Passwords do not match.")

            user = User.objects.get(id = self.kwargs.get("id"))
            today_date = date.today()

            if user.password_change_allowed >= today_date:
                raise Exception("You cannot change password")

            validate_password(password)

            hashed_password = make_password(password)
            user.password = hashed_password

            new_date = today_date + timedelta(days=30) 
            user.password_change_allowed = new_date

            user.save()

            return JsonResponse({"status": True})

        except User.DoesNotExist as e:
            return JsonResponse({"error": "Error message", "detail": str(e)}, status=404)

        except ValidationError as e:
            return Response({"error": "Password is too weak", "detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error": "An error occurred during user registration", "detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        

