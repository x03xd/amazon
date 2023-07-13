# Generated by Django 4.1 on 2023-02-02 15:14

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0006_user_email_change_allowed'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email_change_allowed',
            field=models.DateTimeField(blank=True, default=datetime.date(2023, 2, 1), null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='username_change_allowed',
            field=models.DateTimeField(blank=True, default=datetime.date(2023, 2, 1), null=True),
        ),
    ]
