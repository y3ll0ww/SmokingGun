# Generated by Django 4.2.1 on 2023-05-25 13:39

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('suite', '0003_folder_created_on_folder_edited_on_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='testrun',
            name='date',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
