'use client';

import { useState, ChangeEvent } from 'react';
import { PartnerOffer, PendingReview, PartnerProfile, CompletedReview } from '@/types/app';
import { PartnerDrawer } from '@/components/PartnerDrawer';

interface PartnerDashboardProps {
  offers: PartnerOffer[];
  pendingReviews: PendingReview[];
  completedReviews: CompletedReview[];
  partnerProfile: PartnerProfile;
  onUpdatePartnerProfile: (profile: PartnerProfile) => void;
  onToggleOffer: (offerId: string) => void;
  onUpdateStock: (offerId: string, newStock: number) => void;
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
  onSwitchRole,
  onCouponValidated,
  onFinishService,
}: PartnerDashboardProps) {
  const [couponCode, setCouponCode] = useState('');
  const [validationResult, setValidationResult] = useState<{ text: string; success: boolean } | null>(null);
  const [activePartnerTab, setActivePartnerTab] = useState<'dashboard' | 'perfil' | 'avaliacoes' | 'suporte'>('dashboard');

  // Estado Local do Formulário do Parceiro
  const [partnerForm, setPartnerForm] = useState<PartnerProfile>(partnerProfile);

  const partnerPendingReviews = pendingReviews.filter((r) => r.pendingFor === 'partner');
  const partnerReviewsReceived = completedReviews.filter((r) => r.type === 'driver_to_partner');

  const handleValidate = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    if (partnerPendingReviews.length > 0) {
      setValidationResult({
        text: '⚠️ Avaliação Pendente Obrigatória: O motorista finalizou o atendimento. Avalie a experiência abaixo para liberar a validação de novos cupons.',
        success: false,
      });
      return;
    }

    if (couponCode.toUpperCase().startsWith('CLUB-PAR-')) {
      const code = couponCode.toUpperCase();
      setValidationResult({
        text: `Cupom ${code} validado com sucesso! Serviço registrado como Em Andamento.`,
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

  const handleSavePartnerProfile = (e: React.SubmitEvent) => {
    e.preventDefault();
    onUpdatePartnerProfile(partnerForm);
    alert('Dados do Auto Center atualizados com sucesso!');
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', padding: '16px', color: '#f8fafc' }}>
      {/* CABEÇALHO */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '1px solid #334155',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <PartnerDrawer onSelectScreen={(screen) => setActivePartnerTab(screen)} />
          <div>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>MODO AUTO CENTER</span>
            <h2 style={{ fontSize: '18px', margin: 0 }}>{partnerForm.name}</h2>
          </div>
        </div>

        <button
          onClick={onSwitchRole}
          style={{
            background: '#1e293b',
            color: '#38bdf8',
            border: '1px solid #38bdf8',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          🔄 Modo Motorista
        </button>
      </div>

      {/* DASHBOARD PRINCIPAL */}
      {activePartnerTab === 'dashboard' && (
        <>
          <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '15px', color: '#38bdf8', marginTop: 0, marginBottom: '10px' }}>
              🎟️ Validar Cupom no Balcão
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
                  borderRadius: '6px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  color: '#f8fafc',
                  fontSize: '13px',
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#10b981',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '6px',
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
                  borderRadius: '6px',
                  fontSize: '13px',
                  background: validationResult.success ? '#065f46' : '#7f1d1d',
                  color: validationResult.success ? '#34d399' : '#fca5a5',
                  border: validationResult.success ? '1px solid #34d399' : '1px solid #fca5a5',
                }}
              >
                {validationResult.text}
              </div>
            )}
          </div>

          <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '15px', color: '#f59e0b', marginTop: 0, marginBottom: '12px' }}>
              ⏳ Avaliações Pendentes de Motoristas ({partnerPendingReviews.length})
            </h3>

            {partnerPendingReviews.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Nenhuma avaliação pendente no momento. Validação liberada!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {partnerPendingReviews.map((rev) => (
                  <div
                    key={rev.id}
                    style={{
                      background: '#0f172a',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #f59e0b',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#f8fafc' }}>
                        🚘 {rev.driverName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        {rev.serviceTitle} • <span style={{ color: '#38bdf8' }}>{rev.couponCode}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onFinishService(rev.id)}
                      style={{
                        background: '#f59e0b',
                        color: '#0f172a',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      ⭐ Avaliar Motorista
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '15px', color: '#38bdf8', marginTop: 0, marginBottom: '12px' }}>
              ⚙️ Minhas Ofertas Promocionais & Estoque
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  style={{
                    background: '#0f172a',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #334155',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{offer.title}</span>
                    <button
                      onClick={() => onToggleOffer(offer.id)}
                      style={{
                        background: offer.active ? '#065f46' : '#7f1d1d',
                        color: offer.active ? '#34d399' : '#fca5a5',
                        border: 'none',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}
                    >
                      {offer.active ? 'Ativa' : 'Pausada'}
                    </button>
                  </div>

                  <div style={{ fontSize: '13px', color: '#10b981', margin: '6px 0' }}>
                    Preço Promocional: <strong>R$ {offer.discountPrice.toFixed(2)}</strong> (De R$ {offer.originalPrice.toFixed(2)})
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Limite de Cupons:</span>
                    <button
                      onClick={() => onUpdateStock(offer.id, Math.max(0, offer.stockRemaining - 1))}
                      style={{ background: '#334155', color: '#fff', border: 'none', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{offer.stockRemaining} restantes</span>
                    <button
                      onClick={() => onUpdateStock(offer.id, offer.stockRemaining + 1)}
                      style={{ background: '#334155', color: '#fff', border: 'none', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* TELA DE PERFIL DO AUTO CENTER */}
      {activePartnerTab === 'perfil' && (
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <button onClick={() => setActivePartnerTab('dashboard')} style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold' }}>
            ← Voltar ao Painel
          </button>
          <h3 style={{ color: '#10b981', marginTop: 0 }}>🏢 Dados & Fotos da Oficina</h3>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', border: '2px solid #10b981' }}>
              {partnerForm.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={partnerForm.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '36px' }}>🏬</span>
              )}
            </div>
            <label style={{ background: '#334155', color: '#f8fafc', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
              📷 Alterar Logo / Foto da Fachada
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
            </label>
          </div>

          <form onSubmit={handleSavePartnerProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nome Fantasia</label>
              <input type="text" value={partnerForm.name} onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>CNPJ</label>
              <input type="text" value={partnerForm.cnpj} onChange={(e) => setPartnerForm({ ...partnerForm, cnpj: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Endereço Completo</label>
              <input type="text" value={partnerForm.address} onChange={(e) => setPartnerForm({ ...partnerForm, address: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Telefone</label>
                <input type="text" value={partnerForm.phone} onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Horário de Func.</label>
                <input type="text" value={partnerForm.workingHours} onChange={(e) => setPartnerForm({ ...partnerForm, workingHours: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }} />
              </div>
            </div>
            <button type="submit" style={{ marginTop: '10px', background: '#10b981', color: '#0f172a', border: 'none', borderRadius: '6px', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
              Salvar Alterações
            </button>
          </form>
        </div>
      )}

      {/* AVALIAÇÕES RECEBIDAS PELO AUTO CENTER */}
      {activePartnerTab === 'avaliacoes' && (
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <button onClick={() => setActivePartnerTab('dashboard')} style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold' }}>
            ← Voltar ao Painel
          </button>
          <h3 style={{ color: '#f59e0b', marginTop: 0, marginBottom: '15px' }}>⭐ Avaliações Recebidas dos Motoristas</h3>

          {partnerReviewsReceived.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '13px' }}>Nenhuma avaliação recebida ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {partnerReviewsReceived.map((rev) => (
                <div key={rev.id} style={{ background: '#0f172a', padding: '12px', borderRadius: '6px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '13px' }}>🚘 {rev.authorName}</span>
                    <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{rev.rating} ★</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>{rev.serviceTitle}</div>
                  {rev.comment && <p style={{ fontSize: '12px', color: '#cbd5e1', fontStyle: 'italic', margin: 0 }}>&quot;{rev.comment}&quot;</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activePartnerTab === 'suporte' && (
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px' }}>
          <button onClick={() => setActivePartnerTab('dashboard')} style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold' }}>
            ← Voltar ao Painel
          </button>
          <h3 style={{ color: '#38bdf8', marginTop: 0 }}>🎧 Suporte & Ajuda</h3>
          <p style={{ color: '#94a3b8', fontSize: '13px' }}>Precisa de ajuda com cupons ou cadastro? Fale com nosso time de atendimento.</p>
        </div>
      )}
    </div>
  );
}