# Generated by Django 4.1 on 2022-11-22 14:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0029_rename_category_name_product_subcategory_name_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='geeks_field',
            new_name='image',
        ),
    ]
