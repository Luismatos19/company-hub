# Company Hub Backend

Backend da aplicação Company Hub construído com NestJS seguindo as melhores práticas de desenvolvimento.

## 🏗️ Estrutura do Projeto

O projeto segue uma arquitetura modular e organizada:

```
src/
├── common/              # Recursos compartilhados
│   ├── prisma/         # Serviço Prisma e módulo
│   ├── filters/        # Exception filters
│   ├── interceptors/   # Interceptors (logging, transform)
│   ├── pipes/          # Validation pipes
│   └── dto/            # DTOs compartilhados (pagination, etc.)
├── users/              # Módulo de usuários
│   ├── dto/           # Data Transfer Objects
│   ├── users.service.ts
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.spec.ts
├── companies/          # Módulo de empresas
├── memberships/        # Módulo de membros
├── invites/            # Módulo de convites
├── auth/               # Módulo de autenticação
├── app.module.ts       # Módulo raiz
└── main.ts             # Arquivo de bootstrap
```

## ✨ Funcionalidades Implementadas

### ✅ Boas Práticas Aplicadas

1. **Modularização**: Código organizado em módulos separados com responsabilidades específicas
2. **Dependency Injection**: Uso completo do sistema de DI do NestJS
3. **Error Handling**: Exception filters globais para tratamento de erros
4. **Logging**: Sistema de logging integrado com interceptors
5. **Validação**: DTOs com class-validator para validação de dados
6. **Testes**: Testes unitários para serviços principais
7. **Código Consistente**: ESLint e Prettier configurados

### 📦 Módulos Disponíveis

- **Users**: Gerenciamento de usuários (CRUD)
- **Companies**: Gerenciamento de empresas (CRUD)
- **Memberships**: Gerenciamento de membros de empresas
- **Invites**: Sistema de convites para empresas
- **Auth**: Autenticação JWT

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- pnpm (ou npm/yarn)
- PostgreSQL

### Instalação

```bash
# Instalar dependências
pnpm install

# Gerar cliente Prisma
pnpm prisma:generate

# Executar migrações
pnpm prisma:migrate
```

### Desenvolvimento

```bash
# Iniciar em modo desenvolvimento
pnpm start:dev

# A aplicação estará disponível em http://localhost:3000/api
```

### Produção

```bash
# Build
pnpm build

# Iniciar produção
pnpm start:prod
```

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Executar testes em modo watch
pnpm test:watch

# Executar testes com cobertura
pnpm test:cov

# Executar testes e2e
pnpm test:e2e
```

## 📝 Variáveis de Ambiente

Configure as variáveis de ambiente no arquivo `.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/company_hub

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1d
```

## 🔒 Segurança

- Senhas são hashadas com bcrypt (10 rounds)
- Validação de dados com class-validator
- Exception filters para tratamento seguro de erros
- CORS configurado
- JWT para autenticação

## 📚 API Endpoints

### Auth
- `POST /api/auth/login` - Login de usuário

### Users
- `GET /api/users` - Listar todos os usuários
- `GET /api/users/:id` - Buscar usuário por ID
- `POST /api/users` - Criar novo usuário
- `PATCH /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Companies
- `GET /api/companies` - Listar todas as empresas
- `GET /api/companies/:id` - Buscar empresa por ID
- `POST /api/companies` - Criar nova empresa
- `PATCH /api/companies/:id` - Atualizar empresa
- `DELETE /api/companies/:id` - Deletar empresa

### Memberships
- `GET /api/memberships` - Listar todas as membresias
- `GET /api/memberships/:id` - Buscar membresia por ID
- `POST /api/memberships` - Criar nova membresia
- `PATCH /api/memberships/:id` - Atualizar membresia
- `DELETE /api/memberships/:id` - Deletar membresia

### Invites
- `GET /api/invites` - Listar todos os convites
- `GET /api/invites/:id` - Buscar convite por ID
- `GET /api/invites/token/:token` - Buscar convite por token
- `POST /api/invites` - Criar novo convite
- `DELETE /api/invites/:id` - Deletar convite

## 🛠️ Tecnologias Utilizadas

- **NestJS** - Framework Node.js
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **class-validator** - Validação de dados
- **Jest** - Framework de testes

## 📖 Documentação

Para mais informações sobre NestJS, consulte a [documentação oficial](https://docs.nestjs.com/).
