'use client';

import { PartnerOffer } from '@/types/app';
import { brl } from '@/lib/format';
import { Building2, Ticket, Zap } from 'lucide-react';
import styles from './OfferCard.module.css';

interface OfferCardProps {
  offer: PartnerOffer;
  onSelectOffer?: (offer: PartnerOffer) => void;
}

const MAX_TICKS = 20;

export function OfferCard({ offer, onSelectOffer }: OfferCardProps) {
  const soldOut = offer.stockRemaining <= 0;
  const paused = !offer.active;
  const unavailable = soldOut || paused;
  const lowStock = !unavailable && offer.stockRemaining <= 2;
  const savings = offer.originalPrice - offer.discountPrice;

  const ticks = Math.max(1, Math.min(offer.stockLimit, MAX_TICKS));
  const ticksOn = Math.min(
    ticks,
    Math.round((offer.stockRemaining / Math.max(offer.stockLimit, 1)) * ticks)
  );

  const cardClass = [
    styles.ticket,
    offer.isDailyOffer && !unavailable ? styles.daily : '',
    unavailable ? styles.unavailable : '',
  ].join(' ');

  const stockText = soldOut
    ? 'Cupons esgotados'
    : paused
      ? 'Oferta pausada pelo parceiro'
      : lowStock
        ? `Últimos ${offer.stockRemaining} cupons`
        : `Restam ${offer.stockRemaining} de ${offer.stockLimit} cupons`;

  return (
    <article className={cardClass} aria-label={offer.title}>
      <div className={styles.top}>
        {offer.isDailyOffer && !unavailable && (
          <p className={styles.flash}>
            <Zap size={14} aria-hidden="true" fill="currentColor" />
            Oferta relâmpago, só hoje
          </p>
        )}
        <p className={styles.partner}>
          <Building2 size={15} aria-hidden="true" />
          {offer.partnerName}
        </p>
        <h3 className={styles.title}>{offer.title}</h3>
      </div>

      <div className={styles.perf} aria-hidden="true" />

      <div className={styles.stub}>
        <div>
          <span className={styles.was}>De {brl(offer.originalPrice)}</span>
          <span className={styles.now}>{brl(offer.discountPrice)}</span>
          <span className={styles.save}>Você economiza {brl(savings)}</span>
        </div>
        <span className={styles.badge} aria-label={`${offer.discountPercentage}% de desconto`}>
          -{offer.discountPercentage}%
        </span>
      </div>

      <div className={styles.foot}>
        <div className={`${styles.stock} ${lowStock ? styles.stockLow : ''}`}>
          <div className={styles.gauge} aria-hidden="true">
            {Array.from({ length: ticks }, (_, i) => (
              <span
                key={i}
                className={`${styles.tick} ${i < ticksOn ? styles.tickOn : ''}`}
              />
            ))}
          </div>
          <span>{stockText}</span>
        </div>

        <button
          type="button"
          className={styles.cta}
          disabled={unavailable}
          onClick={() => onSelectOffer?.(offer)}
        >
          <Ticket size={20} aria-hidden="true" />
          {soldOut ? 'Esgotado' : paused ? 'Indisponível' : 'Gerar cupom'}
        </button>
      </div>
    </article>
  );
}
