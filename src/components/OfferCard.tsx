'use client';

import { PartnerOffer } from '@/types/app';
import { Building2, Package, Tag, TrendingDown, Flame } from 'lucide-react';

interface OfferCardProps {
  offer: PartnerOffer;
  onSelectOffer?: (offer: PartnerOffer) => void;
}

export function OfferCard({ offer, onSelectOffer }: OfferCardProps) {
  const isEsgotado = offer.stockRemaining <= 0 || !offer.active;
  const economiaEmReais = offer.originalPrice - offer.discountPrice;

  return (
    <div
      style={{
        background: offer.isDailyOffer
          ? 'linear-gradient(135deg, #121826 0%, #063726 100%)'
          : '#121826',
        border: offer.isDailyOffer ? '1px solid #00E676' : '1px solid #1F293D',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: offer.isDailyOffer
          ? '0 4px 20px rgba(0, 230, 118, 0.12)'
          : '0 4px 12px rgba(0, 0, 0, 0.25)',
        opacity: isEsgotado ? 0.55 : 1,
        transition: 'transform 0.2s ease, border-color 0.2s ease',
      }}
    >
      {offer.isDailyOffer && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 230, 118, 0.15)',
            border: '1px solid #00E676',
            color: '#00E676',
            fontSize: '11px',
            fontWeight: '700',
            padding: '4px 10px',
            borderRadius: '20px',
            width: 'fit-content',
            letterSpacing: '0.5px',
          }}
        >
          <Flame size={13} color="#00E676" />
          <span>OFERTA RELÂMPAGO • VÁLIDA HOJE</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div>
          <h4 style={{ color: '#F1F5F9', margin: 0, fontSize: '16px', fontWeight: '700', letterSpacing: '-0.2px' }}>
            {offer.title}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
            <Building2 size={14} color="#00D2FF" />
            <span style={{ color: '#CBD5E1', fontWeight: '500' }}>{offer.partnerName}</span>
          </div>
        </div>

        <span
          style={{
            background: isEsgotado ? '#334155' : 'rgba(0, 230, 118, 0.12)',
            color: isEsgotado ? '#94A3B8' : '#00E676',
            border: isEsgotado ? '1px solid #475569' : '1px solid rgba(0, 230, 118, 0.3)',
            fontSize: '12px',
            padding: '4px 10px',
            borderRadius: '20px',
            fontWeight: '800',
            whiteSpace: 'nowrap',
          }}
        >
          -{offer.discountPercentage}% OFF
        </span>
      </div>

      {/* BLOCO DE PREÇO COM ALTO CONTRASTE */}
      <div
        style={{
          background: '#090D16',
          padding: '12px 14px',
          borderRadius: '12px',
          border: '1px solid #1F293D',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <span style={{ fontSize: '11px', color: '#64748B', display: 'block', textDecoration: 'line-through' }}>
            De R$ {offer.originalPrice.toFixed(2)}
          </span>
          <span style={{ color: '#00E676', fontSize: '21px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Por R$ {offer.discountPrice.toFixed(2)}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 210, 255, 0.08)',
            border: '1px solid rgba(0, 210, 255, 0.25)',
            color: '#00D2FF',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '700',
          }}
        >
          <TrendingDown size={14} color="#00D2FF" />
          <span>Economia de R$ {economiaEmReais.toFixed(2)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: offer.stockRemaining <= 2 && offer.stockRemaining > 0 ? '#FF9F0A' : '#94A3B8' }}>
          <Package size={14} color={offer.stockRemaining <= 2 && offer.stockRemaining > 0 ? '#FF9F0A' : '#94A3B8'} />
          <span style={{ fontWeight: offer.stockRemaining <= 2 ? '600' : '400' }}>
            {isEsgotado ? 'Cupons Esgotados' : `Restam ${offer.stockRemaining} cupons`}
          </span>
        </div>

        <button
          disabled={isEsgotado}
          onClick={() => onSelectOffer?.(offer)}
          style={{
            background: isEsgotado ? '#334155' : 'linear-gradient(135deg, #00D2FF 0%, #0088FF 100%)',
            color: isEsgotado ? '#94A3B8' : '#090D16',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 18px',
            fontWeight: '800',
            cursor: isEsgotado ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: isEsgotado ? 'none' : '0 4px 14px rgba(0, 210, 255, 0.3)',
            transition: 'all 0.2s ease',
          }}
        >
          <Tag size={15} color={isEsgotado ? '#94A3B8' : '#090D16'} />
          <span>{isEsgotado ? 'Esgotado' : 'Gerar Cupom'}</span>
        </button>
      </div>
    </div>
  );
}