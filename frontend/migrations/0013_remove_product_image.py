# Generated by Django 4.1 on 2022-11-11 13:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0012_alter_product_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='image',
        ),
    ]