from rest_framework import serializers
from .models import Folder, TestCase, TestRun, TestStep


class FolderSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    order = serializers.IntegerField(required=False)

    class Meta:
        model = Folder
        fields = '__all__'


class TestCaseSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    order = serializers.IntegerField(required=False)

    class Meta:
        model = TestCase
        fields = '__all__'


class TestRunSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestRun
        fields = '__all__'


class TestStepSerializer(serializers.ModelSerializer):
    action = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    result = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = TestStep
        fields = '__all__'
