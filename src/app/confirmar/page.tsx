import { Legal } from '@/components/legal';
import { Confirmation } from '@/features/waitlist/dashboard';
export const metadata = {
  title: 'Confirmar e-mail',
  robots: { index: false, follow: false },
  alternates: { canonical: '/confirmar' },
  referrer: 'no-referrer' as const,
};
export default function Page() {
  return (
    <Legal>
      <h1>Confirme sua inscrição</h1>
      <Confirmation />
    </Legal>
  );
}
