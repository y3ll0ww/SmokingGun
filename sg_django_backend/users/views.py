from django.shortcuts import render
from django.http import Http404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import permissions

from .serializers import *

@api_view(['GET'])
def getUser(request, username):
    try:
        user = CustomUser.objects.get(username=username)
    except CustomUser.DoesNotExist:
        raise Http404("User does not exist")

    serializer = UserSerializer(user, many=False, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
def updateUser(request, username):
    try:
        user = CustomUser.objects.get(username=username)
    except CustomUser.DoesNotExist:
        raise Http404("User does not exist")

    # Check if request data contains avatar
    if 'avatar' in request.data:
        # Update avatar
        user.avatar = request.data['avatar']

    # Update other fields
    if 'bio' in request.data:
        user.bio = request.data['bio']
    if 'email' in request.data:
        user.email = request.data['email']

    user.save()

    serializer = UserSerializer(user, many=False, context={'request': request})
    return Response(serializer.data)