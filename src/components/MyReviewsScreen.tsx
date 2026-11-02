'use client';

import { CompletedReview } from '@/types/app';

interface MyReviewsScreenProps {
  reviews: CompletedReview[];
  onBack: () => void;
}

export function MyReviewsScreen({ reviews, onBack }: MyReviewsScreenProps) {
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

      <h2 style={{ color: '#f8fafc', marginBottom: '6px', fontSize: '18px' }}>⭐ Minha Reputação</h2>
      <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '15px' }}>
        Veja as avaliações e observações que os Auto Centers parceiros deixaram sobre seus atendimentos.
      </p>

      {reviews.length === 0 ? (
        <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', margin: '30px 0' }}>
          Nenhuma avaliação recebida dos estabelecimentos ainda.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reviews.map((rev) => (
            <div key={rev.id} style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 'bold', color: '#f8fafc', fontSize: '14px' }}>🏢 {rev.authorName}</span>
                <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{rev.rating} ★</span>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>{rev.serviceTitle}</div>
              {rev.comment && (
                <p style={{ fontSize: '12px', color: '#cbd5e1', fontStyle: 'italic', margin: 0 }}>
                  &quot;{rev.comment}&quot;
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}