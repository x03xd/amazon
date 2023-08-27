from rest_framework import status
from amazonApp.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import update_last_login
import re
from rest_framework.response import Response


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['email'] = user.email
        token['currency'] = user.currency

        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        if user:
            update_last_login(None, user)
     
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class LoginAPI(APIView):
    def post(self, request):
        
        try:
            username = request.data.get("username")

            user_object = User.objects.get(username=username)
            return Response({'authenticated': True, 'email': user_object.email, 'username': username})
        
        except User.DoesNotExist as e:
            return Response({"error": "Error message", "detail": str(e)}, status=404)
        
        except Exception as e:
            return Response({'authenticated': False, "error": "Internal Server Error", "detail": str(e)}, status=500)


class LogoutView(APIView):
    def get(self, request, format=None):
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
        username = data.get('username')

        if password != password2:
            raise Exception("Passwords do not match.")

        if not re.match(r'^[a-zA-Z]*$', username):
            raise Exception("Username should contain only letters.")
        
        if User.objects.filter(username=username).exists():
            raise Exception("A username with that username already exists")
        
        validate_email(email)

        if User.objects.filter(email=email).exists():
            raise Exception("A username with that email already exists")
        
        if User.objects.filter(email=email, username=username).exists():
            raise Exception("A username with that username and email already exists")
        
        validate_password(password)

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
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


        except serializers.ValidationError as e:  
            return Response({"error": "Password is too weak", "detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": "An error occurred during user registration", "detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)