# Generated by Django 4.1 on 2023-07-08 03:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('amazonApp', '0009_rate_delete_userrate'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='SubCategory',
            new_name='Category',
        ),
        migrations.RemoveField(
            model_name='cart',
            name='products',
        ),
        migrations.AlterField(
            model_name='transaction',
            name='date',
            field=models.DateField(),
        ),
    ]