# Generated by Django 4.2.1 on 2023-07-17 18:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('suite', '0007_project_folder_project_testcase_project_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='folder',
            name='project',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='folders', to='suite.project'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='testcase',
            name='project',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='testcases', to='suite.project'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='testrun',
            name='project',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='testruns', to='suite.project'),
            preserve_default=False,
        ),
    ]
