'use client';

import React, { useState } from 'react';
import { useIAM, ModuleName, PermissionType } from '@/context/IAMContext';

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

export default function PermisosPage() {
  const { permissionsMatrix, toggleMatrixPermission } = useIAM();
  const [showToast, setShowToast] = useState(false);

  const handleToggle = (module: ModuleName, permission: PermissionType) => {
    toggleMatrixPermission(module, permission);
    
    // Show a quick visual auto-save toast/indicator
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fadeIn relative">
      {/* Toast Notification */}
      <div
        className={`fixed bottom-6 right-6 z-50 bg-[#111827] border border-blue-500/20 text-blue-400 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-2 transition-all duration-300 transform ${
          showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-xs font-semibold">Guardado en LocalStorage</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Matriz de Permisos</h2>
          <p className="text-slate-400 mt-2 text-sm max-w-3xl">
            Modifica la matriz global de permisos por módulo de la plataforma SpecFlow AI. Estos permisos definen las capacidades a nivel de sistema que los usuarios pueden poseer.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 rounded-full self-start">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          Autoguardado Activo
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#111827]/30 backdrop-blur-md">
        <table className="w-full border-collapse text-left text-sm text-slate-300">
          <thead className="bg-[#111827]/70 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-5">Módulo de Plataforma</th>
              {defaultPermissions.map((perm) => (
                <th key={perm} className="px-4 py-5 text-center">{perm}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-transparent">
            {defaultModules.map((moduleName) => (
              <tr key={moduleName} className="hover:bg-slate-900/30 transition-colors">
                {/* Module Name & Details */}
                <td className="px-6 py-5 font-semibold text-white">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    <div>
                      <p className="text-sm font-semibold text-white">{moduleName}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Control de acceso granular</p>
                    </div>
                  </div>
                </td>

                {/* Permission Toggles */}
                {defaultPermissions.map((perm) => {
                  const isChecked = permissionsMatrix[moduleName]?.[perm] ?? false;
                  return (
                    <td key={perm} className="px-4 py-5 text-center">
                      <div className="inline-flex items-center justify-center">
                        <label className="relative flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggle(moduleName, perm)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-focus:ring-1 peer-focus:ring-blue-500/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white peer-checked:after:border-blue-600"></div>
                        </label>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Card */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/20 p-6 flex flex-col sm:flex-row gap-4 items-start">
        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400 shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm">¿Cómo funciona la herencia de permisos?</h4>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            La matriz global define qué permisos están habilitados y disponibles para ser asignados en la plataforma.
            Cuando un rol reclama permisos sobre un módulo, este quedará condicionado a que los permisos estén activos aquí en la matriz global.
            Cualquier cambio realizado se propaga en tiempo real a los tokens de sesión de los usuarios activos.
          </p>
        </div>
      </div>
    </div>
  );
}
