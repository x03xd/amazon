# Generated by Django 4.2.4 on 2023-09-06 05:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('amazonApp', '0046_alter_transaction_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='total_price',
            field=models.DecimalField(decimal_places=2, max_digits=8, null=True),
        ),
    ]
