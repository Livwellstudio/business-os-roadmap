import { useStore } from '../store'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts'
import { Badge, formatZAR } from '../components/ui'
import { Page } from '../components/Sidebar'

const STATUS_COLOR: Record<string, 'green'|'gold'|'amber'|'blue'|'red'|'gray'> = {
  complete:'green', active:'gold', qa:'amber', proposal:'blue', lead:'gray', 'on-hold':'red',
}

function RevTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0c1620] border border-[#1b2c38] rounded-xl p-4 text-xs shadow-xl">
      <p className="font-semibold text-[#c8dce8] mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="mb-1">{p.name}: <span className="font-bold">{formatZAR(p.value as number)}</span></p>
      ))}
    </div>
  )
}

export default function Overview({ onNav }: { onNav: (p: Page) => void }) {
  const { state } = useStore()
  const { clients, invoices, expenses, manufacturingJobs, designJobs, collabs } = state

  const activeClients  = clients.filter(c => c.status === 'active' || c.status === 'qa')
  const totalPipeline  = clients.filter(c => c.status === 'proposal' || c.status === 'lead').reduce((s, c) => s + c.value, 0)
  const totalActive    = activeClients.reduce((s, c) => s + c.value, 0)
  const collected      = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const outstanding    = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.amount, 0)
  const overdue        = invoices.filter(i => i.status === 'overdue')
  const totalCost      = expenses.reduce((s, e) => s + e.amount, 0)
  const openMfgJobs    = manufacturingJobs.filter(j => j.status !== 'complete').length
  const activeCollabs  = collabs.filter(c => c.status === 'active').length

  const months = ['Jan','Feb','Mar','Apr','May','Jun']
  const invByMonth = months.map((m, i) => {
    const iso = `2026-0${i+1}`
    return {
      month: m,
      invoiced: invoices.filter(inv => inv.issueDate.startsWith(iso)).reduce((s,i) => s+i.amount, 0),
      collected: invoices.filter(inv => inv.issueDate.startsWith(iso) && inv.status === 'paid').reduce((s,i) => s+i.amount, 0),
    }
  })

  const kpis = [
    { label:'Revenue Collected',  value: formatZAR(collected),   sub:'All paid invoices',      color:'text-[#c4935a]' },
    { label:'Active Projects',    value: activeClients.length,   sub:'In progress + QA',       color:'text-[#c8dce8]' },
    { label:'Active Project Value',value: formatZAR(totalActive),sub:'Total value on site',    color:'text-[#c8dce8]' },
    { label:'Pipeline',           value: formatZAR(totalPipeline),sub:'Leads + proposals',     color:'text-blue-400' },
    { label:'Outstanding',        value: formatZAR(outstanding), sub:`${overdue.length} overdue`, color: overdue.length > 0 ? 'text-red-400' : 'text-amber-400' },
    { label:'Gross Margin',       value: formatZAR(collected - totalCost), sub:'Collected − expenses', color: (collected-totalCost) > 0 ? 'text-emerald-400' : 'text-red-400' },
    { label:'Mfg Jobs Open',      value: openMfgJobs,            sub:'In workshop / pending',  color:'text-[#c8dce8]' },
    { label:'Active Collabs',     value: activeCollabs,          sub:'Lodge + commercial',     color:'text-[#3d7a6d]' },
  ]

  const catCount: Record<string, number> = {}
  state.products.forEach(p => { catCount[p.category] = (catCount[p.category] ?? 0) + 1 })

  return (
    <div className="max-w-[1500px] mx-auto px-6 py-6 space-y-6">

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-[#0e1820] border border-[#1b2c38] rounded-2xl p-4 fade-up">
            <p className="text-[9px] font-bold tracking-widest text-[#2e4455] uppercase mb-2">{k.label}</p>
            <p className={`text-xl font-semibold ${k.color}`}>{k.value}</p>
            <p className="text-[10px] text-[#2e4455] mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue bar chart */}
        <div className="lg:col-span-2 bg-[#0e1820] border border-[#1b2c38] rounded-2xl p-6">
          <p className="text-[10px] font-bold tracking-widest text-[#2e4455] uppercase mb-1">Revenue 2026</p>
          <p className="text-xl font-semibold text-[#c4935a] mb-5">{formatZAR(collected)} collected</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={invByMonth} barGap={3} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#1b2c38" vertical={false} />
              <XAxis dataKey="month" tick={{ fill:'#3d5a6e', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `R${v/1000}k`} tick={{ fill:'#3d5a6e', fontSize:10 }} axisLine={false} tickLine={false} width={52} />
              <Tooltip content={<RevTooltip />} cursor={{ fill:'rgba(196,147,90,0.04)' }} />
              <Bar dataKey="invoiced"  name="Invoiced"  fill="#5c3d1e" radius={[4,4,0,0]} />
              <Bar dataKey="collected" name="Collected" fill="#c4935a" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Client status breakdown */}
        <div className="bg-[#0e1820] border border-[#1b2c38] rounded-2xl p-6">
          <p className="text-[10px] font-bold tracking-widest text-[#2e4455] uppercase mb-1">Client Status</p>
          <p className="text-xl font-semibold text-[#c8dce8] mb-5">{clients.length} total clients</p>
          {(['active','qa','proposal','lead','complete','on-hold'] as const).map(s => {
            const n = clients.filter(c => c.status === s).length
            if (!n) return null
            const pct = Math.round((n / clients.length) * 100)
            return (
              <div key={s} className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#5a7f95] capitalize">{s.replace('-', ' ')}</span>
                  <span className="text-[#c8dce8] font-semibold">{n}</span>
                </div>
                <div className="w-full h-1.5 bg-[#1b2c38] rounded-full overflow-hidden">
                  <div className="h-full rounded-full"
                    style={{ width:`${pct}%`, background: s==='active'?'#c4935a':s==='complete'?'#22c55e':s==='qa'?'#f59e0b':s==='proposal'?'#3b82f6':'#3d5a6e' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Active projects + overdue alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-[#0e1820] border border-[#1b2c38] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold tracking-widest text-[#2e4455] uppercase">Active Projects</p>
            <button onClick={() => onNav('clients')} className="text-xs text-[#c4935a] hover:underline">View all →</button>
          </div>
          <div className="space-y-3">
            {activeClients.slice(0, 6).map(c => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-[#c8dce8] truncate">{c.client}</p>
                    <Badge color={STATUS_COLOR[c.status]}>{c.status.replace('-',' ')}</Badge>
                  </div>
                  <p className="text-[10px] text-[#3d5a6e] truncate">{c.products}</p>
                  <div className="w-full h-1 bg-[#1b2c38] rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full rounded-full bg-[#c4935a]" style={{ width:`${c.progress}%` }} />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-[#c4935a]">{formatZAR(c.value)}</p>
                  <p className="text-[10px] text-[#2e4455]">{c.progress}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0e1820] border border-[#1b2c38] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold tracking-widest text-[#2e4455] uppercase">Recent Invoices</p>
            <button onClick={() => onNav('financials')} className="text-xs text-[#c4935a] hover:underline">View all →</button>
          </div>
          {overdue.length > 0 && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3 mb-4 flex gap-2">
              <span className="text-red-400">⚠</span>
              <div>
                <p className="text-xs font-semibold text-red-400">Overdue: {formatZAR(overdue.reduce((s,i)=>s+i.amount,0))}</p>
                <p className="text-[10px] text-[#5a7f95]">{overdue.map(i=>i.client).join(' · ')}</p>
              </div>
            </div>
          )}
          <div className="space-y-2">
            {invoices.slice(-7).reverse().map(inv => {
              const col: 'green'|'gold'|'amber'|'red'|'gray' =
                inv.status==='paid'?'green':inv.status==='sent'?'gold':inv.status==='overdue'?'red':'gray'
              return (
                <div key={inv.id} className="flex items-center justify-between py-2 border-b border-[#1b2c38] last:border-0">
                  <div>
                    <p className="text-xs font-medium text-[#c8dce8]">{inv.client}</p>
                    <p className="text-[10px] text-[#3d5a6e]">{inv.invoiceNo} · {inv.issueDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge color={col}>{inv.status}</Badge>
                    <span className="text-sm font-semibold text-[#c4935a]">{formatZAR(inv.amount)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mfg + Design snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-[#0e1820] border border-[#1b2c38] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold tracking-widest text-[#2e4455] uppercase">Manufacturing</p>
            <button onClick={() => onNav('manufacturing')} className="text-xs text-[#c4935a] hover:underline">View all →</button>
          </div>
          {manufacturingJobs.map(job => {
            const done = job.cutlist.filter(c=>c.done).length
            const total = job.cutlist.length
            const pct = total > 0 ? Math.round((done/total)*100) : 0
            const STAT_COL: Record<string, string> = { pending:'#3d5a6e', cutting:'#3b82f6', welding:'#f59e0b', assembly:'#c4935a', finishing:'#a78bfa', qa:'#f59e0b', complete:'#22c55e' }
            return (
              <div key={job.id} className="mb-4 pb-4 border-b border-[#1b2c38] last:border-0">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium text-[#c8dce8] truncate pr-2">{job.product}</p>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ color: STAT_COL[job.status], background: STAT_COL[job.status]+'18' }}>{job.status}</span>
                </div>
                <p className="text-[10px] text-[#3d5a6e] mb-2">{job.jobNo} · {job.assignedTo} · Due {job.dueDate}</p>
                {total > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#1b2c38] rounded-full overflow-hidden">
                      <div className="h-full bg-[#c4935a] rounded-full" style={{ width:`${pct}%` }} />
                    </div>
                    <span className="text-[10px] text-[#5a7f95]">{done}/{total}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="bg-[#0e1820] border border-[#1b2c38] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold tracking-widest text-[#2e4455] uppercase">Design & R&D</p>
            <button onClick={() => onNav('design')} className="text-xs text-[#c4935a] hover:underline">View all →</button>
          </div>
          <div className="space-y-3">
            {designJobs.filter(d => d.status !== 'approved').map(d => {
              const DCOL: Record<string,string> = { briefed:'#3d5a6e', 'in-progress':'#c4935a', review:'#f59e0b', revision:'#ef4444' }
              return (
                <div key={d.id} className="flex items-start gap-3 pb-3 border-b border-[#1b2c38] last:border-0">
                  <span className="text-lg mt-0.5">
                    {d.type==='3d-render'?'🧊':d.type==='technical-drawing'?'📐':d.type==='proposal'?'📄':d.type==='animation'?'🎬':'💡'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#c8dce8] leading-snug">{d.title}</p>
                    <p className="text-[10px] text-[#3d5a6e] mt-0.5">{d.assignedTo} · Due {d.dueDate}</p>
                  </div>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ color: DCOL[d.status], background: DCOL[d.status]+'18' }}>{d.status.replace('-',' ')}</span>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
