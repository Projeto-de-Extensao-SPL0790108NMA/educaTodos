from rest_framework.permissions import BasePermission

class MustChangePasswordPermission(BasePermission):
    message = "Você precisa alterar a senha provisória antes de continuar."

    def has_permission(self, request, view):
        user = request.user
        inmate = getattr(user, "inmate", None)  # Verifica se o usuário tem perfil de detento

        if inmate and inmate.must_change_password:
            # Bloqueia o acesso até o detento trocar a senha,
            # exceto em views que definirem explicitamente 'allow_with_temp_password = True'
            return getattr(view, "allow_with_temp_password", False)

        return True  # Libera se o usuário não for detento ou já trocou a senha
