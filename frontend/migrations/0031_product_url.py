# Generated by Django 4.1 on 2022-11-22 14:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0030_rename_geeks_field_product_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='url',
            field=models.URLField(null=True),
        ),
    ]