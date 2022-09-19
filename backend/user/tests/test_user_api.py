"""
Tests for the user API.
"""
from re import S
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.core import mail
from core.models import User
from django.conf import settings
from django.utils.crypto import get_random_string

from rest_framework.test import APIClient
from rest_framework import status

CREATE_USER_URL = reverse('user:create')
TOKEN_URL = reverse('user:token')
ME_URL = reverse('user:me')
FORGOT_URL = reverse('user:forgot_password')
RESET_URL = reverse('user:reset_password')


def create_user(**params):
    """Create and return a new user."""
    return get_user_model().objects.create_user(**params)


class PublicUserApiTests(TestCase):
    """Test the public features of the user API."""

    def setUp(self):
        self.client = APIClient()

    def test_create_token_for_user(self):
        """Test generates token for valid credentials."""
        user_details = {
            'name': 'Test Name',
            'email': 'test@example.com',
            'password': 'test-user-password123'
        }
        create_user(**user_details)

        payload = {
            'email': user_details['email'],
            'password': user_details['password']
        }
        res = self.client.post(TOKEN_URL, payload)

        self.assertIn('key', res.data)
        self.assertIn('user', res.data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_create_token_bad_credentials(self):
        """Test returns error if credentials invalid."""
        create_user(email='test@example.com', password='goodpass')

        payload = {'email': 'test@example.com', 'password': 'badpassword'}
        res = self.client.post(TOKEN_URL, payload)

        self.assertNotIn('token', res.data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_token_blank_password(self):
        """Test posting a blank password returns an error."""
        payload = {'email': 'test@example.com', 'password': ''}
        res = self.client.post(TOKEN_URL, payload)

        self.assertNotIn('token', res.data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_user_unauthorized(self):
        """Test authentication is required for users."""
        res = self.client.get(ME_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_set_password_reset_secret(self):
        """Test setting password reset secret to user."""
        user = create_user(email='test@example.com', name='testpass123')
        payload = {'email': 'test@example.com'}
        res = self.client.post(FORGOT_URL, payload)
        user.refresh_from_db()
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(user.reset_password_secret), 32)

    def test_send_reset_passsword_email(self):
        """Test sending email to user for resetting password."""
        reset_secret = get_random_string(32)
        user = create_user(email='test@example.com', name='testpass123')
        payload = {'email': 'test@example.com'}
        res = self.client.post(FORGOT_URL, payload)
        mail.send_mail(
            f'パスワード再設定通知（{settings.WEB_SITE_NAME}）',
            f'{settings.WEB_SITE_NAME}用のパスワード再設定はこちらから {settings.RESET_PASSWORD_URL}{reset_secret}',
            settings.SENDER_EMAIL,
            [payload['email']],
            fail_silently=False
        )
        self.assertEqual(len(mail.outbox), 2)
        self.assertEqual(mail.outbox[0].subject, 'パスワード再設定通知（Flimapp）')

    def test_reset_password(self):
        """Test reset password successful."""
        secret = get_random_string(32)
        create_user(email='test@example.com', password='testpass123', reset_password_secret=secret)
        payload = {'password': 'testpass456', 'reset_secret': secret}
        user = User.objects.get(reset_password_secret=payload['reset_secret'])
        res = self.client.post(RESET_URL, payload)
        user.refresh_from_db()
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(user.check_password('testpass456'))
        self.assertIsNone(user.reset_password_secret)


class PrivateApiTests(TestCase):
    "Test API requests that require authentication."

    def setUp(self):
        self.user = create_user(
            email='test@example.com',
            password='testpass123',
            name='Test Name'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_retrieve_profile_success(self):
        "Test retrieving profile for logged in user."
        res = self.client.get(ME_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, {
            'name': self.user.name,
            'email': self.user.email
        })

    def test_post_me_allowed(self):
        """Test POST is not allowed for the me endpoint."""
        res = self.client.post(ME_URL, {})

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_update_me_allowed(self):
        """Test updating the user profile for the authenticated user."""
        payload = {'name': 'Updated name', 'password': 'newpass123'}

        res = self.client.patch(ME_URL, payload)

        self.user.refresh_from_db()
        self.assertEqual(self.user.name, payload['name'])
        self.assertTrue(self.user.check_password(payload['password']))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
