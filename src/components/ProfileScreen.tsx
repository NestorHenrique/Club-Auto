'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { UserProfile } from '@/types/app';
import { ArrowLeft, User, Upload } from 'lucide-react';

interface ProfileScreenProps {
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  onBack: () => void;
}

export function ProfileScreen({ profile, onSave, onBack }: ProfileScreenProps) {
  const [formData, setFormData] = useState<UserProfile>(profile);

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
    alert('Perfil atualizado com sucesso!');
  };

  return (
    <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
      <button
        onClick={onBack}
        style={{
          background: '#1e293b',
          border: '1px solid #334155',
          color: '#38bdf8',
          borderRadius: '20px',
          padding: '8px 16px',
          fontSize: '13px',
          fontWeight: '500',
          cursor: 'pointer',
          marginBottom: '20px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <ArrowLeft size={16} color="#38bdf8" />
        <span>Voltar ao Catálogo</span>
      </button>

      <h2 style={{ color: '#f8fafc', marginBottom: '15px', fontSize: '18px' }}>Meu Perfil</h2>

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
            <img src={formData.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <User size={40} color="#94a3b8" />
          )}
        </div>
        <label
          style={{
            background: '#334155',
            color: '#f8fafc',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Upload size={14} />
          <span>Alterar Foto</span>
          <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
        </label>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
            Nome Completo
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              background: '#0f172a',
              border: '1px solid #334155',
              color: '#f8fafc',
              fontSize: '13px',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
            E-mail
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              background: '#0f172a',
              border: '1px solid #334155',
              color: '#f8fafc',
              fontSize: '13px',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
              Telefone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: '#0f172a',
                border: '1px solid #334155',
                color: '#f8fafc',
                fontSize: '13px',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
              Placa do Veículo
            </label>
            <input
              type="text"
              value={formData.plate}
              onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: '#0f172a',
                border: '1px solid #334155',
                color: '#f8fafc',
                fontSize: '13px',
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
            Veículo / Modelo
          </label>
          <input
            type="text"
            value={formData.vehicle}
            onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              background: '#0f172a',
              border: '1px solid #334155',
              color: '#f8fafc',
              fontSize: '13px',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            marginTop: '10px',
            background: '#10b981',
            color: '#0f172a',
            border: 'none',
            borderRadius: '8px',
            padding: '12px',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}