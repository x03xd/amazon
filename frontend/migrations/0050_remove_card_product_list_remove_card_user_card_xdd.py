# Generated by Django 4.1 on 2022-11-25 11:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0049_rename_product_card_product_list_remove_user_card_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='card',
            name='product_list',
        ),
        migrations.RemoveField(
            model_name='card',
            name='user',
        ),
        migrations.AddField(
            model_name='card',
            name='xdd',
            field=models.CharField(max_length=20, null=True),
        ),
    ]
