# Generated by Django 4.1 on 2022-11-22 14:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0028_alter_product_image'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='category_name',
            new_name='subcategory_name',
        ),
        migrations.RenameField(
            model_name='subcategory',
            old_name='category',
            new_name='category_name',
        ),
        migrations.RemoveField(
            model_name='product',
            name='image',
        ),
        migrations.AddField(
            model_name='product',
            name='geeks_field',
            field=models.ImageField(null=True, upload_to=''),
        ),
    ]