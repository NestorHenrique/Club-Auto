'use client';

import { useEffect, useState } from 'react';
import { Tag, Ticket, User, Star, Gift, Headphones, X, Menu, LogOut } from 'lucide-react';
import styles from './NavigationDrawer.module.css';

export type DriverScreenType = 'catalogo' | 'cupons' | 'perfil' | 'avaliacoes' | 'indique' | 'ajuda';

interface NavigationDrawerProps {
  onSelectScreen: (screen: DriverScreenType) => void;
  onSignOut?: () => void;
}

const menuItems = [
  { id: 'catalogo', label: 'Ofertas', icon: Tag },
  { id: 'cupons', label: 'Meus cupons', icon: Ticket },
  { id: 'perfil', label: 'Meu perfil', icon: User },
  { id: 'avaliacoes', label: 'Minhas avaliações', icon: Star },
  { id: 'indique', label: 'Indique e ganhe', icon: Gift },
  { id: 'ajuda', label: 'Ajuda e suporte', icon: Headphones },
] as const;

export function NavigationDrawer({ onSelectScreen, onSignOut }: NavigationDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const handleNavigate = (screen: DriverScreenType) => {
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
            aria-label="Menu principal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.head}>
              <span className={styles.name}>Clube Auto</span>
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

            {onSignOut && (
              <div className={styles.footer}>
                <button type="button" className={styles.partner} onClick={onSignOut}>
                  <LogOut size={20} aria-hidden="true" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
