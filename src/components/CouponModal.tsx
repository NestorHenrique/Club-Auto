'use client';

import { useState, useEffect } from 'react';
import { ActiveCoupon } from '@/types/app';
import { Clock, Check, Building2, MapPin, Phone, Navigation, Ticket } from 'lucide-react';
import styles from './CouponModal.module.css';

interface CouponModalProps {
  coupon: ActiveCoupon | null;
  onClose: () => void;
}

function formatRemaining(diff: number): string {
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return [hours, minutes, seconds].map((n) => n.toString().padStart(2, '0')).join(':');
}

export function CouponModal({ coupon, onClose }: CouponModalProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!coupon) return;

    const expiry = new Date(coupon.expiresAt).getTime();
    const tick = () => {
      const diff = expiry - Date.now();
      if (diff <= 0) {
        setTimeLeft('EXPIRADO');
        return false;
      }
      setTimeLeft(formatRemaining(diff));
      return true;
    };

    tick();
    const interval = setInterval(() => {
      if (!tick()) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [coupon]);

  if (!coupon) return null;

  const enderecoOficina = coupon.partnerAddress;
  const telefoneOficina = coupon.partnerPhone;
  const expired = timeLeft === 'EXPIRADO' || coupon.status === 'expired';

  const handleOpenGPS = () => {
    // Coordenadas do GPS têm prioridade: são exatas, mesmo sem endereço formal.
    const hasCoords = coupon.partnerLatitude != null && coupon.partnerLongitude != null;
    const query = hasCoords
      ? `${coupon.partnerLatitude},${coupon.partnerLongitude}`
      : enderecoOficina
        ? `${coupon.partnerName} - ${enderecoOficina}`
        : coupon.partnerName;
    // "dir" abre a rota a partir da posição atual do motorista até o destino.
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Cupom gerado">
      <div className={styles.ticket}>
          <span className={styles.stamp} aria-hidden="true">
            {expired ? 'EXPIRADO' : 'VÁLIDO'}
          </span>
        <div className={styles.top}>
          <p className={styles.kicker}>
            <Ticket size={18} aria-hidden="true" />
            Cupom gerado
          </p>
          <h3 className={styles.title}>{coupon.offerTitle}</h3>

          <div className={styles.shop}>
            <span className={`${styles.shopLine} ${styles.shopName}`}>
              <Building2 size={16} aria-hidden="true" />
              {coupon.partnerName}
            </span>
            {enderecoOficina && (
              <span className={styles.shopLine}>
                <MapPin size={16} aria-hidden="true" />
                {enderecoOficina}
              </span>
            )}
            {telefoneOficina && (
              <span className={styles.shopLine}>
                <Phone size={16} aria-hidden="true" />
                {telefoneOficina}
              </span>
            )}
          </div>

          <button type="button" className={styles.gps} onClick={handleOpenGPS}>
            <Navigation size={18} aria-hidden="true" />
            Abrir rota no GPS
          </button>
        </div>

        <div className={styles.perf} aria-hidden="true" />

        <div className={styles.codeBlock}>
          <p className={styles.codeLabel}>Mostre este código no balcão</p>
          <p className={styles.code}>{coupon.code}</p>
        </div>

        <div className={styles.timer}>
          <Clock size={20} aria-hidden="true" />
          <span>Válido por</span>
          <span className={styles.timerValue}>{timeLeft || '24:00:00'}</span>
        </div>

        <button type="button" className={styles.done} onClick={onClose}>
          <Check size={22} aria-hidden="true" />
          Salvar cupom
        </button>
      </div>
    </div>
  );
}
