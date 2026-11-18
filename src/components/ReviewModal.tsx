'use client';

import { useState } from 'react';
import { PendingReview } from '@/types/app';
import { Star } from 'lucide-react';
import ui from './ui.module.css';
import styles from './ReviewModal.module.css';

interface ReviewModalProps {
  review: PendingReview | null;
  onSubmitReview: (reviewId: string, rating: number, comment: string) => void;
}

const RATING_TEXT = ['', 'Ruim', 'Regular', 'Bom', 'Muito bom', 'Excelente'];

export function ReviewModal({ review, onSubmitReview }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  if (!review) return null;

  const isDriverViewing = review.pendingFor === 'driver';

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    onSubmitReview(review.id, rating, comment);
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Avaliação do serviço">
      <div className={styles.card}>
        <h3 className={styles.heading}>
          {isDriverViewing ? 'Serviço finalizado. Como foi?' : 'Serviço finalizado. Avalie o motorista'}
        </h3>
        <p className={styles.sub}>
          {isDriverViewing
            ? `Conte como foi o atendimento em ${review.partnerName}.`
            : `Avalie o atendimento ao motorista ${review.driverName}.`}
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.stars} role="radiogroup" aria-label="Nota">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={star === rating}
                aria-label={`${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
                className={`${styles.star} ${star <= rating ? styles.starOn : ''}`}
                onClick={() => setRating(star)}
              >
                <Star size={38} fill={star <= rating ? 'currentColor' : 'none'} aria-hidden="true" />
              </button>
            ))}
          </div>
          <p className={styles.ratingText}>{RATING_TEXT[rating]}</p>

          <div className={ui.field} style={{ marginBottom: 16 }}>
            <label className={ui.label} htmlFor="rv-comment">Comentário (opcional)</label>
            <textarea
              id="rv-comment"
              className={ui.input}
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ex: Atendimento rápido e preço combinado."
            />
          </div>

          <button type="submit" className={ui.btn} style={{ width: '100%' }}>
            Enviar avaliação
          </button>
        </form>
      </div>
    </div>
  );
}
