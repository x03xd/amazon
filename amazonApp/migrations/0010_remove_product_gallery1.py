# Generated by Django 4.1 on 2023-07-29 13:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('amazonApp', '0009_alter_brand_belongs_to_category_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='gallery1',
        ),
    ]
