'use client';

import { useState, ChangeEvent } from 'react';
import { PartnerOffer, PendingReview, PartnerProfile, CompletedReview } from '@/types/app';
import { PartnerDrawer, PartnerTabType } from '@/components/PartnerDrawer';
import { BackButton } from '@/components/BackButton';
import { brl } from '@/lib/format';
import { Star, ScanLine, Building2, Upload, PlusCircle, FileSpreadsheet, Edit3, Save, Flame, UserCheck, Minus, Plus, MapPin } from 'lucide-react';
import ui from './ui.module.css';
import styles from './PartnerDashboard.module.css';

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
  onSignOut: () => void;
  onValidateCoupon: (code: string) => { success: boolean; message: string };
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
  onSignOut,
  onValidateCoupon,
  onFinishService,
}:PartnerDashboardProps) {
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

  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Funciona no navegador do computador e do celular (exige HTTPS ou localhost).
  const handleCaptureLocation = () => {
    setLocationError(null);
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationError('Este dispositivo ou navegador não suporta localização por GPS.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPartnerForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          locationAccuracyM: pos.coords.accuracy,
        }));
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setLocationError(
          err.code === err.PERMISSION_DENIED
            ? 'Permissão de localização negada. Libere o acesso à localização nas configurações do navegador e tente de novo.'
            : err.code === err.TIMEOUT
              ? 'Não foi possível obter a localização a tempo. Vá para um local aberto e tente novamente.'
              : 'Localização indisponível no momento. Verifique se o GPS está ligado.'
        );
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  const partnerPendingReviews = pendingReviews.filter((r) => r.pendingFor === 'partner');
  const partnerReviewsReceived = completedReviews.filter((r) => r.type === 'driver_to_partner');
  const driverReviewsGiven = completedReviews.filter((r) => r.type === 'partner_to_driver');

  const totalReviews = partnerReviewsReceived.length;
  const averageRating = totalReviews > 0
    ? (partnerReviewsReceived.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : partnerProfile.rating.toFixed(1);

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    const result = onValidateCoupon(code);
    setValidationResult({ text: result.message, success: result.success });
    if (result.success) setCouponCode('');
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
    if (!Number.isFinite(editOrigPrice) || !Number.isFinite(editDiscPrice) || editOrigPrice <= 0 || editDiscPrice <= 0) {
      alert('Informe preços válidos, maiores que zero.');
      return;
    }
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

    if (!newTitle.trim() || !Number.isFinite(orig) || !Number.isFinite(disc) || !Number.isFinite(stock)) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    if (orig <= 0 || disc <= 0) {
      alert('Os preços devem ser maiores que zero.');
      return;
    }

    if (stock < 1) {
      alert('O limite de cupons deve ser de pelo menos 1.');
      return;
    }

    if (disc >= orig) {
      alert('O preço promocional deve ser estritamente menor que o preço original.');
      return;
    }

    onAddOffer({
      title: newTitle.trim(),
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

  const renderReview = (rev: (typeof partnerReviewsReceived)[number], who: string) => (
    <li key={rev.id} className={ui.review}>
      <div className={ui.reviewHead}>
        <span className={ui.reviewAuthor}>{who}</span>
        <span className={ui.stars} aria-label={`${rev.rating} estrelas`}>
          {rev.rating}
          <Star size={18} fill="currentColor" aria-hidden="true" />
        </span>
      </div>
      <p className={ui.reviewService}>{rev.serviceTitle}</p>
      {rev.comment && <p className={ui.reviewComment}>&ldquo;{rev.comment}&rdquo;</p>}
    </li>
  );

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.who}>
          <PartnerDrawer onSelectScreen={(screen) => setActivePartnerTab(screen)} partnerName={partnerForm.name} />
          <div className={styles.whoText}>
            <span className={styles.whoKicker}>Área do auto center</span>
            <p className={styles.whoName}>{partnerForm.name}</p>
          </div>
        </div>

        <button type="button" className={ui.btnGhost} onClick={onSignOut}>
          Sair
        </button>
      </header>

      {activePartnerTab !== 'dashboard' && (
        <div className={styles.back}>
          <BackButton onClick={() => setActivePartnerTab('dashboard')} label="Voltar ao painel" />
        </div>
      )}

      {/* PAINEL PRINCIPAL */}
      {activePartnerTab === 'dashboard' && (
        <>
          <section className={styles.stats} aria-label="Resumo do auto center">
            <div className={styles.stat}>
              <p className={`${styles.statValue} ${styles.statLane}`}>28</p>
              <p className={styles.statLabel}>baixas no mês</p>
            </div>
            <div className={styles.stat}>
              <p className={`${styles.statValue} ${styles.statWarn}`}>{averageRating}</p>
              <p className={styles.statLabel}>nota ({totalReviews})</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statValue}>{partnerPendingReviews.length}</p>
              <p className={styles.statLabel}>a avaliar</p>
            </div>
          </section>

          <section className={styles.counter} aria-label="Validar cupom">
            <h3 className={styles.counterTitle}>
              <ScanLine size={26} aria-hidden="true" />
              Validar cupom no balcão
            </h3>
            <form onSubmit={handleValidate} className={styles.counterForm}>
              <input
                type="text"
                className={styles.codeInput}
                placeholder="CLUB-PAR-0000-XXXX"
                aria-label="Código do cupom"
                autoComplete="off"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button type="submit" className={ui.btn}>
                Validar cupom
              </button>
            </form>

            {validationResult && (
              <p
                role="status"
                className={`${styles.result} ${validationResult.success ? '' : styles.resultError}`}
              >
                {validationResult.text}
              </p>
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h3 className={styles.sectionTitle}>Motoristas para avaliar</h3>
            </div>

            {partnerPendingReviews.length === 0 ? (
              <div className={ui.empty}>
                <p className={ui.emptyTitle}>Nenhum motorista aguardando</p>
                <p>Depois de validar um cupom, o atendimento aparece aqui para você avaliar.</p>
              </div>
            ) : (
              <ul className={styles.pending}>
                {partnerPendingReviews.map((rev) => (
                  <li key={rev.id} className={styles.pendingItem}>
                    <div>
                      <p className={styles.pendingName}>{rev.driverName}</p>
                      <p className={styles.pendingMeta}>
                        {rev.serviceTitle}, cupom <span className={styles.pendingCode}>{rev.couponCode}</span>
                      </p>
                    </div>
                    <button type="button" className={styles.warnBtn} onClick={() => onFinishService(rev.id)}>
                      <UserCheck size={18} aria-hidden="true" />
                      Avaliar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h3 className={styles.sectionTitle}>Ofertas e estoque</h3>
              <button type="button" className={ui.btnSmall} onClick={() => setActivePartnerTab('cadastrar')}>
                <PlusCircle size={18} aria-hidden="true" />
                Nova oferta
              </button>
            </div>

            <div className={styles.offers}>
              {offers.map((offer) => {
                const isEditing = editingOfferId === offer.id;
                return (
                  <article
                    key={offer.id}
                    className={`${styles.offer} ${offer.active ? '' : styles.offerPaused}`}
                  >
                    <div className={styles.offerHead}>
                      <h4 className={styles.offerTitle}>{offer.title}</h4>
                      <button
                        type="button"
                        aria-pressed={offer.active}
                        className={`${styles.toggle} ${offer.active ? '' : styles.toggleOff}`}
                        onClick={() => onToggleOffer(offer.id)}
                      >
                        {offer.active ? 'Ativa' : 'Pausada'}
                      </button>
                    </div>

                    {isEditing ? (
                      <div className={styles.editRow}>
                        <div className={ui.field}>
                          <label className={ui.label} htmlFor={`orig-${offer.id}`}>Preço normal</label>
                          <input
                            id={`orig-${offer.id}`}
                            className={ui.input}
                            type="number"
                            value={editOrigPrice}
                            onChange={(e) => setEditOrigPrice(parseFloat(e.target.value))}
                          />
                        </div>
                        <div className={ui.field}>
                          <label className={ui.label} htmlFor={`disc-${offer.id}`}>Promocional</label>
                          <input
                            id={`disc-${offer.id}`}
                            className={`${ui.input} ${ui.inputPrice}`}
                            type="number"
                            value={editDiscPrice}
                            onChange={(e) => setEditDiscPrice(parseFloat(e.target.value))}
                          />
                        </div>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          aria-label="Salvar preços"
                          onClick={() => handleSaveOfferPrice(offer.id)}
                        >
                          <Save size={20} aria-hidden="true" />
                        </button>
                      </div>
                    ) : (
                      <div className={styles.priceLine}>
                        <p className={styles.price}>
                          {brl(offer.discountPrice)}
                          <span className={styles.priceWas}>{brl(offer.originalPrice)}</span>
                        </p>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          aria-label="Editar preços"
                          onClick={() => handleStartEditOffer(offer)}
                        >
                          <Edit3 size={20} aria-hidden="true" />
                        </button>
                      </div>
                    )}

                    <div className={styles.stock}>
                      <span className={styles.stockLabel}>Cupons restantes</span>
                      <div className={styles.stepper}>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          aria-label="Diminuir estoque"
                          onClick={() => onUpdateStock(offer.id, Math.max(0, offer.stockRemaining - 1))}
                        >
                          <Minus size={20} aria-hidden="true" />
                        </button>
                        <span className={styles.stepValue}>{offer.stockRemaining}</span>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          aria-label="Aumentar estoque"
                          disabled={offer.stockRemaining >= offer.stockLimit}
                          onClick={() => onUpdateStock(offer.id, offer.stockRemaining + 1)}
                        >
                          <Plus size={20} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* CADASTRO E IMPORTAÇÃO */}
      {activePartnerTab === 'cadastrar' && (
        <section className={`${ui.panel} ${styles.narrow}`} style={{ marginTop: 12 }}>
          <h2 className={ui.title}>Cadastrar ofertas</h2>
          <p className={ui.lead}>Adicione uma oferta agora ou importe uma planilha com o catálogo inteiro.</p>

          <div className={styles.importBox}>
            <FileSpreadsheet size={34} color="#6ca6ff" aria-hidden="true" />
            <p className={styles.importTitle}>Importar planilha</p>
            <p className={ui.muted}>Envie um arquivo CSV ou Excel para cadastrar vários itens de uma vez.</p>
            <label className={ui.upload}>
              <Upload size={18} aria-hidden="true" />
              Escolher arquivo
              <input type="file" accept=".csv, .xlsx, .json" onChange={handleFileUpload} />
            </label>
          </div>

          <h3 className={ui.subtitle}>Cadastro manual</h3>
          <form onSubmit={handleCreateNewOffer} className={ui.form}>
            <div className={ui.field}>
              <label className={ui.label} htmlFor="no-title">Título do serviço ou peça</label>
              <input
                id="no-title"
                className={ui.input}
                type="text"
                placeholder="Ex: Troca de pastilha de freio dianteira"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div className={ui.field}>
              <label className={ui.label} htmlFor="no-cat">Categoria</label>
              <select
                id="no-cat"
                className={ui.input}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as 'alinhamento' | 'pneus' | 'oleo' | 'combustivel' | 'lavagem')}
              >
                <option value="alinhamento">Alinhamento e suspensão</option>
                <option value="oleo">Óleo e filtros</option>
                <option value="pneus">Pneus e rodas</option>
                <option value="combustivel">Combustível</option>
                <option value="lavagem">Lavagem e estética</option>
              </select>
            </div>

            <div className={ui.row}>
              <div className={ui.field}>
                <label className={ui.label} htmlFor="no-orig">Normal (R$)</label>
                <input
                  id="no-orig"
                  className={ui.input}
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="200,00"
                  value={newOriginalPrice}
                  onChange={(e) => setNewOriginalPrice(e.target.value)}
                />
              </div>
              <div className={ui.field}>
                <label className={ui.label} htmlFor="no-disc">Promocional (R$)</label>
                <input
                  id="no-disc"
                  className={`${ui.input} ${ui.inputPrice}`}
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="140,00"
                  value={newDiscountPrice}
                  onChange={(e) => setNewDiscountPrice(e.target.value)}
                />
              </div>
            </div>

            <div className={ui.field}>
              <label className={ui.label} htmlFor="no-stock">Limite de cupons</label>
              <input
                id="no-stock"
                className={ui.input}
                type="number"
                inputMode="numeric"
                placeholder="Ex: 10"
                value={newStockLimit}
                onChange={(e) => setNewStockLimit(e.target.value)}
              />
            </div>

            <label className={styles.check} htmlFor="dailyOfferCheck">
              <input
                type="checkbox"
                id="dailyOfferCheck"
                checked={newIsDailyOffer}
                onChange={(e) => setNewIsDailyOffer(e.target.checked)}
              />
              <Flame size={18} aria-hidden="true" />
              Destacar como oferta do dia (24h)
            </label>

            <button type="submit" className={ui.btn}>
              Publicar oferta
            </button>
          </form>
        </section>
      )}

      {/* DADOS DA OFICINA */}
      {activePartnerTab === 'perfil' && (
        <section className={`${ui.panel} ${styles.narrow}`} style={{ marginTop: 12 }}>
          <h2 className={ui.title}>Dados da oficina</h2>
          <p className={ui.lead}>A localização (GPS ou endereço) é usada na rota do cupom do motorista.</p>

          <div className={ui.avatarBlock}>
            <div className={ui.logo}>
              {partnerForm.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={partnerForm.logoUrl} alt="Logo do auto center" />
              ) : (
                <Building2 size={42} aria-hidden="true" />
              )}
            </div>
            <label className={ui.upload}>
              <Upload size={18} aria-hidden="true" />
              Trocar logo ou fachada
              <input type="file" accept="image/*" onChange={handleLogoUpload} />
            </label>
          </div>

          <form onSubmit={handleSavePartnerProfile} className={ui.form}>
            <div className={ui.field}>
              <label className={ui.label} htmlFor="pp-name">Nome fantasia</label>
              <input id="pp-name" className={ui.input} type="text" value={partnerForm.name} onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })} />
            </div>
            <div className={ui.field}>
              <label className={ui.label} htmlFor="pp-cnpj">CNPJ</label>
              <input id="pp-cnpj" className={ui.input} type="text" inputMode="numeric" value={partnerForm.cnpj} onChange={(e) => setPartnerForm({ ...partnerForm, cnpj: e.target.value })} />
            </div>
            <div className={ui.field}>
              <label className={ui.label} htmlFor="pp-addr">Endereço completo</label>
              <input id="pp-addr" className={ui.input} type="text" value={partnerForm.address} onChange={(e) => setPartnerForm({ ...partnerForm, address: e.target.value })} />
            </div>
            <div className={ui.field}>
              <span className={ui.label}>Localização exata (GPS)</span>
              <button type="button" className={ui.btnGhost} onClick={handleCaptureLocation} disabled={locating}>
                <MapPin size={18} aria-hidden="true" />
                {locating ? 'Obtendo localização...' : partnerForm.latitude != null ? 'Atualizar localização' : 'Usar minha localização atual'}
              </button>
              {partnerForm.latitude != null && partnerForm.longitude != null && (
                <p className={ui.lead} role="status">
                  {partnerForm.latitude.toFixed(6)}, {partnerForm.longitude.toFixed(6)}
                  {partnerForm.locationAccuracyM != null && ` (precisão ~${Math.round(partnerForm.locationAccuracyM)} m)`}
                  {' · '}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${partnerForm.latitude},${partnerForm.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver no mapa
                  </a>
                </p>
              )}
              {locationError && <p className={ui.lead} role="alert">{locationError}</p>}
              <p className={ui.lead}>
                Para oficinas sem loja física: fique no local do atendimento e toque no botão. Lembre de salvar os dados.
              </p>
            </div>
            <div className={ui.row}>
              <div className={ui.field}>
                <label className={ui.label} htmlFor="pp-phone">Telefone ou WhatsApp</label>
                <input id="pp-phone" className={ui.input} type="tel" value={partnerForm.phone} onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })} />
              </div>
              <div className={ui.field}>
                <label className={ui.label} htmlFor="pp-hours">Horário</label>
                <input id="pp-hours" className={ui.input} type="text" value={partnerForm.workingHours} onChange={(e) => setPartnerForm({ ...partnerForm, workingHours: e.target.value })} />
              </div>
            </div>
            <button type="submit" className={ui.btn}>
              Salvar dados
            </button>
          </form>
        </section>
      )}

      {/* AVALIAÇÕES */}
      {activePartnerTab === 'avaliacoes' && (
        <section className={`${ui.panel} ${styles.narrow}`} style={{ marginTop: 12 }}>
          <h2 className={ui.title}>Avaliações</h2>

          <h3 className={ui.subtitle}>Motoristas sobre o auto center</h3>
          {partnerReviewsReceived.length === 0 ? (
            <p className={ui.muted}>Nenhuma avaliação recebida ainda.</p>
          ) : (
            <ul className={ui.reviews}>{partnerReviewsReceived.map((rev) => renderReview(rev, rev.authorName))}</ul>
          )}

          <h3 className={ui.subtitle}>Suas avaliações de motoristas</h3>
          {driverReviewsGiven.length === 0 ? (
            <p className={ui.muted}>Você ainda não avaliou nenhum motorista.</p>
          ) : (
            <ul className={ui.reviews}>{driverReviewsGiven.map((rev) => renderReview(rev, rev.targetName))}</ul>
          )}
        </section>
      )}

      {activePartnerTab === 'suporte' && (
        <section className={`${ui.panel} ${styles.narrow}`} style={{ marginTop: 12 }}>
          <h2 className={ui.title}>Suporte e ajuda</h2>
          <p className={ui.lead}>Precisa de ajuda com cupons ou cadastro? Fale com o time de atendimento.</p>
        </section>
      )}
    </div>
  );
}
