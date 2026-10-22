# VYVE — site oficial de lançamento

Site em português com Next.js App Router, React, TypeScript strict, Tailwind CSS 4, Motion, Lucide, React Hook Form, Zod, Prisma e PostgreSQL. Implementação local, sem publicação automática.

## Executar no VS Code

Pré-requisitos: Node.js 22.12+ (validado com 24), npm e Docker Desktop em execução.

```powershell
npm.cmd ci
npm.cmd run db:setup
npm.cmd run dev
```

Abra http://127.0.0.1:3000. Se a porta estiver ocupada, use o endereço Local impresso pelo Next.js. No Windows, `.cmd` evita restrições do PowerShell sobre `npm.ps1`. Em outros sistemas use `npm` normalmente.

`db:setup` cria `.env` a partir de `.env.example` com segredo aleatório, inicia PostgreSQL 17 na porta **55432**, gera o cliente e aplica migrations. Os dados persistem no volume Docker `vyve_vyve_data`. Não use `docker compose down -v` se quiser preservá-los.

Para banco externo: configure `DATABASE_URL` em `.env`, execute `npm run db:generate` e `npm run db:migrate`, sem executar `db:setup` (que inicia Docker).

## Verificar e compilar

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npx.cmd playwright install chromium
npm.cmd run test:e2e
npm.cmd run build
npm.cmd start
```

Os testes E2E precisam do PostgreSQL migrado; criam inscrições `@example.invalid` e as removem ao terminar. Consulte [TESTING](docs/TESTING.md).

## Configuração

Veja `.env.example`. Nunca versionar `.env`, credenciais ou dados reais. `NEXT_PUBLIC_SITE_URL` deve ser a origem HTTPS definitiva no deploy. `NEXT_PUBLIC_GA_ID` é opcional; analytics só carrega após autorização. `NEXT_PUBLIC_CONTACT_EMAIL` precisa ser um canal real antes da abertura pública.

## Conteúdo e referências

As artes oficiais fornecidas foram extraídas e otimizadas em WebP, sem criar novas insígnias. As pranchas originais estão em `public/references`. O script `scripts/prepare-assets.mjs <diretório>` permite refazer os recortes. As fotografias e interfaces derivam da prancha oficial; a resolução original limita ampliação. Não há alegações de usuários inscritos, depoimentos ou links fictícios de lojas.

A galeria usa 45 imagens individuais recebidas em `medalhas.zip`, otimizadas em WebP com transparência preservada. Os dados estão em `src/data/medals.json`. Para reimportar, extraia o ZIP e execute `node scripts/import-medals.mjs <pasta-medalhas-extraída>`. Nove coleções possuem imagens individuais; as três restantes continuam documentadas na prancha original.

## Antes de publicar

Revise os rascunhos jurídicos `/privacidade` e `/termos`, identifique controlador e fornecedores, configure contato real, retenção, domínio, HTTPS, banco com TLS e proxy confiável. Configure `AUTH_SECRET`, `ADMIN_PASSWORD` (32+ caracteres), `RESEND_API_KEY` e `MAIL_FROM`. A aplicação prepara mensagens em fila; `npm.cmd run mail:send` efetua o envio quando autorizado e configurado. Agende `npm.cmd run data:retention` diariamente. Em produção, inscrição falha se o envio não estiver configurado. Veja [o sistema de lançamento](docs/LAUNCH_SYSTEM.md) para operação, limitações e aprovação das regras.

Não existe fallback de armazenamento no navegador. Se o banco falhar, a API retorna 503 e o formulário informa o erro. Consulte [DEPLOYMENT](docs/DEPLOYMENT.md).

## Documentação

- [Sistema de lista de espera, indicações e lançamento](docs/LAUNCH_SYSTEM.md)

- [Arquitetura](docs/ARCHITECTURE.md)
- [Requisitos](docs/REQUIREMENTS.md)
- [Fluxos](docs/USER_FLOWS.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [API](docs/API.md)
- [Banco e exclusão](docs/DATABASE.md)
- [Analytics](docs/ANALYTICS.md)
- [Deploy](docs/DEPLOYMENT.md)
- [Testes](docs/TESTING.md)
