'use client';

import React from 'react';
import Link from 'next/link';
import { useIAM } from '@/context/IAMContext';

export default function IAMDashboardPage() {
  const { users, roles, profiles } = useIAM();

  // Compute metrics
  const activeUsersCount = users.filter((u) => u.status === 'Activo').length;
  const totalUsersCount = users.length;
  const rolesCount = roles.length;
  const profilesCount = profiles.length;
  const protectedModulesCount = 9; // Static count of modules

  // Mock list of recent accesses based on users list + timestamp
  const recentAccesses = users
    .filter((u) => u.status === 'Activo')
    .map((u, i) => {
      // Alternate times to simulate log order
      const times = ['Hace 2 min', 'Hace 5 min', 'Hace 18 min', 'Hace 31 min', 'Hace 2 horas'];
      return {
        ...u,
        accessTime: times[i % times.length],
        ipAddress: `192.168.1.${10 + i}`,
        location: 'Bogotá, CO'
      };
    });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Control de Acceso (IAM)
        </h2>
        <p className="text-slate-400 mt-2 text-sm max-w-3xl">
          Monitorea y configura los permisos del sistema, perfiles, roles y usuarios activos en el Command Center.
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-slate-800 bg-[#111827]/40 p-6 backdrop-blur-md hover:border-slate-700 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Usuarios Activos
            </span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{activeUsersCount}</span>
            <span className="text-xs text-slate-500">de {totalUsersCount} en total</span>
          </div>
          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Operando en tiempo real
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-slate-800 bg-[#111827]/40 p-6 backdrop-blur-md hover:border-slate-700 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Roles Configurados
            </span>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{rolesCount}</span>
            <span className="text-xs text-slate-500">definidos en la organización</span>
          </div>
          <div className="mt-2 text-xs text-blue-400">
            Políticas de seguridad activas
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-slate-800 bg-[#111827]/40 p-6 backdrop-blur-md hover:border-slate-700 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Perfiles de Usuario
            </span>
            <div className="rounded-lg bg-violet-500/10 p-2 text-violet-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{profilesCount}</span>
            <span className="text-xs text-slate-500">agrupaciones de roles</span>
          </div>
          <div className="mt-2 text-xs text-violet-400">
            Facilita administración masiva
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-slate-800 bg-[#111827]/40 p-6 backdrop-blur-md hover:border-slate-700 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Módulos Protegidos
            </span>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{protectedModulesCount}</span>
            <span className="text-xs text-slate-500">módulos en fábrica</span>
          </div>
          <div className="mt-2 text-xs text-amber-400">
            Aislados mediante tokens JWT
          </div>
        </div>
      </div>

      {/* Main dashboard content grids */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Side: Recent Access Log */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#111827]/40 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Últimos Accesos</h3>
              <p className="text-xs text-slate-500">Historial de autenticación e inicios de sesión recientes</p>
            </div>
            <Link
              href="/iam/usuarios"
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5 transition-colors"
            >
              Ver todos los usuarios
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="space-y-4">
            {recentAccesses.map((access) => (
              <div
                key={access.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 transition-colors duration-200 gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs">
                    {access.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{access.name}</h4>
                    <p className="text-xs text-slate-500">{access.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-6">
                  <div>
                    <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-semibold text-blue-400 ring-1 ring-inset ring-blue-400/20">
                      {access.role}
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-300 font-medium">{access.accessTime}</p>
                    <p className="text-[10px] text-slate-500">{access.ipAddress} · {access.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Security Overview / Quick Links */}
        <div className="space-y-6">
          {/* Active Roles Overview */}
          <div className="rounded-2xl border border-slate-800 bg-[#111827]/40 p-6 backdrop-blur-md">
            <h3 className="text-lg font-semibold text-white mb-4">Roles de Seguridad</h3>
            <div className="space-y-4">
              {roles.map((role) => (
                <div key={role.id} className="border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-sm text-slate-200">{role.name}</span>
                    <span className="text-xs text-slate-500 font-medium">{role.permissionCount} permisos</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{role.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800/60">
              <Link
                href="/iam/roles"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition-colors"
              >
                Configurar Roles
              </Link>
            </div>
          </div>

          {/* Module Coverage Widget */}
          <div className="rounded-2xl border border-slate-800 bg-[#111827]/40 p-6 backdrop-blur-md">
            <h3 className="text-lg font-semibold text-white mb-3">Módulos Registrados</h3>
            <p className="text-xs text-slate-500 mb-4">Módulos protegidos en el ecosistema SpecFlow AI</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Proyectos',
                'Requerimientos',
                'Arquitectura',
                'Estimación',
                'Desarrollo',
                'Testing',
                'Deploy',
                'RAG',
                'Administración'
              ].map((m) => (
                <div
                  key={m}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/50 border border-slate-800/50"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-medium text-slate-300">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
