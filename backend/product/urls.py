"""
URL mappings for the food app.
"""
from django.urls import path, include

from rest_framework.routers import DefaultRouter

from product import views

router = DefaultRouter()

router.register('products', views.ProductView)

app_name = 'product'

urlpatterns = [
    path('', include(router.urls))
]