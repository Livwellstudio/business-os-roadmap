import { projects, Project, ProjectStatus } from '../data/livwell'

const COLUMNS: { key: ProjectStatus; label: string; color: string; dot: string }[] = [
  { key: 'planning',    label: 'Planning',     color: '#3b82f6', dot: 'bg-blue-500' },
  { key: 'in-progress', label: 'In Progress',  color: '#c9a96e', dot: 'bg-[#c9a96e]' },
  { key: 'qa',          label: 'QA / Snags',   color: '#f59e0b', dot: 'bg-amber-400' },
  { key: 'complete',    label: 'Complete',      color: '#22c55e', dot: 'bg-emerald-500' },
]

const TYPE_LABELS: Record<string, string> = {
  sauna:        'Sauna',
  'cold-plunge':'Cold Plunge',
  'hot-tub':    'Hot Tub',
  pavilion:     'Pavilion',
  steam:        'Steam',
}

const TYPE_COLORS: Record<string, string> = {
  sauna:        'text-[#c9a96e] bg-[#c9a96e]/10',
  'cold-plunge':'text-blue-400 bg-blue-400/10',
  'hot-tub':    'text-emerald-400 bg-emerald-400/10',
  pavilion:     'text-purple-400 bg-purple-400/10',
  steam:        'text-sky-400 bg-sky-400/10',
}

function fmt(n: number) {
  return `R${(n / 1000).toFixed(0)}k`
}

function ProjectCard({ p }: { p: Project }) {
  const col = COLUMNS.find(c => c.key === p.status)!
  return (
    <div className="bg-[#0d1520] border border-[#1a2e40] rounded-xl p-4 hover:border-[#243d52] transition-colors cursor-default">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-[#dce6f0] leading-tight">{p.client}</p>
          <p className="text-xs text-[#445a70] mt-0.5">{p.location}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[p.type]}`}>
          {TYPE_LABELS[p.type]}
        </span>
      </div>

      <p className="text-xs text-[#8aa0b8] mb-3 leading-snug">{p.product}</p>

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#445a70]">{p.stage}</span>
        <span className="text-xs font-semibold text-[#dce6f0]">{p.progress}%</span>
      </div>

      <div className="w-full h-1 bg-[#1a2e40] rounded-full mb-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${p.progress}%`, background: col.color }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: col.color }}>{fmt(p.value)}</span>
        <span className="text-xs text-[#445a70]">{p.endDate.slice(0, 7)}</span>
      </div>
    </div>
  )
}

export default function ProjectPipeline() {
  const byStatus = (s: ProjectStatus) => projects.filter(p => p.status === s)
  const total = projects.reduce((s, p) => s + p.value, 0)

  return (
    <div className="bg-[#111e2b] border border-[#1a2e40] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold tracking-widest text-[#445a70] uppercase mb-1">Project Pipeline</h2>
          <p className="text-2xl font-semibold text-[#dce6f0]">{projects.length} projects · {fmt(total)} total</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map(col => {
          const items = byStatus(col.key)
          const colTotal = items.reduce((s, p) => s + p.value, 0)
          return (
            <div key={col.key}>
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#1a2e40]">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className="text-xs font-semibold text-[#8aa0b8]">{col.label}</span>
                </div>
                <span className="text-xs text-[#445a70]">{items.length}</span>
              </div>
              {colTotal > 0 && (
                <p className="text-xs text-[#445a70] mb-3">{fmt(colTotal)}</p>
              )}
              <div className="space-y-3">
                {items.map(p => <ProjectCard key={p.id} p={p} />)}
                {items.length === 0 && (
                  <p className="text-xs text-[#2a3f52] italic py-4 text-center">No projects</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
