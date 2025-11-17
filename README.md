# 🏢 Company Hub

Plataforma completa para gerenciamento de empresas, membros e convites. Sistema multi-tenant que permite aos usuários criarem empresas, convidarem membros e gerenciarem permissões com diferentes níveis de acesso.

## 📋 Descrição do Projeto

O **Company Hub** é uma aplicação web moderna desenvolvida para facilitar o gerenciamento de empresas e suas equipes. A plataforma oferece:

- **Gerenciamento de Empresas**: Criação, edição e exclusão de empresas
- **Sistema de Membros**: Controle de membros com diferentes níveis de permissão (Owner, Admin, Member)
- **Sistema de Convites**: Convite de novos membros via token único
- **Autenticação JWT**: Sistema seguro de autenticação e autorização
- **Multi-tenant**: Usuários podem gerenciar múltiplas empresas e alternar entre elas
- **Interface Moderna**: UI responsiva construída com componentes modernos

## 🛠️ Principais Ferramentas Utilizadas

### Frontend

- **Next.js 16.0.3** - Framework React com App Router
- **React 19.2.0** - Biblioteca UI com React Compiler
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 4** - Framework de estilização
- **shadcn/ui** - Componentes UI acessíveis baseados em Radix UI
- **Zustand 5.0.8** - Gerenciamento de estado global
- **React Hook Form 7.66.0** - Gerenciamento de formulários
- **Zod 3.25.76** - Validação de schemas
- **Axios 1.13.2** - Cliente HTTP
- **Jest 29.7.0** - Framework de testes
- **Testing Library** - Utilitários para testes de componentes

### Backend

- **NestJS 11.0.1** - Framework Node.js modular e escalável
- **Prisma 6.1.0** - ORM moderno para banco de dados
- **PostgreSQL 18** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **bcrypt 6.0.0** - Hash de senhas
- **class-validator** - Validação de DTOs
- **Swagger** - Documentação automática da API
- **Jest 30.0.0** - Framework de testes

### Infraestrutura

- **Docker** - Containerização dos serviços
- **Docker Compose** - Orquestração de containers
- **PostgreSQL** - Banco de dados containerizado

## 🏗️ Arquitetura

O projeto segue uma arquitetura **monorepo** com separação clara entre frontend e backend:

```
company-hub/
├── frontend/                 # Aplicação Next.js
│   ├── src/
│   │   ├── app/             # Rotas e páginas (App Router)
│   │   ├── components/      # Componentes React reutilizáveis
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilitários e configurações
│   │   │   ├── api.ts       # Cliente Axios configurado
│   │   │   ├── schemas/     # Schemas Zod
│   │   │   └── utils/       # Funções utilitárias
│   │   ├── store/           # Estado global (Zustand)
│   │   └── types/           # Tipos TypeScript
│   ├── __tests__/           # Testes de integração
│   └── components/__tests__/# Testes de componentes
│
├── backend/                  # API NestJS
│   ├── src/
│   │   ├── auth/            # Módulo de autenticação
│   │   ├── users/           # Módulo de usuários
│   │   ├── companies/       # Módulo de empresas
│   │   ├── memberships/     # Módulo de membros
│   │   ├── invites/         # Módulo de convites
│   │   ├── common/          # Recursos compartilhados
│   │   │   ├── filters/     # Exception filters
│   │   │   ├── interceptors/# Interceptors (logging, transform)
│   │   │   ├── pipes/       # Validation pipes
│   │   │   └── prisma/      # Serviço Prisma
│   │   └── main.ts          # Bootstrap da aplicação
│   └── prisma/
│       └── schema.prisma    # Schema do banco de dados
│
└── docker-compose.yml       # Configuração Docker Compose
```

### Fluxo de Dados

```
Frontend (Next.js)
    ↓ HTTP Requests
Backend (NestJS)
    ↓ Prisma ORM
PostgreSQL Database
```

### Principais Conceitos

1. **Autenticação**: JWT tokens para autenticação de usuários
2. **Autorização**: Sistema de roles (OWNER, ADMIN, MEMBER) para controle de acesso
3. **Multi-tenancy**: Usuários podem pertencer a múltiplas empresas
4. **Convites**: Sistema de tokens para convidar novos membros
5. **Validação**: Validação em camadas (frontend com Zod, backend com class-validator)

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- **Node.js** 18 ou superior
- **pnpm** (ou npm/yarn)
- **Docker** e **Docker Compose** (para rodar o banco de dados)

### Instalação com Docker Compose (Recomendado)

1. **Clone o repositório**:

```bash
git clone <repository-url>
cd company-hub
```

2. **Configure as variáveis de ambiente**:

```bash
cp env.example .env
```

Edite o arquivo `.env` e configure as variáveis necessárias:

```env
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha_forte
POSTGRES_DB=company_hub
DATABASE_URL=postgresql://seu_usuario:sua_senha@postgres:5432/company_hub
JWT_SECRET=seu_jwt_secret_forte
```

3. **Inicie os serviços com Docker Compose**:

```bash
docker-compose up -d postgres
```

Aguarde alguns segundos para o PostgreSQL inicializar.

4. **Configure o Backend**:

```bash
cd backend
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
cd ..
```

5. **Configure o Frontend**:

```bash
cd frontend
pnpm install
cd ..
```

6. **Inicie os serviços**:

   **Opção A - Docker Compose (Todos os serviços)**:

   ```bash
   docker-compose up
   ```

   **Opção B - Desenvolvimento local**:

   Terminal 1 - Backend:

   ```bash
   cd backend
   pnpm start:dev
   ```

   Terminal 2 - Frontend:

   ```bash
   cd frontend
   pnpm dev
   ```

7. **Acesse a aplicação**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api
   - Swagger Documentation: http://localhost:3001/api/docs

### Instalação Manual (Sem Docker)

1. **Configure o PostgreSQL**:

   - Instale e configure PostgreSQL 18
   - Crie um banco de dados chamado `company_hub`

2. **Configure as variáveis de ambiente**:

```bash
cp env.example .env
```

Edite o `.env` e configure a `DATABASE_URL` para apontar para seu PostgreSQL local:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/company_hub
```

3. **Configure o Backend**:

```bash
cd backend
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
pnpm start:dev
```

4. **Configure o Frontend** (em outro terminal):

```bash
cd frontend
pnpm install
pnpm dev
```

## 🧪 Testes

### Frontend

```bash
cd frontend
pnpm test              # Executar todos os testes
pnpm test:watch        # Modo watch
pnpm test:coverage     # Com cobertura de código
```

### Backend

```bash
cd backend
pnpm test              # Executar todos os testes
pnpm test:watch        # Modo watch
pnpm test:cov          # Com cobertura de código
pnpm test:e2e          # Testes end-to-end
```

## 📝 Scripts Disponíveis

### Frontend

- `pnpm dev` - Inicia servidor de desenvolvimento
- `pnpm build` - Build para produção
- `pnpm start` - Inicia servidor de produção
- `pnpm test` - Executa testes
- `pnpm lint` - Executa ESLint

### Backend

- `pnpm start:dev` - Inicia servidor de desenvolvimento
- `pnpm start:prod` - Inicia servidor de produção
- `pnpm build` - Build do projeto
- `pnpm test` - Executa testes unitários
- `pnpm test:e2e` - Executa testes end-to-end
- `pnpm prisma:generate` - Gera cliente Prisma
- `pnpm prisma:migrate` - Executa migrações
- `pnpm prisma:studio` - Abre Prisma Studio

## 🔒 Segurança

- Senhas são hashadas com **bcrypt** (10 rounds)
- Autenticação baseada em **JWT tokens**
- Validação de dados em múltiplas camadas (frontend e backend)
- CORS configurado para permitir apenas origens autorizadas
- Exception filters para tratamento seguro de erros

## 📚 Documentação da API

A documentação completa da API está disponível através do **Swagger** quando o backend estiver rodando. O Swagger fornece uma interface interativa para explorar e testar todos os endpoints da API.

### Acessando a Documentação

- **URL**: http://localhost:3001/api/docs
- **Disponível**: Apenas quando o backend estiver em execução

### Funcionalidades do Swagger

- ✅ **Interface Interativa**: Explore todos os endpoints da API de forma visual
- ✅ **Teste de Endpoints**: Teste diretamente os endpoints através da interface
- ✅ **Documentação Automática**: Documentação gerada automaticamente a partir do código
- ✅ **Autenticação JWT**: Sistema de autenticação integrado para testar endpoints protegidos
- ✅ **Esquemas de Dados**: Visualização dos DTOs e modelos de dados
- ✅ **Exemplos de Requisições**: Exemplos de payloads para cada endpoint

### Autenticação no Swagger

Para testar endpoints protegidos no Swagger:

1. Faça login através do endpoint `POST /api/auth/login`
2. Copie o token JWT retornado
3. Clique no botão **"Authorize"** (🔒) no topo da página Swagger
4. Cole o token no campo "Value" no formato: `Bearer seu-token-aqui`
5. Clique em **"Authorize"** e depois em **"Close"**
6. Agora você pode testar todos os endpoints protegidos

### Endpoints Documentados

O Swagger documenta todos os módulos da API:

- **🔐 Autenticação** (`/api/auth`)

  - `POST /api/auth/login` - Login de usuário
  - `POST /api/auth/signup` - Cadastro de novo usuário
  - `POST /api/auth/logout` - Logout

- **🏢 Empresas** (`/api/companies`)

  - `GET /api/companies` - Listar todas as empresas
  - `GET /api/companies/:id` - Buscar empresa por ID
  - `POST /api/companies` - Criar nova empresa
  - `PATCH /api/companies/:id` - Atualizar empresa
  - `DELETE /api/companies/:id` - Deletar empresa
  - `POST /api/companies/:id/select` - Selecionar empresa ativa

- **👤 Membros** (`/api/memberships`)

  - `GET /api/memberships/:id` - Buscar associiação por ID
  - `PATCH /api/memberships/:id` - Atualizar role da associação
  - `DELETE /api/memberships/:id` - Remover membro

- **📧 Convites** (`/api/invites`)
  - `GET /api/invites/token/:token` - Buscar convite por token (público)
  - `POST /api/invites` - Criar novo convite (Owner/Admin)
  - `POST /api/invites/accept` - Aceitar convite
  - `DELETE /api/invites/:id` - Deletar convite (Owner/Admin)

### Notas Importantes

- ⚠️ O Swagger está disponível apenas em **desenvolvimento**
- 🔒 Endpoints marcados com **🔒** requerem autenticação JWT
- 👑 Alguns endpoints requerem permissões específicas (Owner/Admin)
- 📝 Todos os DTOs e schemas são documentados automaticamente

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário.

---

Desenvolvido com ❤️ usando Next.js e NestJS
