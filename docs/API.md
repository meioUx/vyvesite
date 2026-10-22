# POST /api/waitlist

Para todos os endpoints de confirmação, participante, administração e analytics, consulte a [referência atual do sistema de lançamento](LAUNCH_SYSTEM.md#apis).

Content-Type: `application/json`, corpo máximo de 4096 bytes (incluindo limite de leitura em stream). Endpoint Node.js, sem CORS aberto e com verificação de Origin quando enviado. O servidor deve expor somente a origem HTTPS configurada, atrás de proxy confiável.

```json
{
  "name": "Ana",
  "email": "ana@example.com",
  "consent": true,
  "marketingConsent": false,
  "website": "",
  "source": "instagram",
  "medium": "social",
  "campaign": "launch"
}
```

`name` opcional, até 80 caracteres; e-mail até 254, válido, normalizado para minúsculas. `consent` precisa ser verdadeiro. `website` é o honeypot invisível; valores preenchidos recebem resposta neutra sem persistência. Atribuições opcionais limitadas a 120 caracteres. ConsentVersion e createdAt são definidos pelo servidor.

200: solicitação recebida. Mesmo corpo para registro novo, duplicado ou honeypot; não revela se terceiros estão inscritos. Duplicatas não alteram nome/consentimento da inscrição existente. 400: payload inválido; 403: origem não permitida; 413: excesso de tamanho; 415: tipo inválido; 429: excesso de tentativas, Retry-After 600; 503: persistência/configuração indisponível.

Com `TRUST_PROXY=true`, o limite é cinco tentativas por IP e janela de dez minutos. Só habilitar se o proxy sobrescrever x-forwarded-for. Sem confiança em proxy, usa 50 tentativas por janela global, sem confiar no IP fornecido pelo cliente. HMAC com segredo de pelo menos 32 caracteres evita guardar IP bruto. O banco faz incremento atômico. Honeypot e rate limit são proteção básica, não substituem WAF ou proteção de borda.

O painel individual exige sessão obtida por confirmação de e-mail; não há consulta pública por e-mail. `referralCode` UUID é opcional. Consentimento para campanhas é separado e opcional. Logs usam códigos operacionais genéricos. Para exclusão autenticada, ver DATABASE.md.
