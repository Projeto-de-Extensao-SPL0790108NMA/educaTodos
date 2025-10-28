from django.urls import path
from .views import AdminCreateInmateView, ChangePasswordView

urlpatterns = [
    path("admin/inmates/", AdminCreateInmateView.as_view(), name="admin-create-inmate"),
    path("auth/change-password/", ChangePasswordView.as_view(), name="change-password"),
]