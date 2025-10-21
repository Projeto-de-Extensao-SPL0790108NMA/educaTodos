from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers

from .models import Inmate
from .utils import gerar_matricula


class AdminCreateInmateSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    matricula = serializers.CharField(max_length=20, required=False)  # opcional
    password = serializers.CharField(write_only=True, min_length=6)

    @transaction.atomic
    def create(self, validated_data):
        full_name = validated_data["full_name"].strip()
        matricula = validated_data.get("matricula") or gerar_matricula()
        password = validated_data["password"]

        validate_password(password)  # usa validadores do Django

        # Credencial
        user = User.objects.create_user(username=matricula)
        user.set_password(password)
        user.is_active = True
        user.save()

        # Perfil
        inmate = Inmate.objects.create(
            user=user,
            full_name=full_name,
            matricula=matricula,
            must_change_password=True,
        )
        return inmate

    def to_representation(self, inmate: Inmate):
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
        validate_password(attrs["new_password"], user)
        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        # Desliga a obrigatoriedade de troca
        inmate = getattr(user, "inmate", None)
        if inmate:
            inmate.must_change_password = False
            inmate.save(update_fields=["must_change_password"])
        return user
