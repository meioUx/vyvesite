'use client';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpRight, CheckCircle2, LoaderCircle } from 'lucide-react';
import { waitlistSchema, type WaitlistInput } from './schema';
import { track } from '@/features/analytics/analytics';
import { acquisition } from './attribution';
export function WaitlistForm() {
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const started = useRef(false);
  useEffect(() => {
    acquisition();
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistInput>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { consent: false, website: '' },
  });
  async function submit(data: WaitlistInput) {
    setResult(null);
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          ...acquisition(),
        }),
      });
      const body = await response.json();
      setResult({ ok: response.ok, message: body.message });
      track(response.ok ? 'waitlist_submit_success' : 'waitlist_submit_error');
      if (response.ok) track('generate_lead');
    } catch {
      setResult({
        ok: false,
        message: 'Falha de conexão. Verifique sua internet e tente novamente.',
      });
      track('waitlist_submit_error');
    }
  }
  if (result?.ok)
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={44} />
        <h3>Você deu o primeiro passo.</h3>
        <p>{result.message}</p>
      </div>
    );
  return (
    <form
      onSubmit={handleSubmit(submit)}
      onFocus={() => {
        if (!started.current) {
          track('waitlist_form_start');
          started.current = true;
        }
      }}
      noValidate
    >
      <div className="field">
        <label htmlFor="name">
          Como podemos te chamar? <span>(opcional)</span>
        </label>
        <input
          id="name"
          autoComplete="given-name"
          maxLength={80}
          placeholder="Seu nome"
          {...register('name')}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p className="field-error" id="name-error">
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="email">Seu melhor e-mail</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          placeholder="voce@exemplo.com"
          {...register('email')}
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p className="field-error" id="email-error">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>
      <label className="consent">
        <input
          type="checkbox"
          {...register('consent')}
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? 'consent-error' : undefined}
        />
        <span>
          Quero participar da lista de espera e receber os e-mails necessários à inscrição. Posso excluir meus dados a qualquer momento.
        </span>
      </label>
      <label className="consent">
        <input type="checkbox" {...register('marketingConsent')} />
        <span>Também quero receber novidades e campanhas do VYVE (opcional).</span>
      </label>
      {errors.consent && (
        <p className="field-error" id="consent-error">
          {errors.consent.message}
        </p>
      )}
      <button className="button primary form-submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            Salvando <LoaderCircle className="spin" size={18} />
          </>
        ) : (
          <>
            Quero fazer parte <ArrowUpRight size={19} />
          </>
        )}
      </button>
      <p className="form-note">Sem spam. Só o próximo capítulo da sua evolução.</p>
      <p className="form-note">
        <a href="/painel">Já confirmou seu e-mail? Acesse seu painel.</a>
      </p>
      <div aria-live="polite">
        {result && (
          <p className="field-error" role="alert">
            {result.message}
          </p>
        )}
      </div>
    </form>
  );
}
