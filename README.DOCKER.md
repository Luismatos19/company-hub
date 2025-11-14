# Docker Setup - Company Hub

Este projeto contém configuração Docker completa para executar a aplicação em containers.

## Pré-requisitos

- Docker Engine 20.10+
- Docker Compose 2.0+

## Estrutura dos Containers

- **postgres**: Banco de dados PostgreSQL 16
- **backend**: API NestJS na porta 3001
- **frontend**: Aplicação Next.js na porta 3000

## Configuração Inicial

1. **Copie o arquivo de exemplo de variáveis de ambiente:**

```bash
cp env.example .env
```

2. **⚠️ IMPORTANTE: Edite o arquivo `.env` e altere TODAS as credenciais padrão:**
   - `POSTGRES_USER`: Nome de usuário do banco de dados
   - `POSTGRES_PASSWORD`: **SENHA FORTE** para o banco de dados (mínimo 12 caracteres)
   - `POSTGRES_DB`: Nome do banco de dados
   - `DATABASE_URL`: URL completa de conexão (será construída automaticamente)

⚠️ **NUNCA use as credenciais padrão em produção!**

Para mais informações sobre segurança, consulte o arquivo `README.SECURITY.md`.

## Comandos Principais

### Construir e iniciar todos os serviços:

```bash
docker-compose up -d
```

### Construir imagens do zero:

```bash
docker-compose build --no-cache
```

### Ver logs dos containers:

```bash
docker-compose logs -f
```

### Ver logs de um serviço específico:

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Parar todos os serviços:

```bash
docker-compose down
```

### Parar e remover volumes (apaga dados do banco):

```bash
docker-compose down -v
```

### Reiniciar um serviço específico:

```bash
docker-compose restart backend
```

### Executar comandos dentro de um container:

```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh

# PostgreSQL
docker-compose exec postgres psql -U postgres -d company_hub
```

## Executar Migrações do Prisma

Para executar migrações do Prisma no banco de dados:

```bash
docker-compose exec backend npx prisma migrate deploy
```

Ou se preferir, entre no container e execute:

```bash
docker-compose exec backend sh
npx prisma migrate deploy
```

## Desenvolvimento

Para desenvolvimento com hot-reload, você pode modificar o `docker-compose.yml` para usar volumes de bind mount, o que já está configurado. Os volumes permitem que mudanças no código sejam refletidas automaticamente.

## Acessar a Aplicação

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

## Solução de Problemas

### Container não inicia

Verifique os logs: `docker-compose logs <nome-do-serviço>`

### Erro de conexão com banco de dados

Certifique-se de que o PostgreSQL está saudável: `docker-compose ps`

### Reconstruir apenas um serviço

```bash
docker-compose build backend
docker-compose up -d backend
```
