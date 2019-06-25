# Generated by Django 2.1.7 on 2019-06-25 17:38

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Cerificate',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('InstanceID', models.CharField(max_length=128, verbose_name='InstanceID')),
                ('Name', models.CharField(max_length=128, verbose_name='CerificateName')),
                ('Domain', models.CharField(max_length=128, verbose_name='Domain')),
                ('BrandName', models.CharField(max_length=128, verbose_name='BrandName')),
                ('CertType', models.CharField(max_length=16, verbose_name='CertType')),
                ('StatusCode', models.CharField(max_length=16, verbose_name='StatusCode')),
                ('AfterDate', models.BigIntegerField(verbose_name='AfterDate')),
                ('BeforeDate', models.BigIntegerField(verbose_name='BeforeDate')),
                ('RemainingDays', models.IntegerField(verbose_name='RemainingDays')),
                ('Year', models.IntegerField(verbose_name='Year')),
                ('Comment', models.TextField(blank=True, verbose_name='Comment')),
                ('ProdInvalidDate', models.DateTimeField(verbose_name='ProdInvalidDate')),
                ('ProdInvalidDays', models.IntegerField(verbose_name='ProdInvalidDays')),
            ],
            options={
                'verbose_name': 'aliyun 证书管理',
                'ordering': ['BeforeDate'],
            },
        ),
    ]
