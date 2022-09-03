"""
Serializers for product.
"""
from rest_framework import serializers

from core.models import Product


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for product."""

    class Meta:
        model = Product
        fields = ['id', 'name', 'url', 'has_stock', 'current_price',
                  'initial_price']
        read_only_fields = ['id']


class ProductDetailSerializer(ProductSerializer):
    """Serializer for product detail."""

    class Meta(ProductSerializer.Meta):
        fields = '__all__'
