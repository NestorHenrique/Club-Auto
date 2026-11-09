'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PartnerDashboard } from '@/components/PartnerDashboard';
import { ReviewModal } from '@/components/ReviewModal';
import { useAppState } from '@/context/AppState';
import type { PendingReview } from '@/types/app';

export default function AutoCenterPage() {
  const router = useRouter();
  const app = useAppState();
  const [activeReview, setActiveReview] = useState<PendingReview | null>(null);

  // Esta área é só para contas de auto center.
  useEffect(() => {
    if (app.role !== 'partner') router.replace('/');
  }, [app.role, router]);

  if (app.role !== 'partner') return null;

  const handleResolve = (reviewId: string, rating: number, comment: string) => {
    app.resolveReview(reviewId, rating, comment);
    setActiveReview(null);
    alert(`Avaliação de ${rating}★ salva com sucesso!`);
  };

  return (
    <>
      <PartnerDashboard
        offers={app.offers}
        pendingReviews={app.pendingReviews}
        completedReviews={app.completedReviews}
        partnerProfile={app.partnerProfile}
        onUpdatePartnerProfile={app.updatePartnerProfile}
        onToggleOffer={app.toggleOffer}
        onUpdateStock={app.updateStock}
        onUpdateOfferPrices={app.updateOfferPrices}
        onAddOffer={app.addOffer}
        onSignOut={() => {
          app.signOut();
          router.push('/');
        }}
        onValidateCoupon={app.validateCoupon}
        onFinishService={(id) => setActiveReview(app.pendingReviews.find((r) => r.id === id) ?? null)}
      />
      <ReviewModal key={activeReview?.id ?? 'none'} review={activeReview} onSubmitReview={handleResolve} />
    </>
  );
}
