# Generated by Django 4.1.13 on 2024-11-07 09:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('HealthCareApp', '0003_alter_slot_max_patient'),
    ]

    operations = [
        migrations.AddField(
            model_name='doctor',
            name='password',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AddField(
            model_name='patient',
            name='password',
            field=models.CharField(default='', max_length=255),
        ),
    ]