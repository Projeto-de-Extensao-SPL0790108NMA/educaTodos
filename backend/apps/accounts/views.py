from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import AdminCreateInmateSerializer, ChangePasswordSerializer
from .permissions import MustChangePasswordPermission


class AdminCreateInmateView(APIView):
    permission_classes = [permissions.IsAdminUser]  # apenas admin pode criar detentos

    def post(self, request):
        s = AdminCreateInmateSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        inmate = s.save()  # cria User (credencial) + Inmate (perfil)
        return Response(s.to_representation(inmate), status=status.HTTP_201_CREATED)


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    # exige login e bloqueia uso do app até a troca da senha provisória
    permission_classes = [permissions.IsAuthenticated, MustChangePasswordPermission]
    allow_with_temp_password = True  # esta rota é a exceção liberada pela permissão

    def get_object(self):
        return self.request.user  # o alvo da atualização é o próprio usuário logado