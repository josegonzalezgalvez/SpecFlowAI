const modules = [
  {
    icon: "📝",
    name: "Requerimiento",
    description: "Captura y estructura necesidades de negocio con contexto claro.",
  },
  {
    icon: "🏗️",
    name: "Arquitectura",
    description: "Diseña soluciones escalables y alineadas con estándares técnicos.",
  },
  {
    icon: "📊",
    name: "Estimación",
    description: "Calcula alcance, esfuerzo y riesgos con mayor precisión.",
  },
  {
    icon: "🛠️",
    name: "Actividades de desarrollo",
    description: "Organiza tareas y flujos de trabajo de forma inteligente.",
  },
  {
    icon: "✅",
    name: "Casos de prueba",
    description: "Genera escenarios de validación y cubre riesgos críticos.",
  },
  {
    icon: "💻",
    name: "Desarrollo",
    description: "Acelera la implementación con asistencia de agentes especializados.",
  },
  {
    icon: "🚀",
    name: "Despliegue automático",
    description: "Entrega cambios de forma continua y segura con CI/CD.",
  },
];

const platformStatus = [
  { icon: "🟢", label: "Frontend" },
  { icon: "🟡", label: "Backend" },
  { icon: "⚪", label: "RAG" },
  { icon: "⚪", label: "Amazon Bedrock" },
  { icon: "⚪", label: "Agentes IA" },
  { icon: "⚪", label: "CI/CD" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-900">
      <main className="mx-auto flex max-w-7xl flex-col px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
        <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/80 p-8 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur sm:p-10 lg:p-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
                IA para fábricas de software
              </div>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                SpecFlow AI
              </h1>
              <h2 className="mt-4 text-xl font-medium text-slate-700 sm:text-2xl">
                Plataforma de Desarrollo de Software Asistida por Inteligencia Artificial
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Centraliza el ciclo completo de desarrollo de software utilizando agentes especializados,
                RAG y automatización inteligente.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl lg:min-w-[320px]">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                Arquitectura inteligente
              </p>
              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <span className="text-base">🧠</span>
                  <span>RAG contextual para decisiones técnicas</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-base">☁️</span>
                  <span>Integración con Amazon Bedrock</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-base">⚡</span>
                  <span>Automatización del ciclo de entrega</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                Capacidades
              </p>
              <h3 className="mt-2 text-3xl font-semibold text-slate-950">Módulos</h3>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => (
              <article
                key={module.name}
                className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="text-3xl">{module.icon}</div>
                <h4 className="mt-4 text-xl font-semibold text-slate-900">{module.name}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">{module.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[32px] border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur sm:p-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                Estado
              </p>
              <h3 className="mt-2 text-3xl font-semibold text-slate-950">Estado de la Plataforma</h3>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platformStatus.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium text-slate-800">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
