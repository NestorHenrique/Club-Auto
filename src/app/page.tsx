// src/app/page.tsx
'use client';

import { useState } from 'react';
import styles from '@/app/page.module.css';
import { NavigationDrawer } from '@/components/NavigationDrawer';

export default function Home() {
  type Tela = 'catalogo' | 'parceiro' | 'perfil' | 'minhas-avaliacoes' | 'indique' | 'ajuda' | 'detalhes' | 'aval-motorista' | 'aval-parceiro';

  const [telaAtiva, setTelaAtiva] = useState<Tela>('catalogo');
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todas');

  const categorias = [
    { id: 'todas', label: 'Todos' },
    { id: 'alinhamento', label: 'Alinhamento' },
    { id: 'pneus', label: 'Pneus' },
    { id: 'oleo', label: 'Óleo' },
  ];

  return (
    <main className={styles.container}>
      
      {/* CABEÇALHO PRINCIPAL DO MOTORISTA */}
      <div className={styles.headerDash}>
        {/* Componente Modular do Menu Gaveta importado de @/components/NavigationDrawer */}
        <NavigationDrawer onSelectScreen={(tela) => setTelaAtiva(tela)} />

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Bem-vindo</span>
          <h3 style={{ color: '#10b981', fontSize: '16px', margin: 0 }}>Motorista (Nestor)</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setTelaAtiva('perfil')}>
          <div className={styles.profileBadge}>
            ★ 5.00
          </div>
        </div>
      </div>

      {/* TELA 1: CATÁLOGO E OFERTAS DO MOTORISTA */}
      {telaAtiva === 'catalogo' && (
        <div>
          <div style={{ border: '1px solid #10b981', padding: '15px', borderRadius: '8px', background: '#1e293b' }}>
            <h3 style={{ color: '#10b981', fontSize: '16px', marginBottom: '8px' }}>💰 Meus Serviços e Economia</h3>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981', marginBottom: '5px' }}>
              R$ 0,00
            </div>
          </div>

          <h2 style={{ textAlign: 'left', width: '100%', marginBottom: '10px', fontSize: '18px', marginTop: '15px' }}>
            Catálogo e Ofertas
          </h2>

          {/* CHIPS DE FILTRO DE CATEGORIA */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
            {categorias.map((cat) => (
              <div
                key={cat.id}
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
        </div>
      )}

      {/* DEMAIS TELAS (Perfil, Indique, Ajuda...) */}
      {telaAtiva === 'perfil' && (
        <div>
          <h2>Meu Perfil</h2>
          <button onClick={() => setTelaAtiva('catalogo')}>← Voltar</button>
        </div>
      )}
    </main>
  );
}