import Link from 'next/link';
import { Legal } from '@/components/legal';
export default function NotFound() {
  return (
    <Legal>
      <div className="error-page">
        <p className="eyebrow">404 · FORA DA TRILHA</p>
        <h1>
          Vamos voltar
          <br />
          ao seu caminho.
        </h1>
        <p>Esta página não foi encontrada.</p>
        <Link className="button primary" href="/">
          Voltar ao início ↗
        </Link>
      </div>
    </Legal>
  );
}
