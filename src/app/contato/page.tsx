import Link from 'next/link';
import type { Metadata } from 'next';
import { Legal } from '@/components/legal';
import { ContactForm } from '@/components/contact-form';
export const metadata: Metadata = { title: 'Contato', alternates: { canonical: '/contato' } };
export default function Contact() {
  return (
    <Legal>
      <p className="eyebrow">VAMOS CONVERSAR</p>
      <h1>Contato e suporte</h1>
      <p>Envie sua mensagem para o suporte VYVE. Responderemos pelo e-mail informado.</p>
      <ContactForm />
      <p>
        Para receber novidades sobre o lançamento, visite a{' '}
        <Link href="/#lista-de-espera">lista de espera</Link>.
      </p>
    </Legal>
  );
}
