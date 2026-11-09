'use client';

import { useRouter } from 'next/navigation';
import { Car, Wrench } from 'lucide-react';
import { useAppState } from '@/context/AppState';
import type { UserRole } from '@/types/app';
import styles from './entrada.module.css';

const DESTINATIONS: Record<UserRole, string> = {
  driver: '/motorista',
  partner: '/autocenter',
};

// Provisório: enquanto não há cadastro/login, o perfil é escolhido aqui.
// Com o backend, o tipo de cadastro da conta define para qual rota ir.
export default function Entrada() {
  const router = useRouter();
  const { signIn } = useAppState();

  const enter = (role: UserRole) => {
    signIn(role);
    router.push(DESTINATIONS[role]);
  };

  return (
    <main className={styles.screen}>
      <header>
        <h1 className={styles.name}>Clube Auto</h1>
        <span className={styles.lane} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <p className={styles.lead}>Como você usa o Clube Auto?</p>
      </header>

      <div className={styles.options}>
        <button type="button" className={styles.option} onClick={() => enter('driver')}>
          <span className={styles.optionIcon}>
            <Car size={22} aria-hidden="true" />
          </span>
          <span>
            <span className={styles.optionTitle}>Sou motorista</span>
            <br />
            <span className={styles.optionText}>Ver ofertas e gerar cupons de desconto</span>
          </span>
        </button>

        <button type="button" className={styles.option} onClick={() => enter('partner')}>
          <span className={styles.optionIcon}>
            <Wrench size={22} aria-hidden="true" />
          </span>
          <span>
            <span className={styles.optionTitle}>Sou auto center</span>
            <br />
            <span className={styles.optionText}>Cadastrar ofertas e validar cupons</span>
          </span>
        </button>
      </div>

      <p className={styles.note}>Entrada provisória até o cadastro de contas estar disponível.</p>
    </main>
  );
}
