# Arquitetura

A arquitetura atual de confirmação, indicação, sessões, outbox, painel administrativo, analytics e desafio está detalhada em [Sistema de lançamento](LAUNCH_SYSTEM.md). As seções abaixo descrevem a base da landing.

`src/app` contém rotas App Router, metadata, sitemap, robots e endpoint. `src/components` concentra apresentação; `src/features/waitlist` separa schema, formulário e serviço, e `src/features/analytics` controla consentimento e eventos. `src/lib` centraliza configuração e acesso ao banco. `prisma` contém schema e migration SQL reproduzível. `src/generated/prisma` é gerado localmente e não versionado.

O HTML inicial é renderizado pelo Next.js. A landing usa componentes cliente para interações e Motion. O formulário usa React Hook Form e validação Zod, repetida no servidor. O serviço recebe uma interface de persistência para testes independentes; o endpoint usa Prisma com adapter-pg e PostgreSQL real. Nenhuma credencial chega ao cliente.

POST → validação de origem/tamanho/tipo → schema → honeypot → limite persistente → transação de inscrição e fila de confirmação → resposta genérica. Falhas retornam 503. Advisory lock por caixa e índices únicos protegem concorrência e aliases. Confirmação é atômica e só então conta como inscrição verificada.

O rate limit usa buckets atômicos no banco, compartilhados entre instâncias, com hashes HMAC e janelas de dez minutos. Registros expirados são removidos oportunisticamente. Em tráfego elevado, mover limpeza para tarefa agendada e aplicar limite adicional no WAF. O modo sem proxy usa um bucket global conservador.

Não foram implementados recursos do aplicativo fitness, autenticação de jogadores, reconhecimento de câmera ou ranking real. Os mockups são representações oficiais identificadas como conceituais.
