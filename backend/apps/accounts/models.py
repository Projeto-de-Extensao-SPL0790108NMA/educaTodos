import uuid
from django.db import models
from django.contrib.auth.models import User


class Inmate(models.Model):
    #Perfil do detento. Credencial fica no User (username = matrícula).
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="inmate")

    full_name = models.CharField(max_length=150)
    matricula = models.CharField(max_length=20, unique=True, db_index=True)

    must_change_password = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["matricula"])]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} ({self.matricula})"
