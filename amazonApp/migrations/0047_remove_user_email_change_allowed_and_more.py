# Generated by Django 4.2.4 on 2023-09-02 16:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('amazonApp', '0046_alter_user_email_change_allowed_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='email_change_allowed',
        ),
        migrations.RemoveField(
            model_name='user',
            name='password_change_allowed',
        ),
        migrations.RemoveField(
            model_name='user',
            name='username_change_allowed',
        ),
    ]