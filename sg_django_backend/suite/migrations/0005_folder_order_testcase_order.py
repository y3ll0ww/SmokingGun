# Generated by Django 4.2.1 on 2023-05-30 13:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('suite', '0004_testrun_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='folder',
            name='order',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='testcase',
            name='order',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]
