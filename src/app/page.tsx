import { Landing } from '@/components/site';
import { site } from '@/lib/config';
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: site.name,
            url: site.url,
            description: site.description,
            inLanguage: 'pt-BR',
          }).replace(/</g, '\\u003c'),
        }}
      />
      <Landing />
    </>
  );
}
