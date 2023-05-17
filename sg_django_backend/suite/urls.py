from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path('folders/', views.FolderListCreateView.as_view(), name='folder-list'),
    path('folders/<int:pk>/', views.FolderDetailView.as_view(), name='folder-detail'),
    path('folders/tree/', views.FolderTreeView.as_view(), name='folder-tree-root'),
    path('folders/tree/<int:pk>/', views.FolderTreeView.as_view(), name='folder-tree-id'),
    path('testcases/', views.TestCaseListCreateView.as_view(), name='testcase-list'),
    path('testcases/<int:pk>/', views.TestCaseDetailView.as_view(), name='testcase-detail'),
    path('testruns/', views.TestRunListCreateView.as_view(), name='testrun-list'),
    path('testruns/<int:pk>/', views.TestRunDetailView.as_view(), name='testrun-detail'),
    path('teststeps/', views.TestStepListCreateView.as_view(), name='teststep-list'),
    path('teststeps/<int:pk>/', views.TestStepDetailView.as_view(), name='teststep-detail'),

    # Create
    path('folders/create/', views.FolderCreateView.as_view(), name='folder-create'),
]

urlpatterns = format_suffix_patterns(urlpatterns)