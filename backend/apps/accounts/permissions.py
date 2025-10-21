from rest_framework.permissions import BasePermission

class MustChangePasswordPermission(BasePermission):
    message = "Você precisa alterar a senha provisória antes de continuar."

    def has_permission(self, request, view):
        user = request.user
        inmate = getattr(user, "inmate", None)
        if inmate and inmate.must_change_password:
            # Só libera views que declarem explicitamente esta flag
            return getattr(view, "allow_with_temp_password", False)
        return True
