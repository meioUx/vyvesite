'use client';

import { useState, type FormEvent } from 'react';

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);
    setStatus('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!response.ok) throw new Error();
      form.reset();
      setStatus('Mensagem enviada! Nossa equipe responderá pelo e-mail informado.');
    } catch {
      setStatus('Não foi possível enviar agora. Tente novamente em instantes.');
    } finally {
      setPending(false);
    }
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <label className="field">
        Seu nome
        <input
          name="name"
          placeholder="Como podemos chamar você?"
          autoComplete="name"
          required
          maxLength={100}
        />
      </label>
      <label className="field">
        Seu e-mail
        <input
          name="email"
          placeholder="voce@exemplo.com"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
        />
      </label>
      <label className="field">
        Como podemos ajudar?
        <textarea
          placeholder="Conte um pouco sobre o que você precisa..."
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
        />
      </label>
      <div hidden aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p>
        Usaremos seus dados para responder à sua solicitação.
      </p>
      <button className="button primary" type="submit" disabled={pending}>
        {pending ? 'Enviando…' : 'Enviar mensagem'}
      </button>
      <p role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
