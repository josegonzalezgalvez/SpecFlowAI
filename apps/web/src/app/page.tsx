import Link from "next/link";

type KpiItem = {
  label: string;
  value: string;
  trend: string;
};

type ProjectStatusItem = {
  name: string;
  count: number;
  progress: number;
  tone: string;
};

type ActivityItem = {
  user: string;
  action: string;
  project: string;
  time: string;
};

type ConsumptionItem = {
  module: string;
  tokens: string;
  percent: number;
};

type DashboardResponse = {
  projects: {
    total: number;
    active: number;
    blocked: number;
    completed: number;
  };
  users: {
    active: number;
    interactionsToday: number;
  };
  aiUsage: {
    tokensConsumed: number;
    estimatedCostUsd: number;
  };
};

const projectStatuses: ProjectStatusItem[] = [
  { name: "Nuevo", count: 14, progress: 15, tone: "bg-slate-500" },
  { name: "En Discovery", count: 8, progress: 28, tone: "bg-sky-500" },
  { name: "En Requerimiento", count: 11, progress: 42, tone: "bg-violet-500" },
  { name: "En Arquitectura", count: 9, progress: 56, tone: "bg-indigo-500" },
  { name: "En Estimación", count: 6, progress: 63, tone: "bg-cyan-500" },
  { name: "En Desarrollo", count: 17, progress: 74, tone: "bg-emerald-500" },
  { name: "En Testing", count: 10, progress: 82, tone: "bg-amber-500" },
  { name: "En Deploy", count: 5, progress: 90, tone: "bg-rose-500" },
  { name: "Completado", count: 32, progress: 100, tone: "bg-green-600" },
  { name: "Bloqueado", count: 4, progress: 35, tone: "bg-red-500" },
];

const recentActivity: ActivityItem[] = [
  { user: "Marta Ruiz", action: "actualizó requisitos", project: "Portal B2B", time: "5 min" },
  { user: "Luis Vega", action: "aprobó arquitectura", project: "API Gateway", time: "18 min" },
  { user: "Ana Torres", action: "envió casos de prueba", project: "Dashboard Ops", time: "31 min" },
  { user: "Daniel Cho", action: "desplegó release", project: "Mobile App", time: "1 h" },
];

const aiConsumption: ConsumptionItem[] = [
  { module: "Requerimiento", tokens: "820K", percent: 92 },
  { module: "Arquitectura", tokens: "710K", percent: 78 },
  { module: "Estimación", tokens: "540K", percent: 64 },
  { module: "Testing", tokens: "1.1M", percent: 88 },
  { module: "Desarrollo", tokens: "1.4M", percent: 95 },
  { module: "DevOps", tokens: "630K", percent: 71 },
];

async function getDashboardData(): Promise<DashboardResponse> {
  const response = await fetch("http://localhost:3000/api/dashboard", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudo cargar el dashboard");
  }

  return response.json();
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatCost(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function StatCard({ label, value, trend }: KpiItem) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-emerald-600">{trend}</p>
    </div>
  );
}

function StatusBar({ name, count, progress, tone }: ProjectStatusItem) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">{name}</p>
          <p className="text-xs text-slate-500">{count} proyectos</p>
        </div>
        <span className="text-sm font-semibold text-slate-700">{progress}%</span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-slate-200">
        <div className={`h-2 rounded-full ${tone}`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export default async function Home() {
  const dashboardData = await getDashboardData();

  const kpis: KpiItem[] = [
    { label: "Proyectos totales", value: formatNumber(dashboardData.projects.total), trend: "+12% vs mes anterior" },
    { label: "Proyectos activos", value: formatNumber(dashboardData.projects.active), trend: "9 en ejecución hoy" },
    { label: "Proyectos bloqueados", value: formatNumber(dashboardData.projects.blocked), trend: "Requiere revisión" },
    { label: "Proyectos completados", value: formatNumber(dashboardData.projects.completed), trend: "Entregas consolidadas" },
    { label: "Usuarios activos", value: formatNumber(dashboardData.users.active), trend: "+6 esta semana" },
    { label: "Interacciones de hoy", value: formatNumber(dashboardData.users.interactionsToday), trend: "Actividad en tiempo real" },
    { label: "Tokens consumidos", value: formatNumber(dashboardData.aiUsage.tokensConsumed), trend: "Pico en Development" },
    { label: "Costo estimado", value: formatCost(dashboardData.aiUsage.estimatedCostUsd), trend: "Optimizado 8%" },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.14),_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-900">
      <main className="mx-auto flex max-w-7xl flex-col px-6 py-10 sm:px-8 lg:px-10 lg:py-12">
        <section className="rounded-[32px] border border-slate-200/80 bg-white/85 p-8 shadow-[0_24px_90px_-36px_rgba(15,23,42,0.35)] backdrop-blur sm:p-10 lg:p-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                SpecFlow AI
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Command Center
              </h1>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
                Vista ejecutiva del ciclo de desarrollo asistido por IA.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link 
                href="/iam" 
                className="rounded-2xl border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors duration-200 px-4 py-3 text-sm font-semibold text-blue-700 flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Identity & Access Management (IAM)
              </Link>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 flex items-center justify-center">
                Sistema operativo · 24/7
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => (
            <StatCard key={item.label} {...item} />
          ))}
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Operación
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Proyectos por estatus</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {projectStatuses.map((item) => (
                <StatusBar key={item.name} {...item} />
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                Actividad reciente
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Usuarios activos</h2>
            </div>

            <div className="mt-6 space-y-4">
              {recentActivity.map((item) => (
                <div key={`${item.user}-${item.project}`} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-100">{item.user}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {item.action} · {item.project}
                      </p>
                    </div>
                    <span className="text-sm text-slate-500">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Consumo IA
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Consumo de IA</h2>
          </div>

          <div className="mt-6 space-y-4">
            {aiConsumption.map((item) => (
              <div key={item.module}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.module}</span>
                  <span className="text-slate-500">{item.tokens}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-sky-600" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
