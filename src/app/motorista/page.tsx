'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/page.module.css';
import { NavigationDrawer, DriverScreenType } from '@/components/NavigationDrawer';
import { OfferCard } from '@/components/OfferCard';
import { ProfileScreen } from '@/components/ProfileScreen';
import { CouponModal } from '@/components/CouponModal';
import { ReviewModal } from '@/components/ReviewModal';
import { MyCouponsScreen } from '@/components/MyCouponsScreen';
import { MyReviewsScreen } from '@/components/MyReviewsScreen';
import { BackButton } from '@/components/BackButton';
import { useAppState } from '@/context/AppState';
import { brl } from '@/lib/format';
import { ActiveCoupon, PartnerOffer, PendingReview } from '@/types/app';
import { Layers, Wrench, CircleDot, Droplets, Share2, Copy, Search, Fuel, Sparkles } from 'lucide-react';

const categorias = [
  { id: 'todas', label: 'Todos', icon: Layers },
  { id: 'alinhamento', label: 'Alinhamento', icon: Wrench },
  { id: 'pneus', label: 'Pneus', icon: CircleDot },
  { id: 'oleo', label: 'Óleo', icon: Droplets },
  { id: 'combustivel', label: 'Combustível', icon: Fuel },
  { id: 'lavagem', label: 'Lavagem', icon: Sparkles },
];

export default function MotoristaPage() {
  const router = useRouter();
  const app = useAppState();

  const [telaAtiva, setTelaAtiva] = useState<DriverScreenType>('catalogo');
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCouponModal, setActiveCouponModal] = useState<ActiveCoupon | null>(null);
  const [activeReviewModal, setActiveReviewModal] = useState<PendingReview | null>(null);

  // Esta área é só para contas de motorista.
  useEffect(() => {
    if (app.role !== 'driver') router.replace('/');
  }, [app.role, router]);

  if (app.role !== 'driver') return null;

  const { userProfile, coupons, offers } = app;

  const referralCode = `CLUB-${userProfile.name.split(' ')[0].toUpperCase()}-8921`;

  const totalEconomy = coupons
    .filter((c) => c.status === 'used')
    .reduce((acc, curr) => acc + (curr.originalPrice - curr.discountPrice), 0);

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
      if (aDisponivel !== bDisponivel) return bDisponivel - aDisponivel;
      return (b.isDailyOffer ? 1 : 0) - (a.isDailyOffer ? 1 : 0);
    });

  const handleGerarCupom = (oferta: PartnerOffer) => {
    const coupon = app.generateCoupon(oferta);
    if (coupon) setActiveCouponModal(coupon);
  };

  const handleResolveReview = (reviewId: string, rating: number, comment: string) => {
    app.resolveReview(reviewId, rating, comment);
    setActiveReviewModal(null);
    alert(`Avaliação de ${rating}★ salva com sucesso!`);
  };

  const driverPendingList = app.pendingReviews.filter((r) => r.pendingFor === 'driver');

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

  const handleSignOut = () => {
    app.signOut();
    router.push('/');
  };

  return (
    <main className={styles.container}>
      <header className={styles.headerDash}>
        <div className={styles.brand}>
          <NavigationDrawer onSelectScreen={(t) => setTelaAtiva(t)} onSignOut={handleSignOut} />
          <div className={styles.wordmark}>
            <span className={styles.wordmarkName}>Clube Auto</span>
            <span className={styles.laneMark} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </div>
        </div>

        <div className={styles.plate} role="img" aria-label={`Placa ${userProfile.plate}`}>
          <span className={styles.plateBand}>BRASIL</span>
          <span className={styles.plateNumber}>{userProfile.plate}</span>
        </div>
      </header>

      {driverPendingList.length > 0 && (
        <div className={styles.notice}>
          {driverPendingList.map((rev) => (
            <div key={rev.id} style={{ display: 'contents' }}>
              <div>
                <p className={styles.noticeTitle}>Serviço em andamento: {rev.serviceTitle}</p>
                <p className={styles.noticeMeta}>{rev.partnerName}</p>
              </div>
              <button type="button" className={styles.noticeAction} onClick={() => setActiveReviewModal(rev)}>
                Avaliar
              </button>
            </div>
          ))}
        </div>
      )}

      {telaAtiva === 'catalogo' && (
        <div>
          <section className={styles.savings} aria-label="Resumo da sua economia">
            <div>
              <p className={styles.greeting}>Olá, {userProfile.name.split(' ')[0]}</p>
              <p className={styles.savingsValue}>{brl(totalEconomy)}</p>
              <p className={styles.savingsLabel}>economizados com o clube</p>
            </div>
            <div className={styles.couponCount}>
              <strong>{coupons.length}</strong>
              {coupons.length === 1 ? 'cupom gerado' : 'cupons gerados'}
            </div>
          </section>

          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Ofertas</h2>
            <span className={styles.sectionCount}>
              {ofertasFiltradas.length} {ofertasFiltradas.length === 1 ? 'disponível' : 'disponíveis'}
            </span>
          </div>

          <div className={styles.search}>
            <Search size={18} className={styles.searchIcon} aria-hidden="true" />
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Buscar serviço ou auto center"
              aria-label="Buscar serviço ou auto center"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.chips} role="group" aria-label="Filtrar por categoria">
            {categorias.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = categoriaAtiva === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={isSelected}
                  className={`${styles.chip} ${isSelected ? styles.chipActive : ''}`}
                  onClick={() => setCategoriaAtiva(cat.id)}
                >
                  <IconComp size={16} aria-hidden="true" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {ofertasFiltradas.length > 0 ? (
            <div className={styles.offers}>
              {ofertasFiltradas.map((oferta) => (
                <OfferCard key={oferta.id} offer={oferta} onSelectOffer={handleGerarCupom} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>Nenhuma oferta encontrada</p>
              <p>Troque a categoria ou busque por outro serviço.</p>
              <button
                type="button"
                className={styles.emptyAction}
                onClick={() => {
                  setCategoriaAtiva('todas');
                  setSearchTerm('');
                }}
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      )}

      {telaAtiva === 'cupons' && (
        <div className={styles.narrow}>
          <MyCouponsScreen coupons={coupons} onBack={() => setTelaAtiva('catalogo')} />
        </div>
      )}

      {telaAtiva === 'perfil' && (
        <div className={styles.narrow}>
          <ProfileScreen
            profile={userProfile}
            onSave={(updated) => {
              app.setUserProfile(updated);
              setTelaAtiva('catalogo');
            }}
            onBack={() => setTelaAtiva('catalogo')}
          />
        </div>
      )}

      {telaAtiva === 'avaliacoes' && (
        <div className={styles.narrow}>
          <MyReviewsScreen
            reviews={app.completedReviews.filter((r) => r.type === 'partner_to_driver')}
            onBack={() => setTelaAtiva('catalogo')}
          />
        </div>
      )}

      {telaAtiva === 'indique' && (
        <div className={styles.narrow}>
          <BackButton onClick={() => setTelaAtiva('catalogo')} />
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Indique e ganhe</h2>
            <p className={styles.panelText}>
              Compartilhe seu código com outros motoristas e acumule descontos adicionais.
            </p>

            <div className={styles.referralCode}>
              <p className={styles.referralLabel}>Seu código de indicação</p>
              <p className={styles.referralValue}>{referralCode}</p>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.btnPrimary} onClick={handleShareWhatsApp}>
                <Share2 size={20} aria-hidden="true" />
                Enviar pelo WhatsApp
              </button>
              <button type="button" className={styles.btnGhost} onClick={handleCopyCode}>
                <Copy size={20} aria-hidden="true" />
                Copiar código
              </button>
            </div>
          </section>
        </div>
      )}

      {telaAtiva === 'ajuda' && (
        <div className={styles.narrow}>
          <BackButton onClick={() => setTelaAtiva('catalogo')} />
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Ajuda e suporte</h2>
            <p className={styles.panelText}>
              Dúvidas sobre cupons ou agendamentos? Fale com o suporte oficial do Clube Auto.
            </p>
          </section>
        </div>
      )}

      <CouponModal coupon={activeCouponModal} onClose={() => setActiveCouponModal(null)} />
      <ReviewModal key={activeReviewModal?.id ?? 'none'} review={activeReviewModal} onSubmitReview={handleResolveReview} />
    </main>
  );
}
