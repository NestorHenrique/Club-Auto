'use client';

import { useState } from 'react';

interface NavigationDrawerProps {
  onSelectScreen: (tela: 'catalogo' | 'parceiro' | 'perfil' | 'minhas-avaliacoes' | 'indique' | 'ajuda') => void;
}

export function NavigationDrawer({ onSelectScreen }: NavigationDrawerProps) {
  const [menuAberto, setMenuAberto] = useState<boolean>(false);

  const handleNavigate = (tela: 'catalogo' | 'parceiro' | 'perfil' | 'minhas-avaliacoes' | 'indique' | 'ajuda') => {
    onSelectScreen(tela);
    setMenuAberto(false);
  };

  return (
    <>
      {/* Botão de acionamento das três linhas */}
      <div 
        style={{ cursor: 'pointer', fontSize: '24px', padding: '5px' }} 
        onClick={() => setMenuAberto(true)}
      >
        ☰
      </div>

      {/* Fundo escuro (Overlay) */}
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

      {/* Menu Gaveta Lateral */}
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
          style={{ background: 'transparent', color: '#f8fafc', textAlign: 'left', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
          onClick={() => handleNavigate('catalogo')}
        >
          🏷️ Catálogo e Ofertas
        </button>

        <button 
          style={{ background: 'transparent', color: '#f8fafc', textAlign: 'left', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
          onClick={() => handleNavigate('perfil')}
        >
          👤 Meu Perfil
        </button>

        <button 
          style={{ background: 'transparent', color: '#f8fafc', textAlign: 'left', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
          onClick={() => handleNavigate('minhas-avaliacoes')}
        >
          ★ Minhas Avaliações
        </button>

        <button 
          style={{ background: 'transparent', color: '#f8fafc', textAlign: 'left', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
          onClick={() => handleNavigate('indique')}
        >
          🎁 Indique e Ganhe
        </button>

        <button 
          style={{ background: 'transparent', color: '#f8fafc', textAlign: 'left', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
          onClick={() => handleNavigate('ajuda')}
        >
          ❓ Central de Ajuda
        </button>

        <button 
          style={{ background: '#334155', color: '#38bdf8', textAlign: 'left', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', marginTop: 'auto' }}
          onClick={() => handleNavigate('parceiro')}
        >
          🛠️ Área do Parceiro
        </button>
      </div>
    </>
  );
}