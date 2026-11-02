'use client';

import { useState } from 'react';

export type DriverScreenType = 'catalogo' | 'cupons' | 'perfil' | 'avaliacoes' | 'indique' | 'ajuda';

interface NavigationDrawerProps {
  onSelectScreen: (screen: DriverScreenType) => void;
}

export function NavigationDrawer({ onSelectScreen }: NavigationDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (screen: DriverScreenType) => {
    onSelectScreen(screen);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          background: '#1e293b',
          border: '1px solid #334155',
          color: '#f8fafc',
          borderRadius: '6px',
          padding: '6px 12px',
          fontSize: '18px',
          cursor: 'pointer',
        }}
      >
        ☰
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.7)',
            zIndex: 250,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '280px',
              height: '100%',
              background: '#0f172a',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '4px 0 15px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#10b981' }}>Clube Auto</h3>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => handleNavigate('catalogo')}
                style={{ textAlign: 'left', padding: '12px', borderRadius: '6px', background: '#1e293b', color: '#f8fafc', border: 'none', cursor: 'pointer' }}
              >
                🏷️ Catálogo de Ofertas
              </button>
              <button
                onClick={() => handleNavigate('cupons')}
                style={{ textAlign: 'left', padding: '12px', borderRadius: '6px', background: '#1e293b', color: '#f8fafc', border: 'none', cursor: 'pointer' }}
              >
                🎟️ Meus Cupons
              </button>
              <button
                onClick={() => handleNavigate('perfil')}
                style={{ textAlign: 'left', padding: '12px', borderRadius: '6px', background: '#1e293b', color: '#f8fafc', border: 'none', cursor: 'pointer' }}
              >
                👤 Meu Perfil
              </button>
              <button
                onClick={() => handleNavigate('avaliacoes')}
                style={{ textAlign: 'left', padding: '12px', borderRadius: '6px', background: '#1e293b', color: '#f8fafc', border: 'none', cursor: 'pointer' }}
              >
                ⭐ Minhas Avaliações
              </button>
              <button
                onClick={() => handleNavigate('indique')}
                style={{ textAlign: 'left', padding: '12px', borderRadius: '6px', background: '#1e293b', color: '#f8fafc', border: 'none', cursor: 'pointer' }}
              >
                🎁 Indicação & Bônus
              </button>
              <button
                onClick={() => handleNavigate('ajuda')}
                style={{ textAlign: 'left', padding: '12px', borderRadius: '6px', background: '#1e293b', color: '#f8fafc', border: 'none', cursor: 'pointer' }}
              >
                🎧 Ajuda & Suporte
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}