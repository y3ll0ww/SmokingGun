from rest_framework import generics
from rest_framework.response import Response
from .serializers import ProjectSerializer, FolderSerializer, TestCaseSerializer
from .models import Project, Folder, TestCase


class ProjectsAllView(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get(self, request, *args, **kwargs):
        projects = self.queryset.values("id", "name", "key", "edited_on")
        return Response({'projects': list(projects)})


class ProjectCreateView(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class ProjectDetailView(generics.RetrieveUpdateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class ProjectDeleteView(generics.DestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def perform_destroy(self, instance):
        folders = instance.project_folders.all()
        for folder in folders:
            folder.delete()

        testcases = instance.project_testcases.all()
        for testcase in testcases:
            testcase.delete()

        testruns = instance.project_testruns.all()
        for testrun in testruns:
            testrun.delete()

        instance.delete()


class RootFolderDetailView(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        project_id = kwargs['id']
        project = self.get_object()
        serializer = self.get_serializer(project)

        # Retrieve all folders with parent_folder=None
        folders = Folder.objects.filter(project=project_id, parent_folder=None).order_by('order')
        folders_serializer = FolderSerializer(folders, many=True)

        # Retrieve all test cases with folder=None
        test_cases = TestCase.objects.filter(project=project_id, folder=None).order_by('order')
        test_cases_serializer = TestCaseSerializer(test_cases, many=True)

        # Prepare the response data
        data = serializer.data
        data['project_folders'] = folders_serializer.data
        data['project_testcases'] = test_cases_serializer.data
        #data = {
        #    'child_folders': folders_serializer.data,
        #    'test_cases': test_cases_serializer.data
        #}

        return Response(data)
