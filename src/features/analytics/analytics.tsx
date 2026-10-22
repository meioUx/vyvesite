'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { type EventName, sourceBucket } from './events';
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
export function track(name: EventName, parameters: Record<string, string> = {}) {
  try {
    emit(name, parameters);
  } catch {
    /* Optional measurement must never interrupt a user action. */
  }
}
function emit(name: EventName, parameters: Record<string, string>) {
  if (
    localStorage.getItem('vyve-analytics-consent') !== 'yes' ||
    ['/confirmar', '/admin'].includes(location.pathname)
  )
    return;
  const tool = ['referral', 'challenge', 'achievement_card', 'league', 'medals'].includes(
    parameters.tool,
  )
    ? parameters.tool
    : undefined;
  // Never forward arbitrary parameters, query strings, codes, or form fields.
  window.gtag?.('event', name, tool ? { tool } : {});
  if (name === 'waitlist_email_verified' || name === 'referral_signup_verified') return;
  let visitor = localStorage.getItem('vyve-visitor');
  if (!visitor) {
    visitor = crypto.randomUUID();
    localStorage.setItem('vyve-visitor', visitor);
  }
  void fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      tool,
      visitor,
      consent: true,
      source: sourceBucket(new URLSearchParams(location.search).get('utm_source')),
    }),
  }).catch(() => {});
}
export function Analytics() {
  const [consent, setConsent] = useState<string | null | undefined>(undefined);
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  useEffect(() => {
    if (consent === 'yes') track('page_view');
  }, [consent]);
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setConsent(localStorage.getItem('vyve-analytics-consent')),
    );
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            track(entry.target.getAttribute('data-event') as EventName);
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.25 },
    );
    document.querySelectorAll('[data-event]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const choose = (value: string) => {
    if (value === 'no') {
      const visitor = localStorage.getItem('vyve-visitor');
      if (visitor)
        void fetch('/api/events', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitor }),
          keepalive: true,
        });
      localStorage.removeItem('vyve-visitor');
    }
    localStorage.setItem('vyve-analytics-consent', value);
    setConsent(value);
    if (value === 'no') window.location.reload();
  };
  return (
    <>
      {consent === 'yes' &&
        ga &&
        /^G-[A-Z0-9]+$/.test(ga) &&
        !['/confirmar', '/admin', '/painel'].includes(
          typeof location === 'undefined' ? '' : location.pathname,
        ) && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga-init"
              strategy="afterInteractive"
            >{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${ga}',{send_page_view:false,allow_google_signals:false,page_location:location.origin+location.pathname,page_referrer:''});gtag('event','page_view',{page_path:location.pathname,page_location:location.origin+location.pathname,page_referrer:''});`}</Script>
          </>
        )}
      {consent === null && (
        <aside className="cookie-banner" aria-label="Preferências de analytics">
          <p>
            Podemos usar analytics para entender o uso do site? Nenhum dado do formulário é enviado.
          </p>
          <button onClick={() => choose('yes')}>Permitir</button>
          <button onClick={() => choose('no')}>Recusar</button>
        </aside>
      )}
      {consent != null && (
        <button
          className="cookie-preferences"
          onClick={() => {
            const visitor = localStorage.getItem('vyve-visitor');
            if (visitor)
              void fetch('/api/events', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ visitor }),
                keepalive: true,
              });
            localStorage.removeItem('vyve-visitor');
            localStorage.removeItem('vyve-analytics-consent');
            window.location.reload();
          }}
        >
          Preferências de cookies
        </button>
      )}
    </>
  );
}
