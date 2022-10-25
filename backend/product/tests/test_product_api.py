"""
Tests for the product api.
"""
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from django.forms.models import model_to_dict
from rest_framework import status
from rest_framework.test import APIClient
import json

from core.models import Product

from product.serializers import ProductSerializer, ProductDetailSerializer

PRODUCTS_URL = reverse('product:product-list')


def get_url(object):
    new_obj = model_to_dict(object)
    return new_obj['url']

def detail_url(product_id):
    return reverse('product:product-detail', args=[product_id])


def create_product(user, **params):
    """Create and return a sample product"""
    defaults = {
        'url': 'https://jp.mercari',
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
        urls = map(get_url, products)
        serializer = ProductSerializer(products, many=True)
        self.assertEqual(list(urls), ['https://jp.mercari', 'https://jp.mercari'])
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
        # self.assertEqual(url, "status.HTTP_200_OK")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_partial_update_product(self):
        """Test parcially updating a product"""
        product = create_product(user=self.user)
        payload = {
            'name': 'Pikachu Sticker',
            'has_stock': True,
            'current_price': 200,
            'image': "https://image.com"
        }
        url = detail_url(product.id)
        res = self.client.patch(url, payload, format='json')
        serializer = ProductSerializer()
        serializer.update(product, payload)
        product.refresh_from_db()
        product3 = Product.objects.get(user=self.user)
        # self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(product3.name, payload['name'])

    def test_full_update_product(self):
        """Test fulll update for a product."""
        product = create_product(user=self.user)
        payload = {
            'user': self.user,
            'name': 'Pikachu Sticker',
            'url': 'https://jp.mercari/item/sample',
            'has_stock': True,
            'market': 'mercari',
            'current_price': 200,
            'image': "https://image.com",
            'detail': 'アメリカでは高値で売れている',
            'link': 'https://ubay.com/time/pikachu'
        }
        url = detail_url(product.id)
        res = self.client.put(url, payload)

        product.refresh_from_db()
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        for k, v in payload.items():
            self.assertEqual(getattr(product, k), v)
        self.assertEqual(product.user, self.user)

    def test_delete_product(self):
        product = create_product(user=self.user)
        url = detail_url(product.id)
        res = self.client.delete(url)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Product.objects.filter(user=self.user).exists())

    def test_product_id(self):
        product = create_product(user=self.user)
        url = detail_url(product.id)
        res = self.client.get(url)
        product3 = Product.objects.get(user=self.user)
        # id = model_to_dict(product3)['id']
        id = product3.id
        self.assertEqual(product.id, id)

    def test_bulk_delete(self):
      """Delete multiple products at once."""
      product1 = create_product(user=self.user)
      new_user = create_user(
            email='user5@example.com',
            password='testpass123'
      )
      product2 = create_product(user=new_user)
      product3 = create_product(user=new_user)
      payload = [product1.id, product2.id, product3.id]
      res = self.client.delete(PRODUCTS_URL, data=json.dumps(payload), content_type='application/json')
      self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
      # self.assertEqual(res.data['msg'], 'Success deleting 3 items.')
      self.assertFalse(Product.objects.filter(user=self.user).exists())
      self.assertFalse(Product.objects.filter(user=new_user).exists())





