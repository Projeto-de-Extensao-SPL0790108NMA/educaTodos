import unicodedata
import re
from typing import List, Tuple
from django.utils import timezone
from django.contrib.auth.models import User
from .models import Inmate

PREFIXO = "DL"  
#função gerar matricula
def gerar_matricula() -> str:
    ano = timezone.now().strftime("%Y")
    base = f"{PREFIXO}-{ano}-"
    seq = Inmate.objects.filter(matricula__startswith=base).count() + 1
    return f"{base}{seq:04d}"


def remove_accents(text: str) -> str:
    """
    Remove acentos e caracteres especiais de uma string.
    Exemplo: 'José María' -> 'Jose Maria'
    """
    nfd = unicodedata.normalize('NFD', text)
    without_accents = ''.join(char for char in nfd if unicodedata.category(char) != 'Mn')
    return without_accents


def clean_name_part(name: str) -> str:
    """
    Limpa e normaliza parte de um nome:
    - Remove acentos
    - Remove caracteres especiais
    - Converte para minúsculas
    - Remove espaços extras
    """
    name = remove_accents(name)
    name = re.sub(r'[^a-zA-Z\s]', '', name)  # Remove tudo que não é letra ou espaço
    name = name.strip().lower()
    return name


def extract_consonants(text: str) -> str:
    """
    Extrai apenas as consoantes de um texto (sem vogais).
    Usado como estratégia de fallback.
    Exemplo: 'silveira' -> 'slvr'
    """
    vowels = 'aeiouAEIOU'
    return ''.join(char for char in text if char not in vowels and char.isalpha())


def split_full_name(full_name: str) -> Tuple[str, str, List[str]]:
    """
    Divide o nome completo em partes:
    - primeiro_nome: primeira palavra
    - ultimo_nome: última palavra
    - nomes_intermediarios: palavras do meio
    
    Retorna: (primeiro_nome, ultimo_nome, nomes_intermediarios)
    """
    parts = [clean_name_part(p) for p in full_name.split() if clean_name_part(p)]
    
    if not parts:
        raise ValueError("Nome completo inválido ou vazio")
    
    if len(parts) == 1:
        # Apenas um nome: usa ele duas vezes
        return parts[0], parts[0], []
    
    primeiro_nome = parts[0]
    ultimo_nome = parts[-1]
    nomes_intermediarios = parts[1:-1] if len(parts) > 2 else []
    
    return primeiro_nome, ultimo_nome, nomes_intermediarios


def generate_unique_username(full_name: str, max_attempts: int = 50) -> str:
    """
    Gera um username único baseado no nome completo do aluno.
    
    Estratégias (em ordem de tentativa):
    1. primeiroNome.ultimoNome (ex: carlos.silveira)
    2. Embaralhar nomes intermediários com primeiro/último (ex: junior.carlos, campos.silveira)
    3. primeiroNome + consoantes do último nome (ex: carlos.slvr)
    4. Adicionar número incremental (ex: carlos.silveira2, carlos.silveira3...)
    
    Args:
        full_name: Nome completo do aluno
        max_attempts: Número máximo de tentativas antes de lançar exceção
    
    Returns:
        Username único e válido
        
    Raises:
        ValueError: Se não conseguir gerar username único após max_attempts
        
    Exemplos:
        >>> generate_unique_username("Carlos Eduardo Silveira")
        'carlos.silveira'
        >>> generate_unique_username("José María Santos")
        'jose.santos'
        >>> generate_unique_username("Ana Silva")  # se já existir
        'ana.silva2'
    """
    primeiro_nome, ultimo_nome, nomes_intermediarios = split_full_name(full_name)
    
    candidates = []
    
    # Estratégia 1: primeiroNome.ultimoNome
    candidates.append(f"{primeiro_nome}.{ultimo_nome}")
    
    # Estratégia 2: Embaralhar com nomes intermediários
    if nomes_intermediarios:
        # Tenta combinações: nomeIntermediario.primeiroNome, nomeIntermediario.ultimoNome
        for nome_inter in nomes_intermediarios:
            candidates.append(f"{nome_inter}.{primeiro_nome}")
            candidates.append(f"{nome_inter}.{ultimo_nome}")
            candidates.append(f"{primeiro_nome}.{nome_inter}")
            candidates.append(f"{ultimo_nome}.{nome_inter}")
    
    # Estratégia 3: primeiroNome + consoantes do último nome
    consonants = extract_consonants(ultimo_nome)
    if consonants and consonants != ultimo_nome:  # Só usa se for diferente
        candidates.append(f"{primeiro_nome}.{consonants}")
    
    # Tenta os candidatos sem número primeiro
    for candidate in candidates:
        if not User.objects.filter(username=candidate).exists():
            return candidate
    
    # Estratégia 4: Adiciona números incrementais ao melhor candidato
    base_username = candidates[0]  # Usa o formato padrão como base
    
    for num in range(2, max_attempts + 2):
        numbered_username = f"{base_username}{num}"
        if not User.objects.filter(username=numbered_username).exists():
            return numbered_username
    
    # Se chegou aqui, não conseguiu gerar username único
    raise ValueError(
        f"Não foi possível gerar um username único para '{full_name}' "
        f"após {max_attempts} tentativas."
    ) 
