'use client';

import React, { useState } from 'react';
import { useIAM, ModuleName, PermissionType } from '@/context/IAMContext';
import Modal from '@/components/Modal';

const defaultModules: ModuleName[] = [
  "Proyectos",
  "Requerimientos",
  "Arquitectura",
  "Estimación",
  "Desarrollo",
  "Testing",
  "Deploy",
  "RAG",
  "Administración"
];

const defaultPermissions: PermissionType[] = [
  "Ver",
  "Crear",
  "Editar",
  "Aprobar",
  "Eliminar",
  "Ejecutar IA"
];

export default function RolesPage() {
  const { roles, addRole, deleteRole } = useIAM();

  // Modal open/close state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState('');

  // Matrix state for new role configuration: module -> permission -> active (bool)
  const [selectedPermissions, setSelectedPermissions] = useState<{
    [key in ModuleName]: { [key in PermissionType]: boolean };
  }>(
    defaultModules.reduce((acc, mod) => {
      const perms = {} as { [key in PermissionType]: boolean };
      defaultPermissions.forEach(p => {
        perms[p] = p === 'Ver'; // Default check "Ver" permission for all modules
      });
      return { ...acc, [mod]: perms };
    }, {} as { [key in ModuleName]: { [key in PermissionType]: boolean } })
  );

  const handleTogglePermission = (mod: ModuleName, perm: PermissionType) => {
    setSelectedPermissions(prev => ({
      ...prev,
      [mod]: {
        ...prev[mod],
        [perm]: !prev[mod][perm]
      }
    }));
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!roleName.trim() || !description.trim()) {
      setValidationError('Por favor, ingresa un nombre y descripción para el rol.');
      return;
    }

    if (roles.some(r => r.name.toLowerCase().trim() === roleName.toLowerCase().trim())) {
      setValidationError('Ya existe un rol con este nombre.');
      return;
    }

    // Process modules
    const modulesConfig: { [key in ModuleName]?: PermissionType[] } = {};
    defaultModules.forEach(mod => {
      const activePermsForMod = defaultPermissions.filter(p => selectedPermissions[mod][p]);
      if (activePermsForMod.length > 0) {
        modulesConfig[mod] = activePermsForMod;
      }
    });

    // Call Context add role
    addRole({
      name: roleName.trim(),
      description: description.trim(),
      modules: modulesConfig
    });

    // Reset fields
    setRoleName('');
    setDescription('');
    setSelectedPermissions(
      defaultModules.reduce((acc, mod) => {
        const perms = {} as { [key in PermissionType]: boolean };
        defaultPermissions.forEach(p => {
          perms[p] = p === 'Ver';
        });
        return { ...acc, [mod]: perms };
      }, {} as { [key in ModuleName]: { [key in PermissionType]: boolean } })
    );
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Roles</h2>
          <p className="text-slate-400 mt-2 text-sm">
            Crea y administra los roles de seguridad de la fábrica de software. Define qué permisos tiene cada rol sobre los módulos de SpecFlow.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/10 hover:shadow-blue-500/20 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear Rol
        </button>
      </div>

      {/* Grid of Roles */}
      <div className="grid gap-6 md:grid-cols-2">
        {roles.map((role) => (
          <div
            key={role.id}
            className="rounded-2xl border border-slate-800 bg-[#111827]/40 p-6 backdrop-blur-md hover:border-slate-700 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Header card info */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">{role.name}</h3>
                  <span className="mt-1 inline-flex items-center rounded-md bg-blue-400/10 px-2 py-0.5 text-xs font-semibold text-blue-400 ring-1 ring-inset ring-blue-400/20">
                    {role.permissionCount} permisos asociados
                  </span>
                </div>
                {/* Delete button (Avoid deleting Admin default role for safety, but allow deleting others) */}
                {role.name !== 'Administrador' && (
                  <button
                    onClick={() => deleteRole(role.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Eliminar rol"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-slate-400 leading-relaxed">{role.description}</p>

              {/* Modules breakdown */}
              <div className="mt-5 space-y-2">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Distribución de accesos</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {Object.entries(role.modules).map(([moduleName, perms]) => (
                    <span
                      key={moduleName}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      {moduleName}: <strong className="text-white font-semibold">{perms?.length}</strong>
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
        title="Crear Nuevo Rol de Acceso"
      >
        <form onSubmit={handleCreateRole} className="space-y-6">
          {validationError && (
            <div className="text-red-400 text-xs border border-red-500/20 bg-red-500/10 px-3 py-2 rounded-xl">
              {validationError}
            </div>
          )}

          {/* Name & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Nombre del Rol
              </label>
              <input
                type="text"
                required
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Ej. Desarrollador Frontend"
                className="w-full px-4 py-2.5 bg-[#1F2937]/35 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white text-sm outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Descripción del Rol
              </label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Indica las responsabilidades y accesos generales que confiere este rol en la plataforma."
                className="w-full px-4 py-2.5 bg-[#1F2937]/35 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white text-sm outline-none transition-all duration-200 resize-none"
              />
            </div>
          </div>

          {/* Permissions Matrix */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Definición de Permisos por Módulo
              </label>
              <span className="text-[10px] text-slate-500 font-semibold">Toma acción granular</span>
            </div>
            
            <div className="border border-slate-800 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#1F2937]/45 border-b border-slate-800 text-slate-400 font-semibold sticky top-0">
                  <tr>
                    <th className="p-3">Módulo</th>
                    {defaultPermissions.map(p => (
                      <th key={p} className="p-3 text-center">{p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-transparent">
                  {defaultModules.map(mod => (
                    <tr key={mod} className="hover:bg-slate-900/20">
                      <td className="p-3 font-semibold text-white">{mod}</td>
                      {defaultPermissions.map(perm => (
                        <td key={perm} className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedPermissions[mod][perm]}
                            onChange={() => handleTogglePermission(mod, perm)}
                            className="h-4 w-4 rounded border-slate-800 bg-[#1F2937]/35 text-blue-600 focus:ring-blue-500/30 cursor-pointer"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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
              Crear Rol
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
