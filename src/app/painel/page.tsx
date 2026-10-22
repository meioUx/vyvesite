import { Legal } from '@/components/legal';
import { Dashboard } from '@/features/waitlist/dashboard';
export const metadata = {
  title: 'Minha lista de espera',
  robots: { index: false, follow: false },
  alternates: { canonical: '/painel' },
};
export default function Page() {
  return (
    <Legal>
      <p className="eyebrow">LISTA DE ESPERA VYVE</p>
      <h1>Seu próximo passo</h1>
      <Dashboard />
    </Legal>
  );
}
