# Generated by Django 4.0.7 on 2022-09-16 00:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_user_reset_password_secret_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='reset_password_secret',
            field=models.CharField(default=None, max_length=100, null=True),
        ),
    ]