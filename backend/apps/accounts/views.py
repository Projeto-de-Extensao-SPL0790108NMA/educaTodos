from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import AdminCreateInmateSerializer, ChangePasswordSerializer
from .permissions import MustChangePasswordPermission


class AdminCreateInmateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        s = AdminCreateInmateSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        inmate = s.save()
        return Response(s.to_representation(inmate), status=status.HTTP_201_CREATED)


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated, MustChangePasswordPermission]
    allow_with_temp_password = True  # libera mesmo com must_change_password=True

    def get_object(self):
        return self.request.user
