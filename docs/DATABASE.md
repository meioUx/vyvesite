# Banco de dados

Schema atualizado, migração, vínculos, tokens, sessões, fila e expurgo: [Sistema de lançamento](LAUNCH_SYSTEM.md).

PostgreSQL 17 local via Docker, porta 55432 ligada somente ao loopback. Prisma 7 com driver `pg`. Produção usa DATABASE_URL externo; use TLS conforme seu provedor. Nunca reutilize a senha local em produção.

`WaitlistEntry`: id UUID gerado pela aplicação; name opcional; email único; consent boolean; consentVersion; createdAt; source, campaign e medium opcionais. Não há senha nem dados de câmera. `RateLimitBucket`: chave HMAC, contador e expiração indexada. Buckets vencidos são removidos em requisições posteriores.

```text
npm run db:generate
npm run db:migrate
```

Migration inicial versionada em `prisma/migrations`. Para mudanças futuras, em ambiente de desenvolvimento: `npx prisma migrate dev --name <descrição>`. Deploy usa somente `migrate deploy`; não executar db push em produção.

## Exclusão mediante solicitação

O responsável confirma a titularidade pelo canal oficial; não usar e-mail público sem autenticar a solicitação. No ambiente seguro configurado com o banco correto:

```text
npm run db:delete
```

O script solicita o e-mail interativamente (não em argumentos nem logs), normaliza e remove registros correspondentes sem informar existência. O próprio participante também pode excluir os dados em /painel, com sessão verificada e confirmação EXCLUIR. Relações privadas são removidas em cascata. Registre atendimento sem dados pessoais desnecessários; defina expurgo de backups e dados no provedor de e-mail.

Backups, teste de restauração, controle de acesso e rotina de retenção são responsabilidades de operação. O volume local persiste entre reinícios. `docker compose down` preserva dados; não adicione `-v` salvo descarte intencional.
