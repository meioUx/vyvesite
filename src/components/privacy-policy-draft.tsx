import type { Metadata } from 'next';
import { Legal } from '@/components/legal';
export const metadata: Metadata = {
  title: 'Política de Privacidade — VYVE World',
  alternates: { canonical: '/privacidade' },
  robots: { index: false, follow: true },
};
export default function Privacy() {
  return (
    <Legal className="privacy-page">
      <header className="privacy-hero" id="privacy-top">
        <p className="eyebrow">VYVE WORLD / TRANSPARÊNCIA</p>
        <h1>
          Política de
          <br />
          <em>Privacidade.</em>
        </h1>
        <p className="privacy-intro">
          Movimento, evolução e competição. Sua privacidade faz parte da jornada.
        </p>
        <div className="privacy-meta">
          <span>
            VERSÃO <strong>1.0</strong>
          </span>
          <span>
            ATUALIZADA EM <strong>22 de outubro de 2026</strong>
          </span>
        </div>
        <div className="privacy-draft">
          <span className="privacy-status">EM REVISÃO</span>
          <p>Minuta para validação jurídica e técnica antes da publicação.</p>
        </div>
      </header>
      <div className="privacy-layout">
        <aside className="privacy-sidebar">
          <nav aria-label="Índice da política de privacidade">
            <p>NESTA PÁGINA</p>
            <a href="#privacy-1">
              <span>01</span>Nosso compromisso com sua privacidade
            </a>
            <a href="#privacy-2">
              <span>02</span>Quem é responsável pelos seus dados
            </a>
            <a href="#privacy-3">
              <span>03</span>Quais dados podemos coletar
            </a>
            <a href="#privacy-4">
              <span>04</span>Para que utilizamos seus dados
            </a>
            <a href="#privacy-5">
              <span>05</span>Bases legais para tratamento
            </a>
            <a href="#privacy-6">
              <span>06</span>Gamificação, rankings e competições
            </a>
            <a href="#privacy-7">
              <span>07</span>Progressão automática e decisões automatizadas
            </a>
            <a href="#privacy-8">
              <span>08</span>Compartilhamento de dados
            </a>
            <a href="#privacy-9">
              <span>09</span>Armazenamento e segurança
            </a>
            <a href="#privacy-10">
              <span>10</span>Cookies, identificadores e analytics
            </a>
            <a href="#privacy-11">
              <span>11</span>Comunicações e notificações
            </a>
            <a href="#privacy-12">
              <span>12</span>Prazo de armazenamento dos dados
            </a>
            <a href="#privacy-13">
              <span>13</span>Seus direitos como titular
            </a>
            <a href="#privacy-14">
              <span>14</span>Exclusão da conta e dos dados
            </a>
            <a href="#privacy-15">
              <span>15</span>Transferência internacional de dados
            </a>
            <a href="#privacy-16">
              <span>16</span>Privacidade de crianças e adolescentes
            </a>
            <a href="#privacy-17">
              <span>17</span>Informações públicas e interação entre participantes
            </a>
            <a href="#privacy-18">
              <span>18</span>Links e serviços externos
            </a>
            <a href="#privacy-19">
              <span>19</span>Alterações desta política
            </a>
            <a href="#privacy-20">
              <span>20</span>Como entrar em contato
            </a>
          </nav>
          <a className="privacy-help" href="/contato">
            Precisa de ajuda? <span>Fale com a gente ↗</span>
          </a>
        </aside>
        <article className="privacy-content">
          <section className="privacy-section" id="privacy-1">
            <h2>
              <span>01</span>Nosso compromisso com sua privacidade
            </h2>
            <p>
              Bem-vindo ao <strong>VYVE World</strong>.
            </p>
            <p>
              O VYVE World é uma plataforma de experiências fitness gamificadas que combina
              atividade física, desafios, competições, evolução individual e interação entre
              participantes.
            </p>
            <p>
              Acreditamos que a tecnologia deve incentivar o movimento, a superação e a construção
              de hábitos saudáveis, respeitando a privacidade e a autonomia de cada pessoa.
            </p>
            <p>
              Esta Política de Privacidade explica quais dados pessoais podemos coletar, como são
              utilizados, quando podem ser compartilhados, por quanto tempo são armazenados e quais
              direitos você possui.
            </p>
            <p>
              O tratamento de dados pessoais observa a Lei Geral de Proteção de Dados Pessoais (LGPD
              — Lei nº 13.709/2018) e demais normas aplicáveis.
            </p>
            <p>
              Esta política abrange o site, a lista de espera, o aplicativo móvel e os serviços
              digitais associados ao VYVE World, conforme as funcionalidades efetivamente
              disponibilizadas.
            </p>
          </section>
          <section className="privacy-section" id="privacy-2">
            <h2>
              <span>02</span>Quem é responsável pelos seus dados
            </h2>
            <p>O responsável pelas decisões sobre o tratamento dos dados pessoais é:</p>
            <p>
              <strong>Controlador:</strong> [Nome completo ou razão social]
              <br />
              <strong>CPF/CNPJ:</strong> [Informar conforme aplicável]
              <br />
              <strong>País de estabelecimento:</strong> Brasil
              <br />
              <strong>Canal de privacidade:</strong>{' '}
              <a href="mailto:contato@vyve.world">contato@vyve.world</a>
              <br />
              <strong>Encarregado ou canal responsável:</strong> [Identificar conforme as exigências
              legais aplicáveis]
            </p>
            <p>
              O controlador define as finalidades e os meios essenciais de tratamento dos dados
              pessoais.
            </p>
            <p>
              Prestadores de serviços tecnológicos podem atuar como operadores de dados, conforme
              suas atribuições e os contratos estabelecidos.
            </p>
          </section>
          <section className="privacy-section" id="privacy-3">
            <h2>
              <span>03</span>Quais dados podemos coletar
            </h2>
            <p>
              Coletamos apenas as informações necessárias às funcionalidades utilizadas, às
              finalidades informadas e às obrigações legais aplicáveis.
            </p>
            <h3>3.1. Cadastro e identificação</h3>
            <p>Conforme o serviço utilizado, podemos tratar:</p>
            <ul>
              <li>Nome e nome de usuário;</li>
              <li>Endereço de e-mail;</li>
              <li>Identificador da conta;</li>
              <li>Credenciais de autenticação e informações necessárias à segurança do acesso;</li>
              <li>Fotografia de perfil, quando fornecida;</li>
              <li>Preferências de comunicação;</li>
              <li>Data de nascimento ou faixa etária, caso necessária à elegibilidade;</li>
              <li>Data de criação, confirmação e atualização da conta.</li>
            </ul>
            <p>
              O fornecimento de informações opcionais não será exigido para funcionalidades que não
              dependam delas.
            </p>
            <h3>3.2. Lista de espera e indicações</h3>
            <p>Para administrar o acesso antecipado ao VYVE World, podemos coletar:</p>
            <ul>
              <li>E-mail e nome opcional;</li>
              <li>Data de inscrição e confirmação;</li>
              <li>Código individual de indicação;</li>
              <li>Identificação da indicação que originou a inscrição;</li>
              <li>Quantidade de convidados que confirmaram participação;</li>
              <li>Preferências e registros de consentimento;</li>
              <li>Informações de origem de campanha, quando disponíveis.</li>
            </ul>
            <p>
              Esses dados são utilizados para administrar a lista de espera, validar inscrições,
              evitar abusos e executar as regras divulgadas de indicação e acesso antecipado.
            </p>
            <p>
              A participação em comunicações promocionais é opcional e não condiciona a inscrição na
              lista de espera.
            </p>
            <h3>3.3. Atividades físicas e desempenho</h3>
            <p>Durante o uso das funcionalidades fitness, poderemos tratar informações como:</p>
            <ul>
              <li>Modalidades e exercícios escolhidos;</li>
              <li>Treinos iniciados e concluídos;</li>
              <li>Repetições, duração, distância e frequência das atividades;</li>
              <li>Histórico de execução;</li>
              <li>Metas e evolução individual;</li>
              <li>Nível de dificuldade selecionado;</li>
              <li>Pontuação, experiência (XP), conquistas e recompensas;</li>
              <li>Participação em desafios, campanhas, rodadas e temporadas;</li>
              <li>Resultados competitivos e posições em rankings.</li>
            </ul>
            <p>
              Essas informações permitem acompanhar a evolução do participante, personalizar
              desafios e executar as regras do jogo.
            </p>
            <p>
              Dependendo do contexto, informações relacionadas à atividade física poderão revelar
              aspectos da saúde do usuário e receberão as salvaguardas aplicáveis aos dados pessoais
              sensíveis.
            </p>
            <h3>3.4. Câmera e análise de movimentos</h3>
            <p>
              Determinadas funcionalidades do VYVE World poderão utilizar a câmera do dispositivo
              para analisar movimentos durante a execução de exercícios.
            </p>
            <p>
              Essa tecnologia poderá ser utilizada para identificar movimentos, contabilizar
              repetições, acompanhar a execução e calcular resultados de atividades.
            </p>
            <p>
              O acesso à câmera dependerá da permissão concedida no dispositivo e será limitado às
              funcionalidades que necessitem desse recurso.
            </p>
            <p>
              <strong>Antes da ativação da análise por câmera, o aplicativo informará:</strong>
            </p>
            <ul>
              <li>
                Se o processamento ocorre exclusivamente no dispositivo ou também em servidores;
              </li>
              <li>Se imagens, vídeos ou representações corporais são transmitidos;</li>
              <li>Se algum conteúdo visual é armazenado e por quanto tempo;</li>
              <li>Se serviços de terceiros participam do processamento;</li>
              <li>Quais dados derivados da análise são conservados.</li>
            </ul>
            <p className="privacy-pending">
              <strong>
                [PENDENTE DE VALIDAÇÃO TÉCNICA: descrever o funcionamento efetivo da análise de
                movimentos.]
              </strong>
            </p>
            <p>
              A autorização para utilizar a câmera poderá ser alterada nas configurações do
              dispositivo.
            </p>
            <p>
              A revogação da permissão poderá impedir o funcionamento de recursos que dependam
              diretamente da câmera.
            </p>
            <p>
              A utilização da câmera para contagem de exercícios não significa, por si só, que o
              aplicativo realize reconhecimento facial ou identificação biométrica. Caso essas
              tecnologias sejam implementadas, suas finalidades, bases legais e salvaguardas serão
              informadas previamente.
            </p>
            <p>
              Imagens ou vídeos não serão utilizados para treinamento de modelos de inteligência
              artificial para finalidades distintas sem base legal apropriada e informação prévia ao
              usuário.
            </p>
            <h3>3.5. Informações técnicas e de utilização</h3>
            <p>Para manter a segurança e o funcionamento dos serviços, poderemos tratar:</p>
            <ul>
              <li>Endereço IP e identificadores técnicos;</li>
              <li>Tipo de dispositivo, sistema operacional e versão do aplicativo;</li>
              <li>Eventos de autenticação;</li>
              <li>Registros de falhas e erros;</li>
              <li>Informações de sessão;</li>
              <li>Dados necessários à prevenção de fraudes;</li>
              <li>Registros de utilização e desempenho técnico.</li>
            </ul>
            <p>
              Essas informações serão utilizadas conforme a necessidade de cada finalidade,
              observados os princípios de minimização, segurança e retenção limitada.
            </p>
            <h3>3.6. Dados de pagamentos</h3>
            <p>
              Caso sejam disponibilizados planos pagos, campanhas especiais, inscrições, produtos
              físicos ou outras funcionalidades comerciais, poderão ser tratados:
            </p>
            <ul>
              <li>Identificação da compra;</li>
              <li>Produto ou serviço adquirido;</li>
              <li>Valor, moeda e situação do pagamento;</li>
              <li>Histórico de transações;</li>
              <li>Dados necessários à emissão de documentos fiscais e ao atendimento.</li>
            </ul>
            <p>Os pagamentos poderão ser processados por plataformas externas.</p>
            <p className="privacy-pending">
              <strong>
                [PENDENTE: identificar os processadores de pagamento e esclarecer quais dados
                financeiros são acessíveis ao VYVE World.]
              </strong>
            </p>
            <h3>3.7. Localização</h3>
            <p>
              Algumas atividades, como corrida e desafios baseados em percurso, poderão utilizar
              dados de localização quando essa funcionalidade estiver disponível.
            </p>
            <p>
              O acesso à localização precisa dependerá de autorização específica do dispositivo.
            </p>
            <p>
              O aplicativo deverá informar quando a localização for coletada, se será armazenada,
              quem poderá visualizá-la e se será compartilhada em desafios ou rankings.
            </p>
            <p className="privacy-pending">
              <strong>
                [PENDENTE: confirmar se haverá coleta de GPS, armazenamento de rotas e
                compartilhamento de percursos.]
              </strong>
            </p>
          </section>
          <section className="privacy-section" id="privacy-4">
            <h2>
              <span>04</span>Para que utilizamos seus dados
            </h2>
            <p>Os dados pessoais poderão ser utilizados para as seguintes finalidades:</p>
            <div className="legal-table">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Finalidade</th>
                    <th scope="col">Exemplos de utilização</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Gestão de contas</td>
                    <td>Criar contas, autenticar usuários e recuperar acessos</td>
                  </tr>
                  <tr>
                    <td>Funcionamento do jogo</td>
                    <td>Registrar treinos, calcular XP, aplicar regras e acompanhar temporadas</td>
                  </tr>
                  <tr>
                    <td>Personalização</td>
                    <td>Ajustar desafios e progressões conforme desempenho e preferências</td>
                  </tr>
                  <tr>
                    <td>Competições</td>
                    <td>Gerenciar inscrições, resultados, classificações e eliminações</td>
                  </tr>
                  <tr>
                    <td>Segurança</td>
                    <td>Prevenir fraudes, acessos indevidos e manipulação de resultados</td>
                  </tr>
                  <tr>
                    <td>Suporte</td>
                    <td>Responder solicitações e solucionar problemas</td>
                  </tr>
                  <tr>
                    <td>Comunicações operacionais</td>
                    <td>Informar alterações relevantes, segurança e funcionamento dos serviços</td>
                  </tr>
                  <tr>
                    <td>Marketing opcional</td>
                    <td>Enviar campanhas, novidades e ofertas mediante base legal apropriada</td>
                  </tr>
                  <tr>
                    <td>Análise de utilização</td>
                    <td>Compreender o funcionamento do produto e melhorar a experiência</td>
                  </tr>
                  <tr>
                    <td>Obrigações legais</td>
                    <td>
                      Cumprir exigências fiscais, regulatórias e determinações legalmente válidas
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Não utilizaremos dados pessoais para finalidades incompatíveis com aquelas informadas
              sem observar os requisitos legais aplicáveis.
            </p>
          </section>
          <section className="privacy-section" id="privacy-5">
            <h2>
              <span>05</span>Bases legais para tratamento
            </h2>
            <p>
              O tratamento de dados pessoais será realizado mediante base legal adequada à
              finalidade e à natureza dos dados.
            </p>
            <p>Conforme o caso, poderão ser aplicáveis:</p>
            <p>
              <strong>Execução de contrato ou procedimentos preliminares:</strong> para criação de
              contas, fornecimento das funcionalidades solicitadas e administração de serviços
              contratados.
            </p>
            <p>
              <strong>Cumprimento de obrigação legal ou regulatória:</strong> para atender
              exigências legais, fiscais e regulatórias.
            </p>
            <p>
              <strong>Legítimo interesse:</strong> quando legalmente cabível, para finalidades como
              segurança, prevenção de abusos e melhoria dos serviços, mediante avaliação da
              necessidade e dos direitos dos titulares.
            </p>
            <p>
              <strong>Consentimento:</strong> quando necessário para funcionalidades ou tratamentos
              opcionais, como determinadas comunicações promocionais, tecnologias de rastreamento e
              tratamentos específicos.
            </p>
            <p>
              <strong>Exercício regular de direitos:</strong> quando necessário à proteção de
              direitos em processos judiciais, administrativos ou arbitrais.
            </p>
            <p>
              Dados pessoais sensíveis, quando tratados, estarão sujeitos às hipóteses legais
              específicas do artigo 11 da LGPD, incluindo consentimento específico e destacado
              quando essa for a base legal aplicável.
            </p>
            <p>
              O VYVE World não utilizará legítimo interesse como fundamento para o tratamento de
              dados pessoais sensíveis.
            </p>
            <p>
              A base legal aplicável a cada operação deverá ser documentada e refletir o
              funcionamento real do serviço.
            </p>
          </section>
          <section className="privacy-section" id="privacy-6">
            <h2>
              <span>06</span>Gamificação, rankings e competições
            </h2>
            <p>
              O VYVE World utiliza elementos de gamificação para incentivar a participação e a
              evolução dos jogadores.
            </p>
            <p>Esses recursos podem envolver:</p>
            <ul>
              <li>Pontuação por atividades concluídas;</li>
              <li>Evolução de níveis;</li>
              <li>Conquistas e medalhas digitais;</li>
              <li>Classificações individuais e coletivas;</li>
              <li>Participação em equipes, desafios e temporadas;</li>
              <li>Regras de classificação, progressão e eliminação.</li>
            </ul>
            <p>
              A participação em funcionalidades competitivas poderá exigir a divulgação de
              determinadas informações aos demais participantes.
            </p>
            <p>
              Conforme as configurações e regras de cada modalidade, poderão ser exibidos nome
              público, avatar, pontuação, nível, conquistas e classificação.
            </p>
            <p>
              <strong>
                Antes da participação, serão informados os dados que ficarão visíveis, o público que
                poderá acessá-los e as opções de privacidade disponíveis.
              </strong>
            </p>
            <p>
              Informações sensíveis, imagens capturadas pela câmera e dados privados de saúde não
              serão publicados em rankings sem fundamento legal apropriado e informação clara ao
              titular.
            </p>
          </section>
          <section className="privacy-section" id="privacy-7">
            <h2>
              <span>07</span>Progressão automática e decisões automatizadas
            </h2>
            <p>
              O VYVE World poderá utilizar mecanismos automatizados para ajustar desafios e calcular
              resultados.
            </p>
            <p>
              Esses mecanismos poderão considerar informações como histórico de execução,
              frequência, desempenho e dificuldade selecionada.
            </p>
            <p>
              A progressão poderá modificar a quantidade de repetições, a duração ou a complexidade
              dos exercícios, conforme regras divulgadas ao participante.
            </p>
            <p>
              Também poderão existir mecanismos automatizados de cálculo de pontuação, classificação
              e eliminação competitiva.
            </p>
            <p>
              O usuário poderá solicitar informações sobre os critérios e procedimentos utilizados e
              exercer, quando cabível, o direito de solicitar revisão de decisões tomadas unicamente
              com base no tratamento automatizado de dados pessoais que afetem seus interesses.
            </p>
            <p>
              Os mecanismos de progressão não constituem diagnóstico médico ou prescrição
              individualizada de exercícios.
            </p>
          </section>
          <section className="privacy-section" id="privacy-8">
            <h2>
              <span>08</span>Compartilhamento de dados
            </h2>
            <p>
              O VYVE World poderá compartilhar dados pessoais com prestadores de serviços
              necessários ao funcionamento da plataforma, conforme a finalidade e a base legal
              aplicáveis.
            </p>
            <p>Esses serviços poderão incluir:</p>
            <ul>
              <li>Hospedagem e infraestrutura;</li>
              <li>Banco de dados e armazenamento;</li>
              <li>Autenticação;</li>
              <li>Envio de e-mails e notificações;</li>
              <li>Monitoramento de erros;</li>
              <li>Análise de utilização;</li>
              <li>Processamento de pagamentos;</li>
              <li>Serviços de processamento de movimentos, quando utilizados;</li>
              <li>Serviços de atendimento e suporte.</li>
            </ul>
            <p>
              O compartilhamento deverá ser limitado aos dados necessários para a prestação do
              serviço correspondente.
            </p>
            <p>
              Também poderão ocorrer compartilhamentos quando exigidos por lei, ordem judicial ou
              autoridade competente, observados os requisitos legais.
            </p>
            <p className="privacy-pending">
              <strong>
                [PENDENTE: incluir a identificação dos principais fornecedores, categorias de dados
                compartilhados, finalidades e respectivos papéis.]
              </strong>
            </p>
            <p>
              Não comercializaremos listas de e-mails ou dados pessoais de participantes com
              terceiros para utilização independente em campanhas publicitárias.
            </p>
          </section>
          <section className="privacy-section" id="privacy-9">
            <h2>
              <span>09</span>Armazenamento e segurança
            </h2>
            <p>
              Adotaremos medidas técnicas e administrativas proporcionais aos riscos envolvidos no
              tratamento dos dados pessoais.
            </p>
            <p>Conforme a arquitetura efetivamente implementada, essas medidas poderão incluir:</p>
            <ul>
              <li>Controle de acesso por autorização;</li>
              <li>Proteção das comunicações;</li>
              <li>Proteção de credenciais;</li>
              <li>Segregação de ambientes;</li>
              <li>Monitoramento de eventos de segurança;</li>
              <li>Políticas de atualização e correção de vulnerabilidades;</li>
              <li>Rotinas de backup e recuperação;</li>
              <li>Restrição de acesso a dados sensíveis;</li>
              <li>Procedimentos de resposta a incidentes.</li>
            </ul>
            <p>Nenhuma plataforma digital pode garantir segurança absoluta.</p>
            <p>
              Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos
              titulares, serão adotadas as medidas de contenção, investigação e comunicação exigidas
              pela legislação e pela regulamentação aplicável.
            </p>
          </section>
          <section className="privacy-section" id="privacy-10">
            <h2>
              <span>10</span>Cookies, identificadores e analytics
            </h2>
            <p>
              O site e o aplicativo poderão utilizar tecnologias de armazenamento local e
              identificação para permitir o funcionamento dos serviços e compreender sua utilização.
            </p>
            <p>Essas tecnologias poderão ser classificadas em:</p>
            <p>
              <strong>Essenciais:</strong> necessárias para autenticação, manutenção de sessões,
              segurança e funcionalidades solicitadas.
            </p>
            <p>
              <strong>Analíticas:</strong> utilizadas para compreender padrões de utilização e
              melhorar o produto.
            </p>
            <p>
              <strong>Marketing:</strong> utilizadas para medir campanhas e comunicações
              promocionais, quando implementadas.
            </p>
            <p>
              As tecnologias não essenciais sujeitas a consentimento somente serão ativadas após
              autorização válida.
            </p>
            <p>
              O usuário poderá rejeitar tecnologias opcionais sem perder o acesso às funcionalidades
              essenciais.
            </p>
            <h3>Analytics da lista de espera</h3>
            <p>
              A lista de espera poderá utilizar identificadores pseudônimos para mensuração interna,
              sem vinculação direta ao cadastro, conforme a implementação descrita.
            </p>
            <p>
              O histórico analítico interno terá retenção de até 90 dias, conforme o mecanismo
              previsto.
            </p>
            <p>
              Quando o Google Analytics estiver configurado, sua ativação dependerá da autorização
              aplicável. Nome e e-mail informados no formulário não deverão ser enviados ao serviço.
            </p>
            <p>
              A configuração deverá impedir o envio de parâmetros de URL que possam expor
              informações pessoais.
            </p>
            <p>
              A retirada do consentimento impedirá novas coletas baseadas nessa autorização, sem
              prejuízo do tratamento anterior realizado licitamente e das obrigações legais
              aplicáveis.
            </p>
            <p className="privacy-pending">
              <strong>
                [PENDENTE: confirmar os SDKs de analytics e publicidade do aplicativo, os
                identificadores utilizados e seus prazos de retenção.]
              </strong>
            </p>
          </section>
          <section className="privacy-section" id="privacy-11">
            <h2>
              <span>11</span>Comunicações e notificações
            </h2>
            <p>Poderemos enviar comunicações necessárias à operação dos serviços, incluindo:</p>
            <ul>
              <li>Confirmação de cadastro;</li>
              <li>Recuperação de acesso;</li>
              <li>Alertas de segurança;</li>
              <li>Alterações relevantes nos serviços;</li>
              <li>Informações sobre inscrições e competições;</li>
              <li>Avisos relacionados a compras e pagamentos.</li>
            </ul>
            <p>
              Mensagens promocionais, campanhas e novidades opcionais serão enviadas conforme a base
              legal aplicável e as preferências registradas.
            </p>
            <p>
              O usuário poderá cancelar comunicações promocionais pelos mecanismos disponibilizados
              nas mensagens ou nas configurações da conta.
            </p>
            <p>
              A desativação de comunicações promocionais não impede o envio de mensagens
              estritamente necessárias à prestação dos serviços.
            </p>
          </section>
          <section className="privacy-section" id="privacy-12">
            <h2>
              <span>12</span>Prazo de armazenamento dos dados
            </h2>
            <p>
              Os dados pessoais serão conservados pelo período necessário às finalidades informadas,
              respeitadas as obrigações legais e as hipóteses autorizadas pela LGPD.
            </p>
            <p>Para a lista de espera, aplicam-se os seguintes critérios previstos:</p>
            <div className="legal-table">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Categoria</th>
                    <th scope="col">Prazo ou critério</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Inscrições não confirmadas</td>
                    <td>Exclusão após 30 dias</td>
                  </tr>
                  <tr>
                    <td>Mensagens pendentes da lista de espera</td>
                    <td>Remoção após 7 dias, conforme rotina implementada</td>
                  </tr>
                  <tr>
                    <td>Histórico analítico interno</td>
                    <td>Até 90 dias</td>
                  </tr>
                  <tr>
                    <td>Tokens e sessões</td>
                    <td>Até sua expiração técnica</td>
                  </tr>
                  <tr>
                    <td>Inscrições confirmadas</td>
                    <td>
                      Até a exclusão, encerramento da finalidade ou prazo final a ser definido
                    </td>
                  </tr>
                  <tr>
                    <td>Dados do aplicativo</td>
                    <td>[Definir por categoria]</td>
                  </tr>
                  <tr>
                    <td>Registros de atividades e competições</td>
                    <td>[Definir]</td>
                  </tr>
                  <tr>
                    <td>Imagens e dados derivados da câmera</td>
                    <td>[Definir conforme arquitetura]</td>
                  </tr>
                  <tr>
                    <td>Dados de pagamentos</td>
                    <td>[Definir conforme obrigações legais]</td>
                  </tr>
                  <tr>
                    <td>Backups</td>
                    <td>[Definir ciclo de retenção e eliminação]</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Ao término do tratamento, os dados serão eliminados ou anonimizados, ressalvadas as
              hipóteses legais que autorizem sua conservação.
            </p>
            <p className="privacy-pending">
              <strong>
                [PENDENTE: aprovar os prazos de retenção do aplicativo antes de disponibilizá-lo ao
                público.]
              </strong>
            </p>
          </section>
          <section className="privacy-section" id="privacy-13">
            <h2>
              <span>13</span>Seus direitos como titular
            </h2>
            <p>
              Nos termos da LGPD, você poderá exercer os direitos aplicáveis ao tratamento de seus
              dados pessoais, incluindo:
            </p>
            <ol>
              <li>Confirmar a existência de tratamento de seus dados;</li>
              <li>Solicitar acesso às informações;</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
              <li>
                Solicitar anonimização, bloqueio ou eliminação de dados desnecessários, excessivos
                ou tratados em desconformidade com a lei;
              </li>
              <li>Solicitar portabilidade, observada a regulamentação aplicável;</li>
              <li>
                Solicitar informações sobre compartilhamento com entidades públicas e privadas;
              </li>
              <li>
                Solicitar eliminação de dados tratados com consentimento, ressalvadas as hipóteses
                legais;
              </li>
              <li>Revogar consentimentos concedidos;</li>
              <li>
                Obter informações sobre a possibilidade de negar consentimento e suas consequências;
              </li>
              <li>Opor-se a tratamentos nas hipóteses previstas em lei;</li>
              <li>Solicitar revisão de decisões automatizadas, quando aplicável;</li>
              <li>Apresentar petição à Autoridade Nacional de Proteção de Dados (ANPD).</li>
            </ol>
            <p>O exercício desses direitos é gratuito.</p>
            <p>
              Para proteger suas informações, poderemos solicitar confirmação de identidade
              proporcional à natureza da solicitação.
            </p>
            <p>
              Os pedidos serão atendidos nos prazos previstos na legislação e regulamentação
              aplicáveis.
            </p>
          </section>
          <section className="privacy-section" id="privacy-14">
            <h2>
              <span>14</span>Exclusão da conta e dos dados
            </h2>
            <p>
              Você poderá solicitar a exclusão de sua conta e dos dados pessoais associados pelos
              mecanismos disponibilizados na plataforma ou pelo canal de privacidade.
            </p>
            <p>
              Na lista de espera, o painel do participante poderá permitir a exclusão mediante
              confirmação de e-mail e ação expressa.
            </p>
            <p>
              A exclusão poderá abranger dados da base ativa, registros de inscrição, sessões,
              tokens e informações associadas, conforme a funcionalidade implementada.
            </p>
            <p>
              Determinadas informações poderão permanecer temporariamente em backups ou ser
              conservadas quando houver fundamento legal para tanto.
            </p>
            <p>
              Nesses casos, serão aplicadas restrições de acesso e critérios de retenção compatíveis
              com a finalidade remanescente.
            </p>
            <p>
              A exclusão da conta poderá resultar na perda de histórico de treinos, XP, conquistas,
              inscrições e outros recursos vinculados ao perfil.
            </p>
            <p>
              Antes da confirmação, o usuário deverá ser informado das consequências relevantes da
              exclusão.
            </p>
          </section>
          <section className="privacy-section" id="privacy-15">
            <h2>
              <span>15</span>Transferência internacional de dados
            </h2>
            <p>
              Alguns fornecedores tecnológicos poderão utilizar infraestrutura localizada fora do
              Brasil.
            </p>
            <p>
              Quando houver transferência internacional de dados pessoais, serão observados os
              mecanismos e as garantias exigidos pela LGPD e pela regulamentação da ANPD.
            </p>
            <p>
              O VYVE World deverá informar os países ou regiões envolvidos, as categorias de
              destinatários e os mecanismos jurídicos aplicáveis, conforme a operação realizada.
            </p>
            <p className="privacy-pending">
              <strong>
                [PENDENTE: confirmar localização da infraestrutura, fornecedores internacionais e
                mecanismos de transferência.]
              </strong>
            </p>
          </section>
          <section className="privacy-section" id="privacy-16">
            <h2>
              <span>16</span>Privacidade de crianças e adolescentes
            </h2>
            <p>
              O VYVE World deverá estabelecer critérios de elegibilidade etária compatíveis com suas
              funcionalidades e com a legislação aplicável.
            </p>
            <p>
              O tratamento de dados pessoais de crianças e adolescentes deverá observar seu melhor
              interesse e as exigências legais específicas.
            </p>
            <p>
              Caso sejam permitidas contas de crianças, serão adotados os mecanismos necessários à
              observância do artigo 14 da LGPD, incluindo consentimento específico e em destaque de
              pelo menos um dos pais ou responsável legal quando exigido.
            </p>
            <p>
              Funcionalidades públicas, rankings, interações sociais, localização e compartilhamento
              de imagens deverão ser avaliados considerando os riscos próprios desse público.
            </p>
            <p className="privacy-pending">
              <strong>
                [PENDENTE: definir idade mínima, política de participação de menores e mecanismos de
                verificação e autorização.]
              </strong>
            </p>
          </section>
          <section className="privacy-section" id="privacy-17">
            <h2>
              <span>17</span>Informações públicas e interação entre participantes
            </h2>
            <p>
              O VYVE World poderá oferecer recursos de interação, competição e participação
              coletiva.
            </p>
            <p>
              Determinadas informações de perfil e desempenho poderão ser disponibilizadas aos
              demais participantes, conforme as regras e configurações de privacidade de cada
              funcionalidade.
            </p>
            <p>
              Antes da publicação, serão informados os dados visíveis e o alcance da divulgação.
            </p>
            <p>
              O participante não deverá publicar dados pessoais de terceiros sem autorização ou
              fundamento legal adequado.
            </p>
            <p>
              O VYVE World poderá adotar medidas de moderação e proteção para prevenir exposição
              indevida de informações pessoais.
            </p>
          </section>
          <section className="privacy-section" id="privacy-18">
            <h2>
              <span>18</span>Links e serviços externos
            </h2>
            <p>
              O aplicativo e o site poderão conter links para plataformas externas, lojas de
              aplicativos, meios de pagamento e outros serviços.
            </p>
            <p>Esses terceiros poderão possuir políticas próprias de privacidade.</p>
            <p>Recomendamos a leitura de suas políticas antes da utilização.</p>
            <p>
              O VYVE World permanece responsável pelos tratamentos que realizar e pelas obrigações
              que lhe sejam legalmente atribuídas, inclusive em relação à contratação de prestadores
              de serviços.
            </p>
          </section>
          <section className="privacy-section" id="privacy-19">
            <h2>
              <span>19</span>Alterações desta política
            </h2>
            <p>
              Esta Política de Privacidade poderá ser atualizada para refletir mudanças legais,
              tecnológicas ou operacionais.
            </p>
            <p>A versão vigente e a data de atualização estarão disponíveis nos canais oficiais.</p>
            <p>Alterações relevantes serão comunicadas por meios adequados.</p>
            <p>
              Quando uma nova finalidade exigir consentimento, ele será solicitado antes do
              respectivo tratamento.
            </p>
            <p>
              A continuidade do uso do aplicativo não será considerada, isoladamente, consentimento
              válido para novas finalidades que dependam de autorização específica.
            </p>
          </section>
          <section className="privacy-section" id="privacy-20">
            <h2>
              <span>20</span>Como entrar em contato
            </h2>
            <p>Para dúvidas, solicitações ou exercício de direitos relacionados à privacidade:</p>
            <p>
              <strong>VYVE World — Privacidade e Proteção de Dados</strong>
            </p>
            <p>
              <strong>E-mail:</strong> <a href="mailto:contato@vyve.world">contato@vyve.world</a>
              <br />
              <strong>Site:</strong> <a href="https://vyve.world">https://vyve.world</a>
              <br />
              <strong>Controlador:</strong> [Informar]
              <br />
              <strong>Canal responsável por privacidade:</strong> [Confirmar]
            </p>
            <p>
              Também é possível obter informações sobre direitos e apresentar solicitações à
              Autoridade Nacional de Proteção de Dados pelo portal oficial:
            </p>
            <p>
              <a href="https://www.gov.br/anpd">https://www.gov.br/anpd</a>
            </p>
            <hr />
            <p>
              <strong>VYVE World</strong>
            </p>
            <p>
              <em>Movimento, evolução e competição. Sua privacidade faz parte da jornada.</em>
            </p>
            <p>
              <strong>Última atualização:</strong> 22 de outubro de 2026.
            </p>
          </section>
          <a className="privacy-back" href="#privacy-top">
            Voltar ao início ↑
          </a>
        </article>
      </div>
    </Legal>
  );
}
