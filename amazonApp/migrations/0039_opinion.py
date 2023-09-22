# Generated by Django 4.2.4 on 2023-08-31 23:22

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('amazonApp', '0038_alter_product_bought_by_rec'),
    ]

    operations = [
        migrations.CreateModel(
            name='Opinion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=30)),
                ('text', models.TextField()),
                ('reviewed_date', models.DateTimeField(auto_now_add=True)),
                ('rate', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='amazonApp.rate')),
                ('reviewed_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('reviewed_product', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='amazonApp.product')),
            ],
        ),
    ]
