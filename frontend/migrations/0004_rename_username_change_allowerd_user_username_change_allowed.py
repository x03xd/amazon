# Generated by Django 4.1 on 2023-02-01 15:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0003_user_username_change_allowerd'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='username_change_allowerd',
            new_name='username_change_allowed',
        ),
    ]