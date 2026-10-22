import { Legal } from '@/components/legal';
import { AdminDashboard } from '@/features/waitlist/admin';
export const metadata = {
  title: 'Administração',
  robots: { index: false, follow: false },
  alternates: { canonical: '/admin' },
};
export default function Page() {
  return (
    <Legal>
      <p className="eyebrow">ACESSO RESTRITO</p>
      <h1>Painel de lançamento</h1>
      <AdminDashboard />
    </Legal>
  );
}
