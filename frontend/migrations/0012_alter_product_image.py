# Generated by Django 4.1 on 2022-11-11 13:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0011_product_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(null=True, upload_to='src/images'),
        ),
    ]
