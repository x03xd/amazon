# Generated by Django 4.1 on 2023-07-29 14:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('amazonApp', '0013_alter_cart_owner_alter_cart_test_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='brand',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='amazonApp.brand'),
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='email_change_allowed',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='password_change_allowed',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='username_change_allowed',
            field=models.DateField(blank=True, null=True),
        ),
    ]
