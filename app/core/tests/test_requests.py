"""
Tests for http requests.
"""
from django.test import TestCase

from rest_framework.test import APIClient
from rest_framework import status


class HttpRequestsTests(TestCase):
    """Test http requests"""

    def setUp(self):
        self.client = APIClient()

    def test_index_page(self):
        """Test getting index page."""
        res = self.client.get('/food/hello/')

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_item_page(self):
        """Test getting item page."""
        res = self.client.get('/food/item/')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
