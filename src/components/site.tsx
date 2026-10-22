'use client';
import Image from 'next/image';
import { CampaignCarousel } from './campaign-carousel';
import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Menu,
  X,
  Plus,
  Minus,
  Camera,
  Zap,
  Trophy,
  Target,
  Activity,
  ScanLine,
  Check,
  MoveUpRight,
  Mountain,
  ShieldCheck,
} from 'lucide-react';
import { WaitlistForm } from '@/features/waitlist/form';
import { track } from '@/features/analytics/analytics';
import medals from '@/data/medals.json';
import { ContactForm } from './contact-form';

const nav = [
  ['Como funciona', 'como-funciona'],
  ['Desafios', 'desafios'],
  ['Ligas', 'ligas'],
  ['Medalhas', 'medalhas'],
  ['FAQ', 'faq'],
  ['Contato', 'contato'],
];
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <Link className="brand" href="/" aria-label="VYVE World início">
        <Image src="/images/wordmark.webp" width={138} height={39} alt="VYVE" priority />
        <span className="brand-complement">World</span>
      </Link>
      <nav className={open ? 'navigation open' : 'navigation'} aria-label="Navegação principal">
        {nav.map(([label, id]) => (
          <a key={id} href={`/#${id}`} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
        <Link className="button nav-cta" href="/#lista-de-espera" onClick={() => setOpen(false)}>
          Quero acesso <ArrowUpRight size={16} />
        </Link>
      </nav>
      <button
        className="menu-toggle"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="scroll-progress"
      aria-hidden="true"
      style={{ scaleX: reduced ? scrollYProgress : smooth }}
    />
  );
}
function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduced ? 0 : 0.65,
        delay: reduced ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
function Eyebrow({ children, number }: { children: React.ReactNode; number: string }) {
  return (
    <p className="eyebrow">
      <span>{number}</span> {children}
    </p>
  );
}
const modes = [
  {
    name: 'Leve',
    growth: 3,
    xp: '0,90',
    text: 'Encontre seu ritmo. Um movimento de cada vez.',
    icon: '01',
  },
  {
    name: 'Normal',
    growth: 7,
    xp: '1,00',
    text: 'O equilíbrio entre desafio e consistência.',
    icon: '02',
  },
  {
    name: 'Intenso',
    growth: 10,
    xp: '1,15',
    text: 'Mais intensidade para ir além do habitual.',
    icon: '03',
  },
  {
    name: 'Extremo',
    growth: 12,
    xp: '1,30',
    text: 'Para quem busca o próximo limite.',
    icon: '04',
  },
];
const leagues = [
  ['Ferro', '#92949a', 'O começo da jornada'],
  ['Cobre', '#e58b60', 'Primeiras conquistas'],
  ['Prata', '#c9d3e2', 'Disciplina em movimento'],
  ['Ouro', '#ffc352', 'Progresso consolidado'],
  ['Ametista', '#bb68ff', 'Disciplina e destaque'],
  ['Safira', '#548cff', 'Alta performance'],
  ['Esmeralda', '#32db9e', 'Excelência e raridade'],
  ['Diamante', '#c9e8ff', 'O topo da evolução'],
];
const availableCollections = [...new Set(medals.map((medal) => medal[3]))];
const faqs = [
  [
    'O que é o VYVE?',
    'É uma plataforma fitness gamificada: exercícios físicos reais se transformam em XP, níveis, medalhas e progressão em ligas. A vida real é onde você sobe de nível.',
  ],
  [
    'Como o aplicativo reconhece os exercícios?',
    'A câmera do celular reconhece movimentos compatíveis para contabilizar repetições ou duração. O reconhecimento tem limitações e não substitui orientação profissional nem garante a segurança ou a avaliação perfeita da postura.',
  ],
  [
    'Preciso de equipamentos?',
    'Haverá modalidades com o peso do corpo, como calistenia e mobilidade. A necessidade de equipamentos depende do desafio escolhido e será indicada no aplicativo.',
  ],
  [
    'Posso começar mesmo sendo iniciante?',
    'Sim. A primeira execução de cada exercício ajuda a definir seu ponto de partida, e a progressão dos desafios acompanha seu desempenho individual. Respeite seus limites.',
  ],
  [
    'Como funcionam os níveis e as ligas?',
    'Os níveis representam a evolução com XP permanente. As ligas têm temporadas semanais, grupos de 30 jogadores e divisões III, II e I. Os cinco melhores sobem e os cinco últimos descem, observadas as regras de proteção. O pareamento considera categoria física e compatibilidade.',
  ],
  [
    'Posso alterar a dificuldade?',
    'Sim. Você poderá alternar entre Leve, Normal, Intenso e Extremo quando quiser. Cada modo tem uma taxa de progressão e um multiplicador de XP.',
  ],
];
export function Landing() {
  const reduced = useReducedMotion();
  const [mode, setMode] = useState(1);
  const [league, setLeague] = useState(3);
  const [collection, setCollection] = useState('Consistência');
  const [faq, setFaq] = useState<number | null>(0);
  return (
    <>
      <Header />
      <ScrollProgress />
      <main id="conteudo">
        <section className="hero">
          <div className="hero-art">
            <Image
              src="/images/athlete.webp"
              alt="Atleta sob iluminação dramática alaranjada, arte oficial VYVE"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 58vw"
            />
            <div className="hero-grid" />
            <span className="image-caption">MOVIMENTO REAL. EVOLUÇÃO REAL.</span>
          </div>
          <div className="hero-content">
            <p className="launch-label">
              <span /> FITNESS ENCONTRA RPG <span className="label-divider">/</span> EM BREVE
            </p>
            <h1>
              Seu corpo é<br />o controle.
              <span>
                Sua evolução
                <br />é o jogo.
              </span>
            </h1>
            <p className="hero-description">
              Transforme movimentos reais em XP, conquiste medalhas, avance nas ligas e descubra até
              onde você pode chegar.
            </p>
            <div className="hero-actions">
              <p className="hero-download-label">Baixe o app</p>
              <a className="text-link" href="#como-funciona">
                Descubra como funciona <ArrowRight size={17} />
              </a>
            </div>
            <div className="store-badges" aria-label="Em breve na App Store e no Google Play">
              <div className="store-badge">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d="M17.05 12.54c.03 3.24 2.84 4.32 2.87 4.33-.02.08-.45 1.54-1.48 3.05-.9 1.3-1.83 2.6-3.3 2.63-1.44.03-1.9-.85-3.55-.85-1.64 0-2.16.82-3.52.88-1.42.05-2.5-1.41-3.4-2.7-1.84-2.66-3.25-7.52-1.36-10.8.94-1.63 2.62-2.66 4.44-2.69 1.39-.03 2.7.94 3.55.94.85 0 2.45-1.16 4.12-.99.7.03 2.66.28 3.92 2.12-.1.06-2.34 1.37-2.31 4.08ZM14.34 4.57c.75-.91 1.26-2.17 1.12-3.43-1.08.04-2.39.72-3.16 1.62-.69.8-1.29 2.08-1.13 3.31 1.2.09 2.42-.61 3.17-1.5Z" />
                </svg>
                <span>
                  <small>EM BREVE NA</small>
                  <strong>App Store</strong>
                </span>
              </div>
              <div className="store-badge">
                <svg viewBox="0 0 24 26" aria-hidden="true">
                  <path fill="#4285f4" d="M1 1 13 13 1 25Z" />
                  <path fill="#34a853" d="m1 1 15 8-3 4Z" />
                  <path fill="#fbbc04" d="m16 9 7 4-7 4-3-4Z" />
                  <path fill="#ea4335" d="m1 25 12-12 3 4Z" />
                </svg>
                <span>
                  <small>EM BREVE NO</small>
                  <strong>Google Play</strong>
                </span>
              </div>
            </div>
          </div>
          <div className="xp-float">
            <span className="xp-icon">
              <Zap fill="currentColor" size={21} />
            </span>
            <div>
              <span>MOVIMENTO VALIDADO</span>
              <strong>
                +120 <small>XP</small>
              </strong>
            </div>
            <span className="xp-check">
              <Check size={15} />
            </span>
          </div>
          <div className="hero-phone">
            <div className="phone-label">
              UM NOVO JEITO DE EVOLUIR <ArrowUpRight size={14} />
            </div>
            <Image
              src="/mockups/home.webp"
              alt="Interface conceitual VYVE com nível 24, XP e atributos de evolução"
              width={238}
              height={519}
              priority
            />
            <span className="demo-label">INTERFACE CONCEITUAL</span>
          </div>
          <div className="hero-bottom">
            <a href="#como-funciona">
              <ArrowDown size={16} /> EXPLORE SEU PRÓXIMO NÍVEL
            </a>
            <span>01 — INFINITAS POSSIBILIDADES</span>
          </div>
        </section>
        <div className="manifesto-strip">
          <span>
            <Zap size={18} /> MOVA-SE NO MUNDO REAL
          </span>
          <span className="strip-star">✳</span>
          <span>EVOLUA NO SEU PRÓPRIO JOGO</span>
          <span className="strip-star">✳</span>
          <span>
            <Trophy size={18} /> CADA MOVIMENTO CONTA
          </span>
          <span className="strip-star">✳</span>
        </div>

        <section id="como-funciona" className="section" data-event="how_it_works_view">
          <Reveal>
            <Eyebrow number="01">O JOGO COMEÇA EM VOCÊ</Eyebrow>
            <div className="section-heading">
              <h2>
                Você se move.
                <br />O VYVE transforma
                <br />
                isso em <em>evolução.</em>
              </h2>
              <p>
                Sem controles. Sem avatares no seu lugar.
                <br />
                Aqui, o protagonista é você — e cada
                <br className="desktop-break" /> movimento faz a história avançar.
              </p>
            </div>
          </Reveal>
          <div className="steps">
            {[
              [Target, 'Escolha seu desafio', 'Encontre atividades adequadas à sua capacidade.'],
              [Camera, 'Ative a câmera', 'O VYVE reconhece e contabiliza movimentos compatíveis.'],
              [Zap, 'Ganhe XP', 'Cada execução validada contribui para sua evolução.'],
              [Trophy, 'Suba de nível', 'Desbloqueie conquistas e avance nas ligas.'],
            ].map(([Icon, title, text], i) => {
              const StepIcon = Icon as typeof Target;
              return (
                <Reveal key={i} className="step" delay={i * 0.09}>
                  <div className="step-top">
                    <StepIcon size={27} strokeWidth={1.5} />
                    <span>0{i + 1}</span>
                  </div>
                  <h3>{title as string}</h3>
                  <p>{text as string}</p>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="section adaptive">
          <Reveal className="adaptive-visual">
            <div className="scan-photo">
              <Image
                src="/images/male-athlete.webp"
                alt="Atleta em arte oficial do VYVE"
                fill
                sizes="(max-width: 760px) 100vw, 45vw"
              />
              <div className="scan-corners">
                <ScanLine size={42} />
                <span>RECONHECIMENTO DE MOVIMENTO</span>
              </div>
            </div>
            <div className="rep-chart">
              <div>
                <span>SEU RITMO. SUA EVOLUÇÃO.</span>
                <span className="green">+7% / Normal</span>
              </div>
              <div className="bars">
                {[10, 11, 12, 13, 14].map((n, i) => (
                  <div key={n}>
                    <span>{n}</span>
                    <motion.i
                      style={{ height: `${40 + i * 17}px`, transformOrigin: 'bottom' }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : i * 0.1 }}
                    />
                    <small>S{i + 1}</small>
                  </div>
                ))}
              </div>
              <p>Repetições por sessão · exemplo ilustrativo</p>
            </div>
          </Reveal>
          <Reveal>
            <Eyebrow number="02">EVOLUÇÃO, NO SEU RITMO</Eyebrow>
            <h2>
              Seu treino
              <br />
              evolui <em>com você.</em>
            </h2>
            <p className="body-large">
              Você começa do seu ponto de partida. O VYVE aprende com suas execuções e ajusta seus
              próximos desafios conforme sua evolução.
            </p>
            <ul className="check-list">
              {[
                'Avaliação individual na primeira execução',
                'Reconhecimento de repetições e duração',
                'Progressão personalizada e ajustes automáticos',
                'Respeito ao seu ritmo, em cada etapa',
              ].map((t) => (
                <li key={t}>
                  <Check size={17} />
                  {t}
                </li>
              ))}
            </ul>
            <p className="small-disclaimer">
              O reconhecimento tem limitações e não substitui orientação profissional.
            </p>
          </Reveal>
        </section>

        <section className="section difficulty">
          <Reveal>
            <Eyebrow number="03">VOCÊ DEFINE A INTENSIDADE</Eyebrow>
            <div className="section-heading">
              <h2>
                Seu jogo.
                <br />
                <em>Sua dificuldade.</em>
              </h2>
              <p>
                Um bom desafio acompanha você.
                <br />
                Escolha seu modo e altere quando quiser.
              </p>
            </div>
          </Reveal>
          <div
            className="mode-grid"
            role="group"
            aria-label="Escolha uma dificuldade para explorar"
          >
            {modes.map((m, i) => (
              <button
                key={m.name}
                aria-pressed={mode === i}
                className={`mode-card ${mode === i ? 'selected' : ''}`}
                onClick={() => setMode(i)}
              >
                <div className="mode-top">
                  <span>{m.icon}</span>
                  {mode === i ? <Check size={18} /> : <Plus size={18} />}
                </div>
                <h3>{m.name}</h3>
                <p>{m.text}</p>
                <div className="mode-values">
                  <span>
                    PROGRESSÃO<strong>+{m.growth}%</strong>
                  </span>
                  <span>
                    XP<strong>×{m.xp}</strong>
                  </span>
                </div>
              </button>
            ))}
          </div>
          <p className="mode-result" aria-live="polite">
            <Activity size={17} /> Modo {modes[mode].name}: progressão de +{modes[mode].growth}% e
            XP ×{modes[mode].xp}. <span>O próximo passo é seu.</span>
          </p>
        </section>

        <section id="ligas" className="league-section" data-event="league_section_view">
          <div className="section">
            <Reveal>
              <Eyebrow number="04">MESMO MOVIMENTO. NOVO NÍVEL.</Eyebrow>
              <div className="section-heading">
                <h2>
                  Não basta começar.
                  <br />A próxima liga
                  <br />
                  <em>espera por você.</em>
                </h2>
                <div>
                  <p>
                    Da primeira conquista ao extraordinário.
                    <br />8 ligas. 3 divisões em cada uma.
                    <br />
                    Um novo motivo para continuar.
                  </p>
                  <span className="mini-tag">
                    III <ArrowRight size={12} /> II <ArrowRight size={12} /> I{' '}
                    <ArrowUpRight size={12} />
                  </span>
                </div>
              </div>
            </Reveal>
            <div className="leagues" role="group" aria-label="Explore as oito ligas">
              {leagues.map(([name, color], i) => (
                <button
                  style={{ '--league-color': color } as React.CSSProperties}
                  aria-pressed={league === i}
                  className={`league-item ${league === i ? 'active' : ''}`}
                  key={name}
                  onClick={() => setLeague(i)}
                >
                  <Image
                    src={`/leagues/${i}.webp`}
                    alt={`Insígnia oficial da liga ${name}`}
                    width={170}
                    height={230}
                  />
                  <span>{name}</span>
                  <small>{String(i + 1).padStart(2, '0')}</small>
                </button>
              ))}
            </div>
            <div className="league-details" aria-live="polite">
              <div>
                <span className="green">LIGA {String(league + 1).padStart(2, '0')}</span>
                <h3>
                  {leagues[league][0]} <span>/ {leagues[league][2]}</span>
                </h3>
              </div>
              <p>
                Temporadas semanais · Grupos de 30 jogadores
                <br />
                <span>5 melhores sobem. 5 últimos descem, com regras de proteção.</span>
              </p>
            </div>
            <p className="league-footnote">
              Pareamento por categoria física e critérios de compatibilidade. Cada liga possui as
              divisões III, II e I.
            </p>
          </div>
        </section>

        <section id="medalhas" className="section medal-section" data-event="medal_section_view">
          <Reveal>
            <Eyebrow number="05">CONQUISTE. COLECIONE. CONTE SUA HISTÓRIA.</Eyebrow>
            <div className="section-heading">
              <h2>
                Cada conquista
                <br />
                <em>tem uma história.</em>
              </h2>
              <p>
                60 medalhas. 12 coleções.
                <br />
                Da primeira repetição à consistência
                <br />
                que transforma quem você é.
              </p>
            </div>
          </Reveal>
          <div className="medal-tabs" role="group" aria-label="Coleção de medalhas">
            {availableCollections.map((name) => (
              <button
                key={name}
                aria-pressed={collection === name}
                onClick={() => setCollection(name)}
              >
                {name} <span>05</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={collection}
              className="medals"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -8 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
            >
              {medals
                .filter((m) => m[3] === collection)
                .map((m, position) => {
                  const index = medals.indexOf(m);
                  return (
                    <Reveal
                      key={m[0]}
                      className={`medal-card rarity-${m[2]}`}
                      delay={position * 0.065}
                    >
                      <span className="medal-number">
                        {String(index + 1).padStart(2, '0')} / 60
                      </span>
                      <Image
                        src={`/medals/official-${index}.webp`}
                        width={180}
                        height={180}
                        sizes="(max-width: 760px) 40vw, 180px"
                        alt={`Medalha oficial ${m[0]}`}
                      />
                      <h3>{m[0]}</h3>
                      <p>{m[1]}</p>
                      <span className="rarity">{m[2]}</span>
                    </Reveal>
                  );
                })}
            </motion.div>
          </AnimatePresence>
          <div className="rarities">
            <span>DA PRIMEIRA À INESQUECÍVEL</span>
            {['Comum', 'Rara', 'Épica', 'Lendária'].map((r) => (
              <span className={`rarity-${r}`} key={r}>
                <i /> {r}
              </span>
            ))}
          </div>
        </section>

        <section id="desafios" className="section challenges">
          <Reveal>
            <Eyebrow number="06">DESAFIOS SAZONAIS</Eyebrow>
            <div className="section-heading">
              <h2>
                Uma nova temporada.
                <br />
                <em>Uma nova versão de você.</em>
              </h2>
              <p>
                Jornadas com começo, evolução e conquista. Cada treino é uma missão. A consistência
                é o que faz você avançar.
              </p>
            </div>
          </Reveal>
          <CampaignCarousel />
          <p className="season-note">
            Prévia do conceito das temporadas. Calendário, desafios e recompensas serão confirmados
            antes do lançamento.
          </p>
        </section>

        <section className="progress-section">
          <div className="section progress-layout">
            <Reveal>
              <Eyebrow number="07">SEU ESFORÇO GANHA FORMA</Eyebrow>
              <h2>
                Progresso que
                <br />
                você pode ver.
                <br />
                <em>E sentir.</em>
              </h2>
              <p className="body-large">
                Muito além de números em uma tela.
                <br />
                Um registro de tudo o que você constrói.
              </p>
              <div className="progress-features">
                {[
                  'Nível RPG e XP permanente',
                  'Histórico de atividades',
                  'Evolução dos exercícios',
                  'Medalhas desbloqueadas',
                  'Progresso nas ligas',
                ].map((t, i) => (
                  <div key={t}>
                    <span>0{i + 1}</span>
                    {t}
                    <MoveUpRight size={15} />
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal className="progress-phones">
              <Image
                className="phone-back"
                src="/mockups/progress.webp"
                width={238}
                height={519}
                alt="Dashboard conceitual com gráfico ilustrativo da evolução pessoal"
              />
              <Image
                className="phone-front"
                src="/mockups/challenges.webp"
                width={238}
                height={519}
                alt="Interface conceitual dos desafios diários e recompensas de XP"
              />
              <span className="demo-label">INTERFACES E DADOS DEMONSTRATIVOS</span>
            </Reveal>
          </div>
        </section>

        <section id="lista-de-espera" className="section waitlist-section">
          <Reveal className="waitlist-copy">
            <Eyebrow number="08">SEU PRÓXIMO CAPÍTULO</Eyebrow>
            <div className="waitlist-symbol">
              <Image src="/images/icon.webp" alt="" width={86} height={86} />
              <span className="launch-label">
                <span /> EM BREVE
              </span>
            </div>
            <h2>
              Prepare-se
              <br />
              para{' '}
              <em>
                subir
                <br /> de nível.
              </em>
            </h2>
            <p className="body-large">
              O VYVE está chegando. Entre para a lista de espera e receba novidades sobre o
              lançamento.
            </p>
            <span className="waitlist-platform">
              iOS & Android <span>·</span> A vida real é onde você sobe de nível.
            </span>
          </Reveal>
          <Reveal className="form-panel">
            <div className="form-panel-title">
              <span>O PRIMEIRO MOVIMENTO É SEU</span>
              <ArrowUpRight size={22} />
            </div>
            <WaitlistForm />
            <p className="privacy-note">
              <ShieldCheck size={16} /> Seus dados são usados para comunicar novidades do VYVE.
            </p>
          </Reveal>
        </section>

        <section id="faq" className="section faq-section">
          <Reveal>
            <Eyebrow number="09">ANTES DO PRIMEIRO PASSO</Eyebrow>
            <h2>
              Boa pergunta.
              <br />
              <em>Vamos lá.</em>
            </h2>
            <p>
              Ainda tem dúvidas?
              <br />
              Seu próximo nível começa entendendo o jogo.
            </p>
          </Reveal>
          <div className="faq-list">
            {faqs.map(([question, answer], i) => (
              <div key={question} className={`faq-item ${faq === i ? 'expanded' : ''}`}>
                <h3>
                  <button
                    aria-expanded={faq === i}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-question-${i}`}
                    onClick={() => {
                      setFaq(faq === i ? null : i);
                      if (faq !== i) track('faq_open', { question: String(i + 1) });
                    }}
                  >
                    <span>{question}</span>
                    {faq === i ? <Minus size={19} /> : <Plus size={19} />}
                  </button>
                </h3>
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  className="faq-answer"
                  aria-labelledby={`faq-question-${i}`}
                  aria-hidden={faq !== i}
                  inert={faq !== i}
                >
                  <div>
                    <p>{answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section id="contato" className="section contact-section" aria-labelledby="contact-title">
          <Reveal className="contact-copy">
            <Eyebrow number="10">FALE COM A GENTE</Eyebrow>
            <h2 id="contact-title">
              Precisa de <em>ajuda?</em>
            </h2>
            <p className="body-large">
              Tem uma dúvida ou encontrou algum problema no app? Entre em contato com o suporte
              VYVE.
            </p>
            <div className="contact-topics">
              <div>
                <span className="contact-topic-icon">
                  <Activity size={20} />
                </span>
                <div>
                  <h3>App e conta</h3>
                  <p>Acesso, funcionalidades e problemas no aplicativo.</p>
                </div>
              </div>
              <div>
                <span className="contact-topic-icon">
                  <ShieldCheck size={20} />
                </span>
                <div>
                  <h3>Seus dados</h3>
                  <p>Privacidade e solicitações sobre suas informações.</p>
                </div>
              </div>
            </div>
            <div className="contact-reply-note">
              <span />A resposta chega no e-mail que você informar.
            </div>
          </Reveal>
          <Reveal className="contact-panel" delay={0.1}>
            <div className="contact-panel-heading">
              <div>
                <span>SUPORTE VYVE</span>
                <h3>Vamos conversar.</h3>
              </div>
              <ArrowUpRight size={24} aria-hidden="true" />
            </div>
            <ContactForm />
          </Reveal>
        </section>
        <div className="closing-line">
          <span>
            A VIDA REAL É ONDE VOCÊ <em>SOBE DE NÍVEL.</em>
          </span>
          <ArrowUpRight />
        </div>
      </main>
      <Footer />
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <Link className="brand" href="/" aria-label="VYVE World início">
            <Image src="/images/wordmark.webp" alt="VYVE" width={138} height={39} />
            <span className="brand-complement">World</span>
          </Link>
          <p>
            Fitness encontra RPG.
            <br />
            Cada movimento conta.
          </p>
        </div>
        <nav aria-label="Navegação do rodapé">
          {nav.map(([label, id]) => (
            <a key={id} href={`/#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <div className="footer-legal">
          <Link href="/termos">Termos de Uso</Link>
          <Link href="/contato">Contato</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} VYVE. Todos os direitos reservados.</span>
        <span>Desenvolvido por 837 Code</span>
        <span>
          MESMO MOVIMENTO. NOVO NÍVEL. <Mountain size={14} />
        </span>
      </div>
    </footer>
  );
}
