import { projects, kpis } from '../data/livwell'

function formatZAR(n: number) {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `R${(n / 1_000).toFixed(0)}k`
  return `R${n}`
}

interface CardProps {
  label: string
  value: string
  sub: string
  accent: string
  delay: string
}

function Card({ label, value, sub, accent, delay }: CardProps) {
  return (
    <div
      className="bg-[#111e2b] border border-[#1a2e40] rounded-2xl p-6 fade-up hover:border-[#243d52] transition-colors"
      style={{ animationDelay: delay }}
    >
      <p className="text-xs font-semibold tracking-widest text-[#445a70] uppercase mb-3">{label}</p>
      <p className={`text-3xl font-semibold ${accent} mb-1`}>{value}</p>
      <p className="text-xs text-[#445a70]">{sub}</p>
    </div>
  )
}

export default function KPICards() {
  const { ytdRevenue, active, pipeline, avgValue, completed } = kpis(projects)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <Card label="Revenue YTD"     value={formatZAR(ytdRevenue)} sub="Jan–Jun 2026"       accent="text-[#c9a96e]"  delay="0ms" />
      <Card label="Active Projects" value={String(active)}        sub="In progress + QA"   accent="text-[#dce6f0]"  delay="60ms" />
      <Card label="Pipeline"        value={formatZAR(pipeline)}   sub={`${projects.filter(p=>p.status==='planning').length} proposals`} accent="text-[#3b82f6]" delay="120ms" />
      <Card label="Avg Project"     value={formatZAR(avgValue)}   sub="across all jobs"    accent="text-[#dce6f0]"  delay="180ms" />
      <Card label="Delivered"       value={String(completed)}     sub="projects this year"  accent="text-emerald-400" delay="240ms" />
    </div>
  )
}
