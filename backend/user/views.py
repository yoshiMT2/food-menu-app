"""
Views for the user API.
"""
from rest_framework import generics, authentication, permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from rest_framework.authtoken.models import Token as DefaultTokenModel
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator

from user.serializers import UserSerializer, AuthTokenSerializer

# def get_token_response(user):
#         serializer_class = TokenSerializer
#         token, _ = DefaultTokenModel.objects.get_or_create(user=user)
#         serializer = serializer_class(instance=token)
#         return Response(serializer.data, status=status.HTTP_200_OK)


class CreateUserView(generics.CreateAPIView):
    """Create a new user in the system."""
    serializer_class = UserSerializer

# @method_decorator(csrf_exempt, name='dispatch')
class CreateToeknView(ObtainAuthToken):
    """Create a new auth token for user."""
    serializer_class = AuthTokenSerializer
    render_classes = api_settings.DEFAULT_RENDERER_CLASSES

    # def post(self, request, *args, **kargs):
    #     """Login user and send back token with user info."""
    #     serializer = self.get_serialier(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     usr = serializer.validated_data['user']
    #     return get_token_response(user)


class ManageUserView(generics.RetrieveUpdateAPIView):
    """Managethe authenticated user."""
    serializer_class = UserSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """Retrieve and return the authenticated user."""
        return self.request.user

