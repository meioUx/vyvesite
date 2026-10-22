# Publicação posterior

O projeto é Next.js padrão com servidor Node.js, adequado à Vercel ou infraestrutura própria. Não é exportação estática: a API precisa de runtime e PostgreSQL.

## Vercel

1. Versione o código e importe o repositório. Configure Node.js 24 e build `npm run build`.
2. Provisione PostgreSQL externo com conexão TLS e pooling adequado. Configure DATABASE_URL e RATE_LIMIT_SECRET (aleatório, 32+ caracteres), NEXT_PUBLIC_SITE_URL (HTTPS, domínio real), contato e GA4 opcional.
3. Execute `npm run db:migrate` em um job seguro de release com a mesma URL. Gere o cliente antes de usar scripts administrativos.
4. Habilite TRUST_PROXY somente após confirmar a sobrescrita de x-forwarded-for pelo provedor. Configure WAF/limite na borda. Verifique políticas e HTTPS.
5. Publique, envie uma inscrição de teste, confirme no banco e remova-a. Valide domínio canonical, sitemap, OG, privacidade e mensagens de erro.

## Servidor próprio

Execute `npm ci`, `npm run db:generate`, `npm run db:migrate`, `npm run build` e `npm start` sob supervisor. O servidor liga no loopback 127.0.0.1:3000; use proxy reverso HTTPS. O proxy deve sobrescrever os headers de IP se TRUST_PROXY estiver ativo. Use secret manager, banco restrito à rede do servidor, TLS e backups. Configure processo de rollback de código preservando compatibilidade das migrations.

## Aprovação de conteúdo

Substitua os rascunhos jurídicos por textos aprovados; informe controlador, contato, retenção, operadores e direitos. Configure o adaptador Resend, os segredos e o worker explícito de envio. Agende o expurgo e teste o descadastro no painel. Veja [Sistema de lançamento](LAUNCH_SYSTEM.md). As rotas jurídicas mantêm noindex enquanto forem rascunho.

O container Docker incluso é exclusivamente para desenvolvimento. Não exponha sua senha/porta em produção. Não há publicação executada nesta tarefa, conforme pedido de execução local e deploy posterior.
