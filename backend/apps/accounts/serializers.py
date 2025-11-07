from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers

from .models import Inmate
from .utils import gerar_matricula


class InmateListSerializer(serializers.ModelSerializer):
    """Serializer para listar inmates com informações básicas."""
    status = serializers.SerializerMethodField()
    
    class Meta:
        model = Inmate
        fields = ['id', 'full_name', 'matricula', 'status', 'must_change_password', 'created_at']
    
    def get_status(self, obj):
        """Retorna o status do aluno (ativo ou senha provisória)."""
        if obj.must_change_password:
            return 'Senha Provisória'
        return 'Ativo'


class AdminCreateInmateSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    matricula = serializers.CharField(max_length=20, required=False)  # opcional (gera se não vier)
    password = serializers.CharField(write_only=True, min_length=6)

    @transaction.atomic  # cria User + Inmate numa transação única
    def create(self, validated_data):
        full_name = validated_data["full_name"].strip()
        matricula = validated_data.get("matricula") or gerar_matricula()  # matrícula padrão DL-AAAA-####
        password = validated_data["password"]

        validate_password(password)  # aplica validadores do Django

        # Credencial (login = matrícula)
        user = User.objects.create_user(username=matricula)
        user.set_password(password)
        user.is_active = True
        user.save()

        # Perfil (dados do detento + flag para troca obrigatória)
        inmate = Inmate.objects.create(
            user=user,
            full_name=full_name,
            matricula=matricula,
            must_change_password=True,
        )
        return inmate

    def to_representation(self, inmate: Inmate):
        # Nunca retorna senha; apenas dados seguros para o cliente
        return {
            "id": str(inmate.id),
            "nome_completo": inmate.full_name,
            "matricula": inmate.matricula,
            "must_change_password": inmate.must_change_password,
        }


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = self.context["request"].user
        if not user.check_password(attrs["old_password"]):
            raise serializers.ValidationError({"old_password": "Senha atual incorreta."})
        validate_password(attrs["new_password"], user)  # força senha forte
        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()

        # Após trocar a senha, libera o uso do app
        inmate = getattr(user, "inmate", None)
        if inmate:
            inmate.must_change_password = False
            inmate.save(update_fields=["must_change_password"])
        return user
