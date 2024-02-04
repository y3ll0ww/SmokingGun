from rest_framework import serializers
from .models import Project, Folder, TestCase, TestStep, TestRun, TestStepRun


class ProjectSerializer(serializers.ModelSerializer):
    description = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Project
        fields = '__all__'


class FolderSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    order = serializers.IntegerField(required=False)
    item_number = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Folder
        fields = '__all__'


class TestCaseSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    order = serializers.IntegerField(required=False)
    item_number = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = TestCase
        fields = '__all__'


class TestStepSerializer(serializers.ModelSerializer):
    action = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    result = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = TestStep
        fields = '__all__'


class TestStepRunSerializer(serializers.ModelSerializer):
    teststepdetails = TestStepSerializer(source='teststep', read_only=True)

    class Meta:
        model = TestStepRun
        fields = '__all__'


class TestRunDetailSerializer(serializers.ModelSerializer):
    teststepruns = TestStepRunSerializer(many=True, read_only=True)

    class Meta:
        model = TestRun
        fields = '__all__'


class TestRunListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestRun
        fields = '__all__'