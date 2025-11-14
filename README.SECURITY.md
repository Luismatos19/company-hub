# Segurança - Variáveis de Ambiente

## ⚠️ IMPORTANTE: Proteção de Dados Sensíveis

Este projeto utiliza variáveis de ambiente para armazenar informações sensíveis como credenciais de banco de dados. **Nunca** commite arquivos `.env` no repositório Git.

## Configuração Inicial

1. **Copie o arquivo de exemplo:**
   ```bash
   cp env.example .env
   ```

2. **Edite o arquivo `.env`** e altere TODAS as credenciais padrão:
   - `POSTGRES_USER`: Nome de usuário do PostgreSQL (não use "postgres" em produção)
   - `POSTGRES_PASSWORD`: Senha forte para o PostgreSQL (mínimo 12 caracteres, use letras, números e símbolos)
   - `POSTGRES_DB`: Nome do banco de dados
   - `DATABASE_URL`: URL completa de conexão (será construída automaticamente com as variáveis acima)

## Boas Práticas de Segurança

### Desenvolvimento
- Use senhas diferentes em cada ambiente (desenvolvimento, staging, produção)
- Nunca compartilhe credenciais via email ou mensagens não criptografadas
- Use um gerenciador de senhas para armazenar credenciais

### Produção
- **SEMPRE** use senhas fortes e únicas em produção
- Use variáveis de ambiente do sistema ou um gerenciador de secrets (AWS Secrets Manager, HashiCorp Vault, etc.)
- Não use valores padrão em produção
- Rotacione credenciais periodicamente
- Monitore acessos ao banco de dados

## Geração de Senhas Seguras

Você pode gerar senhas seguras usando:

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**PowerShell (Windows):**
```powershell
-join ((48..57) + (65..90) + (97..122) + (33..47) | Get-Random -Count 32 | % {[char]$_})
```

**Online (se confiável):**
- Use geradores de senha seguros como: https://passwordsgenerator.net/

## Verificação

O arquivo `.gitignore` está configurado para ignorar arquivos `.env*`. Sempre verifique antes de commitar:

```bash
git status
```

Se você ver algum arquivo `.env` na lista, NÃO commite!

## Troubleshooting

Se você receber erros sobre variáveis de ambiente não definidas:
1. Verifique se o arquivo `.env` existe na raiz do projeto
2. Certifique-se de que todas as variáveis obrigatórias estão definidas
3. Reinicie os containers: `docker-compose down && docker-compose up -d`

