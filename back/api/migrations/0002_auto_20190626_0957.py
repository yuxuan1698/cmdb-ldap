# Generated by Django 2.1.7 on 2019-06-26 09:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cerificate',
            name='InstanceID',
            field=models.CharField(max_length=128, unique='instanceid', verbose_name='InstanceID'),
        ),
    ]
