# Generated by Django 4.1 on 2022-11-25 00:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0047_transaction_alter_card_user_having'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='card',
            name='user_having',
        ),
        migrations.AddField(
            model_name='user',
            name='card',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='frontend.card'),
        ),
        migrations.AlterField(
            model_name='card',
            name='product',
            field=models.ManyToManyField(blank=True, to='frontend.product'),
        ),
    ]
