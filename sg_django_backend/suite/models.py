from django.db import models
from django import forms


class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=500)
    key = models.CharField(max_length=4, null=False)
    project_folders = models.ManyToManyField('Folder', blank=True, related_name='projects')
    project_testcases = models.ManyToManyField('TestCase', blank=True, related_name='projects')
    project_testruns = models.ManyToManyField('TestRun', blank=True, related_name='projects')
    created_on = models.DateTimeField(auto_now_add=True)
    edited_on = models.DateTimeField(auto_now=True)
    item_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name


class Folder(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='folders', null=False)
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=500)
    references = models.ManyToManyField('Reference', blank=True)
    parent_folder = models.ForeignKey('self', null=True,
                                      blank=True,
                                      related_name='child_folders',
                                      on_delete=models.CASCADE)
    order = models.IntegerField(null=False)
    created_on = models.DateTimeField(auto_now_add=True)
    edited_on = models.DateTimeField(auto_now=True)
    item_number = models.PositiveIntegerField(null=True)


class Reference(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField()


class TestCase(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='testcases', null=False)
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name='testcases', null=True)
    order = models.IntegerField(null=False)
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=500)
    created_on = models.DateTimeField(auto_now_add=True)
    edited_on = models.DateTimeField(auto_now=True)
    item_number = models.PositiveIntegerField(null=True)


class TestStep(models.Model):
    testcase = models.ForeignKey(TestCase, on_delete=models.CASCADE, related_name='teststeps', null=False)
    order = models.IntegerField()
    action = models.CharField(max_length=500, null=True, blank=True)
    result = models.CharField(max_length=500, null=True, blank=True)
    file = models.FileField(upload_to='uploads/', blank=True)


class TestStepForm(forms.ModelForm):
    class Meta:
        model = TestStep
        fields = ['file']
        widgets = {
            'file': forms.ClearableFileInput(),
        }


class TestRun(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='testruns', null=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    testcase = models.ForeignKey(TestCase, on_delete=models.CASCADE, related_name='testruns')
    passed = models.BooleanField(default=False)
    comment = models.TextField(blank=True)
    picture = models.ImageField(upload_to='uploads/', blank=True)

    def __str__(self):
        return f'{self.timestamp} - {self.testcase.name}'


class TestStepRun(models.Model):
    testrun = models.ForeignKey(TestRun, on_delete=models.CASCADE, related_name='steps')
    teststep = models.ForeignKey(TestStep, on_delete=models.CASCADE, related_name='teststepruns')
    passed = models.BooleanField(default=False)
    executed = models.BooleanField(default=False)
    comment = models.TextField(blank=True)
    picture = models.ImageField(upload_to='uploads/', blank=True)

    def __str__(self):
        return f'{self.testrun} - {self.teststep.name}'
