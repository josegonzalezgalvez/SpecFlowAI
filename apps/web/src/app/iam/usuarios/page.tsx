'use client';

import React, { useState } from 'react';
import { useIAM } from '@/context/IAMContext';
import Modal from '@/components/Modal';

export default function UsuariosPage() {
  const { users, roles, profiles, addUser, deleteUser } = useIAM();
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(roles[0]?.name || 'Administrador');
  const [profile, setProfile] = useState(profiles[0]?.name || 'Administrador de TI');
  const [status, setStatus] = useState<'Activo' | 'Inactivo'>('Activo');
  const [validationError, setValidationError] = useState('');

  // Handle new user submission
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name || !email) {
      setValidationError('Por favor, completa todos los campos requeridos.');
      return;
    }

    if (!email.includes('@')) {
      setValidationError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    // Call context
    addUser({
      name,
      email,
      role,
      profile,
      status
    });

    // Reset state & close
    setName('');
    setEmail('');
    setRole(roles[0]?.name || 'Administrador');
    setProfile(profiles[0]?.name || 'Administrador de TI');
    setStatus('Activo');
    setIsModalOpen(false);
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'Todos' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'Todos' || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Usuarios</h2>
          <p className="text-slate-400 mt-2 text-sm">
            Administra los usuarios del sistema, sus roles vinculados, perfiles de seguridad y sus estados de actividad.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/10 hover:shadow-blue-500/20 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Registrar Usuario
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 bg-[#111827]/40 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1F2937]/35 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white text-sm outline-none transition-all duration-200"
          />
        </div>

        {/* Role Filter */}
        <div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 bg-[#1F2937]/35 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white text-sm outline-none transition-all duration-200 cursor-pointer"
          >
            <option value="Todos">Todos los Roles</option>
            {roles.map(r => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-[#1F2937]/35 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white text-sm outline-none transition-all duration-200 cursor-pointer"
          >
            <option value="Todos">Todos los Estados</option>
            <option value="Activo">Activos</option>
            <option value="Inactivo">Inactivos</option>
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedRole('Todos');
              setSelectedStatus('Todos');
            }}
            className="w-full py-2 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-colors"
          >
            Restablecer Filtros
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#111827]/30 backdrop-blur-md">
        <table className="w-full border-collapse text-left text-sm text-slate-300">
          <thead className="bg-[#111827]/70 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Correo Electrónico</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4">Perfil</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Último Acceso</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-transparent">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-white">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2.5 py-1 text-xs font-semibold text-blue-400 ring-1 ring-inset ring-blue-400/20">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{user.profile}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                        user.status === 'Activo'
                          ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-400 ring-slate-500/20'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{user.lastAccess}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Eliminar usuario"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  Ningún usuario coincide con los filtros especificados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Creation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setValidationError('');
        }}
        title="Registrar Nuevo Usuario"
      >
        <form onSubmit={handleAddUser} className="space-y-5">
          {validationError && (
            <div className="text-red-400 text-xs border border-red-500/20 bg-red-500/10 px-3 py-2 rounded-xl">
              {validationError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="w-full px-4 py-2.5 bg-[#1F2937]/35 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white text-sm outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan.perez@specflow.ai"
              className="w-full px-4 py-2.5 bg-[#1F2937]/35 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white text-sm outline-none transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Rol
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#1F2937]/35 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white text-sm outline-none transition-all duration-200 cursor-pointer"
              >
                {roles.map(r => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Perfil de Seguridad
              </label>
              <select
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#1F2937]/35 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white text-sm outline-none transition-all duration-200 cursor-pointer"
              >
                {profiles.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Estado Inicial
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'Activo' | 'Inactivo')}
              className="w-full px-3 py-2.5 bg-[#1F2937]/35 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white text-sm outline-none transition-all duration-200 cursor-pointer"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

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
              Registrar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
