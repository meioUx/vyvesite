'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useReducedMotion } from 'motion/react';

import { campaigns } from '@/data/campaigns';

export function CampaignCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  function goTo(index: number) {
    const item = track.current?.children[index] as HTMLElement | undefined;
    if (item && track.current) track.current.scrollTo({ left: item.offsetLeft - (track.current.children[0] as HTMLElement).offsetLeft, behavior: reduced ? 'instant' : 'smooth' });
  }
  return (
    <div className="campaign-carousel" role="region" aria-roledescription="carrossel" aria-label="Campanhas sazonais">
      <div className="campaign-toolbar">
        <span>ESCOLHA SUA PRÓXIMA JORNADA <small>{String(active + 1).padStart(2, '0')} / {String(campaigns.length).padStart(2, '0')}</small></span>
        <div><button type="button" aria-label="Campanha anterior" disabled={active === 0} onClick={() => goTo(active - 1)}><ArrowLeft size={19} /></button><button type="button" aria-label="Próxima campanha" disabled={active === campaigns.length - 1} onClick={() => goTo(active + 1)}><ArrowRight size={19} /></button></div>
      </div>
      <div className="campaign-track" id="campaign-track" ref={track} tabIndex={0} aria-label="Deslize para explorar as campanhas" onKeyDown={event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); goTo(Math.max(0, Math.min(campaigns.length - 1, active + (event.key === 'ArrowRight' ? 1 : -1)))); }
      }} onScroll={() => {
        if (!track.current) return;
        const first = track.current.children[0] as HTMLElement;
        const step = first.getBoundingClientRect().width + 20;
        setActive(Math.min(campaigns.length - 1, Math.round(track.current.scrollLeft / step)));
      }}>
        {campaigns.map((campaign, i) => (
          <article className={`campaign-poster campaign-${campaign.theme}`} key={campaign.title} aria-label={`${i + 1} de ${campaigns.length}: ${campaign.title}`}>
            <div className="campaign-poster-art">
              <Image src={campaign.image} alt="" fill sizes="(max-width:760px) 85vw, 360px" />
            </div>
            <div className="campaign-poster-top"><span>VYVE SEASONS / {String(i + 1).padStart(2, '0')}</span><strong>{campaign.days}</strong></div>
            <div className="campaign-poster-copy">
              <span className="campaign-tag">{campaign.tag}</span>
              <h3>{campaign.title}</h3><strong className="campaign-subtitle">{campaign.subtitle}</strong>
              <span className="campaign-detail">{campaign.detail}</span><p>{campaign.text}</p>
              <div className={`campaign-sequence${['phoenix', 'neon', 'everest', 'summer', 'bloom', 'jungle'].includes(campaign.theme) ? ' has-medal' : ''}`}>
                <small>SUA SEQUÊNCIA</small><p>{campaign.sequence}</p>
                {campaign.theme === 'phoenix' && (
                  <Image className="sequence-medal" src="/images/campaigns/phoenix-pin.webp" alt="Medalha de fênix da campanha Phoenix Rising" width={96} height={96} />
                )}
                {campaign.theme === 'neon' && (
                  <Image className="sequence-medal" src="/images/campaigns/neon-pin.webp" alt="Medalha de ampulheta da campanha Neon Rush" width={96} height={96} />
                )}
                {campaign.theme === 'everest' && (
                  <Image className="sequence-medal" src="/images/campaigns/everest-pin.webp" alt="Medalha de montanha da campanha Everest Challenge" width={96} height={96} />
                )}
                {campaign.theme === 'summer' && (
                  <Image className="sequence-medal" src="/images/campaigns/summer-pin.webp" alt="Medalha de sol da campanha Summer Challenge" width={96} height={96} />
                )}
                {campaign.theme === 'bloom' && (
                  <Image className="sequence-medal" src="/images/campaigns/bloom-pin.webp" alt="Medalha de árvore da campanha Bloom" width={96} height={96} />
                )}
                {campaign.theme === 'jungle' && (
                  <Image className="sequence-medal" src="/images/campaigns/jungle-pin.webp" alt="Medalha de broto da campanha Jungle Expedition" width={96} height={96} />
                )}
              </div>
              <span className="campaign-coming-soon">Em breve</span>
            </div>
          </article>
        ))}
      </div>
      <div className="campaign-pagination" aria-label="Selecionar campanha">{campaigns.map((campaign, i) => <button key={campaign.title} type="button" aria-label={`Ver ${campaign.title}`} aria-current={active === i ? 'true' : undefined} onClick={() => goTo(i)} />)}</div>
    </div>
  );
}
