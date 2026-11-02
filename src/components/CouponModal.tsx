'use client';

import { useState, useEffect } from 'react';
import { ActiveCoupon } from '@/types/app';

interface CouponModalProps {
  coupon: ActiveCoupon | null;
  onClose: () => void;
}

export function CouponModal({ coupon, onClose }: CouponModalProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!coupon) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(coupon.expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft('EXPIRADO');
        clearInterval(interval);
      } else {
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [coupon]);

  if (!coupon) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.75)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: '#1e293b',
          border: '1px solid #10b981',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        }}
      >
        <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>CUPOM EXCLUSIVO GERADO</span>
        <h3 style={{ color: '#f8fafc', margin: '8px 0 4px', fontSize: '18px' }}>{coupon.offerTitle}</h3>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '16px' }}>{coupon.partnerName}</p>

        <div
          style={{
            background: '#0f172a',
            border: '2px dashed #38bdf8',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>CÓDIGO DE VALIDAÇÃO</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#38bdf8', letterSpacing: '2px' }}>
            {coupon.code}
          </div>
        </div>

        <div style={{ marginBottom: '20px', background: '#334155', padding: '10px', borderRadius: '8px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>VÁLIDO POR (EXPIRA EM):</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>
            ⏳ {timeLeft || '24:00:00'}
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            background: '#10b981',
            color: '#0f172a',
            border: 'none',
            borderRadius: '6px',
            padding: '12px',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Salvar Cupom
        </button>
      </div>
    </div>
  );
}