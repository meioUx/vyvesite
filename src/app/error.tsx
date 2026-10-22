'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="conteudo" className="section error-page">
      <h1>Algo interrompeu o caminho.</h1>
      <p>Tente carregar esta página novamente.</p>
      <button className="button primary" onClick={reset}>
        Tentar novamente
      </button>
    </main>
  );
}
