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



# To add a Link to a Folder, you can simply call the add() method on the links attribute of a Folder instance:
# folder = Folder.objects.get(id=1)
# link = Link.objects.get(id=1)
# folder.links.add(link)
#
# To remove a Link from a Folder, you can call the remove() method:
# folder = Folder.objects.get(id=1)
# link = Link.objects.get(id=1)
# folder.links.remove(link)
#
# You can also retrieve all the Links associated with a Folder by accessing the links attribute:
# folder = Folder.objects.get(id=1)
# links = folder.links.all()



# To add a TestStep to a TestCase, you can create a new TestStep instance and set the testcase attribute to the TestCase instance that the test step belongs to:
# testcase = TestCase.objects.get(id=1)
# teststep = TestStep(name='Step 1', testcase=testcase)
# teststep.save()

# To upload a file for a TestStep, you can use a forms.ModelForm and set the widget of the file field to a forms.ClearableFileInput widget. Here's an example:
# from django import forms
#
# class TestStepForm(forms.ModelForm):
#     class Meta:
#         model = TestStep
#         fields = ['name', 'file']
#         widgets = {
#             'file': forms.ClearableFileInput(attrs={'multiple': True}),
#         }

# To handle file uploads in your views, you can use the request.FILES attribute to access the uploaded files. Here's an example:
# def create_teststep(request, testcase_id):
#     testcase = TestCase.objects.get(id=testcase_id)
#     if request.method == 'POST':
#         form = TestStepForm(request.POST, request.FILES)
#         if form.is_valid():
#             teststep = form.save(commit=False)
#             teststep.testcase = testcase
#             teststep.save()
#             form.save_m2m()
#             return redirect('testcase_detail', testcase_id=testcase.id)
#     else:
#         form = TestStepForm()
#     return render(request, 'create_teststep.html', {'form': form, 'testcase': testcase})
