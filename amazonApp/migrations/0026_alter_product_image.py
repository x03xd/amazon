# Generated by Django 4.1 on 2023-07-31 16:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('amazonApp', '0025_alter_product_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(upload_to=''),
        ),
    ]
