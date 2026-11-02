'use client';

import { useState, ChangeEvent } from 'react';
import { UserProfile } from '@/types/app';

interface ProfileScreenProps {
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
  onBack: () => void;
}

export function ProfileScreen({ profile, onSave, onBack }: ProfileScreenProps) {
  const [formData, setFormData] = useState<UserProfile>(profile);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    alert('Perfil atualizado com sucesso!');
  };

  return (
    <div style={{ background: '#1e293b', borderRadius: '8px', padding: '20px', border: '1px solid #334155' }}>
      <button
        onClick={onBack}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#38bdf8',
          cursor: 'pointer',
          marginBottom: '15px',
          fontWeight: 'bold',
        }}
      >
        ← Voltar ao Catálogo
      </button>

      <h2 style={{ color: '#f8fafc', marginBottom: '20px', fontSize: '18px' }}>👤 Meu Perfil (Motorista)</h2>

      {/* Avatar e Upload */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px',
            border: '2px solid #10b981',
          }}
        >
          {formData.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={formData.avatarUrl} alt="Foto de perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '36px' }}>👤</span>
          )}
        </div>
        <label
          style={{
            background: '#334155',
            color: '#f8fafc',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          📷 Alterar Foto
          <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
        </label>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nome Completo</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Telefone / WhatsApp</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Veículo</label>
            <input
              type="text"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Placa</label>
            <input
              type="text"
              name="plate"
              value={formData.plate}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            marginTop: '10px',
            background: '#10b981',
            color: '#0f172a',
            border: 'none',
            borderRadius: '6px',
            padding: '10px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}