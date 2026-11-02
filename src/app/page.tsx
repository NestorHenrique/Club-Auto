'use client';

import { useState } from 'react';
import styles from '@/app/page.module.css';
import { NavigationDrawer, DriverScreenType } from '@/components/NavigationDrawer';
import { OfferCard } from '@/components/OfferCard';
import { ProfileScreen } from '@/components/ProfileScreen';
import { PartnerDashboard } from '@/components/PartnerDashboard';
import { CouponModal } from '@/components/CouponModal';
import { ReviewModal } from '@/components/ReviewModal';
import { MyCouponsScreen } from '@/components/MyCouponsScreen';
import { MyReviewsScreen } from '@/components/MyReviewsScreen';
import { MOCK_OFFERS } from '@/lib/offers';
import { UserProfile, ActiveCoupon, PartnerOffer, UserRole, PendingReview, PartnerProfile, CompletedReview } from '@/types/app';

export default function Home() {
  const [role, setRole] = useState<UserRole>('driver');
  const [telaAtiva, setTelaAtiva] = useState<DriverScreenType>('catalogo');
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todas');
  
  const [offers, setOffers] = useState<PartnerOffer[]>(MOCK_OFFERS);
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [completedReviews, setCompletedReviews] = useState<CompletedReview[]>([]);
  const [activeReviewModal, setActiveReviewModal] = useState<PendingReview | null>(null);

  const [myCoupons, setMyCoupons] = useState<ActiveCoupon[]>([]);

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

  const [activeCouponModal, setActiveCouponModal] = useState<ActiveCoupon | null>(null);

  // Código Único do Motorista para o Indique e Ganhe
  const referralCode = `CLUB-${userProfile.name.split(' ')[0].toUpperCase()}-8921`;

  const categorias = [
    { id: 'todas', label: 'Todos' },
    { id: 'alinhamento', label: 'Alinhamento' },
    { id: 'pneus', label: 'Pneus' },
    { id: 'oleo', label: 'Óleo' },
  ];

  const ofertasFiltradas = offers.filter((oferta) => {
    if (categoriaAtiva === 'todas') return true;
    return oferta.category === categoriaAtiva;
  });

  const handleToggleOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((off) => (off.id === offerId ? { ...off, active: !off.active } : off))
    );
  };

  const handleUpdateStock = (offerId: string, newStock: number) => {
    setOffers((prev) =>
      prev.map((off) => (off.id === offerId ? { ...off, stockRemaining: newStock } : off))
    );
  };

  const handleGerarCupom = (oferta: PartnerOffer) => {
    if (oferta.stockRemaining <= 0) return;

    const now = new Date();
    const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const generatedCode = `CLUB-PAR-${Math.floor(1000 + Math.random() * 9000)}-${randomCode}`;

    const newCoupon: ActiveCoupon = {
      id: `cup-${Date.now()}`,
      code: generatedCode,
      offerId: oferta.id,
      offerTitle: oferta.title,
      partnerName: oferta.partnerName,
      originalPrice: oferta.originalPrice,
      discountPrice: oferta.discountPrice,
      generatedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      status: 'valid',
    };

    handleUpdateStock(oferta.id, oferta.stockRemaining - 1);
    setMyCoupons((prev) => [newCoupon, ...prev]);
    setActiveCouponModal(newCoupon);
  };

  const handleValidateCouponFromPartner = (code: string) => {
    const reviewForDriver: PendingReview = {
      id: `rev-drv-${Date.now()}`,
      couponCode: code,
      driverId: userProfile.id,
      driverName: userProfile.name,
      partnerName: partnerProfile.name,
      serviceTitle: 'Alinhamento 3D + Balanceamento Completo',
      date: new Date().toISOString(),
      pendingFor: 'driver',
    };

    const reviewForPartner: PendingReview = {
      id: `rev-part-${Date.now()}`,
      couponCode: code,
      driverId: userProfile.id,
      driverName: userProfile.name,
      partnerName: partnerProfile.name,
      serviceTitle: 'Alinhamento 3D + Balanceamento Completo',
      date: new Date().toISOString(),
      pendingFor: 'partner',
    };

    setMyCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, status: 'used' } : c))
    );

    setPendingReviews((prev) => [...prev, reviewForDriver, reviewForPartner]);
  };

  const handleDriverFinishAndReview = (reviewId: string) => {
    const rev = pendingReviews.find((r) => r.id === reviewId);
    if (rev) {
      setActiveReviewModal(rev);
    }
  };

  const handleResolveReview = (reviewId: string, rating: number, comment: string) => {
    const rev = pendingReviews.find((r) => r.id === reviewId);
    if (rev) {
      const newCompletedReview: CompletedReview = {
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

      setCompletedReviews((prev) => [newCompletedReview, ...prev]);
    }

    setPendingReviews((prev) => prev.filter((r) => r.id !== reviewId));
    setActiveReviewModal(null);
    alert(`Avaliação de ${rating}★ salva com sucesso!`);
  };

  const driverPendingList = pendingReviews.filter((r) => r.pendingFor === 'driver');

  // Compartilhar via WhatsApp ou API Nativa
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá! Baixe o app Clube Auto e use meu código de indicação *${referralCode}* para economizar em serviços automotivos com cupons exclusivos! 🚗💨`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert(`Código ${referralCode} copiado para a área de transferência!`);
  };

  // MODO AUTO CENTER
  if (role === 'partner') {
    return (
      <>
        <PartnerDashboard
          offers={offers}
          pendingReviews={pendingReviews}
          completedReviews={completedReviews}
          partnerProfile={partnerProfile}
          onUpdatePartnerProfile={(updated) => setPartnerProfile(updated)}
          onToggleOffer={handleToggleOffer}
          onUpdateStock={handleUpdateStock}
          onSwitchRole={() => setRole('driver')}
          onCouponValidated={handleValidateCouponFromPartner}
          onFinishService={handleDriverFinishAndReview}
        />
        <ReviewModal review={activeReviewModal} onSubmitReview={handleResolveReview} />
      </>
    );
  }

  // MODO MOTORISTA
  return (
    <main className={styles.container}>
      <div className={styles.headerDash}>
        <NavigationDrawer onSelectScreen={(t) => setTelaAtiva(t)} />

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Motorista</span>
          <h3 style={{ color: '#10b981', fontSize: '15px', margin: 0 }}>{userProfile.name}</h3>
        </div>

        <button
          onClick={() => setRole('partner')}
          style={{
            background: '#1e293b',
            color: '#10b981',
            border: '1px solid #10b981',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          🏬 Área Auto Center
        </button>
      </div>

      {driverPendingList.length > 0 && (
        <div style={{ background: '#1e293b', padding: '14px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #f59e0b' }}>
          <h4 style={{ color: '#f59e0b', margin: '0 0 8px 0', fontSize: '14px' }}>
            🛠️ Serviço em Andamento na Oficina
          </h4>
          {driverPendingList.map((rev) => (
            <div key={rev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '13px', color: '#f8fafc', fontWeight: 'bold' }}>{rev.serviceTitle}</span>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{rev.partnerName}</div>
              </div>
              <button
                onClick={() => handleDriverFinishAndReview(rev.id)}
                style={{
                  background: '#f59e0b',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                ✅ Finalizado? Avaliar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CATÁLOGO */}
      {telaAtiva === 'catalogo' && (
        <div>
          <div style={{ border: '1px solid #10b981', padding: '15px', borderRadius: '8px', background: '#1e293b' }}>
            <h3 style={{ color: '#10b981', fontSize: '16px', marginBottom: '8px' }}>💰 Meus Serviços e Economia</h3>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981', marginBottom: '5px' }}>
              R$ 0,00
            </div>
          </div>

          <h2 style={{ textAlign: 'left', width: '100%', marginBottom: '10px', fontSize: '18px', marginTop: '15px' }}>
            Catálogo e Ofertas
          </h2>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', overflowX: 'auto' }}>
            {categorias.map((cat) => (
              <div
                key={cat.id}
                style={{
                  cursor: 'pointer',
                  padding: '6px 14px',
                  borderRadius: '16px',
                  fontSize: '13px',
                  fontWeight: '500',
                  background: categoriaAtiva === cat.id ? '#38bdf8' : '#1e293b',
                  color: categoriaAtiva === cat.id ? '#0f172a' : '#f8fafc',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onClick={() => setCategoriaAtiva(cat.id)}
              >
                {cat.label}
              </div>
            ))}
          </div>

          {ofertasFiltradas.length > 0 ? (
            ofertasFiltradas.map((oferta) => (
              <OfferCard key={oferta.id} offer={oferta} onSelectOffer={handleGerarCupom} />
            ))
          ) : (
            <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', margin: '20px 0' }}>
              Nenhuma oferta encontrada.
            </p>
          )}
        </div>
      )}

      {/* MEUS CUPONS */}
      {telaAtiva === 'cupons' && (
        <MyCouponsScreen coupons={myCoupons} onBack={() => setTelaAtiva('catalogo')} />
      )}

      {/* PERFIL */}
      {telaAtiva === 'perfil' && (
        <ProfileScreen
          profile={userProfile}
          onSave={(updated) => {
            setUserProfile(updated);
            setTelaAtiva('catalogo');
          }}
          onBack={() => setTelaAtiva('catalogo')}
        />
      )}

      {/* MINHAS AVALIAÇÕES RECEBIDAS DO AUTO CENTER */}
      {telaAtiva === 'avaliacoes' && (
        <MyReviewsScreen
          reviews={completedReviews.filter((r) => r.type === 'partner_to_driver')}
          onBack={() => setTelaAtiva('catalogo')}
        />
      )}

      {/* INDIQUE E GANHE COM CÓDIGO E BOTÃO WHATSAPP */}
      {telaAtiva === 'indique' && (
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <button
            onClick={() => setTelaAtiva('catalogo')}
            style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold' }}
          >
            ← Voltar ao Catálogo
          </button>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '40px' }}>🎁</span>
            <h2 style={{ color: '#10b981', margin: '8px 0 4px', fontSize: '20px' }}>Indique e Ganhe</h2>
            <p style={{ color: '#94a3b8', fontSize: '13px' }}>
              Compartilhe seu código exclusivo com outros motoristas parceiros e acumule descontos adicionais!
            </p>
          </div>

          <div
            style={{
              background: '#0f172a',
              border: '2px dashed #10b981',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>SEU CÓDIGO ÚNICO DE INDICAÇÃO</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#10b981', letterSpacing: '2px' }}>
              {referralCode}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleShareWhatsApp}
              style={{
                background: '#25D366',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
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
              📲 Compartilhar no WhatsApp
            </button>

            <button
              onClick={handleCopyCode}
              style={{
                background: '#334155',
                color: '#f8fafc',
                border: 'none',
                borderRadius: '6px',
                padding: '12px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              📋 Copiar Código
            </button>
          </div>
        </div>
      )}

      {/* AJUDA & SUPORTE */}
      {telaAtiva === 'ajuda' && (
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <button
            onClick={() => setTelaAtiva('catalogo')}
            style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold' }}
          >
            ← Voltar ao Catálogo
          </button>
          <h2 style={{ color: '#38bdf8', marginTop: 0 }}>🎧 Ajuda & Suporte</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px' }}>
            Dúvidas sobre cupons ou agendamentos? Fale diretamente com o suporte oficial do Clube Auto.
          </p>
        </div>
      )}

      <CouponModal coupon={activeCouponModal} onClose={() => setActiveCouponModal(null)} />
      <ReviewModal review={activeReviewModal} onSubmitReview={handleResolveReview} />
    </main>
  );
}