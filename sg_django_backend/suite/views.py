from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import FolderSerializer, TestCaseSerializer, TestRunSerializer, TestStepSerializer
from .models import Folder, TestCase, TestRun, TestStep


class FolderListCreateView(generics.ListCreateAPIView):
    serializer_class = FolderSerializer

    def get_queryset(self):
        return Folder.objects.all()


class FolderCreateView(generics.CreateAPIView):
    serializer_class = FolderSerializer

    def create(self, request, *args, **kwargs):
        name = request.data.get('name')
        parent_folder_id = request.data.get('parent_folder')

        # Check if the parent folder exists
        parent_folder = None
        if parent_folder_id:
            try:
                parent_folder = Folder.objects.get(id=parent_folder_id)
            except Folder.DoesNotExist:
                return Response({'error': 'Parent folder does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the folder
        folder = Folder(name=name, parent_folder=parent_folder)
        folder.save()

        # Serialize the created folder
        serializer = self.get_serializer(folder)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class FolderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        folder = self.get_object()
        serializer = self.get_serializer(folder)

        # Get the child folders and test cases
        child_folders = Folder.objects.filter(parent_folder=folder)
        child_folders_serializer = FolderSerializer(child_folders, many=True)
        test_cases = TestCase.objects.filter(folder=folder)
        test_cases_serializer = TestCaseSerializer(test_cases, many=True)

        # Add the child folders and test cases to the serialized data
        data = serializer.data
        data['child_folders'] = child_folders_serializer.data
        data['test_cases'] = test_cases_serializer.data

        return Response(data)


class TestCaseListCreateView(generics.ListCreateAPIView):
    serializer_class = TestCaseSerializer

    def get_queryset(self):
        return TestCase.objects.all()


class TestCaseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TestCase.objects.all()
    serializer_class = TestCaseSerializer
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        testcase = self.get_object()
        serializer = self.get_serializer(testcase)

        # Get the test steps for the test case
        test_steps = TestStep.objects.filter(testcase=testcase)
        test_steps_serializer = TestStepSerializer(test_steps, many=True)

        # Add the test steps to the serialized data
        data = serializer.data
        data['test_steps'] = test_steps_serializer.data

        return Response(data)


class TestRunListCreateView(generics.ListCreateAPIView):
    serializer_class = TestRunSerializer

    def get_queryset(self):
        return TestRun.objects.all()


class TestRunDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TestRunSerializer

    def get_queryset(self):
        return TestRun.objects.all()


class TestStepListCreateView(generics.ListCreateAPIView):
    serializer_class = TestStepSerializer

    def get_queryset(self):
        return TestStep.objects.all()


class TestStepDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TestStepSerializer

    def get_queryset(self):
        return TestStep.objects.all()


class FolderTreeView(generics.RetrieveAPIView):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer

    def get(self, request, *args, **kwargs):
        if 'id' in kwargs:
            folder = self.get_object()
            serializer = self.get_serializer(folder)
            data = serializer.data
        else:
            root_folders = Folder.objects.filter(parent_folder=None)
            serializer = self.get_serializer(root_folders, many=True)
            data = serializer.data

        # Get child folders and testcases for each folder
        for folder_data in data:
            folder_id = folder_data['id']
            child_folders = Folder.objects.filter(parent_folder_id=folder_id)
            child_folder_serializer = self.get_serializer(child_folders, many=True)
            folder_data['child_folders'] = child_folder_serializer.data

            testcases = TestCase.objects.filter(folder_id=folder_id)
            testcase_serializer = TestCaseSerializer(testcases, many=True)
            folder_data['testcases'] = testcase_serializer.data

            folder_data['type'] = 'folder'
            folder_data['collapsed'] = True

            if folder_data['testcases']:
                for testcase_data in folder_data['testcases']:
                    testcase_data['type'] = 'testcase'

        return Response(data)
