'use client';

import { useEffect, useState } from 'react';
import { LayoutDashboard, PlusCircle, Building2, Star, Headphones, X, Menu } from 'lucide-react';
import styles from './NavigationDrawer.module.css';

export type PartnerTabType = 'dashboard' | 'cadastrar' | 'perfil' | 'avaliacoes' | 'suporte';

interface PartnerDrawerProps {
  onSelectScreen: (screen: PartnerTabType) => void;
  partnerName: string;
}

const menuItems = [
  { id: 'dashboard', label: 'Painel e validação', icon: LayoutDashboard },
  { id: 'cadastrar', label: 'Cadastrar ofertas', icon: PlusCircle },
  { id: 'perfil', label: 'Dados da oficina', icon: Building2 },
  { id: 'avaliacoes', label: 'Avaliações', icon: Star },
  { id: 'suporte', label: 'Suporte e ajuda', icon: Headphones },
] as const;

export function PartnerDrawer({ onSelectScreen, partnerName }: PartnerDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const handleNavigate = (screen: PartnerTabType) => {
    onSelectScreen(screen);
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menu"
        aria-haspopup="dialog"
      >
        <Menu size={22} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-label="Menu do auto center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.head}>
              <span className={styles.name}>{partnerName || 'Auto center'}</span>
              <button
                type="button"
                className={styles.close}
                onClick={() => setIsOpen(false)}
                aria-label="Fechar menu"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            <nav className={styles.nav}>
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={styles.item}
                    onClick={() => handleNavigate(item.id)}
                  >
                    <IconComponent size={20} aria-hidden="true" />
                    {item.label}
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
