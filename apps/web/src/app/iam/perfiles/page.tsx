'use client';

import React, { useState } from 'react';
import { useIAM } from '@/context/IAMContext';
import Modal from '@/components/Modal';

export default function PerfilesPage() {
  const { profiles, roles, addProfile, deleteProfile } = useIAM();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [validationError, setValidationError] = useState('');

  const handleToggleRole = (roleName: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleName)
        ? prev.filter(r => r !== roleName)
        : [...prev, roleName]
    );
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!profileName.trim() || !description.trim()) {
      setValidationError('Por favor, ingresa un nombre y descripción para el perfil.');
      return;
    }

    if (selectedRoles.length === 0) {
      setValidationError('Por favor, asocia al menos un rol a este perfil.');
      return;
    }

    if (profiles.some(p => p.name.toLowerCase().trim() === profileName.toLowerCase().trim())) {
      setValidationError('Ya existe un perfil con este nombre.');
      return;
    }

    // Call context
    addProfile({
      name: profileName.trim(),
      description: description.trim(),
      roles: selectedRoles
    });

    // Reset fields & close
    setProfileName('');
    setDescription('');
    setSelectedRoles([]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Perfiles de Seguridad</h2>
          <p className="text-slate-400 mt-2 text-sm">
            Los perfiles agrupan múltiples roles de seguridad. Utilízalos para estructurar los cargos de la empresa y facilitar la asignación masiva de accesos.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/10 hover:shadow-blue-500/20 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear Perfil
        </button>
      </div>

      {/* Profiles Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="rounded-2xl border border-slate-800 bg-[#111827]/40 p-6 backdrop-blur-md hover:border-slate-700 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Header card info */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">{profile.name}</h3>
                  <span className="mt-1 inline-flex items-center rounded-md bg-violet-400/10 px-2 py-0.5 text-xs font-semibold text-violet-400 ring-1 ring-inset ring-violet-400/20">
                    {profile.roles.length} roles vinculados
                  </span>
                </div>
                
                {/* Delete button (Safety check: prevent deleting main Administrador de TI default profile) */}
                {profile.name !== 'Administrador de TI' && (
                  <button
                    onClick={() => deleteProfile(profile.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Eliminar perfil"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-slate-400 leading-relaxed">{profile.description}</p>

              {/* Linked Roles */}
              <div className="mt-5 space-y-2">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Roles Agrupados</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {profile.roles.map((roleName) => (
                    <span
                      key={roleName}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400"
                    >
                      {roleName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Creation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setValidationError('');
        }}
        title="Crear Nuevo Perfil de Seguridad"
      >
        <form onSubmit={handleCreateProfile} className="space-y-6">
          {validationError && (
            <div className="text-red-400 text-xs border border-red-500/20 bg-red-500/10 px-3 py-2 rounded-xl">
              {validationError}
            </div>
          )}

          {/* Name & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Nombre del Perfil
              </label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Ej. Líder de Ingeniería"
                className="w-full px-4 py-2.5 bg-[#1F2937]/35 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white text-sm outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Descripción del Perfil
              </label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Agrupa roles técnicos o administrativos específicos del perfil."
                className="w-full px-4 py-2.5 bg-[#1F2937]/35 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white text-sm outline-none transition-all duration-200 resize-none"
              />
            </div>
          </div>

          {/* Role selection checkboxes */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Seleccionar Roles Asociados (Mínimo 1)
            </label>
            <div className="grid gap-3 sm:grid-cols-2 max-h-48 overflow-y-auto p-1">
              {roles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => handleToggleRole(role.name)}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedRoles.includes(role.name)
                      ? 'bg-blue-600/10 border-blue-500 text-white'
                      : 'bg-[#1F2937]/20 border-slate-850 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.name)}
                    readOnly
                    className="h-4 w-4 mt-0.5 rounded border-slate-800 bg-[#1F2937]/35 text-blue-600 focus:ring-blue-500/30 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{role.name}</p>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-1 leading-tight">{role.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-800/60 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Crear Perfil
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
