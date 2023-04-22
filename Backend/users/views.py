from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CustomUserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from .models import NewUser
from django.db import IntegrityError



class CustomUserCreate(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.POST.get('email')
        if NewUser.objects.filter(email=email).exists():
            return Response({'email': 'Email address already exists'}, status=400)
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
            except IntegrityError:
                return Response({'email': 'Email address already exists'}, status=400)
            
            if user:
                json = serializer.data
                refresh = RefreshToken.for_user(user)
                
                return Response({"user":json,'access': str(refresh.access_token),
            'refresh': str(refresh)}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BlacklistTokenUpdateView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'Error': 'Invalid refresh  key'}, status=400)