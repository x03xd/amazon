# Generated by Django 4.1 on 2023-02-01 16:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0004_rename_username_change_allowerd_user_username_change_allowed'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='username_change_allowed',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
