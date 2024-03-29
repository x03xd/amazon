# Generated by Django 4.1 on 2023-07-30 21:45

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('amazonApp', '0019_remove_product_status_alter_rate_rate'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rate',
            name='rate',
            field=models.IntegerField(default=0, null=True, validators=[django.core.validators.MinValueValidator(1, message='Value must be greater than or equal to 0.'), django.core.validators.MaxValueValidator(5, message='Value must be less than or equal to 5.')]),
        ),
        migrations.AlterField(
            model_name='rate',
            name='rated_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='rate',
            name='rated_products',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='amazonApp.product'),
        ),
    ]
