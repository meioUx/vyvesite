'use client';
import { useEffect, useState } from 'react';
type Report = {
  totals: { total: number; verified: number; referrals: number; converted: number };
  sources: { source: string; visitors: number }[];
  weeks: { week: string; verified: number }[];
  toolUsage: { tool: string; uses: number }[];
  shares: number;
  visitors: number;
  leads: number;
  retention: { eligible: number; retained: number };
  settings: null | { rewardsEnabled: boolean; rewardRules: string; rewardThreshold: number };
};
export function AdminDashboard() {
  const [data, setData] = useState<Report | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function load() {
    try {
      const response = await fetch('/api/admin');
      if (response.ok) setData(await response.json());
      else setData(null);
    } catch {
      setMessage('Não foi possível acessar o painel.');
    }
  }
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      void load();
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  async function send(body: object) {
    setBusy(true);
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (response.ok && 'entries' in result) {
        const url = URL.createObjectURL(
          new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' }),
        );
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vyve-authorized-import.json';
        a.click();
        URL.revokeObjectURL(url);
      }
      setMessage(result.message || (response.ok ? 'Concluído.' : 'Não foi possível concluir.'));
      if (response.ok) await load();
    } catch {
      setMessage('Falha de conexão.');
    } finally {
      setBusy(false);
    }
  }
  const pct = (n: number, d: number) =>
    d ? `${((100 * n) / d).toFixed(1)}%` : 'Sem base suficiente';
  return (
    <div className="launch-dashboard">
      <p role="status" aria-live="polite">
        {message}
      </p>
      {!data ? (
        <form
          className="launch-panel"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            void send({ action: 'login', password: f.get('password') });
            e.currentTarget.reset();
          }}
        >
          <label htmlFor="admin-password">Senha administrativa</label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            maxLength={200}
          />
          <button className="button primary" disabled={busy}>
            Entrar
          </button>
        </form>
      ) : (
        <>
          <section className="launch-panel">
            <h2>Aquisição e uso</h2>
            <div className="launch-stats">
              <p>
                <strong>{data.totals.verified}</strong> inscrições verificadas
              </p>
              <p>
                <strong>{data.totals.total - data.totals.verified}</strong> aguardando confirmação
              </p>
              <p>
                <strong>{data.visitors}</strong> visitantes com consentimento · 90 dias
              </p>
              <p>
                <strong>{pct(data.totals.verified, data.totals.total)}</strong> confirmação de
                inscrições
              </p>
              <p>
                <strong>{data.shares}</strong> compartilhamentos acionados · 90 dias
              </p>
              <p>
                <strong>{data.totals.referrals}</strong> inscrições por convite
              </p>
              <p>
                <strong>{data.totals.converted}</strong> convites convertidos
              </p>
              <p>
                <strong>{pct(data.retention.retained, data.retention.eligible)}</strong> retorno no
                7º dia
              </p>
            </div>
            <p>
              Compartilhar não confirma que um convite foi enviado. Analytics considera apenas
              visitantes que autorizaram a medição; inscrições e confirmações são contagens
              operacionais. A taxa acima mede confirmação, sem misturar esses públicos.
            </p>
            <p>
              Conversão de visitantes que autorizaram analytics:{' '}
              <strong>{pct(data.leads, data.visitors)}</strong> ({data.leads} visitantes com
              solicitação aceita / {data.visitors} visitantes observados em 90 dias). Solicitações
              aceitas podem incluir duplicatas; este indicador não mede e-mails verificados.
            </p>
            <h3>Visitantes por origem · 90 dias</h3>
            <table>
              <thead>
                <tr>
                  <th>Origem</th>
                  <th>Visitantes</th>
                </tr>
              </thead>
              <tbody>
                {data.sources.map((row) => (
                  <tr key={row.source}>
                    <td>{row.source}</td>
                    <td>{row.visitors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data.sources.length && <p>Sem dados coletados.</p>}
            <h3>Ferramentas utilizadas · 90 dias</h3>
            <table>
              <thead>
                <tr>
                  <th>Ferramenta</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {data.toolUsage.map((row) => (
                  <tr key={row.tool}>
                    <td>{row.tool}</td>
                    <td>{row.uses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3>Crescimento semanal · 12 semanas</h3>
            <table>
              <thead>
                <tr>
                  <th>Semana de</th>
                  <th>Novas verificações</th>
                  <th>Variação</th>
                </tr>
              </thead>
              <tbody>
                {data.weeks.map((row, i) => (
                  <tr key={row.week}>
                    <td>{new Date(row.week).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                    <td>{row.verified}</td>
                    <td>
                      {i && data.weeks[i - 1].verified
                        ? `${((row.verified / data.weeks[i - 1].verified - 1) * 100).toFixed(1)}%`
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              Retenção: retorno exatamente no 7º dia UTC entre visitantes com pelo menos 7 dias
              observáveis. Sem coorte elegível, não há percentual.
            </p>
          </section>
          <section className="launch-panel">
            <h2>Regras promocionais do site</h2>
            <p>
              Separadas de XP, ligas, medalhas e regras competitivas do aplicativo. Desativadas por
              padrão.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                void send({
                  action: 'rewards',
                  enabled: f.has('enabled'),
                  rules: f.get('rules'),
                  threshold: Number(f.get('threshold')),
                  approved: f.has('approved'),
                });
              }}
            >
              <label className="consent">
                <input
                  name="enabled"
                  type="checkbox"
                  defaultChecked={data.settings?.rewardsEnabled}
                />
                Ativar recompensas promocionais
              </label>
              <label htmlFor="reward-rules">Regras aprovadas, elegibilidade e entrega</label>
              <textarea
                id="reward-rules"
                name="rules"
                maxLength={2000}
                defaultValue={data.settings?.rewardRules}
              />
              <label htmlFor="threshold">Meta de convidados verificados</label>
              <input
                id="threshold"
                name="threshold"
                type="number"
                min={1}
                max={1000}
                defaultValue={data.settings?.rewardThreshold || 5}
                required
              />
              <label className="consent">
                <input name="approved" type="checkbox" required />
                Confirmo a aprovação das regras promocionais e desta configuração.
              </label>
              <button className="button secondary" disabled={busy}>
                Salvar regras
              </button>
            </form>
          </section>
          <section className="launch-panel">
            <h2>Convites controlados para beta</h2>
            <p>
              Seleciona inscrições verificadas em ordem de inscrição, uma vez por pessoa. Prepara
              mensagens na fila, sem liberar automaticamente acesso ao aplicativo.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                void send({
                  action: 'beta',
                  limit: Number(f.get('limit')),
                  authorized: f.has('authorized'),
                });
              }}
            >
              <label htmlFor="beta-limit">Quantidade (até 50)</label>
              <input id="beta-limit" name="limit" type="number" min={1} max={50} defaultValue={5} />
              <label className="consent">
                <input name="authorized" type="checkbox" required />
                Autorizo preparar este lote de convites.
              </label>
              <button className="button secondary" disabled={busy}>
                Preparar convites beta
              </button>
            </form>
          </section>
          <section className="launch-panel">
            <h2>Comunicação opcional</h2>
            <p>
              Prepara até 50 mensagens para pessoas verificadas que autorizaram campanhas. Revise o
              público e o texto; cada envio deste formulário cria uma nova campanha.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                void send({
                  action: 'campaign',
                  subject: f.get('subject'),
                  text: f.get('text'),
                  authorized: f.has('authorized'),
                });
              }}
            >
              <label htmlFor="campaign-subject">Assunto</label>
              <input id="campaign-subject" name="subject" required maxLength={120} />
              <label htmlFor="campaign-text">Mensagem</label>
              <textarea id="campaign-text" name="text" required maxLength={2000} />
              <label className="consent">
                <input name="authorized" type="checkbox" required />
                Revisei e autorizo preparar esta campanha.
              </label>
              <button className="button secondary" disabled={busy}>
                Preparar campanha
              </button>
            </form>
          </section>
          <section className="launch-panel">
            <h2>Importação futura autorizada</h2>
            <p>
              Exporta até 10.000 inscrições verificadas com autorização individual de transferência.
              O arquivo contém dados pessoais e deve ser tratado com acesso restrito. A importação
              no futuro VYVE dependerá do sistema de destino.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                void send({ action: 'export', authorized: f.has('authorized') });
              }}
            >
              <label className="consent">
                <input name="authorized" type="checkbox" required />
                Autorizo esta exportação para a finalidade informada.
              </label>
              <button className="button secondary" disabled={busy}>
                Exportar lista autorizada
              </button>
            </form>
          </section>
          <button
            className="button secondary"
            disabled={busy}
            onClick={() => send({ action: 'logout' })}
          >
            Sair do painel
          </button>
        </>
      )}
    </div>
  );
}
