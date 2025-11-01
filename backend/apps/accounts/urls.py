from django.urls import path
from .views import AdminCreateInmateView, AdminListInmatesView, AdminInmateDetailView, ChangePasswordView, user_me

urlpatterns = [
    path("admin/inmates/", AdminCreateInmateView.as_view(), name="admin-create-inmate"),
    path("admin/inmates/list/", AdminListInmatesView.as_view(), name="admin-list-inmates"),
    path("admin/inmates/<uuid:pk>/", AdminInmateDetailView.as_view(), name="admin-inmate-detail"),
    path("auth/change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("me/", user_me, name="user_me"),
]