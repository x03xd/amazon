# Generated by Django 4.1 on 2022-11-23 18:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0045_card'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='card',
            name='product',
        ),
        migrations.AddField(
            model_name='card',
            name='product',
            field=models.ManyToManyField(blank=True, null=True, to='frontend.product'),
        ),
    ]