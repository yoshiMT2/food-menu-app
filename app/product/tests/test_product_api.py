"""
Tests for the product api.
"""
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Product

from product.serializers import ProductSerializer, ProductDetailSerializer

PRODUCTS_URL = reverse('product:product-list')


def detail_url(product_id):
    return reverse('product:product-detail', args=[product_id])


def create_product(user, **params):
    """Create and return a sample product"""
    defaults = {
        'url': 'https://jp.mercari/item/sample',
    }
    defaults.update(params)

    product = Product.objects.create(user=user, **defaults)
    return product


def create_user(**params):
    """Create and retrun a new user"""
    return get_user_model().objects.create_user(**params)


class PublicProductAPITests(TestCase):
    "Test unauthenticated API requests."

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """Test auth is required."""
        res = self.client.get(PRODUCTS_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateProductAPITests(TestCase):
    """TEst authenticated API requests."""

    def setUp(self):
        self.client = APIClient()
        self.user = create_user(
            email='user@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(self.user)

    def test_retrieve_products(self):
        """Test retrieving a list of products."""
        create_product(user=self.user)
        create_product(user=self.user)

        res = self.client.get(PRODUCTS_URL)

        products = Product.objects.all().order_by('-id')
        serializer = ProductSerializer(products, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)
        self.assertEqual(len(res.data), 2)

    def test_product_list_limited_to_user(self):
        """Test list of products is limited to authenticated user."""
        other_user = create_user(
            email='other@example.com',
            password='testpass123'
        )
        create_product(user=other_user)
        create_product(user=self.user)

        res = self.client.get(PRODUCTS_URL)

        products = Product.objects.filter(user=self.user)
        serializer = ProductSerializer(products, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)
        self.assertEqual(len(res.data), 1)

    def test_get_product_detail(self):
        """Test retrieving product detail."""
        product = create_product(user=self.user)

        url = detail_url(product.id)
        res = self.client.get(url)
        serializer = ProductDetailSerializer(product)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_update_product(self):
        """Test updating a product"""
        product = create_product(user=self.user)
        payload = {
            'name': 'Pikachu Sticker',
            'has_stock': True,
            'current_price': 200,
            'initial_price': 200
        }
        url = detail_url(product.id)
        res = self.client.patch(url, payload, format='json')

        product.refresh_from_db()
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(product.name, payload['name'])
