from django.db import models
from django import forms


class Folder(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=500)
    references = models.ManyToManyField('Reference', blank=True)
    parent_folder = models.ForeignKey('self', null=True,
                                      blank=True,
                                      related_name='child_folders',
                                      on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)
    edited_on = models.DateTimeField(auto_now=True)


class Reference(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField()


class TestCase(models.Model):
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name='testcases', null=True)
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=500)
    created_on = models.DateTimeField(auto_now_add=True)
    edited_on = models.DateTimeField(auto_now=True)


class TestStep(models.Model):
    testcase = models.ForeignKey(TestCase, on_delete=models.CASCADE, related_name='teststeps')
    order = models.IntegerField()
    action = models.CharField(max_length=500)
    result = models.CharField(max_length=500)
    file = models.FileField(upload_to='uploads/', blank=True)


class TestStepForm(forms.ModelForm):
    class Meta:
        model = TestStep
        fields = ['file']
        widgets = {
            'file': forms.ClearableFileInput(),
        }


class TestRun(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    testcase = models.ForeignKey(TestCase, on_delete=models.CASCADE, related_name='testruns')
    passed = models.BooleanField(default=False)
    comment = models.TextField(blank=True)
    picture = models.ImageField(upload_to='uploads/', blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.timestamp} - {self.testcase.name}'


class TestStepRun(models.Model):
    testrun = models.ForeignKey(TestRun, on_delete=models.CASCADE, related_name='teststepruns')
    teststep = models.ForeignKey(TestStep, on_delete=models.CASCADE, related_name='teststepruns')
    passed = models.BooleanField(default=False)
    comment = models.TextField(blank=True)
    picture = models.ImageField(upload_to='uploads/', blank=True)

    def __str__(self):
        return f'{self.testrun} - {self.teststep.name}'
