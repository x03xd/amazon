# Generated by Django 4.1 on 2022-11-22 14:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0027_alter_product_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.URLField(max_length=3000, null=True),
        ),
    ]
