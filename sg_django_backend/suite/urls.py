from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path('folders/', views.FolderListCreateView.as_view(), name='folder-list'),
    path('folders/tree/<int:pk>/', views.TreeView.as_view(), name='folder-tree-id'),
    path('testcases/', views.TestCaseListCreateView.as_view(), name='testcase-list'),
    path('testruns/', views.TestRunListCreateView.as_view(), name='testrun-list'),
    path('testruns/<int:pk>/', views.TestRunDetailView.as_view(), name='testrun-detail'),
    path('teststeps/', views.TestStepListCreateView.as_view(), name='teststep-list'),
    path('teststeps/<int:pk>/', views.TestStepDetailView.as_view(), name='teststep-detail'),

    # Get
    path('root/tree/', views.TreeView.as_view(), name='tree-root'),
    path('breadcrumbs/<str:item_type>/<int:item_id>/', views.BreadcrumbTrailView.as_view(), name='breadcrumbs'),
    path('root/', views.RootFolderDetailView.as_view(), name='root'),
    path('folder/<int:id>/', views.FolderDetailView.as_view(), name='folder-detail'),
    path('testcase/<int:id>/', views.TestCaseDetailView.as_view(), name='testcase-detail'),


    # Create
    path('folder/create/', views.FolderCreateView.as_view(), name='folder-create'),
    path('testcase/create/', views.TestCaseCreateView.as_view(), name='testcase-create'),

    # Update
    path('folder/update/<int:pk>/', views.FolderUpdateView.as_view(), name='folder-update'),
    path('testcase/update/<int:pk>/', views.TestCaseUpdateView.as_view(), name='testcase-update'),

    # Delete
    path('folder/delete/<int:pk>/', views.FolderDeleteView.as_view(), name='folder-delete'),
    path('testcase/delete/<int:pk>/', views.TestCaseDeleteView.as_view(), name='testcase-delete'),
]

urlpatterns = format_suffix_patterns(urlpatterns)