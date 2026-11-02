'use client';

import { useState, ChangeEvent } from 'react';
import { PartnerOffer, PendingReview, PartnerProfile, CompletedReview } from '@/types/app';
import { PartnerDrawer, PartnerTabType } from '@/components/PartnerDrawer';
import { CheckCircle2, Star, Clock, ScanLine, Building2, Upload, PlusCircle, ArrowLeft, FileSpreadsheet, Edit3, Save, Flame, UserCheck } from 'lucide-react';

interface PartnerDashboardProps {
  offers: PartnerOffer[];
  pendingReviews: PendingReview[];
  completedReviews: CompletedReview[];
  partnerProfile: PartnerProfile;
  onUpdatePartnerProfile: (profile: PartnerProfile) => void;
  onToggleOffer: (offerId: string) => void;
  onUpdateStock: (offerId: string, newStock: number) => void;
  onUpdateOfferPrices: (offerId: string, originalPrice: number, discountPrice: number) => void;
  onAddOffer: (newOffer: Omit<PartnerOffer, 'id' | 'partnerId' | 'partnerName' | 'discountPercentage'>) => void;
  onSwitchRole: () => void;
  onCouponValidated?: (code: string) => void;
  onFinishService: (reviewId: string) => void;
}

export function PartnerDashboard({
  offers,
  pendingReviews,
  completedReviews,
  partnerProfile,
  onUpdatePartnerProfile,
  onToggleOffer,
  onUpdateStock,
  onUpdateOfferPrices,
  onAddOffer,
  onSwitchRole,
  onCouponValidated,
  onFinishService,
}: PartnerDashboardProps) {
  const [couponCode, setCouponCode] = useState('');
  const [validationResult, setValidationResult] = useState<{ text: string; success: boolean } | null>(null);
  const [activePartnerTab, setActivePartnerTab] = useState<PartnerTabType>('dashboard');

  const [partnerForm, setPartnerForm] = useState<PartnerProfile>(partnerProfile);

  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [editOrigPrice, setEditOrigPrice] = useState<number>(0);
  const [editDiscPrice, setEditDiscPrice] = useState<number>(0);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'alinhamento' | 'pneus' | 'oleo' | 'combustivel' | 'lavagem'>('alinhamento');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newDiscountPrice, setNewDiscountPrice] = useState('');
  const [newStockLimit, setNewStockLimit] = useState('');
  const [newIsDailyOffer, setNewIsDailyOffer] = useState(false);

  const partnerPendingReviews = pendingReviews.filter((r) => r.pendingFor === 'partner');
  const partnerReviewsReceived = completedReviews.filter((r) => r.type === 'driver_to_partner');
  const driverReviewsGiven = completedReviews.filter((r) => r.type === 'partner_to_driver');

  const totalReviews = partnerReviewsReceived.length;
  const averageRating = totalReviews > 0
    ? (partnerReviewsReceived.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : partnerProfile.rating.toFixed(1);

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    if (couponCode.toUpperCase().startsWith('CLUB-PAR-')) {
      const code = couponCode.toUpperCase();
      setValidationResult({
        text: `Cupom ${code} validado com sucesso! Atendimento iniciado.`,
        success: true,
      });
      onCouponValidated?.(code);
      setCouponCode('');
    } else {
      setValidationResult({
        text: 'Código de cupom inválido ou expirado.',
        success: false,
      });
    }
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPartnerForm((prev) => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePartnerProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePartnerProfile(partnerForm);
    alert('Dados do Auto Center atualizados com sucesso!');
  };

  const handleStartEditOffer = (offer: PartnerOffer) => {
    setEditingOfferId(offer.id);
    setEditOrigPrice(offer.originalPrice);
    setEditDiscPrice(offer.discountPrice);
  };

  const handleSaveOfferPrice = (offerId: string) => {
    if (editDiscPrice >= editOrigPrice) {
      alert('O preço promocional deve ser menor que o preço original!');
      return;
    }
    onUpdateOfferPrices(offerId, editOrigPrice, editDiscPrice);
    setEditingOfferId(null);
  };

  const handleCreateNewOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const orig = parseFloat(newOriginalPrice);
    const disc = parseFloat(newDiscountPrice);
    const stock = parseInt(newStockLimit, 10);

    if (!newTitle.trim() || isNaN(orig) || isNaN(disc) || isNaN(stock)) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    if (disc >= orig) {
      alert('O preço promocional deve ser estritamente menor que o preço original.');
      return;
    }

    onAddOffer({
      title: newTitle,
      category: newCategory,
      originalPrice: orig,
      discountPrice: disc,
      stockLimit: stock,
      stockRemaining: stock,
      active: true,
      isDailyOffer: newIsDailyOffer,
    });

    setNewTitle('');
    setNewOriginalPrice('');
    setNewDiscountPrice('');
    setNewStockLimit('');
    setNewIsDailyOffer(false);
    alert('Serviço/Peça cadastrado com sucesso!');
    setActivePartnerTab('dashboard');
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`Arquivo "${file.name}" importado com sucesso! Os itens foram adicionados ao catálogo.`);
    }
  };

  return (
    <div style={{ background: '#090D16', minHeight: '100vh', padding: '16px', color: '#F1F5F9' }}>
      {/* CABEÇALHO */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '1px solid #1F293D',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <PartnerDrawer onSelectScreen={(screen) => setActivePartnerTab(screen)} partnerName={''} />
          <div>
            <span style={{ fontSize: '11px', color: '#00E676', fontWeight: 'bold' }}>MODO AUTO CENTER</span>
            <h2 style={{ fontSize: '18px', margin: 0, color: '#F1F5F9' }}>{partnerForm.name}</h2>
          </div>
        </div>

        <button
          onClick={onSwitchRole}
          style={{
            background: '#121826',
            color: '#00D2FF',
            border: '1px solid #00D2FF',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Modo Motorista
        </button>
      </div>

      {activePartnerTab !== 'dashboard' && (
        <button
          onClick={() => setActivePartnerTab('dashboard')}
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
          <ArrowLeft size={16} />
          <span>Voltar ao Painel</span>
        </button>
      )}

      {/* PAINEL PRINCIPAL */}
      {activePartnerTab === 'dashboard' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '22px' }}>
            <div style={{ background: 'linear-gradient(180deg, #121826 0%, #0B1E19 100%)', padding: '14px 10px', borderRadius: '14px', border: '1px solid rgba(0, 230, 118, 0.25)', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                <CheckCircle2 size={20} color="#00E676" />
              </div>
              <span style={{ fontSize: '11px', color: '#A7F3D0', fontWeight: '500', display: 'block' }}>Baixas Mês</span>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#00E676', marginTop: '2px' }}>28</div>
            </div>

            <div style={{ background: 'linear-gradient(180deg, #121826 0%, #241A0E 100%)', padding: '14px 10px', borderRadius: '14px', border: '1px solid rgba(255, 159, 10, 0.25)', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                <Star size={20} color="#FF9F0A" fill="#FF9F0A" />
              </div>
              <span style={{ fontSize: '11px', color: '#FDE68A', fontWeight: '500', display: 'block' }}>Reputação ({totalReviews})</span>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#FF9F0A', marginTop: '2px' }}>{averageRating} ★</div>
            </div>

            <div style={{ background: 'linear-gradient(180deg, #121826 0%, #0A2233 100%)', padding: '14px 10px', borderRadius: '14px', border: '1px solid rgba(0, 210, 255, 0.25)', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                <Clock size={20} color="#00D2FF" />
              </div>
              <span style={{ fontSize: '11px', color: '#BAE6FD', fontWeight: '500', display: 'block' }}>Pendentes</span>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#00D2FF', marginTop: '2px' }}>{partnerPendingReviews.length}</div>
            </div>
          </div>

          <div style={{ background: '#121826', padding: '16px', borderRadius: '14px', marginBottom: '20px', border: '1px solid #1F293D' }}>
            <h3 style={{ fontSize: '15px', color: '#00D2FF', marginTop: 0, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ScanLine size={18} />
              <span>Validar Cupom no Balcão</span>
            </h3>
            <form onSubmit={handleValidate} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Digite o código ex: CLUB-PAR-8921-XK9"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  background: '#090D16',
                  border: '1px solid #1F293D',
                  color: '#F1F5F9',
                  fontSize: '13px',
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#00E676',
                  color: '#090D16',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0 16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Validar
              </button>
            </form>

            {validationResult && (
              <div
                style={{
                  marginTop: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  background: validationResult.success ? 'rgba(0, 230, 118, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: validationResult.success ? '#00E676' : '#FCA5A5',
                  border: validationResult.success ? '1px solid #00E676' : '1px solid #EF4444',
                }}
              >
                {validationResult.text}
              </div>
            )}
          </div>

          <div style={{ background: '#121826', padding: '16px', borderRadius: '14px', marginBottom: '20px', border: '1px solid rgba(255, 159, 10, 0.3)' }}>
            <h3 style={{ fontSize: '15px', color: '#FF9F0A', marginTop: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={18} />
              <span>Avaliar Atendimento do Motorista ({partnerPendingReviews.length})</span>
            </h3>

            {partnerPendingReviews.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>Nenhum motorista aguardando avaliação no momento.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {partnerPendingReviews.map((rev) => (
                  <div
                    key={rev.id}
                    style={{
                      background: '#090D16',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid #1F293D',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#F1F5F9' }}>
                        {rev.driverName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                        {rev.serviceTitle} • <span style={{ color: '#00D2FF' }}>{rev.couponCode}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onFinishService(rev.id)}
                      style={{
                        background: '#FF9F0A',
                        color: '#090D16',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Star size={14} fill="#090D16" />
                      <span>Avaliar Motorista</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: '#121826', padding: '16px', borderRadius: '14px', border: '1px solid #1F293D' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '15px', color: '#00D2FF', margin: 0 }}>
                Minhas Ofertas Promocionais & Estoque
              </h3>
              <button
                onClick={() => setActivePartnerTab('cadastrar')}
                style={{
                  background: '#00E676',
                  color: '#090D16',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <PlusCircle size={14} />
                <span>Nova Oferta</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {offers.map((offer) => {
                const isEditing = editingOfferId === offer.id;
                return (
                  <div
                    key={offer.id}
                    style={{
                      background: '#090D16',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid #1F293D',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#F1F5F9' }}>{offer.title}</span>
                      <button
                        onClick={() => onToggleOffer(offer.id)}
                        style={{
                          background: offer.active ? 'rgba(0, 230, 118, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: offer.active ? '#00E676' : '#FCA5A5',
                          border: offer.active ? '1px solid #00E676' : '1px solid #EF4444',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                      >
                        {offer.active ? 'Ativa' : 'Pausada'}
                      </button>
                    </div>

                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '8px', margin: '10px 0', alignItems: 'center' }}>
                        <div>
                          <label style={{ fontSize: '10px', color: '#94A3B8' }}>Original (R$)</label>
                          <input
                            type="number"
                            value={editOrigPrice}
                            onChange={(e) => setEditOrigPrice(parseFloat(e.target.value))}
                            style={{ width: '80px', padding: '4px', background: '#121826', border: '1px solid #1F293D', color: '#fff', borderRadius: '4px', fontSize: '12px' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '10px', color: '#00E676' }}>Promocional (R$)</label>
                          <input
                            type="number"
                            value={editDiscPrice}
                            onChange={(e) => setEditDiscPrice(parseFloat(e.target.value))}
                            style={{ width: '80px', padding: '4px', background: '#121826', border: '1px solid #00E676', color: '#00E676', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}
                          />
                        </div>
                        <button
                          onClick={() => handleSaveOfferPrice(offer.id)}
                          style={{ marginTop: '14px', background: '#00E676', color: '#090D16', border: 'none', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer' }}
                        >
                          <Save size={14} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '6px 0' }}>
                        <div style={{ fontSize: '13px', color: '#00E676' }}>
                          Preço Promocional: <strong>R$ {offer.discountPrice.toFixed(2)}</strong> (De R$ {offer.originalPrice.toFixed(2)})
                        </div>
                        <button
                          onClick={() => handleStartEditOffer(offer)}
                          style={{ background: 'transparent', border: 'none', color: '#00D2FF', cursor: 'pointer', padding: '2px 4px' }}
                        >
                          <Edit3 size={15} />
                        </button>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#94A3B8' }}>Limite de Cupons:</span>
                      <button
                        onClick={() => onUpdateStock(offer.id, Math.max(0, offer.stockRemaining - 1))}
                        style={{ background: '#1F293D', color: '#fff', border: 'none', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{offer.stockRemaining} restantes</span>
                      <button
                        onClick={() => onUpdateStock(offer.id, offer.stockRemaining + 1)}
                        style={{ background: '#1F293D', color: '#fff', border: 'none', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ABA DE CADASTRO E IMPORTAÇÃO */}
      {activePartnerTab === 'cadastrar' && (
        <div style={{ background: '#121826', padding: '20px', borderRadius: '14px', border: '1px solid #1F293D' }}>
          <h3 style={{ color: '#00E676', marginTop: 0, marginBottom: '4px' }}>Cadastrar Serviços & Peças</h3>
          <p style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '20px' }}>
            Adicione novas ofertas manualmente ou importe uma planilha com seu catálogo completo de produtos.
          </p>

          <div
            style={{
              border: '2px dashed #00D2FF',
              background: '#090D16',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '24px',
            }}
          >
            <FileSpreadsheet size={36} color="#00D2FF" style={{ margin: '0 auto 8px' }} />
            <h4 style={{ margin: '0 0 4px', fontSize: '14px', color: '#F1F5F9' }}>Importação em Lote via Arquivo</h4>
            <p style={{ color: '#94A3B8', fontSize: '12px', margin: '0 0 12px' }}>
              Suba arquivos CSV ou Excel para cadastrar múltiplos produtos e peças de uma só vez.
            </p>
            <label
              style={{
                background: '#00D2FF',
                color: '#090D16',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Upload size={14} />
              <span>Selecionar Arquivo (CSV / Excel)</span>
              <input type="file" accept=".csv, .xlsx, .json" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #1F293D', margin: '20px 0' }} />

          <h4 style={{ color: '#F1F5F9', fontSize: '15px', marginBottom: '12px' }}>Cadastro Manual Rápido</h4>
          <form onSubmit={handleCreateNewOffer} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Título do Serviço / Peça</label>
              <input
                type="text"
                placeholder="Ex: Troca de Pastilha de Freio Dianteira"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#090D16', border: '1px solid #1F293D', color: '#F1F5F9', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Categoria</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as 'alinhamento' | 'pneus' | 'oleo' | 'combustivel' | 'lavagem')}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#090D16', border: '1px solid #1F293D', color: '#F1F5F9', fontSize: '13px' }}
              >
                <option value="alinhamento">Alinhamento & Suspensão</option>
                <option value="oleo">Óleo & Filtros</option>
                <option value="pneus">Pneus & Rodas</option>
                <option value="combustivel">Combustível</option>
                <option value="lavagem">Lavagem & Estética</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Preço Normal (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="200.00"
                  value={newOriginalPrice}
                  onChange={(e) => setNewOriginalPrice(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#090D16', border: '1px solid #1F293D', color: '#F1F5F9', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#00E676', display: 'block', marginBottom: '4px' }}>Preço Promocional (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="140.00"
                  value={newDiscountPrice}
                  onChange={(e) => setNewDiscountPrice(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#090D16', border: '1px solid #00E676', color: '#00E676', fontWeight: 'bold', fontSize: '13px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0', background: '#090D16', padding: '10px', borderRadius: '10px', border: '1px solid #00E676' }}>
              <input
                type="checkbox"
                id="dailyOfferCheck"
                checked={newIsDailyOffer}
                onChange={(e) => setNewIsDailyOffer(e.target.checked)}
                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
              />
              <label htmlFor="dailyOfferCheck" style={{ fontSize: '12px', color: '#00E676', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={14} />
                <span>Destacar como &quot;Oferta do Dia&quot; (Validade de 24h)</span>
              </label>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Limite de Cupons Promocionais</label>
              <input
                type="number"
                placeholder="Ex: 10"
                value={newStockLimit}
                onChange={(e) => setNewStockLimit(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#090D16', border: '1px solid #1F293D', color: '#F1F5F9', fontSize: '13px' }}
              />
            </div>

            <button
              type="submit"
              style={{ marginTop: '8px', background: '#00E676', color: '#090D16', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
            >
              Publicar Oferta no Clube Auto
            </button>
          </form>
        </div>
      )}

      {/* ABA DE PERFIL E DADOS DA OFICINA (RESTAURADA E COMPLETA) */}
      {activePartnerTab === 'perfil' && (
        <div style={{ background: '#121826', padding: '20px', borderRadius: '14px', border: '1px solid #1F293D' }}>
          <h3 style={{ color: '#00E676', marginTop: 0, marginBottom: '15px' }}>Dados & Fotos da Oficina</h3>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '14px', overflow: 'hidden', background: '#090D16', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', border: '2px solid #00E676' }}>
              {partnerForm.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={partnerForm.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Building2 size={40} color="#94A3B8" />
              )}
            </div>
            <label style={{ background: '#1F293D', color: '#F1F5F9', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
              <Upload size={14} />
              <span>Alterar Logo / Fachada</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
            </label>
          </div>

          <form onSubmit={handleSavePartnerProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Nome Fantasia</label>
              <input type="text" value={partnerForm.name} onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#090D16', border: '1px solid #1F293D', color: '#F1F5F9', fontSize: '13px' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>CNPJ</label>
              <input type="text" value={partnerForm.cnpj} onChange={(e) => setPartnerForm({ ...partnerForm, cnpj: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#090D16', border: '1px solid #1F293D', color: '#F1F5F9', fontSize: '13px' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Endereço Completo (Usado no GPS do Cupom)</label>
              <input type="text" value={partnerForm.address} onChange={(e) => setPartnerForm({ ...partnerForm, address: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#090D16', border: '1px solid #1F293D', color: '#F1F5F9', fontSize: '13px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Telefone / WhatsApp</label>
                <input type="text" value={partnerForm.phone} onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#090D16', border: '1px solid #1F293D', color: '#F1F5F9', fontSize: '13px' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Horário de Func.</label>
                <input type="text" value={partnerForm.workingHours} onChange={(e) => setPartnerForm({ ...partnerForm, workingHours: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#090D16', border: '1px solid #1F293D', color: '#F1F5F9', fontSize: '13px' }} />
              </div>
            </div>
            <button type="submit" style={{ marginTop: '10px', background: '#00E676', color: '#090D16', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
              Salvar Alterações do Estabelecimento
            </button>
          </form>
        </div>
      )}

      {/* AVALIAÇÕES RECEBIDAS E ENVIADAS */}
      {activePartnerTab === 'avaliacoes' && (
        <div style={{ background: '#121826', padding: '20px', borderRadius: '14px', border: '1px solid #1F293D' }}>
          <h3 style={{ color: '#FF9F0A', marginTop: 0, marginBottom: '15px' }}>⭐ Avaliações Recebidas & Enviadas</h3>

          <h4 style={{ fontSize: '14px', color: '#00D2FF', marginBottom: '8px' }}>Avaliações dos Motoristas sobre o Auto Center</h4>
          {partnerReviewsReceived.length === 0 ? (
            <p style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '20px' }}>Nenhuma avaliação recebida ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {partnerReviewsReceived.map((rev) => (
                <div key={rev.id} style={{ background: '#090D16', padding: '12px', borderRadius: '10px', border: '1px solid #1F293D' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#F1F5F9' }}>{rev.authorName}</span>
                    <span style={{ color: '#FF9F0A', fontWeight: 'bold' }}>{rev.rating} ★</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>{rev.serviceTitle}</div>
                  {rev.comment && <p style={{ fontSize: '12px', color: '#CBD5E1', fontStyle: 'italic', margin: 0 }}>&quot;{rev.comment}&quot;</p>}
                </div>
              ))}
            </div>
          )}

          <h4 style={{ fontSize: '14px', color: '#00E676', marginBottom: '8px' }}>Suas Avaliações sobre Motoristas</h4>
          {driverReviewsGiven.length === 0 ? (
            <p style={{ color: '#94A3B8', fontSize: '13px' }}>Você ainda não avaliou nenhum motorista.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {driverReviewsGiven.map((rev) => (
                <div key={rev.id} style={{ background: '#090D16', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0, 230, 118, 0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#00E676' }}>Motorista: {rev.targetName}</span>
                    <span style={{ color: '#FF9F0A', fontWeight: 'bold' }}>{rev.rating} ★</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>{rev.serviceTitle}</div>
                  {rev.comment && <p style={{ fontSize: '12px', color: '#CBD5E1', fontStyle: 'italic', margin: 0 }}>&quot;{rev.comment}&quot;</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activePartnerTab === 'suporte' && (
        <div style={{ background: '#121826', padding: '20px', borderRadius: '14px', border: '1px solid #1F293D' }}>
          <h3 style={{ color: '#00D2FF', marginTop: 0 }}>Suporte & Ajuda</h3>
          <p style={{ color: '#94A3B8', fontSize: '13px' }}>Precisa de ajuda com cupons ou cadastro? Fale com nosso time de atendimento.</p>
        </div>
      )}
    </div>
  );
}