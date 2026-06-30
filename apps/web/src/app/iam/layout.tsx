'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useIAM } from '@/context/IAMContext';

export default function IAMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, currentUser, logout, visibleModules, can } = useIAM();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Route protection
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !currentUser) {
    return <div className="min-h-screen bg-[#0B0F19]"></div>;
  }

  if (!can("iam", "Read")) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex items-center justify-center px-6">
        <div className="max-w-md rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
          <h1 className="text-2xl font-bold text-white">403</h1>
          <p className="mt-3 text-sm text-red-200">
            No tienes permisos para acceder al módulo de Identity & Access Management.
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      name: 'Resumen',
      href: '/iam',
      moduleId: 'iam',
    },
    ...visibleModules
      .filter((module) => module.id !== 'iam')
      .map((module) => ({
        name: module.name,
        href: module.route,
        moduleId: module.id,
      })),
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/iam') {
      return pathname === '/iam';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Header Bar */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-[#111827] border-b border-slate-800 z-30">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="font-bold text-lg text-white tracking-wider">SpecFlow IAM</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 rounded-lg text-slate-400 hover:text-white focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#111827]/90 border-r border-slate-800 z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex md:flex-col md:h-screen md:w-64 backdrop-blur-xl ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="px-6 py-8 border-b border-slate-800/60 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-105 transition-transform duration-200">
              SF
            </div>
            <div>
              <h1 className="font-bold text-base text-white tracking-wider leading-none">SpecFlow AI</h1>
              <span className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase">IAM Module</span>
            </div>
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/60 bg-[#0F1522]">
          {/* User Widget */}
          <div className="flex items-center gap-3 px-2 py-3 rounded-xl">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 font-medium truncate">{currentUser.role}</p>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-medium text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all duration-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Inicio
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 rounded-xl transition-all duration-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Salir
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Main Workspace Panel */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden md:max-h-screen md:overflow-y-auto bg-[#0B0F19] relative">
        {/* Top visual glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[250px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

        <div className="flex-1 px-6 py-8 md:px-8 md:py-10 z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
