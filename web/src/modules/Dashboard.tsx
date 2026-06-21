import { useStore } from '../store'
import { revenueData, productMix } from '../data/livwell'
import RevenueChart from '../components/RevenueChart'
import ProductMix   from '../components/ProductMix'
import { Badge, Stat, formatZAR } from '../components/ui'
import { Page } from '../components/Sidebar'

const STATUS_COLOR: Record<string, 'gold' | 'blue' | 'green' | 'amber' | 'gray'> = {
  'in-progress': 'gold', planning: 'blue', qa: 'amber', complete: 'green',
}

export default function Dashboard({ onNav }: { onNav: (p: Page) => void }) {
  const { state } = useStore()
  const { projects, invoices, snags, siteVisits } = state

  const active    = projects.filter(p => p.status === 'in-progress' || p.status === 'qa')
  const pipeline  = projects.filter(p => p.status === 'planning').reduce((s, p) => s + p.value, 0)
  const collected = revenueData.reduce((s, m) => s + m.collected, 0)
  const outstanding = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.amount, 0)
  const openSnags = snags.filter(s => s.status !== 'complete').length
  const thisWeekVisits = siteVisits.filter(v => {
    const d = new Date(v.date), now = new Date()
    return Math.abs(d.getTime() - now.getTime()) < 7 * 86400000
  }).length

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        <Stat label="Revenue YTD"     value={formatZAR(collected)}   sub="Jan–Jun 2026"          color="text-[#c9a96e]" />
        <Stat label="Active Projects" value={active.length}          sub="in progress + QA"      color="text-[#dce6f0]" />
        <Stat label="Pipeline"        value={formatZAR(pipeline)}    sub={`${projects.filter(p=>p.status==='planning').length} proposals`} color="text-blue-400" />
        <Stat label="Outstanding"     value={formatZAR(outstanding)} sub="sent + overdue"        color={outstanding > 0 ? 'text-amber-400' : 'text-emerald-400'} />
        <Stat label="Open Snags"      value={openSnags}              sub="QA / QC items"         color={openSnags > 0 ? 'text-red-400' : 'text-emerald-400'} />
        <Stat label="Visits This Week"value={thisWeekVisits}         sub="site visits"           color="text-[#dce6f0]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><RevenueChart /></div>
        <div className="lg:col-span-1"><ProductMix /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active project cards */}
        <div className="bg-[#111e2b] border border-[#1a2e40] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#445a70] uppercase tracking-widest">Active Projects</h2>
            <button onClick={() => onNav('projects')} className="text-xs text-[#c9a96e] hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {active.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-[#dce6f0] truncate">{p.client}</p>
                    <Badge color={STATUS_COLOR[p.status]}>{p.status.replace('-', ' ')}</Badge>
                  </div>
                  <div className="w-full h-1.5 bg-[#1a2e40] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#c9a96e]" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
                <span className="text-xs text-[#445a70] w-10 text-right">{p.progress}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent invoices */}
        <div className="bg-[#111e2b] border border-[#1a2e40] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#445a70] uppercase tracking-widest">Recent Invoices</h2>
            <button onClick={() => onNav('financials')} className="text-xs text-[#c9a96e] hover:underline">View all</button>
          </div>
          <div className="space-y-2">
            {invoices.slice(0, 6).map(inv => {
              const color: 'green'|'gold'|'amber'|'red'|'gray' =
                inv.status === 'paid' ? 'green' : inv.status === 'sent' ? 'gold' :
                inv.status === 'overdue' ? 'red' : 'gray'
              return (
                <div key={inv.id} className="flex items-center justify-between py-1.5 border-b border-[#1a2e40] last:border-0">
                  <div>
                    <p className="text-sm text-[#dce6f0]">{inv.client}</p>
                    <p className="text-xs text-[#445a70]">{inv.invoiceNo}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <Badge color={color}>{inv.status}</Badge>
                    <span className="text-sm font-medium text-[#dce6f0]">{formatZAR(inv.amount)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
