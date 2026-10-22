import { Header, Footer } from './site';
export function Legal({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <Header />
      <main id="conteudo" className={`section legal-page ${className}`}>
        {children}
      </main>
      <Footer />
    </>
  );
}
