# Generated by Django 4.1 on 2023-07-31 23:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('amazonApp', '0029_alter_product_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=30, unique=True),
        ),
    ]
