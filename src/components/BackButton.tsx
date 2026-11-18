'use client';

import { ArrowLeft } from 'lucide-react';
import styles from './BackButton.module.css';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export function BackButton({ onClick, label = 'Voltar às ofertas' }: BackButtonProps) {
  return (
    <button type="button" className={styles.back} onClick={onClick}>
      <ArrowLeft size={18} aria-hidden="true" />
      {label}
    </button>
  );
}
