'use client';

import { useState, useEffect } from 'react';
import { ActiveCoupon } from '@/types/app';
import { Clock, Ticket, Check, Building2, MapPin, Phone, Navigation } from 'lucide-react';

interface CouponModalProps {
  coupon: ActiveCoupon & { partnerAddress?: string; partnerPhone?: string } | null;
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

  const enderecoOficina = coupon.partnerAddress || 'Av. São Sebastião, 1500 - Parnaíba/PI';
  const telefoneOficina = coupon.partnerPhone || '(86) 3322-1100';

  const handleOpenGPS = () => {
    const encodedAddress = encodeURIComponent(`${coupon.partnerName} - ${enderecoOficina}`);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
  };

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
          background: '#121826',
          border: '1px solid #00E676',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <Ticket size={36} color="#00E676" />
        </div>
        <span style={{ fontSize: '11px', color: '#00E676', fontWeight: 'bold' }}>CUPOM EXCLUSIVO GERADO</span>
        <h3 style={{ color: '#F1F5F9', margin: '8px 0 4px', fontSize: '18px' }}>{coupon.offerTitle}</h3>

        <div style={{ background: '#090D16', padding: '14px', borderRadius: '10px', margin: '12px 0', textAlign: 'left', border: '1px solid #1F293D' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#00D2FF', fontWeight: 'bold', marginBottom: '8px' }}>
            <Building2 size={15} />
            <span>{coupon.partnerName}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94A3B8' }}>
              <MapPin size={14} color="#94A3B8" />
              <span>{enderecoOficina}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94A3B8', marginBottom: '12px' }}>
            <Phone size={14} color="#94A3B8" />
            <span>{telefoneOficina}</span>
          </div>

          <button
            onClick={handleOpenGPS}
            style={{
              width: '100%',
              background: 'rgba(0, 210, 255, 0.1)',
              color: '#00D2FF',
              border: '1px solid rgba(0, 210, 255, 0.3)',
              borderRadius: '8px',
              padding: '8px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Navigation size={14} />
            <span>Navegar até a Oficina (GPS)</span>
          </button>
        </div>

        <div
          style={{
            background: '#090D16',
            border: '2px dashed #00D2FF',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>CÓDIGO DE VALIDAÇÃO</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00D2FF', letterSpacing: '2px' }}>
            {coupon.code}
          </div>
        </div>

        <div style={{ marginBottom: '20px', background: '#1F293D', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Clock size={18} color="#FF9F0A" />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>VÁLIDO POR:</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF9F0A' }}>
              {timeLeft || '24:00:00'}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            background: '#00E676',
            color: '#090D16',
            border: 'none',
            borderRadius: '10px',
            padding: '12px',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Check size={18} />
          <span>Salvar Cupom</span>
        </button>
      </div>
    </div>
  );
}