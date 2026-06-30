'use client';

import { loginWithEmail, loginWithProvider } from "@/lib/auth";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIAM } from '@/context/IAMContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn } = useIAM();
  const [email, setEmail] = useState('admin@specflow.ai');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/iam');
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await loginWithEmail(email, password);

    if (result.success && result.user) {
      login(result.user);
      router.push("/iam");
    } else {
      setError(result.message ?? "Error al iniciar sesión.");
    }

    setIsLoading(false);
  };

  const handleSSOLogin = async (provider: "Google" | "GitHub" | "Microsoft") => {
  setIsLoading(true);

  const result = await loginWithProvider(provider);
    if (result.success && result.user) {
      login(result.user);
      router.push("/iam");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] text-slate-100 px-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[150px]" />

      <div className="w-full max-w-md z-10">
        {/* Branding header */}
        <div className="text-center mb-8 animate-fadeIn">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full">
            SpecFlow AI
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Identity Control
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Acceso unificado a la fábrica de software inteligente
          </p>
        </div>

        {/* Card wrapper */}
        <div className="bg-[#111827]/60 border border-slate-800 rounded-3xl p-8 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-slideUp">
          
          {/* SSO Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSSOLogin('Google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1F2937]/50 hover:bg-[#1F2937] border border-slate-800 hover:border-slate-700 rounded-2xl text-sm font-medium transition-all duration-200"
            >
              {/* Google SVG Icon */}
              <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V13.4 h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.746-.08-1.32-.176-1.887H12.24z" />
              </svg>
              Continuar con Google
            </button>

            <button
              onClick={() => handleSSOLogin('GitHub')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1F2937]/50 hover:bg-[#1F2937] border border-slate-800 hover:border-slate-700 rounded-2xl text-sm font-medium transition-all duration-200"
            >
              {/* GitHub SVG Icon */}
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
              Continuar con GitHub
            </button>

            <button
              onClick={() => handleSSOLogin('Microsoft')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1F2937]/50 hover:bg-[#1F2937] border border-slate-800 hover:border-slate-700 rounded-2xl text-sm font-medium transition-all duration-200"
            >
              {/* Microsoft SVG Icon */}
              <svg className="w-5 h-5 text-blue-400" viewBox="0 0 23 23" fill="currentColor">
                <path fill="#f35325" d="M0 0h11v11H0z" />
                <path fill="#81bc06" d="M12 0h11v11H12z" />
                <path fill="#05a6f0" d="M0 12h11v11H0z" />
                <path fill="#ffba08" d="M12 12h11v11H12z" />
              </svg>
              Continuar con Microsoft
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#111827]/90 px-3 text-slate-500 font-semibold tracking-wider">o continuar con correo</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@empresa.com"
                className="w-full px-4 py-3 bg-[#1F2937]/35 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl text-white text-sm outline-none transition-all duration-200"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Contraseña
                </label>
                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <input
                id="password"
                type="password"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#1F2937]/35 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl text-white text-sm outline-none transition-all duration-200"
              />
            </div>

            {error && (
              <div className="text-red-400 text-xs border border-red-500/20 bg-red-500/10 px-3 py-2 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-2xl text-sm shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          {/* Sugerencias de demostración */}
          <div className="mt-6 border-t border-slate-800/60 pt-4">
            <p className="text-xs text-slate-500 text-center">
              💡 Tip de prueba: Presiona &quot;Iniciar sesión&quot; directamente para entrar como Administrador o usa cualquier correo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
