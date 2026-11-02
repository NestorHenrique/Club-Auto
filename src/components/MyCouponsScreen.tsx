'use client';

import { useState } from 'react';
import { ActiveCoupon } from '@/types/app';

interface MyCouponsScreenProps {
  coupons: ActiveCoupon[];
  onBack: () => void;
}

export function MyCouponsScreen({ coupons, onBack }: MyCouponsScreenProps) {
  const [filter, setFilter] = useState<'valid' | 'used' | 'expired'>('valid');

  const filteredCoupons = coupons.filter((c) => c.status === filter);

  return (
    <div style={{ background: '#1e293b', borderRadius: '8px', padding: '20px', border: '1px solid #334155' }}>
      <button
        onClick={onBack}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#38bdf8',
          cursor: 'pointer',
          marginBottom: '15px',
          fontWeight: 'bold',
        }}
      >
        ← Voltar ao Catálogo
      </button>

      <h2 style={{ color: '#f8fafc', marginBottom: '15px', fontSize: '18px' }}>🎟️ Meus Cupons</h2>

      {/* CHIPS DE FILTRO DE STATUS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={() => setFilter('valid')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            background: filter === 'valid' ? '#10b981' : '#0f172a',
            color: filter === 'valid' ? '#0f172a' : '#94a3b8',
          }}
        >
          Válidos
        </button>
        <button
          onClick={() => setFilter('used')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            background: filter === 'used' ? '#38bdf8' : '#0f172a',
            color: filter === 'used' ? '#0f172a' : '#94a3b8',
          }}
        >
          Finalizados
        </button>
        <button
          onClick={() => setFilter('expired')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            background: filter === 'expired' ? '#ef4444' : '#0f172a',
            color: filter === 'expired' ? '#fff' : '#94a3b8',
          }}
        >
          Expirados
        </button>
      </div>

      {/* LISTA DE CUPONS */}
      {filteredCoupons.length === 0 ? (
        <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', margin: '30px 0' }}>
          Nenhum cupom nesta categoria.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredCoupons.map((c) => (
            <div
              key={c.id}
              style={{
                background: '#0f172a',
                padding: '14px',
                borderRadius: '8px',
                border: '1px solid #334155',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 'bold', color: '#f8fafc', fontSize: '14px' }}>{c.offerTitle}</span>
                <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '14px' }}>
                  R$ {c.discountPrice.toFixed(2)}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>🏢 {c.partnerName}</div>

              <div
                style={{
                  background: '#1e293b',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#38bdf8', letterSpacing: '1px' }}>
                  {c.code}
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {c.status === 'valid' ? '⏳ Válido por 24h' : c.status === 'used' ? '✅ Utilizado' : '❌ Expirado'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}