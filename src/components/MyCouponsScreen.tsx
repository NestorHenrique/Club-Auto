'use client';

import { useState, type CSSProperties } from 'react';
import { ActiveCoupon } from '@/types/app';
import { brl } from '@/lib/format';
import { BackButton } from '@/components/BackButton';
import { Ticket, Clock, CheckCircle2, XCircle } from 'lucide-react';
import styles from './MyCouponsScreen.module.css';

interface MyCouponsScreenProps {
  coupons: ActiveCoupon[];
  onBack: () => void;
}

type CouponFilter = 'valid' | 'used' | 'expired';

const TABS: { id: CouponFilter; label: string; empty: string }[] = [
  { id: 'valid', label: 'Válidos', empty: 'Você não tem cupons válidos.' },
  { id: 'used', label: 'Usados', empty: 'Nenhum cupom usado ainda.' },
  { id: 'expired', label: 'Expirados', empty: 'Nenhum cupom expirou.' },
];

const STATUS_COLOR: Record<CouponFilter, string> = {
  valid: 'var(--lane)',
  used: 'var(--go)',
  expired: 'var(--stop)',
};

export function MyCouponsScreen({ coupons, onBack }: MyCouponsScreenProps) {
  const [filter, setFilter] = useState<CouponFilter>('valid');

  const filteredCoupons = coupons.filter((c) => c.status === filter);
  const emptyText = TABS.find((t) => t.id === filter)?.empty;

  return (
    <div>
      <BackButton onClick={onBack} />

      <h2 className={styles.title}>
        <Ticket size={30} aria-hidden="true" />
        Meus cupons
      </h2>

      <div className={styles.tabs} role="tablist" aria-label="Status dos cupons">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={filter === tab.id}
            className={`${styles.tab} ${filter === tab.id ? styles.tabActive : ''}`}
            onClick={() => setFilter(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredCoupons.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>{emptyText}</p>
          {filter === 'valid' && <p>Gere um cupom em Ofertas e ele aparece aqui.</p>}
        </div>
      ) : (
        <ul className={styles.list}>
          {filteredCoupons.map((c) => (
            <li
              key={c.id}
              className={styles.coupon}
              style={{ '--statusColor': STATUS_COLOR[c.status] } as CSSProperties}
            >
              <span className={styles.couponTitle}>{c.offerTitle}</span>
              <span className={styles.couponPrice}>{brl(c.discountPrice)}</span>
              <span className={styles.couponShop}>{c.partnerName}</span>

              <div className={styles.couponMeta}>
                <span className={styles.couponCode}>{c.code}</span>
                <span className={styles.status}>
                  {c.status === 'valid' ? (
                    <>
                      <Clock size={15} color="#ffc800" aria-hidden="true" />
                      Válido até {new Date(c.expiresAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </>
                  ) : c.status === 'used' ? (
                    <>
                      <CheckCircle2 size={15} color="#43d17a" aria-hidden="true" />
                      Usado
                    </>
                  ) : (
                    <>
                      <XCircle size={15} color="#ff5a4f" aria-hidden="true" />
                      Expirado
                    </>
                  )}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
