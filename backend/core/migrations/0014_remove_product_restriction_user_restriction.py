# Generated by Django 4.0.8 on 2022-11-02 21:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_product_restriction'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='restriction',
        ),
        migrations.AddField(
            model_name='user',
            name='restriction',
            field=models.IntegerField(default=300, null=True),
        ),
    ]
