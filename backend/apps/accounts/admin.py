from django.contrib import admin
from .models import Inmate

@admin.register(Inmate)
class InmateAdmin(admin.ModelAdmin):
    list_display = ("full_name", "matricula", "must_change_password", "created_at")
    search_fields = ("full_name", "matricula")
