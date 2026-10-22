import type { Metadata, Viewport } from 'next';
import { Analytics } from '@/features/analytics/analytics';
import { site } from '@/lib/config';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'VYVE — Sua evolução é o jogo.', template: '%s | VYVE' },
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    title: 'VYVE — Seu corpo é o controle.',
    description: site.description,
    siteName: 'VYVE',
    images: [
      { url: '/images/og.jpg', width: 1200, height: 630, alt: 'VYVE — Fitness encontra RPG' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VYVE — Sua evolução é o jogo.',
    description: site.description,
    images: ['/images/og.jpg'],
  },
  icons: { icon: '/images/icon.webp', apple: '/images/icon.webp' },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: '#15151D', width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
