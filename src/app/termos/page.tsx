import type { Metadata } from 'next';
import { Legal } from '@/components/legal';
export const metadata: Metadata = {
  title: 'Termos de Uso — rascunho',
  alternates: { canonical: '/termos' },
  robots: { index: false, follow: true },
};
export default function Terms() {
  return (
    <Legal>
      <p className="eyebrow">INFORMAÇÕES DO SITE</p>
      <h1>Termos de Uso</h1>
      <p className="draft-notice">
        RASCUNHO PARA REVISÃO JURÍDICA. Identificação do responsável, jurisdição e condições finais
        deverão ser aprovadas antes da publicação.
      </p>
      <h2>Sobre o VYVE</h2>
      <p>
        Este site apresenta o conceito de uma plataforma fitness gamificada em preparação para
        lançamento. Interfaces, estatísticas e progressões de exemplo são demonstrativas. O
        aplicativo ainda não está disponível nas lojas. Data, preços e condições comerciais não
        foram anunciados.
      </p>
      <h2>Lista de espera</h2>
      <p>
        A inscrição é voluntária e permite receber comunicações sobre o lançamento. Não constitui
        compra, garantia de vaga, data de acesso ou compromisso de disponibilização de recursos
        específicos. O consentimento pode ser revogado.
      </p>
      <h2>Atividades físicas</h2>
      <p>
        O conteúdo tem caráter informativo. O reconhecimento de movimentos tem limitações, não
        garante segurança nem avaliação perfeita da postura e não substitui orientação de
        profissional qualificado. Respeite seus limites e procure orientação apropriada ao seu
        estado de saúde.
      </p>
      <h2>Propriedade intelectual e uso</h2>
      <p>
        As marcas e artes do VYVE são apresentadas para divulgação do produto. O visitante não deve
        usar o formulário para spam, submissões automatizadas abusivas ou dados de terceiros sem
        autorização.
      </p>
      <h2>Privacidade e alterações</h2>
      <p>
        Para informações sobre seus dados, <a href="/contato">entre em contato</a>.
        As condições finais de uso do aplicativo serão apresentadas antes de seu lançamento.
      </p>
    </Legal>
  );
}
