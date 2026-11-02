'use client';

import { useState } from 'react';
import { Tag, Ticket, User, Star, Gift, Headphones, X, Menu } from 'lucide-react';

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

  const menuItems = [
    { id: 'catalogo', label: 'Catálogo de Ofertas', icon: Tag, color: '#10b981' },
    { id: 'cupons', label: 'Meus Cupons', icon: Ticket, color: '#38bdf8' },
    { id: 'perfil', label: 'Meu Perfil', icon: User, color: '#94a3b8' }, // Nome limpo sem emoji
    { id: 'avaliacoes', label: 'Minhas Avaliações', icon: Star, color: '#f59e0b' },
    { id: 'indique', label: 'Indicação & Bônus', icon: Gift, color: '#10b981' },
    { id: 'ajuda', label: 'Ajuda & Suporte', icon: Headphones, color: '#38bdf8' },
  ] as const;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          background: '#1e293b',
          border: '1px solid #334155',
          color: '#f8fafc',
          borderRadius: '8px',
          padding: '8px 12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Menu size={20} />
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
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(4px)',
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
              boxShadow: '4px 0 25px rgba(0,0,0,0.5)',
              borderRight: '1px solid #1e293b',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#10b981', fontWeight: 'bold' }}>Clube Auto</h3>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id as DriverScreenType)}
                    style={{
                      textAlign: 'left',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: '#1e293b',
                      color: '#f8fafc',
                      border: '1px solid #334155',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <IconComponent size={18} color={item.color} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}