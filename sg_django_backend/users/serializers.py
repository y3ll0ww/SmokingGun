from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [ "id", "username", "avatar", "email", "first_name", "last_name", "date_joined" ]
