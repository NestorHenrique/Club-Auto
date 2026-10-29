'use client';

import { useState } from 'react';

export default function Home() {
  // Estado para controlar a navegação entre as telas do app
  const [telaAtiva, setTelaAtiva] = useState<
    'catalogo' | 'parceiro' | 'perfil' | 'minhas-avaliacoes' | 'indique' | 'ajuda' | 'detalhes' | 'aval-motorista' | 'aval-parceiro'
  >('catalogo');

  // Estado para controlar se o menu das três linhas (☰) está aberto ou fechado
  const [menuAberto, setMenuAberto] = useState<boolean>(false);

  // Estado para controlar qual filtro de categoria está ativo
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todas');

  const categorias = [
    { id: 'todas', label: 'Todos' },
    { id: 'alinhamento', label: 'Alinhamento' },
    { id: 'pneus', label: 'Pneus' },
    { id: 'oleo', label: 'Óleo' },
  ];

  return (
    <div className="app-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
      
      {/* OVERLAY E MENU LATERAL (TRÊS LINHAS ☰) */}
      {menuAberto && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.6)',
            zIndex: 99
          }}
          onClick={() => setMenuAberto(false)}
        />
      )}

      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: menuAberto ? 0 : '-280px',
          width: '260px',
          height: '100vh',
          background: '#1e293b',
          zIndex: 100,
          transition: 'left 0.3s ease',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          boxShadow: '4px 0 10px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
          <h3 style={{ color: '#10b981', margin: 0 }}>Menu Clube Auto</h3>
          <button 
            style={{ background: 'none', border: 'none', color: '#f8fafc', fontSize: '20px', cursor: 'pointer' }}
            onClick={() => setMenuAberto(false)}
          >
            ✕
          </button>
        </div>

        <button 
          className="btn" 
          style={{ background: 'transparent', color: '#f8fafc', textAlign: 'left', padding: '10px', borderRadius: '6px' }}
          onClick={() => { setTelaAtiva('catalogo'); setMenuAberto(false); }}
        >
          🏷️ Catálogo e Ofertas
        </button>

        <button 
          className="btn" 
          style={{ background: 'transparent', color: '#f8fafc', textAlign: 'left', padding: '10px', borderRadius: '6px' }}
          onClick={() => { setTelaAtiva('perfil'); setMenuAberto(false); }}
        >
          👤 Meu Perfil
        </button>

        <button 
          className="btn" 
          style={{ background: 'transparent', color: '#f8fafc', textAlign: 'left', padding: '10px', borderRadius: '6px' }}
          onClick={() => { setTelaAtiva('minhas-avaliacoes'); setMenuAberto(false); }}
        >
          ★ Minhas Avaliações
        </button>

        <button 
          className="btn" 
          style={{ background: 'transparent', color: '#f8fafc', textAlign: 'left', padding: '10px', borderRadius: '6px' }}
          onClick={() => { setTelaAtiva('indique'); setMenuAberto(false); }}
        >
          🎁 Indique e Ganhe
        </button>

        <button 
          className="btn" 
          style={{ background: 'transparent', color: '#f8fafc', textAlign: 'left', padding: '10px', borderRadius: '6px' }}
          onClick={() => { setTelaAtiva('ajuda'); setMenuAberto(false); }}
        >
          ❓ Central de Ajuda
        </button>

        <button 
          className="btn" 
          style={{ background: '#334155', color: '#38bdf8', textAlign: 'left', padding: '10px', borderRadius: '6px', marginTop: 'auto' }}
          onClick={() => { setTelaAtiva('parceiro'); setMenuAberto(false); }}
        >
          🛠️ Área do Parceiro
        </button>
      </div>

      {/* CABEÇALHO PRINCIPAL DO MOTORISTA */}
      <div className="header-dash" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div 
          className="menu-btn-circle" 
          style={{ cursor: 'pointer', fontSize: '24px', padding: '5px' }} 
          onClick={() => setMenuAberto(true)}
        >
          ☰
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Bem-vindo</span>
          <h3 id="user-display-mot" style={{ color: '#10b981', fontSize: '16px', margin: 0 }}>Motorista (Nestor)</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setTelaAtiva('perfil')}>
          <div className="profile-badge" style={{ background: '#1e293b', padding: '4px 8px', borderRadius: '12px', color: '#f59e0b', fontSize: '13px', fontWeight: 'bold' }}>
            ★ 5.00
          </div>
        </div>
      </div>

      {/* TELA 1: CATÁLOGO E OFERTAS DO MOTORISTA */}
      {telaAtiva === 'catalogo' && (
        <div id="screen-catalog">
          <div className="supplier-box" style={{ border: '1px solid #10b981', padding: '15px', borderRadius: '8px' }}>
            <h3 style={{ color: '#10b981', fontSize: '16px', marginBottom: '8px' }}>💰 Meus Serviços e Economia</h3>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981', marginBottom: '5px' }} id="mot-economia-total">
              R$ 0,00
            </div>
            <div id="mot-historico-lista" style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}></div>
          </div>

          <h2 style={{ textAlign: 'left', width: '100%', marginBottom: '10px', fontSize: '18px', marginTop: '15px' }}>
            Catálogo e Ofertas
          </h2>

          <div style={{ width: '100%', marginBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input type="text" id="search-input" placeholder="Buscar serviço ou loja..." style={{ flex: 1, padding: '8px' }} />
              <button type="button" className="btn" style={{ width: '50px', margin: 0 }}>🔍</button>
            </div>
            <select id="sort-select" style={{ width: '100%', padding: '8px' }}>
              <option value="melhor-avaliado">Melhor Avaliado</option>
              <option value="menor-preco">Menor Valor</option>
              <option value="maior-preco">Maior Valor</option>
              <option value="a-z">A - Z (Serviço)</option>
            </select>
          </div>

          {/* CHIPS DE FILTRO DE CATEGORIA COM ESTADO ATIVO */}
          <div className="chips-container" id="chips-filter" style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
            {categorias.map((cat) => (
              <div
                key={cat.id}
                className={`chip ${categoriaAtiva === cat.id ? 'active-chip' : ''}`}
                style={{
                  cursor: 'pointer',
                  padding: '6px 14px',
                  borderRadius: '16px',
                  fontSize: '13px',
                  fontWeight: '500',
                  background: categoriaAtiva === cat.id ? '#38bdf8' : '#1e293b',
                  color: categoriaAtiva === cat.id ? '#0f172a' : '#f8fafc',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setCategoriaAtiva(cat.id)}
              >
                {cat.label}
              </div>
            ))}
          </div>

          <div id="catalog-container" className="product-list">
            <button className="btn" style={{ background: '#10b981', width: '100%', padding: '12px' }} onClick={() => setTelaAtiva('detalhes')}>
              Ver Exemplo de Oferta
            </button>
          </div>
        </div>
      )}

      {/* TELA 2: DASHBOARD DO PARCEIRO */}
      {telaAtiva === 'parceiro' && (
        <div id="screen-dashboard-parceiro" className="screen">
          <div className="header-dash" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
            <button className="btn-link" style={{ width: 'auto', margin: 0, fontSize: '18px' }} onClick={() => setTelaAtiva('catalogo')}>← Voltar</button>
            <div>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Painel Parceiro</span>
              <h3 id="user-display-parc" style={{ color: '#10b981', fontSize: '16px' }}>Auto Center A</h3>
            </div>
            <div style={{ width: '44px' }}></div>
          </div>

          <div id="parc-pendencia-box" className="supplier-box" style={{ border: '1px solid #f59e0b', padding: '15px', borderRadius: '8px', width: '100%', marginBottom: '15px' }}>
            <h3 style={{ color: '#f59e0b', fontSize: '16px', marginBottom: '8px' }}>⏳ Avaliações Pendentes</h3>
            <button className="btn" style={{ background: '#f59e0b', width: '100%' }} onClick={() => setTelaAtiva('aval-parceiro')}>Avaliar Motorista</button>
          </div>

          <div className="supplier-box" style={{ border: '1px solid #38bdf8', padding: '15px', borderRadius: '8px', width: '100%', marginBottom: '15px' }}>
            <h3 style={{ color: '#38bdf8', fontSize: '16px', marginBottom: '8px' }}>Validar Cupom do Motorista</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" id="valida-codigo" placeholder="EX: CLUB-ABCD-1234" style={{ textTransform: 'uppercase', flex: 1, padding: '8px' }} />
              <button type="button" className="btn" style={{ margin: 0, width: '120px', background: '#10b981' }}>Concluir</button>
            </div>
          </div>

          <div className="supplier-box" style={{ padding: '15px', border: '1px solid #334155', borderRadius: '8px', width: '100%' }}>
            <h3 style={{ color: '#38bdf8', fontSize: '16px', marginBottom: '8px' }}>Importar Catálogo (Excel)</h3>
            <input type="file" accept=".xlsx, .xls, .csv" />
          </div>
        </div>
      )}

      {/* TELA 3: MEU PERFIL */}
      {telaAtiva === 'perfil' && (
        <div id="screen-profile" className="screen">
          <div className="header-dash" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
            <button className="btn-link" style={{ width: 'auto', margin: 0, fontSize: '18px' }} onClick={() => setTelaAtiva('catalogo')}>← Voltar</button>
            <h3 style={{ color: '#f8fafc' }}>Meu Perfil</h3>
            <div style={{ width: '20px' }}></div>
          </div>

          <div className="profile-header" style={{ textAlign: 'center', marginBottom: '15px' }}>
            <img id="user-profile-img" src="https://via.placeholder.com/100/1e293b/38bdf8?text=FOTO" className="profile-pic" alt="Perfil" style={{ borderRadius: '50%', marginBottom: '10px' }} />
            <input type="file" id="upload-foto" style={{ display: 'none' }} accept="image/*" />
            <h2 id="user-profile-name">Nestor Henrique</h2>
            <div className="profile-badge" style={{ cursor: 'pointer', marginTop: '5px' }} onClick={() => setTelaAtiva('minhas-avaliacoes')}>
               <span id="user-profile-rating" style={{ background: '#1e293b', padding: '4px 8px', borderRadius: '12px', color: '#f59e0b', fontSize: '13px', fontWeight: 'bold' }}>★ 5.00</span> (Ver Avaliações)
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <div className="input-group" style={{ marginBottom: '10px' }}><label style={{ display: 'block' }}>Telefone</label><input type="text" id="prof-telefone" style={{ width: '100%', padding: '8px' }} /></div>
            <div className="input-group" style={{ marginBottom: '10px' }}><label style={{ display: 'block' }}>Endereço</label><input type="text" id="prof-endereco" style={{ width: '100%', padding: '8px' }} /></div>
            <div className="input-group" style={{ marginBottom: '15px' }}><label style={{ display: 'block' }}>Cidade</label><input type="text" id="prof-cidade" style={{ width: '100%', padding: '8px' }} /></div>
            <button type="button" className="btn" style={{ background: '#38bdf8', color: '#0f172a', width: '100%', padding: '10px' }}>Salvar Alterações</button>
          </div>
        </div>
      )}

      {/* TELA 4: MINHAS AVALIAÇÕES */}
      {telaAtiva === 'minhas-avaliacoes' && (
        <div id="screen-minhas-avaliacoes" className="screen">
          <div className="header-dash" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
            <button className="btn-link" style={{ width: 'auto', margin: 0, fontSize: '18px' }} onClick={() => setTelaAtiva('catalogo')}>← Voltar</button>
            <h3 style={{ color: '#f8fafc' }} id="title-minhas-avaliacoes">Avaliações</h3>
            <div style={{ width: '20px' }}></div>
          </div>
          <div style={{ width: '100%' }} id="minhas-avaliacoes-list">
            <p style={{ color: '#94a3b8' }}>Nenhuma avaliação registrada ainda.</p>
          </div>
        </div>
      )}

      {/* TELA 5: INDIQUE E GANHE */}
      {telaAtiva === 'indique' && (
        <div id="screen-indique" className="screen">
          <div className="header-dash" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
            <button className="btn-link" style={{ width: 'auto', margin: 0, fontSize: '18px' }} onClick={() => setTelaAtiva('catalogo')}>← Voltar</button>
            <h3 style={{ color: '#f8fafc' }} id="indique-header-title">Indique</h3>
            <div style={{ width: '20px' }}></div>
          </div>
          <div className="supplier-box" style={{ textAlign: 'center', border: '1px solid #10b981', padding: '20px', borderRadius: '8px', width: '100%' }}>
            <h2 style={{ color: '#10b981' }}>Ganhe 50% de Desconto!</h2>
            <p id="indique-desc-text" style={{ fontSize: '14px', color: '#cbd5e1', margin: '15px 0' }}>Compartilhe seu código com outros motoristas.</p>
            <strong id="codigo-indicacao-display" style={{ fontSize: '24px', color: '#38bdf8' }}>INDIC-1234</strong>
          </div>
        </div>
      )}

      {/* TELA 6: CENTRAL DE AJUDA */}
      {telaAtiva === 'ajuda' && (
        <div id="screen-ajuda" className="screen">
          <div className="header-dash" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
            <button className="btn-link" style={{ width: 'auto', margin: 0, fontSize: '18px' }} onClick={() => setTelaAtiva('catalogo')}>← Voltar</button>
            <h3 style={{ color: '#f8fafc' }}>Central de Ajuda</h3>
            <div style={{ width: '20px' }}></div>
          </div>
          <div className="supplier-box" id="ajuda-motorista-content" style={{ border: '1px solid #334155', padding: '15px', borderRadius: '8px', width: '100%', marginBottom: '10px' }}>
            <h3>Ajuda do Motorista</h3>
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#cbd5e1' }}>Como gerar cupons e avaliar parceiros no balcão.</p>
          </div>
        </div>
      )}

      {/* TELA 7: DETALHES DA OFERTA */}
      {telaAtiva === 'detalhes' && (
        <div id="screen-offer-details" className="screen">
          <div className="header-dash" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
            <button className="btn-link" style={{ width: 'auto', margin: 0, fontSize: '18px' }} onClick={() => setTelaAtiva('catalogo')}>← Voltar</button>
            <h3 style={{ color: '#f8fafc' }}>Detalhes da Promoção</h3>
            <div style={{ width: '20px' }}></div>
          </div>
          <div style={{ width: '100%' }}>
            <img id="det-img" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', background: '#1e293b' }} alt="Detalhe" />
            <h2 id="det-title" style={{ textAlign: 'left', fontSize: '20px', color: '#f8fafc', marginTop: '10px' }}>Troca de Óleo + Filtro</h2>
            <p id="det-partner" style={{ color: '#38bdf8', fontWeight: 'bold' }}>Auto Center A</p>
            <div className="supplier-box" style={{ marginTop: '15px', border: '1px solid #334155', padding: '15px', borderRadius: '8px' }}>
              <button type="button" id="det-btn-gerar" className="btn" style={{ background: '#10b981', width: '100%', padding: '10px' }} onClick={() => setTelaAtiva('aval-motorista')}>
                Gerar Cupom e Avaliar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TELA 8: AVALIAÇÃO OBRIGATÓRIA (MOTORISTA) */}
      {telaAtiva === 'aval-motorista' && (
        <div id="screen-avaliacao-motorista" className="screen">
          <div className="card" style={{ border: '1px solid #334155', padding: '20px', borderRadius: '8px', width: '100%' }}>
            <h2>Avalie a Loja</h2>
            <div className="input-group" style={{ margin: '10px 0' }}>
              <label style={{ display: 'block' }}>Nota</label>
              <select id="mot-nota" style={{ width: '100%', padding: '8px' }}>
                <option value="5">5 ★ Excelente</option>
                <option value="4">4 ★ Muito Bom</option>
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block' }}>Comentário</label>
              <textarea id="mot-comentario" rows={3} style={{ width: '100%', padding: '8px' }}></textarea>
            </div>
            <button className="btn" style={{ background: '#10b981', width: '100%', padding: '10px' }} onClick={() => setTelaAtiva('catalogo')}>Enviar Avaliação</button>
          </div>
        </div>
      )}

      {/* TELA 9: AVALIAÇÃO OBRIGATÓRIA (PARCEIRO) */}
      {telaAtiva === 'aval-parceiro' && (
        <div id="screen-avaliacao-parceiro" className="screen">
          <div className="card" style={{ border: '1px solid #334155', padding: '20px', borderRadius: '8px', width: '100%' }}>
            <h2>Avaliar Motorista</h2>
            <div className="input-group" style={{ margin: '10px 0' }}>
              <label style={{ display: 'block' }}>Nota</label>
              <select id="parc-nota" style={{ width: '100%', padding: '8px' }}>
                <option value="5">5 ★ Educado</option>
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block' }}>Observação</label>
              <textarea id="parc-comentario" rows={3} style={{ width: '100%', padding: '8px' }}></textarea>
            </div>
            <button className="btn" style={{ background: '#10b981', width: '100%', padding: '10px' }} onClick={() => setTelaAtiva('parceiro')}>Enviar Avaliação</button>
          </div>
        </div>
      )}

    </div>
  );
}