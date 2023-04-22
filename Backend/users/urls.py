from django.urls import path
from .views import BlacklistTokenUpdateView,CustomUserCreate

app_name = 'users'

urlpatterns = [
    path('create/', CustomUserCreate.as_view(), name="create_user"),
    path('logout/', BlacklistTokenUpdateView.as_view(),
        name='blacklist')
]