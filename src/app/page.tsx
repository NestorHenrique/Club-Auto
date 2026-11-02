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
import { PiggyBank, Ticket, Layers, Wrench, CircleDot, Droplets, Share2, Copy, Search, Fuel, Sparkles } from 'lucide-react';

export default function Home() {
  const [role, setRole] = useState<UserRole>('driver');
  const [telaAtiva, setTelaAtiva] = useState<DriverScreenType>('catalogo');
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');

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

  const referralCode = `CLUB-${userProfile.name.split(' ')[0].toUpperCase()}-8921`;

  const totalEconomy = myCoupons
    .filter((c) => c.status === 'used')
    .reduce((acc, curr) => acc + (curr.originalPrice - curr.discountPrice), 0);

  const categorias = [
    { id: 'todas', label: 'Todos', icon: Layers },
    { id: 'alinhamento', label: 'Alinhamento', icon: Wrench },
    { id: 'pneus', label: 'Pneus', icon: CircleDot },
    { id: 'oleo', label: 'Óleo', icon: Droplets },
    { id: 'combustivel', label: 'Combustível', icon: Fuel },
    { id: 'lavagem', label: 'Lavagem', icon: Sparkles },
  ];

  const ofertasFiltradas = offers
    .filter((oferta) => {
      const atendeCategoria = categoriaAtiva === 'todas' || oferta.category === categoriaAtiva;
      const atendeBusca =
        oferta.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        oferta.partnerName.toLowerCase().includes(searchTerm.toLowerCase());
      return atendeCategoria && atendeBusca;
    })
    .sort((a, b) => {
      const aDisponivel = a.active && a.stockRemaining > 0 ? 1 : 0;
      const bDisponivel = b.active && b.stockRemaining > 0 ? 1 : 0;
      return bDisponivel - aDisponivel;
    });

  const handleToggleOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((off) => (off.id === offerId ? { ...off, active: !off.active } : off))
    );
  };
  const handleAddOffer = (newOfferData: Omit<PartnerOffer, 'id' | 'partnerId' | 'partnerName' | 'discountPercentage'>) => {
    const discountPercentage = Math.round(((newOfferData.originalPrice - newOfferData.discountPrice) / newOfferData.originalPrice) * 100);
    const newOffer: PartnerOffer = {
      ...newOfferData,
      id: `off-${Date.now()}`,
      partnerId: partnerProfile.id,
      partnerName: partnerProfile.name, // <--- AQUI: Pega dinamicamente o nome atualizado da oficina!
      discountPercentage,
    };
    setOffers((prev) => [newOffer, ...prev]);
  };
  
  const handleUpdateStock = (offerId: string, newStock: number) => {
    setOffers((prev) =>
      prev.map((off) => (off.id === offerId ? { ...off, stockRemaining: newStock } : off))
    );
  };

  const handleUpdateOfferPrices = (offerId: string, originalPrice: number, discountPrice: number) => {
    setOffers((prev) =>
      prev.map((off) => {
        if (off.id === offerId) {
          const discountPercentage = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
          return { ...off, originalPrice, discountPrice, discountPercentage };
        }
        return off;
      })
    );
  };


  const handleGerarCupom = (oferta: PartnerOffer) => {
    if (oferta.stockRemaining <= 0) return;

    const now = new Date();
    const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const generatedCode = `CLUB-PAR-${Math.floor(1000 + Math.random() * 9000)}-${randomCode}`;

    const newCoupon: ActiveCoupon & { partnerAddress?: string; partnerPhone?: string } = {
      id: `cup-${Date.now()}`,
      code: generatedCode,
      offerId: oferta.id,
      offerTitle: oferta.title,
      partnerName: partnerProfile.name,
      partnerAddress: partnerProfile.address,
      partnerPhone: partnerProfile.phone,
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
      serviceTitle: 'Serviço Automotivo Verificado',
      date: new Date().toISOString(),
      pendingFor: 'driver',
    };

    const reviewForPartner: PendingReview = {
      id: `rev-part-${Date.now()}`,
      couponCode: code,
      driverId: userProfile.id,
      driverName: userProfile.name,
      partnerName: partnerProfile.name,
      serviceTitle: 'Serviço Automotivo Verificado',
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

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá! Baixe o app Clube Auto e use meu código de indicação *${referralCode}* para economizar em serviços automotivos com cupons exclusivos!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert(`Código ${referralCode} copiado para a área de transferência!`);
  };
  const handleUpdatePartnerProfile = (updatedProfile: PartnerProfile) => {
    setPartnerProfile(updatedProfile);
    
    // Atualiza o partnerName em todas as ofertas cadastradas deste estabelecimento instantaneamente
    setOffers((prevOffers) =>
      prevOffers.map((offer) => ({
        ...offer,
        partnerName: updatedProfile.name,
      }))
    );
  };

  if (role === 'partner') {
    return (
      <>
        <PartnerDashboard
          offers={offers}
          pendingReviews={pendingReviews}
          completedReviews={completedReviews}
          partnerProfile={partnerProfile}
          onUpdatePartnerProfile={handleUpdatePartnerProfile}
          onToggleOffer={handleToggleOffer}
          onUpdateStock={handleUpdateStock}
          onUpdateOfferPrices={handleUpdateOfferPrices}
          onAddOffer={handleAddOffer}
          onSwitchRole={() => setRole('driver')}
          onCouponValidated={handleValidateCouponFromPartner}
          onFinishService={handleDriverFinishAndReview}
        />
        <ReviewModal review={activeReviewModal} onSubmitReview={handleResolveReview} />
      </>
    );
  }
  return (
    <main className={styles.container}>
      <div className={styles.headerDash}>
        <NavigationDrawer onSelectScreen={(t) => setTelaAtiva(t)} />

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>Motorista</span>
          <h3 style={{ color: '#00E676', fontSize: '15px', margin: 0 }}>{userProfile.name}</h3>
        </div>

        <button
          onClick={() => setRole('partner')}
          style={{
            background: '#121826',
            color: '#00E676',
            border: '1px solid #00E676',
            borderRadius: '20px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Área Auto Center
        </button>
      </div>

      {driverPendingList.length > 0 && (
        <div style={{ background: '#121826', padding: '14px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #FF9F0A' }}>
          <h4 style={{ color: '#FF9F0A', margin: '0 0 8px 0', fontSize: '14px' }}>
            Serviço em Andamento na Oficina
          </h4>
          {driverPendingList.map((rev) => (
            <div key={rev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '13px', color: '#F1F5F9', fontWeight: 'bold' }}>{rev.serviceTitle}</span>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>{rev.partnerName}</div>
              </div>
              <button
                onClick={() => handleDriverFinishAndReview(rev.id)}
                style={{
                  background: '#FF9F0A',
                  color: '#090D16',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Finalizado? Avaliar
              </button>
            </div>
          ))}
        </div>
      )}

      {telaAtiva === 'catalogo' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            <div style={{ background: '#121826', padding: '14px', borderRadius: '12px', border: '1px solid #1F293D' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <PiggyBank size={16} color="#00E676" />
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '500' }}>Economia Acumulada</span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#00E676' }}>
                R$ {totalEconomy.toFixed(2)}
              </div>
            </div>

            <div style={{ background: '#121826', padding: '14px', borderRadius: '12px', border: '1px solid #1F293D' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Ticket size={16} color="#00D2FF" />
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '500' }}>Cupons Gerados</span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#00D2FF' }}>
                {myCoupons.length}
              </div>
            </div>
          </div>

          <h2 style={{ textAlign: 'left', width: '100%', marginBottom: '10px', fontSize: '18px', marginTop: '10px', color: '#F1F5F9' }}>
            Catálogo e Ofertas
          </h2>

          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar por serviço ou Auto Center..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                borderRadius: '10px',
                background: '#121826',
                border: '1px solid #1F293D',
                color: '#F1F5F9',
                fontSize: '13px',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '15px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none',
            }}
          >
            {categorias.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = categoriaAtiva === cat.id;
              return (
                <div
                  key={cat.id}
                  style={{
                    cursor: 'pointer',
                    padding: '8px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '500',
                    background: isSelected ? '#00D2FF' : '#121826',
                    color: isSelected ? '#090D16' : '#F1F5F9',
                    border: '1px solid',
                    borderColor: isSelected ? '#00D2FF' : '#1F293D',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={() => setCategoriaAtiva(cat.id)}
                >
                  <IconComp size={14} color={isSelected ? '#090D16' : '#00D2FF'} />
                  <span>{cat.label}</span>
                </div>
              );
            })}
          </div>

          {ofertasFiltradas.length > 0 ? (
            ofertasFiltradas.map((oferta) => (
              <OfferCard key={oferta.id} offer={oferta} onSelectOffer={handleGerarCupom} />
            ))
          ) : (
            <p style={{ color: '#94A3B8', fontSize: '14px', textAlign: 'center', margin: '20px 0' }}>
              Nenhuma oferta encontrada.
            </p>
          )}
        </div>
      )}

      {telaAtiva === 'cupons' && (
        <MyCouponsScreen coupons={myCoupons} onBack={() => setTelaAtiva('catalogo')} />
      )}

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

      {telaAtiva === 'avaliacoes' && (
        <MyReviewsScreen
          reviews={completedReviews.filter((r) => r.type === 'partner_to_driver')}
          onBack={() => setTelaAtiva('catalogo')}
        />
      )}

      {telaAtiva === 'indique' && (
        <div style={{ background: '#121826', padding: '20px', borderRadius: '12px', border: '1px solid #1F293D' }}>
          <button
            onClick={() => setTelaAtiva('catalogo')}
            style={{
              background: '#121826',
              border: '1px solid #1F293D',
              color: '#00D2FF',
              borderRadius: '20px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            Voltar ao Catálogo
          </button>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#00E676', margin: '8px 0 4px', fontSize: '20px' }}>Indique e Ganhe</h2>
            <p style={{ color: '#94A3B8', fontSize: '13px' }}>
              Compartilhe seu código exclusivo com outros motoristas parceiros e acumule descontos adicionais!
            </p>
          </div>

          <div
            style={{
              background: '#090D16',
              border: '2px dashed #00E676',
              borderRadius: '10px',
              padding: '16px',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>SEU CÓDIGO ÚNICO DE INDICAÇÃO</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#00E676', letterSpacing: '2px' }}>
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
                borderRadius: '10px',
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
              <Share2 size={16} />
              <span>Compartilhar no WhatsApp</span>
            </button>

            <button
              onClick={handleCopyCode}
              style={{
                background: '#1F293D',
                color: '#F1F5F9',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Copy size={16} />
              <span>Copiar Código</span>
            </button>
          </div>
        </div>
      )}

      {telaAtiva === 'ajuda' && (
        <div style={{ background: '#121826', padding: '20px', borderRadius: '12px', border: '1px solid #1F293D' }}>
          <button
            onClick={() => setTelaAtiva('catalogo')}
            style={{
              background: '#121826',
              border: '1px solid #1F293D',
              color: '#00D2FF',
              borderRadius: '20px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            Voltar ao Catálogo
          </button>
          <h2 style={{ color: '#00D2FF', marginTop: 0 }}>Ajuda & Suporte</h2>
          <p style={{ color: '#94A3B8', fontSize: '13px' }}>
            Dúvidas sobre cupons ou agendamentos? Fale diretamente com o suporte oficial do Clube Auto.
          </p>
        </div>
      )}

      <CouponModal coupon={activeCouponModal} onClose={() => setActiveCouponModal(null)} />
      <ReviewModal review={activeReviewModal} onSubmitReview={handleResolveReview} />
    </main>
  );
}