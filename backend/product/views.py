"""
Views for product.
"""
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
import logging
import json


from core.models import Product
from product import serializers

logger = logging.getLogger('development')

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

    def delete(self, request, *args, **kwargs):
          ids = request.data
          if ids:
              queryset = self.queryset.filter(id__in=ids)
              queryset.delete()
          return Response( {'msg':f'Success deleting {len(ids)} items.'},status=status.HTTP_204_NO_CONTENT)
