# Validação

## Atualização de 19/10/2026

Sistema de lançamento: 39 testes unitários, lint, TypeScript e build aprovados. Oito testes de interface passaram em desktop e celular: seis verificações das áreas privadas/confirmação e duas de interações públicas. Dados do participante usam fixtures explícitas nos testes de interface. A migração e os testes de integração reais de confirmação/indicação/exclusão foram preparados, mas não puderam ser executados nesta sessão: o serviço do Docker não disponibilizou PostgreSQL em localhost:55432. Não confundir as fixtures de interface com validação de banco. Após iniciar o banco: `npm.cmd run db:migrate` e `npm.cmd run test:e2e`. Para reutilizar o dev server existente, defina `E2E_BASE_URL=http://127.0.0.1:3000`.

## Resultado desta entrega (18/10/2026)

Para verificar também as animações habilitadas, defina `TEST_MOTION=1` e execute a suíte de interações: `npm run test:e2e -- --grep interactions`. Sem a variável, os testes usam a preferência de movimento reduzido.

ESLint e TypeScript strict aprovados; 14 testes Vitest aprovados; quatro testes E2E aprovados (desktop e mobile), incluindo persistência real no PostgreSQL 17, deduplicação e revisão visual de screenshots. Build de produção Next.js concluído. A inspeção no Chrome confirmou a página; o controle de screenshot da extensão ficou indisponível, então a revisão visual usou as capturas do Playwright. Não houve publicação externa.

`npm run lint`: ESLint Next/Core Web Vitals e TypeScript. `npm run typecheck`: TypeScript strict. `npm test`: Vitest para normalização/limites/consentimento, origem, payload grande/malformado, honeypot, limitação de tentativas, resposta neutra e falha de persistência.

`npm run test:e2e`: Playwright/Chromium em desktop e viewport iPhone 13. Requer DATABASE_URL migrada. Valida formulário real, gravação consultada no PostgreSQL, duplicidade sem atualização indevida, dificuldades, ligas, coleções, FAQ, erro de validação, imagens, menu móvel, rotas de SEO e ausência de overflow horizontal. Inscrições E2E são removidas em finally. Não executar contra banco com dados de produção. Os screenshots ficam em `test-results` (ignorado no Git). O modo de redução de movimento é testado; a escala de captura móvel é 1 para evitar limites de altura de screenshots. Para testar a build de produção, execute o build e defina `E2E_PRODUCTION=1` antes de executar a suíte. O harness usa a porta 3002.

`npm run build`: gera Prisma e compila Next.js. Execute `npm start` para smoke de produção, com GET /, /privacidade, /termos, /contato, /robots.txt e /sitemap.xml.

Antes da abertura pública: validar com teclado, VoiceOver/TalkBack, dispositivos Android/iOS reais, zoom 200%, conexão lenta e reduced motion. Chromium com viewport móvel não substitui Safari/iPhone físico. WCAG AA e Core Web Vitals exigem auditoria e dados reais de produção; não há garantia de certificação ou pontuação.

GA4 depende de propriedade real e consentimento; validar DebugView e ausência de dados pessoais quando configurado. Segurança operacional (proxy/WAF, domínio, TLS, credenciais, retenção e backups) deve ser revisada no ambiente final.
