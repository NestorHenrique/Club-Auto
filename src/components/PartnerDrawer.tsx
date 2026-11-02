'use client';

import { useState } from 'react';
import { LayoutDashboard, PlusCircle, Building2, Star, Headphones, X, Menu } from 'lucide-react';

export type PartnerTabType = 'dashboard' | 'cadastrar' | 'perfil' | 'avaliacoes' | 'suporte';

interface PartnerDrawerProps {
  onSelectScreen: (screen: PartnerTabType) => void;
  partnerName: string;
}

export function PartnerDrawer({ onSelectScreen, partnerName }: PartnerDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (screen: PartnerTabType) => {
    onSelectScreen(screen);
    setIsOpen(false);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Painel & Validação', icon: LayoutDashboard, color: '#00E676' },
    { id: 'cadastrar', label: 'Cadastrar Serviços & Peças', icon: PlusCircle, color: '#00D2FF' },
    { id: 'perfil', label: 'Dados & Fotos da Oficina', icon: Building2, color: '#94A3B8' },
    { id: 'avaliacoes', label: 'Avaliações Recebidas', icon: Star, color: '#FF9F0A' },
    { id: 'suporte', label: 'Suporte & Ajuda', icon: Headphones, color: '#00D2FF' },
  ] as const;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          background: '#121826',
          border: '1px solid #1F293D',
          color: '#F1F5F9',
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
            background: 'rgba(9, 13, 22, 0.85)',
            backdropFilter: 'blur(4px)',
            zIndex: 250,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '280px',
              height: '100%',
              background: '#121826',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '4px 0 25px rgba(0,0,0,0.5)',
              borderRight: '1px solid #1F293D',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#00E676', fontWeight: 'bold' }}>AUTO CENTER</span>
                <h3 style={{ margin: 0, fontSize: '15px', color: '#F1F5F9' }}>{partnerName}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
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
                    onClick={() => handleNavigate(item.id as PartnerTabType)}
                    style={{
                      textAlign: 'left',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: '#090D16',
                      color: '#F1F5F9',
                      border: '1px solid #1F293D',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '14px',
                      fontWeight: '500',
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