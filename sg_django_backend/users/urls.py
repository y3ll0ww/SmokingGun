from django.urls import include, path
from . import views
from .views import *

app_name = 'users'

urlpatterns = [
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.authtoken')),
    path('user/<str:username>/', views.getUser, name='getUser'),
]