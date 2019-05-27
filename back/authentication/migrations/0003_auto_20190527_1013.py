# Generated by Django 2.1.7 on 2019-05-27 10:13

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_auto_20190527_0717'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserGroups',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=128, verbose_name='Name')),
                ('comment', models.TextField(blank=True, verbose_name='Comment')),
                ('date_created', models.DateTimeField(auto_now_add=True, null=True, verbose_name='Date created')),
                ('created_by', models.CharField(blank=True, max_length=100, null=True)),
            ],
            options={
                'verbose_name': 'User group',
                'ordering': ['name'],
            },
        ),
        migrations.AlterField(
            model_name='users',
            name='groups',
            field=models.ManyToManyField(blank=True, related_name='usergroups', to='authentication.UserGroups', verbose_name='User group'),
        ),
    ]
