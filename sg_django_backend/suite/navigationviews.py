import json

from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import ProjectSerializer, FolderSerializer, TestCaseSerializer
from .models import Project, Folder, TestCase


class FolderCreateView(generics.CreateAPIView):
    serializer_class = FolderSerializer

    def create(self, request, *args, **kwargs):
        name = request.data.get('name')
        parent_folder_id = request.data.get('parent_folder')
        project_id = request.data.get('project')

        # Check if the parent folder exists
        parent_folder = None
        if parent_folder_id is not None:
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
            existing_child_folders_count = Folder.objects.filter(parent_folder=parent_folder).count()
            order = existing_child_folders_count + 1
        else:
            existing_root_folders_count = Folder.objects.filter(project=project, parent_folder=None).count()
            order = existing_root_folders_count + 1

        # Create the folder
        folder = Folder(name=name, parent_folder=parent_folder, project=project, order=order)
        folder.save()

        # Increase item_count of project by 1
        project.item_count += 1
        project.save()

        folder.item_number = project.item_count
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
        data['type'] = 'folder'
        data['child_folders'] = child_folders_serializer.data
        data['test_cases'] = test_cases_serializer.data

        return Response(data)


class TreeView(generics.RetrieveAPIView):
    #queryset = Folder.objects.all()
    serializer_class = FolderSerializer

    def get(self, request, *args, **kwargs):
        project_id = kwargs['project']

        if 'id' in kwargs:
            folder = self.get_object()
            serializer = self.get_serializer(folder)
            data = serializer.data
        else:
            root_folders = Folder.objects.filter(project=project_id, parent_folder=None).order_by('order')
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
        testcases = TestCase.objects.filter(project=project_id, folder=None).order_by('order')
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
                breadcrumb_trail.append({'id': item.id, 'name': item.name, 'item_number': item.item_number})  # Add the folder to the breadcrumb trail

                # Traverse the folder hierarchy using the parent_folder field
                while item.parent_folder:
                    item = item.parent_folder
                    breadcrumb_trail.insert(0, {'id': item.id, 'name': item.name, 'item_number': item.item_number})  # Insert each parent folder at the beginning of the trail

            except Folder.DoesNotExist:
                pass  # Handle the case where the item is not a folder

        elif item_type == 'testcase':
            try:
                # Find the test case by its ID
                item = TestCase.objects.get(id=item_id)
                folder = item.folder

                if folder:
                    breadcrumb_trail.append({'id': folder.id, 'name': folder.name, 'item_number': folder.item_number})  # Add the folder to the breadcrumb trail

                    # Traverse the folder hierarchy using the parent_folder field
                    while folder.parent_folder:
                        folder = folder.parent_folder
                        breadcrumb_trail.insert(0, {'id': folder.id, 'name': folder.name, 'item_number': folder.item_number})  # Insert each parent folder at the beginning of the trail

                breadcrumb_trail.append({'id': item.id, 'name': item.name, 'item_number': item.item_number})  # Add the test case to the breadcrumb trail

            except TestCase.DoesNotExist:
                pass  # Handle the case where the item is not a test case

        return breadcrumb_trail


class FolderOrderUpdateView(generics.UpdateAPIView):
    def put(self, request):
        data = request.data
        ids = data.get('ids')
        orders = data.get('orders')

        if len(ids) != len(orders):
            return Response({"error": "Invalid input. The number of IDs and orders should be the same."}, status=400)

        for id, order in zip(ids, orders):
            try:
                folders = Folder.objects.filter(id=id)
                for folder in folders:
                    folder.order = order
                    folder.save()
            except ObjectDoesNotExist:
                return Response({"error": f"Folder with ID {id} does not exist."}, status=400)

        return Response({"success": "Folder orders updated."})


class TestCaseOrderUpdateView(generics.UpdateAPIView):
    def put(self, request):
        data = request.data
        ids = data.get('ids')
        orders = data.get('orders')

        if len(ids) != len(orders):
            return Response({"error": "Invalid input. The number of IDs and orders should be the same."}, status=400)

        for id, order in zip(ids, orders):
            try:
                testcases = TestCase.objects.filter(id=id)
                for testcase in testcases:
                    testcase.order = order
                    testcase.save()
            except ObjectDoesNotExist:
                return Response({"error": f"Testcase with ID {id} does not exist."}, status=400)

        return Response({"success": "Testcase orders updated."})


class FolderChangeParentView(generics.UpdateAPIView):
    queryset = Folder.objects.all()

    def update(self, request, *args, **kwargs):
        folder_id = kwargs.get('pk')
        new_parent_folder_id = request.data.get('parent_folder')

        try:
            folder = Folder.objects.get(id=folder_id)
        except Folder.DoesNotExist:
            return Response({'error': 'Folder does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        if new_parent_folder_id != 0:
            try:
                new_parent_folder = Folder.objects.get(id=new_parent_folder_id)
            except Folder.DoesNotExist:
                return Response({'error': 'New parent folder does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            new_parent_folder = None

        # Check if the new parent folder is the same as the current parent folder
        if folder.parent_folder == new_parent_folder:
            return Response({'error': 'The folder is already in the specified parent folder.'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            # Set the order to 0 for the folder being moved
            folder.order = 0
            folder.parent_folder = new_parent_folder
            folder.save()

            # Increment the order for other folders with the same parent_folder
            siblings = Folder.objects.filter(parent_folder=new_parent_folder).exclude(id=folder_id).order_by('order')
            for index, sibling in enumerate(siblings, start=1):
                sibling.order = index
                sibling.save()

        return Response({'success': 'Folder parent changed and order updated.'}, status=status.HTTP_200_OK)


class TestCaseChangeParentView(generics.UpdateAPIView):
    queryset = TestCase.objects.all()

    def update(self, request, *args, **kwargs):
        testcase_id = kwargs.get('pk')
        new_parent_folder_id = request.data.get('parent_folder')

        try:
            testcase = TestCase.objects.get(id=testcase_id)
        except TestCase.DoesNotExist:
            return Response({'error': 'Test case does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        if new_parent_folder_id != 0:
            try:
                new_parent_folder = Folder.objects.get(id=new_parent_folder_id)
            except Folder.DoesNotExist:
                return Response({'error': 'New parent folder does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            new_parent_folder = None

        # Check if the new parent folder is the same as the current parent folder
        if testcase.folder == new_parent_folder:
            return Response({'error': 'The test case is already in the specified parent folder.'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            # Set the order to 0 for the test case being moved
            testcase.order = 0
            testcase.folder = new_parent_folder
            testcase.save()

            # Increment the order for other test cases with the same parent folder
            siblings = TestCase.objects.filter(folder=new_parent_folder).exclude(id=testcase_id).order_by('order')
            for index, sibling in enumerate(siblings, start=1):
                sibling.order = index
                sibling.save()

        return Response({'success': 'Test case parent changed and order updated.'}, status=status.HTTP_200_OK)


class DeleteFoldersAndTestCasesView(generics.DestroyAPIView):
    def perform_destroy(self, instance):
        instance.delete()

    def delete(self, request, *args, **kwargs):
        folder_ids_to_delete = json.loads(request.query_params.get('folders', '[]'))
        testcase_ids_to_delete = json.loads(request.query_params.get('testcases', '[]'))

        # Delete folders with the specified IDs
        for folder_id in folder_ids_to_delete:
            try:
                folder = Folder.objects.get(id=folder_id)
                self.perform_destroy(folder)
            except Folder.DoesNotExist:
                return Response({'error': f'Folder with ID {folder_id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        # Delete test cases with the specified IDs
        for testcase_id in testcase_ids_to_delete:
            try:
                testcase = TestCase.objects.get(id=testcase_id)
                self.perform_destroy(testcase)
            except TestCase.DoesNotExist:
                return Response({'error': f'Test case with ID {testcase_id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'message': 'Folders and test cases deleted successfully.'}, status=status.HTTP_200_OK)


class ChangeParentFoldersAndTestCasesView(generics.UpdateAPIView):
    def update(self, request, *args, **kwargs):
        new_parent_folder_id = request.data.get('parent_folder')
        folder_ids_to_update = request.data.get('folders', [])
        testcase_ids_to_update = request.data.get('testcases', [])

        if new_parent_folder_id != 0:
            try:
                new_parent_folder = Folder.objects.get(id=new_parent_folder_id)
            except Folder.DoesNotExist:
                return Response({'error': 'New parent folder does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            new_parent_folder = None

        # Update folders with the specified IDs
        folder_order = 0
        for folder_id in folder_ids_to_update:
            try:
                folder = Folder.objects.get(id=folder_id)
                with transaction.atomic():
                    folder.parent_folder = new_parent_folder
                    folder.order = folder_order
                    folder.save()
                folder_order += 1
            except Folder.DoesNotExist:
                return Response({'error': f'Folder with ID {folder_id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        # Increment the order for other folders with the same parent folder
        folder_siblings = Folder.objects.filter(parent_folder=new_parent_folder).exclude(id__in=folder_ids_to_update).order_by('order')
        for index, sibling in enumerate(folder_siblings, start=len(folder_ids_to_update)):
            print('folder: ' + str(sibling.id))
            sibling.order = index
            sibling.save()

        # Update test cases with the specified IDs
        testcase_order = 0
        for testcase_id in testcase_ids_to_update:
            try:
                testcase = TestCase.objects.get(id=testcase_id)
                with transaction.atomic():
                    testcase.folder = new_parent_folder
                    testcase.order = testcase_order
                    testcase.save()
                testcase_order += 1
            except TestCase.DoesNotExist:
                return Response({'error': f'Test case with ID {testcase_id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        # Increment the order for other testcases with the same parent folder
        testcase_siblings = TestCase.objects.filter(folder=new_parent_folder).exclude(id__in=testcase_ids_to_update).order_by('order')
        for index, sibling in enumerate(testcase_siblings, start=len(testcase_ids_to_update)):
            print('testcase: ' + str(sibling.id))
            sibling.order = index
            sibling.save()

        return Response({'message': 'Folders and test cases moved successfully.'}, status=status.HTTP_200_OK)
