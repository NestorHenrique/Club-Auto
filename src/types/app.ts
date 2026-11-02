export type UserRole = 'driver' | 'partner';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  plate: string;
  rating: number;
  avatarUrl: string;
}

export interface PartnerProfile {
  id: string;
  name: string;
  cnpj: string;
  phone: string;
  address: string;
  workingHours: string;
  rating: number;
  logoUrl: string;
}

export interface PartnerOffer {
  id: string;
  partnerId: string;
  partnerName: string;
  title: string;
  category: 'alinhamento' | 'pneus' | 'oleo' | 'combustivel' | 'lavagem';
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  stockLimit: number;
  stockRemaining: number;
  active: boolean;
  isDailyOffer?: boolean;
}

export interface ActiveCoupon {
  id: string;
  code: string;
  offerId: string;
  offerTitle: string;
  partnerName: string;
  partnerAddress?: string; // Adicionado para exibir o endereço real do estabelecimento
  partnerPhone?: string;   // Adicionado para exibir o telefone real do estabelecimento
  originalPrice: number;
  discountPrice: number;
  generatedAt: string;
  expiresAt: string;
  status: 'valid' | 'used' | 'expired';
}

export interface PendingReview {
  id: string;
  couponCode: string;
  driverId: string;
  driverName: string;
  partnerName: string;
  serviceTitle: string;
  date: string;
  pendingFor: 'driver' | 'partner';
}

export interface CompletedReview {
  id: string;
  couponCode: string;
  authorName: string;
  targetName: string;
  serviceTitle: string;
  rating: number;
  comment: string;
  date: string;
  type: 'driver_to_partner' | 'partner_to_driver';
}