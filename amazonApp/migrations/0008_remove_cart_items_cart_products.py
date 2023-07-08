# Generated by Django 4.1 on 2023-07-06 01:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('amazonApp', '0007_alter_cartitem_cart'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cart',
            name='items',
        ),
        migrations.AddField(
            model_name='cart',
            name='products',
            field=models.ManyToManyField(blank=True, related_name='products', to='amazonApp.product'),
        ),
    ]