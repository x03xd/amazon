# Generated by Django 4.1 on 2022-11-25 12:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0053_cart_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cart',
            name='owner',
        ),
        migrations.RemoveField(
            model_name='cart',
            name='products',
        ),
    ]