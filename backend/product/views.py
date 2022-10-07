"""
Views for product.
"""
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from core.models import Product
from product import serializers


# class ProductScraperView(viewsets.ModelViewset):
#     serializer_class = serializers.ProductDetailSerializer
#     queryset = Product.objects.all()

class ProductView(viewsets.ModelViewSet):
    serializer_class = serializers.ProductDetailSerializer
    queryset = Product.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retrieve products for authenticated user"""
        if self.request.user.is_staff == True:
            return self.queryset.order_by('-url')
        else:
            return self.queryset.filter(user=self.request.user).order_by('-id')

    def get_serializer_class(self):
        """Get detail for product."""
        if self.action == 'list':
            return serializers.ProductSerializer
        return self.serializer_class

    def perform_create(self, serializer):
        """Create product."""
        serializer.save(user=self.request.user)
