from rest_framework import serializers
from .models import Folder, TestCase, TestRun, TestStep


class FolderSerializer(serializers.ModelSerializer):
    description = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Folder
        fields = '__all__'


class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = '__all__'


class TestRunSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestRun
        fields = '__all__'


class TestStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestStep
        fields = '__all__'
