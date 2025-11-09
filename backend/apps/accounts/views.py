from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .serializers import AdminCreateInmateSerializer, ChangePasswordSerializer, InmateListSerializer
from .permissions import MustChangePasswordPermission
from .models import Inmate


class AdminListInmatesView(APIView):
    """View para listar todos os inmates (apenas para admin)."""
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        inmates = Inmate.objects.all().select_related('user').order_by('-created_at')
        serializer = InmateListSerializer(inmates, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminInmateDetailView(APIView):
    """View para buscar, atualizar ou deletar um inmate específico (apenas para admin)."""
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, pk):
        inmate = get_object_or_404(Inmate, pk=pk)
        serializer = InmateListSerializer(inmate)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        inmate = get_object_or_404(Inmate, pk=pk)
        full_name = request.data.get('full_name')
        password = request.data.get('password')
        must_change_password = request.data.get('must_change_password')
        
        if full_name:
            inmate.full_name = full_name.strip()
            inmate.save(update_fields=['full_name'])
        
        # Atualiza senha se fornecida
        if password:
            inmate.user.set_password(password)
            inmate.user.save()
        
        # Atualiza status
        if must_change_password is not None:
            inmate.must_change_password = must_change_password
            inmate.save(update_fields=['must_change_password'])
        
        serializer = InmateListSerializer(inmate)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        inmate = get_object_or_404(Inmate, pk=pk)
        inmate.user.delete()  # Deleta o User associado, que cascateia para o Inmate
        return Response(status=status.HTTP_204_NO_CONTENT)


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
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_me(request):
    """Retorna os dados do usuário autenticado."""
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": getattr(user, "role", "USER"),
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
    })