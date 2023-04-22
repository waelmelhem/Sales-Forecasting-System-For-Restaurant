from django.contrib import admin
from django.urls import path,include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('dashboard_api.urls', namespace='dashboard_api')),
    path('api/user/', include('users.urls', namespace='users')),
    # path('create/', views.RegisterView.as_view(), name="create_user"),
    # path('logout/', views.LogoutView.as_view()),
]
