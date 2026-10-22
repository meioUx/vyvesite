# Analytics

Há medição interna com consentimento, independentemente de GA. `NEXT_PUBLIC_GA_ID` habilita adicionalmente GA4. O aviso permite aceitar, recusar e reabrir a escolha. Não enviar dados do formulário, URLs livres, tokens ou códigos. Parâmetros aceitos são enumerados; o servidor rejeita campos extras. GA não é carregado em páginas privadas.

Eventos solicitados: `generate_lead`, `share`, `challenge_started`, `challenge_day_completed`, `achievement_card_generated`, `referral_link_copied`, `referral_signup_verified`, `waitlist_email_verified`. Confirmações são contadores operacionais autoritativos no servidor, sem identidade; ações de uso dependem de opt-in. Os eventos públicos anteriores continuam disponíveis. Fórmulas, janelas, retenção D7 e limites estão no [Sistema de lançamento](LAUNCH_SYSTEM.md#analytics-e-métricas).

Eventos de uso são descartados antes do consentimento. O painel /admin distingue inscrições, confirmações, solicitações consentidas e compartilhamentos acionados. Compartilhar não comprova envio de mensagem. Revogação interrompe novas coletas, solicita a remoção do histórico interno e recarrega a página; cookies anteriores de GA podem ser removidos no navegador.

UTMs source/medium/campaign são armazenadas junto à inscrição, limitadas a 120 caracteres; não são enviadas explicitamente ao analytics. Não inclua dados pessoais em URLs de campanha. Desative medição automática de formulários, user-provided data e recursos que capturem query strings no painel GA. Valide no DebugView/rede antes de produção; o site não configura sua propriedade GA4 remotamente.
