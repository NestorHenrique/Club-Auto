'use client';

import { useState } from 'react';
import { PendingReview } from '@/types/app';

interface ReviewModalProps {
  review: PendingReview | null;
  onSubmitReview: (reviewId: string, rating: number, comment: string) => void;
}

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
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(4px)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: '#1e293b',
          border: '1px solid #f59e0b',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '36px', color: '#f59e0b' }}>⭐</span>
          <h3 style={{ color: '#f8fafc', margin: '8px 0 4px', fontSize: '18px' }}>
            {isDriverViewing ? 'Serviço Finalizado! Como foi?' : 'Serviço Finalizado! Avalie o motorista'}
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
            {isDriverViewing
              ? `Avalie sua experiência em ${review.partnerName}`
              : `Avalie o atendimento ao motorista ${review.driverName}`}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* ESTRELAS AMARELAS */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '32px',
                  cursor: 'pointer',
                  color: star <= rating ? '#f59e0b' : '#475569',
                  transition: 'transform 0.1s ease',
                }}
              >
                ★
              </button>
            ))}
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
              Comentário (opcional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ex: Excelente atendimento, entrega no prazo!"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                background: '#0f172a',
                border: '1px solid #334155',
                color: '#f8fafc',
                fontSize: '13px',
                resize: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              background: '#f59e0b',
              color: '#0f172a',
              border: 'none',
              borderRadius: '6px',
              padding: '12px',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Enviar Avaliação
          </button>
        </form>
      </div>
    </div>
  );
}