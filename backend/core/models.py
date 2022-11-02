"""
Database models.
"""
from unittest.util import _MAX_LENGTH
from xml.etree.ElementInclude import default_loader
from django.conf import settings
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin
)


class UserManager(BaseUserManager):
    """Manager for users."""

    def create_user(self, email, password=None, **extra_fields):
        """Create, save, and return a new user."""
        if not email:
            raise ValueError('User must have an email address.')
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        """Create and return a new superuser."""
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """User in the system"""
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    restriction = models.IntegerField(default=300, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    reset_password_secret = models.CharField(max_length=100, blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'


class Product(models.Model):
    """Product object."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=255, blank=True)
    market = models.CharField(max_length=50, blank=True)
    url = models.URLField(max_length=255)
    has_stock = models.BooleanField(default=True)
    current_price = models.IntegerField(default=0)
    image = models.CharField(max_length=255, blank=True)
    detail = models.CharField(max_length=255, blank=True)
    link = models.CharField(max_length=255, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)
    def __str__(self):
        return self.url
