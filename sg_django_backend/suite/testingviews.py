from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import ProjectSerializer, TestCaseSerializer, TestStepSerializer, TestRunDetailSerializer, \
    TestStepRunSerializer, TestRunListSerializer
from .models import Project, Folder, TestCase, TestStep, TestRun, TestStepRun


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
        data['type'] = 'testcase'
        data['test_steps'] = test_steps_serializer.data

        return Response(data)


class TestCaseCreateView(generics.CreateAPIView):
    serializer_class = TestCaseSerializer

    def create(self, request, *args, **kwargs):
        name = request.data.get('name')
        parent_folder_id = request.data.get('folder')
        project_id = request.data.get('project')

        # Check if the parent folder exists
        parent_folder = None
        if parent_folder_id:
            try:
                parent_folder = Folder.objects.get(id=parent_folder_id)
            except Folder.DoesNotExist:
                return Response({'error': 'Parent folder does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the Project instance
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({'error': 'Project does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        # Set the order number
        if parent_folder is not None:
            existing_testcases_count = TestCase.objects.filter(folder=parent_folder).count()
            order = existing_testcases_count + 1
        else:
            existing_root_testcases_count = TestCase.objects.filter(project=project, folder=None).count()
            order = existing_root_testcases_count + 1

        # Create the testcase
        testcase = TestCase(name=name, folder=parent_folder, project=project, order=order)
        testcase.save()

        # Increase item_count of project by 1
        project.item_count += 1
        project.save()

        testcase.item_number = project.item_count
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


class TestRunDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TestRunDetailSerializer

    def get_queryset(self):
        return TestRun.objects.all()


class TestRunListView(generics.ListAPIView):
    serializer_class = TestRunListSerializer

    def get_queryset(self):
        queryset = TestRun.objects.all()

        # Retrieve parameters from the request
        testcase_id = self.request.query_params.get('testcase')
        project_id = self.request.query_params.get('project')
        parent_folder_id = self.request.query_params.get('parent_folder')

        if not (testcase_id or project_id or parent_folder_id):
            # Return an empty queryset or handle the error as per your requirement
            return queryset.none()

        if testcase_id:
            # Filter by the provided testcase ID
            queryset = queryset.filter(testcase=testcase_id)
        elif project_id:
            # Filter by the provided project ID
            queryset = queryset.filter(project=project_id)
        elif parent_folder_id:
            try:
                # Get all test cases within the specified parent_folder
                folder_testcases = TestCase.objects.filter(folder=parent_folder_id).values_list('id', flat=True)

                # Filter test runs associated with these test cases
                queryset = queryset.filter(testcase__in=folder_testcases)
            except TestCase.DoesNotExist:
                # Return an empty queryset or handle the error as per your requirement
                return queryset

        return queryset


class TestRunCreateView(generics.CreateAPIView):
    serializer_class = TestRunDetailSerializer

    def create(self, request, *args, **kwargs):
        testcase_id = request.data.get('testcase')
        project_id = request.data.get('project')

        try:
            # Create a new TestRun
            testrun_data = {
                'project': project_id,
                'testcase': testcase_id,
            }
            testrun_serializer = TestRunDetailSerializer(data=testrun_data)
            testrun_serializer.is_valid(raise_exception=True)
            testrun = testrun_serializer.save()

            # Get the associated Test Case
            testcase = TestCase.objects.get(id=testcase_id, project=project_id)

            # Retrieve the Test Steps associated with the Test Case
            teststeps = TestStep.objects.filter(testcase=testcase).order_by("order")

            # Create TestStepRuns for each TestStep
            for teststep in teststeps:
                teststeprun_data = {
                    'testrun': testrun.id,
                    'teststep': teststep.id,
                    #'passed': False
                }
                teststeprun_serializer = TestStepRunSerializer(data=teststeprun_data)
                teststeprun_serializer.is_valid(raise_exception=True)
                teststeprun_serializer.save()

            return Response({
                'Project': project_id,
                'Testcase': testcase_id,
                'message': 'TestRun and associated TestStepRuns created successfully.'
            }, status=status.HTTP_201_CREATED)
        except TestCase.DoesNotExist:
            return Response({'error': 'Testcase does not exist or is not associated with the specified project.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'Internal server error: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TestStepRunListView(generics.ListAPIView):
    serializer_class = TestStepRunSerializer

    def get_queryset(self):
        # Retrieve the test run ID from the URL parameter
        testrun_id = self.kwargs.get('testrun_id')

        # Get the test steps associated with the specified test run
        return TestStepRun.objects.filter(testrun=testrun_id)