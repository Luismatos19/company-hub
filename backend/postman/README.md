# Company Hub API - Postman Collection

A collection utiliza as seguintes variáveis que são preenchidas automaticamente:

- `base_url`: URL base da API (padrão: `http://localhost:3001/api`)
- `auth_token`: Token JWT retornado no login (preenchido automaticamente)
- `user_id`: ID do usuário criado/buscado (preenchido automaticamente)
- `company_id`: ID da empresa criada/buscada (preenchido automaticamente)
- `membership_id`: ID da membresia criada (preenchido automaticamente)
- `invite_id`: ID do convite criado (preenchido automaticamente)
- `invite_token`: Token do convite gerado (preenchido automaticamente)

## 🚀 Fluxo Recomendado de Testes

### 1. Setup Inicial

1. **Health Check** - Verificar se a API está rodando
2. **Create User** - Criar um novo usuário
3. **Login** - Fazer login e obter o token JWT

### 2. Gerenciamento de Empresas

1. **Create Company** - Criar uma empresa
2. **Get Company by ID** - Verificar empresa criada
3. **Update Company** - Atualizar nome da empresa

### 3. Membros

1. **Create Membership** - Adicionar usuário como membro da empresa
2. **Get All Memberships** - Listar todas as membresias
3. **Set Active Company** - Definir empresa ativa para o usuário
4. **Update Membership Role** - Alterar papel do membro

### 4. Convites

1. **Create Invite** - Criar convite para nova pessoa
2. **Get Invite by Token** - Validar convite pelo token
3. **Get All Invites** - Listar todos os convites

## 📝 Endpoints Disponíveis

### App

- `GET /` - Health check

### Auth

- `POST /auth/login` - Login de usuário

### Users

- `POST /users` - Criar usuário
- `GET /users` - Listar todos os usuários
- `GET /users/:id` - Buscar usuário por ID
- `PATCH /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Deletar usuário

### Companies

- `POST /companies` - Criar empresa
- `GET /companies` - Listar todas as empresas
- `GET /companies/:id` - Buscar empresa por ID
- `PATCH /companies/:id` - Atualizar empresa
- `DELETE /companies/:id` - Deletar empresa

### Memberships

- `POST /memberships` - Criar membresia
- `GET /memberships` - Listar todas as membresias
- `GET /memberships/:id` - Buscar membresia por ID
- `PATCH /memberships/:id` - Atualizar membresia
- `DELETE /memberships/:id` - Deletar membresia

### Invites

- `POST /invites` - Criar convite
- `GET /invites` - Listar todos os convites
- `GET /invites/:id` - Buscar convite por ID
- `GET /invites/token/:token` - Buscar convite por token
- `DELETE /invites/:id` - Deletar convite

## 🧪 Testes Automáticos

A collection inclui scripts de teste que:

- Salvam automaticamente tokens de autenticação
- Salvam IDs criados para uso em requisições subsequentes
- Validação de status codes

## 💡 Dicas de Uso

1. **Autenticação**: Após fazer login, o token é salvo automaticamente na variável `auth_token`
2. **IDs Automáticos**: Ao criar recursos (usuário, empresa, etc.), os IDs são salvos automaticamente
3. **Validação**: Todos os endpoints incluem validação de dados com mensagens de erro descritivas
4. **Formato de Resposta**: Todas as respostas seguem o formato padronizado:
   ```json
   {
     "data": {...},
     "statusCode": 200,
     "message": "Success"
   }
   ```

## 🔍 Exemplos de Uso

### Criar e Autenticar Usuário

```json
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Criar Empresa

```json
POST /api/companies
{
  "name": "Acme Corporation"
}
```

### Criar Membresia

```json
POST /api/memberships
{
  "userId": "user-uuid",
  "companyId": "company-uuid",
  "role": "ADMIN"
}
```

### Criar Convite

```json
POST /api/invites
{
  "email": "invited@example.com",
  "companyId": "company-uuid",
  "expiresAt": "2024-12-31T23:59:59.000Z"
}
```

## ⚠️ Notas Importantes

- Todos os endpoints requerem o prefixo `/api`
- Senhas devem ter no mínimo 6 caracteres
- Emails devem ter formato válido
- Datas devem estar no formato ISO 8601
- IDs são UUIDs gerados automaticamente pelo banco de dados
- Para definir empresa ativa, o usuário deve ser membro da empresa
