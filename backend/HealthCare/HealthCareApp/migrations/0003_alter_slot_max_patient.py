# Generated by Django 4.1.13 on 2024-11-07 07:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('HealthCareApp', '0002_alter_availableslot_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='slot',
            name='max_patient',
            field=models.IntegerField(default=5),
        ),
    ]