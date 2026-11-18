'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { UserProfile } from '@/types/app';
import { BackButton } from '@/components/BackButton';
import { User, Upload } from 'lucide-react';
import ui from './ui.module.css';

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
    <div>
      <BackButton onClick={onBack} />
      <section className={ui.panel}>
        <h2 className={ui.title}>Meu perfil</h2>
        <p className={ui.lead}>Seus dados e o veículo que aparecem nos cupons.</p>

        <div className={ui.avatarBlock}>
          <div className={ui.avatar}>
            {formData.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={formData.avatarUrl} alt="Sua foto" />
            ) : (
              <User size={42} aria-hidden="true" />
            )}
          </div>
          <label className={ui.upload}>
            <Upload size={18} aria-hidden="true" />
            Trocar foto
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </label>
        </div>

        <form onSubmit={handleSubmit} className={ui.form}>
          <div className={ui.field}>
            <label className={ui.label} htmlFor="pf-name">Nome completo</label>
            <input
              id="pf-name"
              className={ui.input}
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor="pf-email">E-mail</label>
            <input
              id="pf-email"
              className={ui.input}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className={ui.row}>
            <div className={ui.field}>
              <label className={ui.label} htmlFor="pf-phone">Telefone</label>
              <input
                id="pf-phone"
                className={ui.input}
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className={ui.field}>
              <label className={ui.label} htmlFor="pf-plate">Placa</label>
              <input
                id="pf-plate"
                className={ui.input}
                type="text"
                value={formData.plate}
                onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
              />
            </div>
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor="pf-vehicle">Veículo</label>
            <input
              id="pf-vehicle"
              className={ui.input}
              type="text"
              value={formData.vehicle}
              onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
            />
          </div>

          <button type="submit" className={ui.btn}>
            Salvar alterações
          </button>
        </form>
      </section>
    </div>
  );
}
