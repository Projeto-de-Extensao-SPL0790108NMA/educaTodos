#!/usr/bin/env python
"""
Script para criar usuários aleatórios e superusuários no sistema.

Uso:
    python create_users.py

O script irá:
1. Criar 3 superusuários (solicitará login e senha)
2. Criar inmates (detentos) aleatórios com matrículas e senhas geradas automaticamente
"""

import os
import sys
import django
from pathlib import Path

# Configura o Django
SCRIPT_DIR = Path(__file__).resolve().parent  # Diretório scripts/
BASE_DIR = SCRIPT_DIR.parent  # Vai para o diretório backend/
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'conhecimento_livre.settings')
django.setup()

from django.contrib.auth.models import User
from apps.accounts.models import Inmate
import random
import string


# Listas para gerar nomes aleatórios
FIRST_NAMES = [
    'João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Juliana', 'Lucas', 'Fernanda',
    'Rafael', 'Camila', 'Bruno', 'Beatriz', 'Gabriel', 'Larissa', 'Felipe',
    'Amanda', 'Rodrigo', 'Mariana', 'Thiago', 'Letícia', 'Gustavo', 'Patrícia',
    'Leonardo', 'Carla', 'Diego', 'Aline', 'Matheus', 'Renata', 'Vinicius', 'Paula'
]

LAST_NAMES = [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves',
    'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho',
    'Rocha', 'Almeida', 'Nascimento', 'Araújo', 'Melo', 'Barbosa', 'Cardoso',
    'Correia', 'Dias', 'Teixeira', 'Moreira', 'Cavalcanti', 'Ramos', 'Freitas'
]


def generate_password(length=10):
    """Gera uma senha aleatória."""
    characters = string.ascii_letters + string.digits + '!@#$%&*'
    return ''.join(random.choice(characters) for _ in range(length))


def generate_username(first_name, last_name):
    """Gera um username baseado no nome."""
    base_username = f"{first_name.lower()}.{last_name.lower()}"
    base_username = base_username.replace(' ', '').replace('ç', 'c').replace('ã', 'a').replace('õ', 'o')
    
    # Remove acentos
    replacements = {
        'á': 'a', 'à': 'a', 'â': 'a', 'ã': 'a',
        'é': 'e', 'ê': 'e',
        'í': 'i',
        'ó': 'o', 'ô': 'o', 'õ': 'o',
        'ú': 'u', 'ü': 'u',
        'ç': 'c'
    }
    
    for old, new in replacements.items():
        base_username = base_username.replace(old, new)
    
    # Se o username já existe, adiciona número
    username = base_username
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base_username}{counter}"
        counter += 1
    
    return username


def generate_email(username):
    """Gera um email baseado no username."""
    domains = ['gmail.com', 'hotmail.com', 'yahoo.com.br', 'outlook.com', 'educatodos.com']
    return f"{username}@{random.choice(domains)}"


def create_superusers(count=3):
    """Cria superusuários com interação."""
    print("\n" + "="*60)
    print("CRIAÇÃO DE SUPERUSUÁRIOS")
    print("="*60)
    
    superusers = []
    
    for i in range(count):
        print(f"\n--- Superusuário {i+1}/{count} ---")
        
        while True:
            username = input("Digite o nome de usuário (login): ").strip()
            if not username:
                print("❌ Nome de usuário não pode estar vazio!")
                continue
            if User.objects.filter(username=username).exists():
                print(f"❌ O usuário '{username}' já existe! Escolha outro.")
                continue
            break
        
        while True:
            email = input("Digite o email (opcional, pressione Enter para pular): ").strip()
            if not email:
                email = f"{username}@educatodos.com"
                print(f"   Email padrão: {email}")
                break
            if User.objects.filter(email=email).exists():
                print(f"❌ O email '{email}' já está em uso! Escolha outro.")
                continue
            break
        
        while True:
            password = input("Digite a senha: ").strip()
            if len(password) < 4:
                print("❌ Senha muito curta! Use pelo menos 4 caracteres.")
                continue
            confirm = input("Confirme a senha: ").strip()
            if password != confirm:
                print("❌ As senhas não conferem! Tente novamente.")
                continue
            break
        
        # Cria o superusuário
        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        
        superusers.append({
            'username': username,
            'email': email,
            'password': password,
            'is_superuser': True
        })
        
        print(f"✅ Superusuário '{username}' criado com sucesso!")
    
    return superusers


def generate_matricula():
    """Gera uma matrícula única no formato DL-YYYY-NNNN."""
    from django.utils import timezone
    
    PREFIXO = "DL"
    ano = timezone.now().strftime("%Y")
    base = f"{PREFIXO}-{ano}-"
    
    # Conta quantas matrículas já existem com esse prefixo + ano
    seq = Inmate.objects.filter(matricula__startswith=base).count() + 1
    
    return f"{base}{seq:04d}"


def create_random_users(count=20):
    """Cria usuários aleatórios como inmates (detentos)."""
    print("\n" + "="*60)
    print(f"CRIAÇÃO DE {count} INMATES (DETENTOS)")
    print("="*60 + "\n")
    
    users = []
    
    for i in range(count):
        # Gera nome aleatório
        first_name = random.choice(FIRST_NAMES)
        last_name = random.choice(LAST_NAMES)
        full_name = f"{first_name} {last_name}"
        
        # Gera matrícula única
        matricula = generate_matricula()
        
        # Username gerado a partir do nome
        username = generate_username(first_name, last_name)
        email = f"{username}@educatodos.com"
        password = generate_password()
        
        # Cria o usuário
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        # Cria o perfil de Inmate
        inmate = Inmate.objects.create(
            user=user,
            full_name=full_name,
            matricula=matricula,
            must_change_password=True
        )
        
        users.append({
            'username': username,
            'matricula': matricula,
            'email': email,
            'password': password,
            'full_name': full_name,
            'is_superuser': False,
            'is_inmate': True
        })
        
        print(f"✅ [{i+1:2d}/{count}] Inmate criado: {full_name} (Matrícula: {matricula})")
    
    return users


def print_credentials_table(superusers, random_users):
    """Imprime tabela com todas as credenciais."""
    print("\n" + "="*80)
    print("CREDENCIAIS DE ACESSO - GUARDE ESTAS INFORMAÇÕES!")
    print("="*80)
    
    # Superusuários (se houver)
    if superusers:
        print("\n🔑 SUPERUSUÁRIOS (Acesso Admin):")
        print("-" * 80)
        print(f"{'USERNAME':<25} {'EMAIL':<30} {'SENHA':<20}")
        print("-" * 80)
        for user in superusers:
            print(f"{user['username']:<25} {user['email']:<30} {user['password']:<20}")
    
    # Inmates
    print("\n👥 INMATES (DETENTOS)")
    print("-" * 80)
    print(f"{'MATRÍCULA':<15} {'USERNAME':<20} {'NOME COMPLETO':<30} {'SENHA':<15}")
    print("-" * 80)
    for user in random_users:
        print(f"{user['matricula']:<15} {user['username']:<20} {user['full_name']:<30} {user['password']:<15}")
    
    print("\n" + "="*80)


def save_to_file(superusers, random_users):
    """Salva credenciais em arquivo."""
    filename = 'usuarios_criados.txt'
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write("="*80 + "\n")
        f.write("CREDENCIAIS DE ACESSO - educaTodos\n")
        f.write(f"Gerado em: {django.utils.timezone.now().strftime('%d/%m/%Y %H:%M:%S')}\n")
        f.write("="*80 + "\n\n")
        
        # Superusuários (se houver)
        if superusers:
            f.write("🔑 SUPERUSUÁRIOS (Acesso Admin)\n")
            f.write("-" * 80 + "\n")
            f.write(f"{'USERNAME':<25} {'EMAIL':<30} {'SENHA':<20}\n")
            f.write("-" * 80 + "\n")
            for user in superusers:
                f.write(f"{user['username']:<25} {user['email']:<30} {user['password']:<20}\n")
            f.write("\n")
        
        # Inmates
        f.write("\n👥 INMATES (DETENTOS)\n")
        f.write("-" * 80 + "\n")
        f.write(f"{'MATRÍCULA':<15} {'USERNAME':<20} {'NOME COMPLETO':<30} {'SENHA':<15}\n")
        f.write("-" * 80 + "\n")
        for user in random_users:
            f.write(f"{user['matricula']:<15} {user['username']:<20} {user['full_name']:<30} {user['password']:<15}\n")
        
        f.write("\n" + "="*80 + "\n")
        f.write("\n⚠️  IMPORTANTE: Guarde este arquivo em local seguro!\n")
        f.write("    As senhas estão em texto plano apenas para facilitar os testes.\n")
        f.write("    Em produção, NUNCA armazene senhas em texto plano!\n")
    
    return filename


def main():
    """Função principal."""
    print("\n")
    print("╔" + "="*78 + "╗")
    print("║" + " "*78 + "║")
    print("║" + "  SCRIPT DE CRIAÇÃO DE USUÁRIOS - educaTodos".center(78) + "║")
    print("║" + " "*78 + "║")
    print("╚" + "="*78 + "╝")
    
    try:
        # Pergunta se deseja criar superusuários
        while True:
            create_super = input("\nDeseja criar superusuários? (s/n) [padrão: n]: ").strip().lower()
            if create_super in ['', 'n', 'não', 'nao']:
                create_super = False
                num_superusers = 0
                break
            elif create_super in ['s', 'sim', 'y', 'yes']:
                create_super = True
                # Pergunta quantos superusuários criar
                while True:
                    try:
                        num_super_input = input("Quantos superusuários deseja criar? [padrão: 1]: ").strip()
                        num_superusers = int(num_super_input) if num_super_input else 1
                        if num_superusers < 1:
                            print("❌ Quantidade deve ser maior que 0!")
                            continue
                        break
                    except ValueError:
                        print("❌ Digite um número válido!")
                break
            else:
                print("❌ Digite 's' para sim ou 'n' para não!")
        
        # Pergunta quantos inmates criar
        while True:
            try:
                num_users = input("\nQuantos inmates (detentos) deseja criar? [padrão: 20]: ").strip()
                num_users = int(num_users) if num_users else 20
                if num_users < 1:
                    print("❌ Quantidade deve ser maior que 0!")
                    continue
                break
            except ValueError:
                print("❌ Digite um número válido!")
        
        # Cria superusuários (se solicitado)
        superusers = []
        if create_super:
            superusers = create_superusers(count=num_superusers)
        
        # Cria inmates
        random_users = create_random_users(count=num_users)
        
        # Exibe tabela de credenciais
        print_credentials_table(superusers, random_users)
        
        # Salva em arquivo
        filename = save_to_file(superusers, random_users)
        
        print(f"\n✅ Credenciais salvas em: {filename}")
        print(f"\n📊 RESUMO:")
        if superusers:
            print(f"   • {len(superusers)} superusuário(s) criado(s)")
        print(f"   • {len(random_users)} inmate(s) (detento(s)) criado(s)")
        print(f"   • Total: {len(superusers) + len(random_users)} usuários")
        
        print("\n🎉 Script executado com sucesso!\n")
        
    except KeyboardInterrupt:
        print("\n\n⚠️  Script cancelado pelo usuário.")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Erro ao executar script: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
