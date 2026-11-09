'use client';

import { CompletedReview } from '@/types/app';
import { BackButton } from '@/components/BackButton';
import { Star } from 'lucide-react';
import ui from './ui.module.css';

interface MyReviewsScreenProps {
  reviews: CompletedReview[];
  onBack: () => void;
}

export function MyReviewsScreen({ reviews, onBack }: MyReviewsScreenProps) {
  return (
    <div>
      <BackButton onClick={onBack} />
      <h2 className={ui.title}>
        <Star size={30} aria-hidden="true" />
        Minha reputação
      </h2>
      <p className={ui.lead}>O que os auto centers parceiros escreveram sobre seus atendimentos.</p>

      {reviews.length === 0 ? (
        <div className={ui.empty}>
          <p className={ui.emptyTitle}>Nenhuma avaliação ainda</p>
          <p>Elas aparecem aqui depois que você usar um cupom.</p>
        </div>
      ) : (
        <ul className={ui.reviews}>
          {reviews.map((rev) => (
            <li key={rev.id} className={ui.review}>
              <div className={ui.reviewHead}>
                <span className={ui.reviewAuthor}>{rev.authorName}</span>
                <span className={ui.stars} aria-label={`${rev.rating} estrelas`}>
                  {rev.rating}
                  <Star size={18} fill="currentColor" aria-hidden="true" />
                </span>
              </div>
              <p className={ui.reviewService}>{rev.serviceTitle}</p>
              {rev.comment && <p className={ui.reviewComment}>&ldquo;{rev.comment}&rdquo;</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
