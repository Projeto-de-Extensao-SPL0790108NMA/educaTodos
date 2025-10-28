from django.utils import timezone
from .models import Inmate

PREFIXO = "DL"  
#função gerar matricula
def gerar_matricula() -> str:
    ano = timezone.now().strftime("%Y")
    base = f"{PREFIXO}-{ano}-"
    seq = Inmate.objects.filter(matricula__startswith=base).count() + 1
    return f"{base}{seq:04d}" 
