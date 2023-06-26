from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics, status
from rest_framework.response import Response
from django.http import QueryDict
from .serializers import FolderSerializer, TestCaseSerializer, TestRunSerializer, TestStepSerializer
from .models import Folder, TestCase, TestRun, TestStep


class FolderCreateView(generics.CreateAPIView):
    serializer_class = FolderSerializer

    def create(self, request, *args, **kwargs):
        name = request.data.get('name')
        parent_folder_id = request.data.get('parent_folder')

        # Check if the parent folder exists
        parent_folder = None
        if parent_folder_id is not None:
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


class FolderUpdateView(generics.UpdateAPIView):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer


class FolderDeleteView(generics.DestroyAPIView):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer


class FolderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        folder = self.get_object()
        serializer = self.get_serializer(folder)

        # Get the child folders and test cases
        child_folders = Folder.objects.filter(parent_folder=folder).order_by('order')
        child_folders_serializer = FolderSerializer(child_folders, many=True)
        test_cases = TestCase.objects.filter(folder=folder).order_by('order')
        test_cases_serializer = TestCaseSerializer(test_cases, many=True)

        # Add the child folders and test cases to the serialized data
        data = serializer.data
        data['child_folders'] = child_folders_serializer.data
        data['test_cases'] = test_cases_serializer.data

        return Response(data)


class TestCaseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TestCase.objects.all()
    serializer_class = TestCaseSerializer
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        testcase = self.get_object()
        serializer = self.get_serializer(testcase)

        # Get the test steps for the test case
        test_steps = TestStep.objects.filter(testcase=testcase).order_by("order")
        test_steps_serializer = TestStepSerializer(test_steps, many=True)

        # Add the test steps to the serialized data
        data = serializer.data
        data['test_steps'] = test_steps_serializer.data

        return Response(data)


class TestCaseCreateView(generics.CreateAPIView):
    serializer_class = TestCaseSerializer

    def create(self, request, *args, **kwargs):
        name = request.data.get('name')
        parent_folder_id = request.data.get('folder')

        # Check if the parent folder exists
        parent_folder = None
        if parent_folder_id:
            try:
                parent_folder = Folder.objects.get(id=parent_folder_id)
            except Folder.DoesNotExist:
                return Response({'error': 'Parent folder does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the testcase
        testcase = TestCase(name=name, folder=parent_folder)
        testcase.save()

        # Serialize the created folder
        serializer = self.get_serializer(testcase)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TestCaseUpdateView(generics.UpdateAPIView):
    queryset = TestCase.objects.all()
    serializer_class = TestCaseSerializer


class TestCaseDeleteView(generics.DestroyAPIView):
    queryset = TestCase.objects.all()
    serializer_class = TestCaseSerializer


class TestRunDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TestRunSerializer

    def get_queryset(self):
        return TestRun.objects.all()


#class TestStepDetailView(generics.RetrieveUpdateDestroyAPIView):
#    serializer_class = TestStepSerializer
#
#    def get_queryset(self):
#        return TestStep.objects.all()
#
#    def delete(self, request, *args, **kwargs):
#        test_step = self.get_object()
#        self.perform_destroy(test_step)
#        return Response(status=status.HTTP_204_NO_CONTENT)


class TestStepDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TestStepSerializer

    def get_queryset(self):
        return TestStep.objects.all()

    def delete(self, request, *args, **kwargs):
        test_step = self.get_object()
        order_to_delete = test_step.order
        testcase = test_step.testcase

        # Get the trailing steps with higher order values
        trailing_steps = TestStep.objects.filter(testcase=testcase, order__gt=order_to_delete)

        # Decrease the order value of each trailing step by one
        for step in trailing_steps:
            step.order -= 1
            step.save()

        self.perform_destroy(test_step)
        return Response(status=status.HTTP_204_NO_CONTENT)


class TestStepCreateView(generics.CreateAPIView):
    serializer_class = TestStepSerializer

    def create(self, request, *args, **kwargs):
        testcase_id = request.data.get('testcase')
        action = request.data.get('action')
        result = request.data.get('result')

        if not testcase_id:
            return Response({'error': 'Test case ID is missing.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the testcase exists
        try:
            testcase = TestCase.objects.get(id=testcase_id)
        except (TestCase.DoesNotExist, ValueError):
            return Response({'error': 'Test case does not exist or invalid testcase ID.'}, status=status.HTTP_400_BAD_REQUEST)

        # Determine the order value for the new test step
        existing_teststeps = TestStep.objects.filter(testcase=testcase_id)
        if existing_teststeps.exists():
            highest_order = existing_teststeps.order_by('-order').first().order
            order = highest_order + 1
        else:
            order = 0

        # Create the test step
        teststep = TestStep(testcase=testcase, order=order, action=action, result=result)
        teststep.save()

        # Serialize the created test step
        serializer = self.get_serializer(teststep)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TestStepOrderUpdateView(generics.UpdateAPIView):
    def put(self, request):
        data = request.data
        ids = data.get('ids')
        orders = data.get('orders')

        if len(ids) != len(orders):
            return Response({"error": "Invalid input. The number of IDs and orders should be the same."}, status=400)

        for id, order in zip(ids, orders):
            try:
                teststeps = TestStep.objects.filter(id=id)
                for teststep in teststeps:
                    teststep.order = order
                    teststep.save()
            except ObjectDoesNotExist:
                return Response({"error": f"Test step with ID {id} does not exist."}, status=400)

        return Response({"success": "Test step orders updated."})


class TreeView(generics.RetrieveAPIView):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer

    def get(self, request, *args, **kwargs):
        if 'id' in kwargs:
            folder = self.get_object()
            serializer = self.get_serializer(folder)
            data = serializer.data
        else:
            root_folders = Folder.objects.filter(parent_folder=None).order_by('order')
            serializer = self.get_serializer(root_folders, many=True)
            data = serializer.data

        # Recursive function to get child folders and test cases
        def get_children(folder_data):
            folder_id = folder_data['id']
            child_folders = Folder.objects.filter(parent_folder_id=folder_id).order_by('order')
            child_folder_serializer = self.get_serializer(child_folders, many=True)
            folder_data['child_folders'] = child_folder_serializer.data

            testcases = TestCase.objects.filter(folder_id=folder_id).order_by('order')
            testcase_serializer = TestCaseSerializer(testcases, many=True)
            folder_data['testcases'] = testcase_serializer.data

            folder_data['type'] = 'folder'

            if folder_data['child_folders']:
                for child_folder_data in folder_data['child_folders']:
                    get_children(child_folder_data)

            if folder_data['testcases']:
                for testcase_data in folder_data['testcases']:
                    testcase_data['type'] = 'testcase'

        # Get child folders and test cases for each root folder
        for folder_data in data:
            get_children(folder_data)

        # Retrieve test cases from root level
        testcases = TestCase.objects.filter(folder=None).order_by('order')
        testcase_serializer = TestCaseSerializer(testcases, many=True)
        root_testcases = testcase_serializer.data

        if root_testcases:
            for testcase_data in root_testcases:
                testcase_data['type'] = 'testcase'

        # Append root level test cases to the response data
        data.extend(root_testcases)

        return Response(data)


class BreadcrumbTrailView(generics.RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        item_type = kwargs.get('item_type')
        item_id = kwargs.get('item_id')
        breadcrumb_trail = self.generate_breadcrumb_trail(item_type, item_id)
        return Response(breadcrumb_trail)

    def generate_breadcrumb_trail(self, item_type, item_id):
        item = None
        breadcrumb_trail = []

        if item_type == 'folder':
            try:
                # Find the folder by its ID
                item = Folder.objects.get(id=item_id)
                breadcrumb_trail.append({'id': item.id, 'name': item.name})  # Add the folder to the breadcrumb trail

                # Traverse the folder hierarchy using the parent_folder field
                while item.parent_folder:
                    item = item.parent_folder
                    breadcrumb_trail.insert(0, {'id': item.id, 'name': item.name})  # Insert each parent folder at the beginning of the trail

            except Folder.DoesNotExist:
                pass  # Handle the case where the item is not a folder

        elif item_type == 'testcase':
            try:
                # Find the test case by its ID
                item = TestCase.objects.get(id=item_id)
                folder = item.folder

                if folder:
                    breadcrumb_trail.append({'id': folder.id, 'name': folder.name})  # Add the folder to the breadcrumb trail

                    # Traverse the folder hierarchy using the parent_folder field
                    while folder.parent_folder:
                        folder = folder.parent_folder
                        breadcrumb_trail.insert(0, {'id': folder.id, 'name': folder.name})  # Insert each parent folder at the beginning of the trail

                breadcrumb_trail.append({'id': item.id, 'name': item.name})  # Add the test case to the breadcrumb trail

            except TestCase.DoesNotExist:
                pass  # Handle the case where the item is not a test case

        return breadcrumb_trail


class RootFolderDetailView(generics.RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        # Retrieve all folders with parent_folder=None
        folders = Folder.objects.filter(parent_folder=None).order_by('order')
        folders_serializer = FolderSerializer(folders, many=True)

        # Retrieve all test cases with folder=None
        test_cases = TestCase.objects.filter(folder=None).order_by('order')
        test_cases_serializer = TestCaseSerializer(test_cases, many=True)

        # Prepare the response data
        data = {
            'child_folders': folders_serializer.data,
            'test_cases': test_cases_serializer.data
        }

        return Response(data)