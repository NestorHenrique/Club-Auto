'use client';

import { PartnerOffer } from '@/types/app';

interface OfferCardProps {
  offer: PartnerOffer;
  onSelectOffer?: (offer: PartnerOffer) => void;
}

export function OfferCard({ offer, onSelectOffer }: OfferCardProps) {
  const isEsgotado = offer.stockRemaining <= 0 || !offer.active;

  return (
    <div
      style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        opacity: isEsgotado ? 0.6 : 1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h4 style={{ color: '#f8fafc', margin: 0, fontSize: '15px' }}>{offer.title}</h4>
        <span
          style={{
            background: isEsgotado ? '#475569' : '#065f46',
            color: isEsgotado ? '#94a3b8' : '#34d399',
            fontSize: '12px',
            padding: '2px 8px',
            borderRadius: '12px',
            fontWeight: 'bold',
          }}
        >
          -{offer.discountPercentage}%
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#94a3b8' }}>🏢 {offer.partnerName}</span>
        <span
          style={{
            fontSize: '11px',
            color: offer.stockRemaining <= 2 && offer.stockRemaining > 0 ? '#f59e0b' : '#94a3b8',
            fontWeight: offer.stockRemaining <= 2 ? 'bold' : 'normal',
          }}
        >
          {isEsgotado ? '🚫 Cupons Esgotados' : `📦 Restam ${offer.stockRemaining} cupons`}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
        <span style={{ textDecoration: 'line-through', color: '#64748b', fontSize: '13px' }}>
          R$ {offer.originalPrice.toFixed(2)}
        </span>
        <span style={{ color: '#10b981', fontSize: '18px', fontWeight: 'bold' }}>
          R$ {offer.discountPrice.toFixed(2)}
        </span>
      </div>

      <button
        disabled={isEsgotado}
        onClick={() => onSelectOffer?.(offer)}
        style={{
          marginTop: '8px',
          background: isEsgotado ? '#475569' : '#38bdf8',
          color: isEsgotado ? '#94a3b8' : '#0f172a',
          border: 'none',
          borderRadius: '6px',
          padding: '8px 12px',
          fontWeight: 'bold',
          cursor: isEsgotado ? 'not-allowed' : 'pointer',
          fontSize: '13px',
        }}
      >
        {isEsgotado ? 'Esgotado' : 'Gerar Cupom'}
      </button>
    </div>
  );
}