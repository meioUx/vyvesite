'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { track } from '@/features/analytics/analytics';
import Link from 'next/link';
type Member = {
  referralCode: string;
  referralUrl: string;
  verifiedInvites: number;
  pendingInvites: number;
  marketingConsent: boolean;
  migrationConsent: boolean;
  betaInvited: boolean;
  rewards: null | { rules: string; threshold: number };
  challengeStartedAt: string | null;
  days: number[];
};
export function Confirmation() {
  const [token, setToken] = useState('');
  const originalToken = useRef<string | null>(null);
  const [message, setMessage] = useState(
    'Confirme o e-mail para concluir a inscrição e acessar seu painel.',
  );
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const value =
      originalToken.current ?? new URLSearchParams(location.hash.slice(1)).get('token') ?? '';
    originalToken.current = value;
    const frame = requestAnimationFrame(() => setToken(value));
    history.replaceState(null, '', '/confirmar');
    return () => cancelAnimationFrame(frame);
  }, []);
  async function confirm() {
    setBusy(true);
    try {
      const response = await fetch('/api/waitlist/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const body = await response.json();
      if (!response.ok) {
        setMessage(body.message);
        return;
      }
      location.replace('/painel');
    } catch {
      setMessage('Falha de conexão. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <p role="status">{message}</p>
      <button className="button primary" disabled={!token || busy} onClick={confirm}>
        {busy ? 'Confirmando…' : 'Confirmar meu e-mail'}
      </button>
      <p>
        <Link href="/#lista-de-espera">Solicitar um novo link</Link>
      </p>
    </>
  );
}
export function Dashboard() {
  const [data, setData] = useState<Member | null>(null);
  const [message, setMessage] = useState('Carregando…');
  const [busy, setBusy] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/member');
      const body = await response.json();
      if (response.ok) {
        setData(body);
        setMessage('');
      } else setMessage(body.message);
    } catch {
      setMessage('Não foi possível carregar o painel.');
    }
  }, []);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      void load();
    });
    return () => cancelAnimationFrame(frame);
  }, [load]);
  async function action(body: object, event?: 'challenge_started' | 'challenge_day_completed') {
    setBusy(true);
    try {
      const response = await fetch('/api/member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.message);
        return false;
      }
      if (event) track(event, { tool: 'challenge' });
      await load();
      setMessage(result.message);
      return true;
    } catch {
      setMessage('Falha de conexão. Tente novamente.');
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function share() {
    if (!data) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Lista de espera VYVE', url: data.referralUrl });
        track('share', { tool: 'referral' });
      } else {
        await navigator.clipboard.writeText(data.referralUrl);
        track('referral_link_copied', { tool: 'referral' });
      }
      setMessage(
        'Link compartilhado ou copiado. A conversão conta após a confirmação do convidado.',
      );
    } catch {
      setMessage('Não foi possível compartilhar. Copie o link no campo abaixo.');
    }
  }
  async function card() {
    try {
      const response = await fetch('/api/member/card');
      if (!response.ok) {
        setMessage('Não foi possível gerar o cartão.');
        return;
      }
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = url;
      link.download = 'vyve-meu-progresso.svg';
      link.click();
      URL.revokeObjectURL(url);
      track('achievement_card_generated', { tool: 'achievement_card' });
    } catch {
      setMessage('Não foi possível gerar o cartão.');
    }
  }
  const day = data?.challengeStartedAt
    ? Math.floor(
        (Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()) -
          Date.parse(data.challengeStartedAt.slice(0, 10))) /
          86400000,
      ) + 1
    : 0;
  return (
    <div className="launch-dashboard">
      <p role="status" aria-live="polite">
        {message}
      </p>
      {!data ? (
        <p>
          <Link href="/#lista-de-espera">Solicite um link de acesso pelo seu e-mail.</Link>
        </p>
      ) : (
        <>
          <section className="launch-panel">
            <h2>Seu convite, seu progresso</h2>
            <div className="launch-stats">
              <p>
                <strong>{data.verifiedInvites}</strong> convidados verificados
              </p>
              <p>
                <strong>{data.pendingInvites}</strong> aguardando confirmação
              </p>
            </div>
            <label htmlFor="referral-url">Seu link de indicação</label>
            <input
              id="referral-url"
              readOnly
              value={data.referralUrl}
              onFocus={(e) => e.target.select()}
            />
            <p>
              Código individual: <code>{data.referralCode}</code>
            </p>
            <button className="button primary" onClick={share}>
              Compartilhar convite
            </button>
            <button
              className="button secondary"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(data.referralUrl);
                  track('referral_link_copied', { tool: 'referral' });
                  setMessage('Link copiado.');
                } catch {
                  setMessage('Selecione e copie o link acima.');
                }
              }}
            >
              Copiar link
            </button>
            <p>
              Somente inscrições únicas com e-mail confirmado contam. A indicação é atribuída na
              primeira inscrição.
            </p>
            {data.rewards ? (
              <>
                <h3>Regras promocionais aprovadas</h3>
                <p>{data.rewards.rules}</p>
                <progress
                  max={data.rewards.threshold}
                  value={data.verifiedInvites}
                  aria-label="Progresso de convites"
                />
                <p>
                  {Math.min(data.verifiedInvites, data.rewards.threshold)} de{' '}
                  {data.rewards.threshold} convites. Elegibilidade não significa entrega automática.
                </p>
              </>
            ) : (
              <p>Recompensas desativadas. Nenhum benefício está sendo prometido.</p>
            )}
            {data.betaInvited && (
              <p>
                Você foi selecionado para o beta. Aguarde as instruções operacionais antes de tentar
                acessar o aplicativo.
              </p>
            )}
          </section>
          <section className="launch-panel">
            <h2>Desafio pessoal de 30 dias</h2>
            <p>
              Registre um dia de movimento por vez, no seu ritmo. Registro pessoal por dia UTC, sem
              pontuação competitiva ou validação de exercício pelo aplicativo.
            </p>
            {!data.challengeStartedAt ? (
              <button
                className="button primary"
                disabled={busy}
                onClick={() => action({ action: 'challenge_start' }, 'challenge_started')}
              >
                Começar desafio
              </button>
            ) : (
              <>
                <p>{data.days.length} de 30 dias registrados.</p>
                <progress
                  max={30}
                  value={data.days.length}
                  aria-label="Dias do desafio concluídos"
                />
                <div className="challenge-grid">
                  {Array.from({ length: 30 }, (_, i) => (
                    <span
                      key={i}
                      aria-label={`Dia ${i + 1}${data.days.includes(i + 1) ? ' concluído' : ''}`}
                      className={data.days.includes(i + 1) ? 'done' : ''}
                    >
                      {i + 1}
                    </span>
                  ))}
                </div>
                <button
                  className="button primary"
                  disabled={busy || day > 30 || data.days.includes(day)}
                  onClick={() => action({ action: 'challenge_day' }, 'challenge_day_completed')}
                >
                  {day > 30
                    ? 'Desafio encerrado'
                    : data.days.includes(day)
                      ? 'Hoje já foi registrado'
                      : 'Registrar meu dia de movimento'}
                </button>
                <button className="button secondary" onClick={card}>
                  Baixar cartão de progresso
                </button>
              </>
            )}
          </section>
          <section className="launch-panel">
            <h2>Privacidade e preferências</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget);
                void action({
                  action: 'preferences',
                  marketingConsent: form.has('marketing'),
                  migrationConsent: form.has('migration'),
                });
              }}
            >
              <label className="consent">
                <input name="marketing" type="checkbox" defaultChecked={data.marketingConsent} />
                Quero receber campanhas e novidades opcionais.
              </label>
              <label className="consent">
                <input name="migration" type="checkbox" defaultChecked={data.migrationConsent} />
                Autorizo transferir minha inscrição verificada para o futuro sistema VYVE para
                receber meu acesso. Posso revogar antes da transferência.
              </label>
              <button className="button secondary" disabled={busy}>
                Salvar preferências
              </button>
            </form>
            <p>
              A exclusão remove a inscrição, sessões, tokens, mensagens e progresso da base ativa.
              Convites de outras pessoas são desvinculados. Dados agregados sem identificação
              permanecem.
            </p>
            <label htmlFor="delete-confirm">Digite EXCLUIR para excluir seus dados</label>
            <input
              id="delete-confirm"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
            />
            <button
              className="button secondary"
              disabled={busy || confirmation !== 'EXCLUIR'}
              onClick={async () => {
                if (await action({ action: 'delete', confirmation })) setData(null);
              }}
            >
              Excluir meus dados
            </button>
            <button
              className="button secondary"
              disabled={busy}
              onClick={async () => {
                if (await action({ action: 'logout' })) location.reload();
              }}
            >
              Sair
            </button>
          </section>
        </>
      )}
    </div>
  );
}
