# Sistema de lançamento

## Arquitetura e armazenamento

Next.js App Router, TypeScript strict, Zod no servidor, PostgreSQL e Prisma. Leia as instruções locais do Next.js antes de alterar rotas. A migração `20261019000000_launch` preserva inscrições existentes: gera códigos de indicação, mas não presume confirmação de e-mail nem consentimento para marketing. Recompensas começam desativadas.

`WaitlistEntry` guarda consentimento versionado, autorização opcional de marketing, autorização de transferência, aquisição, indicador, verificação e seleção beta. `AccessToken` e `MemberSession` guardam somente SHA-256 de credenciais aleatórias de 256 bits. `MailMessage` é uma outbox transacional: payload com links é cifrado com AES-256-GCM usando AUTH_SECRET e apagado após envio. Exclusão do participante remove tokens, sessões, mensagens e dias do desafio em cascata; convites são desvinculados. `LaunchSettings` separa regras promocionais das regras do aplicativo. `AdminAudit` registra operação, quantidade e data, sem dados de inscritos. `ChallengeDay` tem unicidade por participante/dia e limite 1–30.

## Fluxo de inscrição e indicação

1. A página preserva a primeira campanha/ref da sessão em sessionStorage. O servidor valida todos os campos; campos desconhecidos são descartados. Atribuição é declarada pelo navegador, não uma comprovação antifraude.
2. POST /api/waitlist valida origem, JSON de até 4 KiB, honeypot, consentimento, email e limites persistentes de tentativas. O proxy só é confiável com TRUST_PROXY=true e deve sobrescrever x-forwarded-for.
3. Uma transação com advisory lock por identidade de e-mail encontra/cria a inscrição e enfileira a confirmação. Nome, campanha, consentimento e indicador não são sobrescritos em duplicatas. A resposta é genérica para impedir enumeração. No máximo um acesso por hora por identidade.
4. Identidades ignoram aliases +tag e, para Gmail/Googlemail, pontos e diferença de domínio. É uma deduplicação conservadora: domínios com caixas +tag independentes precisam de revisão assistida. Não impede uma pessoa de controlar várias caixas reais. Recompensas dependem de revisão de abuso antes da entrega.
5. Somente um indicador já verificado pode receber atribuição. A própria caixa/aliases não gera nova inscrição. O banco também impede referência ao próprio id. O indicador de uma inscrição existente não muda.
6. E-mail traz /confirmar#token=... (fragmento não vai ao servidor nem ao referrer). A página remove o fragmento e exige clique explícito antes do POST, evitando consumir o link em pré-visualizações de e-mail. Token expira em 24 horas, é consumido por DELETE RETURNING atômico e não pode ser reutilizado. Links adicionais permitem recuperar acesso sem alterar a inscrição.
7. Confirmação cria sessão HttpOnly, SameSite=Strict, Secure em HTTPS, válida por 7 dias. A primeira confirmação gera os contadores operacionais waitlist_email_verified e referral_signup_verified, sem identificadores pessoais.

## APIs

Todas as respostas de API usam no-store. Rotas privadas também são noindex; isso não substitui autenticação.

| Método / caminho                | Entrada / finalidade                                                                                                       |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| POST /api/waitlist              | name opcional, email, consent=true, marketingConsent opcional, website honeypot, source/medium/campaign, referralCode UUID |
| POST /api/waitlist/verify       | token; exige origem permitida; consome token e define cookie                                                               |
| GET /api/member                 | sessão; código/link, contagens pendentes/verificadas, preferências, regras, progresso                                      |
| POST /api/member                | action: preferences, delete (confirmation=EXCLUIR), logout, challenge_start, challenge_day                                 |
| GET /api/member/card            | sessão; cartão SVG sem nome, email ou identificador pessoal                                                                |
| POST /api/events                | consent=true, visitor UUID aleatório, evento permitido, source e tool enumerados; rejeita campos extras                    |
| DELETE /api/events              | visitor UUID do próprio navegador; remove seu histórico pseudônimo                                                         |
| POST /api/admin                 | login/password, logout; demais ações exigem sessão administrativa                                                          |
| GET /api/admin                  | métricas agregadas e configuração; nunca lista inscritos                                                                   |
| POST /api/admin action=rewards  | enabled, rules, threshold, approved=true; ativação requer texto aprovado de pelo menos 30 caracteres                       |
| POST /api/admin action=beta     | limit 1–50, authorized=true; lote de verificados por antiguidade, sem duplicar seleção                                     |
| POST /api/admin action=campaign | subject, text, authorized=true; até 50 verificados com marketing opt-in                                                    |
| POST /api/admin action=export   | authorized=true; JSON v1 de até 10.000 verificados que autorizaram transferência                                           |

Mutações privadas exigem Origin do site/mesma origem, JSON limitado e rate limiting. Login administrativo exige ADMIN_PASSWORD com 32+ caracteres e gera cookie assinado de uma hora. Instalação inicial tem um único operador; rotação de AUTH_SECRET invalida tickets e requer reemitir mensagens cifradas pendentes. Use acesso administrativo restrito na infraestrutura em produção e não compartilhe a senha.

## E-mails e preparação do beta

Configure AUTH_SECRET, RESEND_API_KEY e MAIL_FROM com domínio verificado. O adaptador usa a [API oficial do Resend](https://resend.com/docs/api-reference/emails/send-email), texto puro e Idempotency-Key por mensagem. A aplicação não dispara e-mails em cadastro/build/testes. Execute `npm.cmd run mail:send` por um operador ou agendador autorizado, em intervalos de poucos minutos. Cada execução tenta até 50 mensagens. Locks de 10 minutos, SKIP LOCKED e chave idempotente protegem múltiplos workers; falhas tentam novamente até cinco vezes. A fila deixa de enviar após 23 horas para manter retentativas dentro da janela de idempotência do provedor. Falhas definitivas precisam de monitoramento operacional; o usuário pode solicitar outro acesso após uma hora.

Mensagens de acesso são transacionais. Campanhas dependem de consentimento opcional, verificação e autorização do operador. O worker verifica novamente o consentimento antes de enviar; revogação também remove campanhas pendentes. Há uma janela inevitável se a revogação ocorrer depois do início de uma requisição ao provedor. Campanhas têm link para o painel, onde o usuário pode solicitar acesso e cancelar. Cada submissão administrativa cria um novo lote; não reenvie o formulário após uma resposta bem-sucedida. Seleção beta é um registro controlado, não concessão de acesso ao futuro aplicativo. Não envie convites antes de aprovar instruções reais de acesso.

Exportação exige autorização administrativa e autorização individual separada no painel. O JSON contém PII e deve ir apenas ao destino autorizado, sob acesso restrito. Não há integração de importação no aplicativo futuro nem transferência automática. O destino deverá validar versão, deduplicar pelo id, registrar finalidade e implementar revogação/exclusão após transferência.

## Analytics e métricas

Analytics interno e GA opcional exigem consentimento. Apenas eventos enumerados e tool/source enumerados são aceitos; não enviar nome, email, URLs, código de indicação, token, campanha livre nem campos arbitrários. O histórico interno usa hash de um UUID aleatório do navegador, sem cruzamento com cadastro. É pseudônimo, não anonimização; o UUID só é criado após opt-in. Preferências permitem retirar consentimento e apagar esse histórico. Uma solicitação bloqueada/offline pode exigir nova tentativa; o prazo máximo do histórico é 90 dias. Contadores operacionais de confirmação não guardam identidade e independem de cookies.

Eventos: generate_lead (resposta aceita do formulário, inclusive resposta genérica para duplicata/honeypot), share (Web Share concluído), referral_link_copied (clipboard concluído), waitlist_email_verified e referral_signup_verified (somente servidor, uma vez), challenge_started, challenge_day_completed e achievement_card_generated. Ações de desafio medidas no navegador são indicadores de uso, não prova competitiva. Eventos recusados/desativados não impedem funcionalidades. GA não carrega em /admin, /painel ou /confirmar e recebe URL sem query/referrer; desative medições automáticas adicionais que capturem URLs no provedor.

Painel: visitantes únicos por origem e ações de ferramentas nos últimos 90 dias, inscrições totais/verificadas e por indicador, compartilhamentos acionados (não equivalem a mensagens enviadas), crescimento de verificações por semana UTC (12 semanas, incluindo semanas zeradas; semana atual é parcial). Conversão operacional = verificadas / inscrições. Conversão de visitante consentido = visitantes distintos com generate_lead / visitantes distintos com page_view na janela; mede solicitações, não verificação. Retenção D7 = visitante com evento exatamente no dia UTC inicial+7 / visitantes com 7 dias observáveis. Consentimento, bloqueadores, limpeza de armazenamento e retenção de 90 dias limitam essa medição. Sem base, mostrar indisponível, nunca inventar valores.

## Desafio e cartões

Implementados depois da base de lista de espera: desafio pessoal de 30 dias UTC com no máximo um registro por dia, sem backdating, sem ranking/XP, e cartão SVG baixável de progresso autodeclarado, sem dados pessoais. Não há leitura de câmera nem verificação de exercício. Compartilhe o arquivo baixado manualmente; o cartão não publica dados em uma URL pública.

## Privacidade e lançamento

Não declare conformidade jurídica automaticamente. /privacidade e /termos continuam rascunhos até aprovação com identificação real do controlador, contato, bases, fornecedores, transferências e política de backups. O consentimento necessário à lista e o opt-in de marketing são separados. Exclusão pelo painel exige sessão verificada e confirmação explícita. O procedimento administrativo documentado continua disponível para solicitações assistidas.

Agende diariamente `npm.cmd run data:retention`: tokens/sessões/rate limits expirados; fila com mais de 7 dias; analytics após 90 dias; inscrições não verificadas após 30 dias. Dados de verificados ficam até exclusão ou encerramento da finalidade: o operador deve aprovar uma data final de expurgo antes do lançamento. Backups e dados no provedor de e-mail exigem política e procedimento próprios; a exclusão local não apaga cópias externas automaticamente.

SEO mantém canonical limpo, sitemap apenas público, OG existente e robots/noindex para áreas privadas. Tokens nunca entram em URL de consulta ou sitemap. Use domínio HTTPS real antes de publicar.

## Validação

`npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd test`, `npm.cmd run build`. Testes unitários cobrem consentimento, payload/origem, rate limiting, erros de banco, identidade/aliases, atribuição e duplicação, cifragem/adulteração, ticket administrativo e dias UTC. `npm.cmd run test:e2e` requer PostgreSQL e migrations; usa apenas endereços @example.invalid e não envia mensagens. O fluxo de integração consome links diretamente da outbox de teste, verifica uso único, contagem, privacidade administrativa e exclusão em cascata. Testes responsivos existentes continuam cobrindo a página pública.

Antes de produção: banco migrado com backup, TLS, segredos fortes, proxy configurado, domínio de envio verificado, worker/expurgo agendados, alertas de falha, revisão jurídica, e ensaio da restauração/exclusão e do fluxo de e-mail real com destinatário autorizado.
