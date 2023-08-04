from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import projectviews as pro, navigationviews as nav, testingviews as tst

urlpatterns = [
    path('folders/tree/<int:pk>/', nav.TreeView.as_view(), name='folder-tree-id'),
    path('testruns/<int:pk>/', tst.TestRunDetailView.as_view(), name='testrun-detail'),
    path('teststeps/<int:pk>/', tst.TestStepDetailView.as_view(), name='teststep-detail'),

    # Get
    path('root/tree/<int:project>/', nav.TreeView.as_view(), name='tree-root'),
    path('breadcrumbs/<str:item_type>/<int:item_id>/', nav.BreadcrumbTrailView.as_view(), name='breadcrumbs'),
    path('project/<int:id>/', pro.RootFolderDetailView.as_view(), name='root'),
    path('folder/<int:id>/', nav.FolderDetailView.as_view(), name='folder-detail'),
    path('testcase/<int:id>/', tst.TestCaseDetailView.as_view(), name='testcase-detail'),

    # Create
    path('projects/', pro.ProjectsAllView.as_view(), name='projects-all'),
    path('project/create/', pro.ProjectCreateView.as_view(), name='project-create'),
    path('folder/create/', nav.FolderCreateView.as_view(), name='folder-create'),
    path('testcase/create/', tst.TestCaseCreateView.as_view(), name='testcase-create'),
    path('teststep/create/', tst.TestStepCreateView.as_view(), name='create-teststep'),

    # Update
    path('project/update/<int:pk>/', pro.ProjectDetailView.as_view(), name='project-update'),
    path('folder/update/<int:pk>/', nav.FolderUpdateView.as_view(), name='folder-update'),
    path('testcase/update/<int:pk>/', tst.TestCaseUpdateView.as_view(), name='testcase-update'),
    path('teststep/update/<int:pk>/', tst.TestStepDetailView.as_view(), name='teststep-update'),

    # Order
    path('teststeps/update-order/', tst.TestStepOrderUpdateView.as_view(), name='teststep-update-order'),

    # Delete
    path('project/delete/<int:pk>/', pro.ProjectDeleteView.as_view(), name='project-delete'),
    path('folder/delete/<int:pk>/', nav.FolderDeleteView.as_view(), name='folder-delete'),
    path('testcase/delete/<int:pk>/', tst.TestCaseDeleteView.as_view(), name='testcase-delete'),
    path('teststep/delete/<int:pk>/', tst.TestStepDetailView.as_view(), name='teststep-delete')
]

urlpatterns = format_suffix_patterns(urlpatterns)