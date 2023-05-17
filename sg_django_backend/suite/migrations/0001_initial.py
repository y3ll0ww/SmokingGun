# Generated by Django 4.2.1 on 2023-05-11 20:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Folder',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=500)),
                ('parent_folder', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='child_folders', to='suite.folder')),
            ],
        ),
        migrations.CreateModel(
            name='Reference',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('url', models.URLField()),
            ],
        ),
        migrations.CreateModel(
            name='TestCase',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=500)),
                ('folder', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='testcases', to='suite.folder')),
            ],
        ),
        migrations.CreateModel(
            name='TestRun',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('passed', models.BooleanField(default=False)),
                ('comment', models.TextField(blank=True)),
                ('picture', models.ImageField(blank=True, upload_to='uploads/')),
                ('testcase', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='testruns', to='suite.testcase')),
            ],
        ),
        migrations.CreateModel(
            name='TestStep',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.IntegerField()),
                ('action', models.CharField(max_length=500)),
                ('result', models.CharField(max_length=500)),
                ('file', models.FileField(blank=True, upload_to='uploads/')),
                ('testcase', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='teststeps', to='suite.testcase')),
            ],
        ),
        migrations.CreateModel(
            name='TestStepRun',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('passed', models.BooleanField(default=False)),
                ('comment', models.TextField(blank=True)),
                ('picture', models.ImageField(blank=True, upload_to='uploads/')),
                ('testrun', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='teststepruns', to='suite.testrun')),
                ('teststep', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='teststepruns', to='suite.teststep')),
            ],
        ),
        migrations.AddField(
            model_name='folder',
            name='references',
            field=models.ManyToManyField(blank=True, to='suite.reference'),
        ),
    ]
