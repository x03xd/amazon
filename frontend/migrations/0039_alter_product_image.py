# Generated by Django 4.1 on 2022-11-22 15:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0038_rename_item_image_product_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(null=True, upload_to='public'),
        ),
    ]
