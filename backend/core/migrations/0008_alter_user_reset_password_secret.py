# Generated by Django 4.0.7 on 2022-09-16 17:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_alter_user_reset_password_secret'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='reset_password_secret',
            field=models.CharField(blank=True, default=None, max_length=100),
        ),
    ]