'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { MOCK_OFFERS } from '@/lib/offers';
import { generateCouponCode, generateLocalId } from '@/lib/coupon';
import {
  UserProfile,
  ActiveCoupon,
  PartnerOffer,
  UserRole,
  PendingReview,
  PartnerProfile,
  CompletedReview,
} from '@/types/app';

type NewOfferData = Omit<PartnerOffer, 'id' | 'partnerId' | 'partnerName' | 'discountPercentage'>;

interface AppState {
  // Perfil logado. Quando houver backend, virá do cadastro/login.
  role: UserRole | null;
  signIn: (role: UserRole) => void;
  signOut: () => void;

  userProfile: UserProfile;
  setUserProfile: (p: UserProfile) => void;
  partnerProfile: PartnerProfile;
  updatePartnerProfile: (p: PartnerProfile) => void;

  offers: PartnerOffer[];
  toggleOffer: (offerId: string) => void;
  addOffer: (data: NewOfferData) => void;
  updateStock: (offerId: string, newStock: number) => void;
  updateOfferPrices: (offerId: string, originalPrice: number, discountPrice: number) => void;

  coupons: ActiveCoupon[];
  generateCoupon: (offer: PartnerOffer) => ActiveCoupon | null;
  validateCoupon: (rawCode: string) => { success: boolean; message: string };

  pendingReviews: PendingReview[];
  completedReviews: CompletedReview[];
  resolveReview: (reviewId: string, rating: number, comment: string) => void;
}

const AppStateContext = createContext<AppState | null>(null);

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState deve ser usado dentro de <AppStateProvider>');
  return ctx;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);

  const [offers, setOffers] = useState<PartnerOffer[]>(MOCK_OFFERS);
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [completedReviews, setCompletedReviews] = useState<CompletedReview[]>([]);
  const [myCoupons, setMyCoupons] = useState<ActiveCoupon[]>([]);

  // Relógio para expirar cupons (a expiração real será decidida pelo backend).
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 15000);
    return () => clearInterval(id);
  }, []);
  const coupons: ActiveCoupon[] = myCoupons.map((c) =>
    c.status === 'valid' && new Date(c.expiresAt).getTime() <= nowMs ? { ...c, status: 'expired' } : c
  );

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'drv-1',
    name: 'Nestor Henrique',
    email: 'nestor@email.com',
    phone: '(86) 99999-8888',
    vehicle: 'VW Voyage 1.6',
    plate: 'ABC-1234',
    rating: 5.0,
    avatarUrl: '',
  });

  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile>({
    id: 'part-1',
    name: 'Auto Center Parnaíba',
    cnpj: '12.345.678/0001-99',
    phone: '(86) 3322-1100',
    address: 'Av. São Sebastião, 1500 - Parnaíba/PI',
    workingHours: 'Seg-Sáb: 08:00 - 18:00',
    rating: 4.9,
    logoUrl: '',
  });

  const toggleOffer = (offerId: string) => {
    setOffers((prev) => prev.map((off) => (off.id === offerId ? { ...off, active: !off.active } : off)));
  };

  const addOffer = (data: NewOfferData) => {
    if (
      !(data.originalPrice > 0) ||
      !(data.discountPrice > 0) ||
      data.discountPrice >= data.originalPrice ||
      !Number.isInteger(data.stockLimit) ||
      data.stockLimit < 1
    ) {
      return;
    }
    const discountPercentage = Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100);
    const newOffer: PartnerOffer = {
      ...data,
      id: `off-${Date.now()}`,
      partnerId: partnerProfile.id,
      partnerName: partnerProfile.name,
      discountPercentage,
    };
    setOffers((prev) => [newOffer, ...prev]);
  };

  const updateStock = (offerId: string, newStock: number) => {
    setOffers((prev) =>
      prev.map((off) =>
        off.id === offerId
          ? { ...off, stockRemaining: Math.min(Math.max(0, Math.trunc(newStock) || 0), off.stockLimit) }
          : off
      )
    );
  };

  const updateOfferPrices = (offerId: string, originalPrice: number, discountPrice: number) => {
    if (!(originalPrice > 0) || !(discountPrice > 0) || discountPrice >= originalPrice) return;
    setOffers((prev) =>
      prev.map((off) => {
        if (off.id !== offerId) return off;
        const discountPercentage = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
        return { ...off, originalPrice, discountPrice, discountPercentage };
      })
    );
  };

  const updatePartnerProfile = (updated: PartnerProfile) => {
    setPartnerProfile(updated);
    // Mantém o nome do estabelecimento sincronizado em todas as suas ofertas.
    setOffers((prev) => prev.map((offer) => ({ ...offer, partnerName: updated.name })));
  };

  // Devolve o cupom a exibir (novo, ou o já válido do motorista para a mesma oferta).
  const generateCoupon = (offer: PartnerOffer): ActiveCoupon | null => {
    if (!offer.active || offer.stockRemaining <= 0) return null;

    const existing = coupons.find((c) => c.offerId === offer.id && c.status === 'valid');
    if (existing) return existing;

    // Hoje só existe um parceiro no estado local.
    const owner = offer.partnerId === partnerProfile.id ? partnerProfile : null;

    const now = new Date();
    const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const newCoupon: ActiveCoupon = {
      id: generateLocalId('cup'),
      code: generateCouponCode(),
      offerId: offer.id,
      offerTitle: offer.title,
      partnerId: offer.partnerId,
      partnerName: offer.partnerName,
      partnerAddress: owner?.address,
      partnerPhone: owner?.phone,
      partnerLatitude: owner?.latitude,
      partnerLongitude: owner?.longitude,
      originalPrice: offer.originalPrice,
      discountPrice: offer.discountPrice,
      generatedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      status: 'valid',
    };

    updateStock(offer.id, offer.stockRemaining - 1);
    setMyCoupons((prev) => [newCoupon, ...prev]);
    return newCoupon;
  };

  const validateCoupon = (rawCode: string): { success: boolean; message: string } => {
    const code = rawCode.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code === code);

    if (!coupon) return { success: false, message: 'Código de cupom não encontrado.' };
    if (coupon.partnerId !== partnerProfile.id) {
      return { success: false, message: 'Este cupom pertence a outro auto center.' };
    }
    if (coupon.status === 'used') return { success: false, message: 'Este cupom já foi utilizado.' };
    if (coupon.status === 'expired') return { success: false, message: 'Este cupom está expirado.' };

    const base = {
      couponCode: coupon.code,
      driverId: userProfile.id,
      driverName: userProfile.name,
      partnerName: coupon.partnerName,
      serviceTitle: coupon.offerTitle,
      date: new Date().toISOString(),
    };

    setMyCoupons((prev) => prev.map((c) => (c.id === coupon.id ? { ...c, status: 'used' } : c)));
    setPendingReviews((prev) => [
      ...prev,
      { ...base, id: `rev-drv-${coupon.id}`, pendingFor: 'driver' },
      { ...base, id: `rev-part-${coupon.id}`, pendingFor: 'partner' },
    ]);

    return { success: true, message: `Cupom ${coupon.code} validado com sucesso! Atendimento iniciado.` };
  };

  const resolveReview = (reviewId: string, rating: number, comment: string) => {
    const rev = pendingReviews.find((r) => r.id === reviewId);
    if (!rev) return;

    const completed: CompletedReview = {
      id: `comp-${Date.now()}`,
      couponCode: rev.couponCode,
      authorName: rev.pendingFor === 'driver' ? rev.driverName : rev.partnerName,
      targetName: rev.pendingFor === 'driver' ? rev.partnerName : rev.driverName,
      serviceTitle: rev.serviceTitle,
      rating,
      comment,
      date: new Date().toISOString(),
      type: rev.pendingFor === 'driver' ? 'driver_to_partner' : 'partner_to_driver',
    };

    setCompletedReviews((prev) => [completed, ...prev]);
    setPendingReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  return (
    <AppStateContext.Provider
      value={{
        role,
        signIn: setRole,
        signOut: () => setRole(null),
        userProfile,
        setUserProfile,
        partnerProfile,
        updatePartnerProfile,
        offers,
        toggleOffer,
        addOffer,
        updateStock,
        updateOfferPrices,
        coupons,
        generateCoupon,
        validateCoupon,
        pendingReviews,
        completedReviews,
        resolveReview,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}
