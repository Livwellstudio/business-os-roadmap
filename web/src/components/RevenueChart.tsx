import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, TooltipProps,
} from 'recharts'
import { revenueData } from '../data/livwell'

function fmt(v: number) {
  return v === 0 ? '—' : `R${(v / 1000).toFixed(0)}k`
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0d1520] border border-[#1a2e40] rounded-xl p-4 text-sm shadow-xl">
      <p className="font-semibold text-[#dce6f0] mb-2">{label} 2026</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="mb-1">
          {p.name}: <span className="font-semibold">{fmt(p.value as number)}</span>
        </p>
      ))}
    </div>
  )
}

export default function RevenueChart() {
  const total = revenueData.reduce((s, m) => s + m.invoiced, 0)
  const collected = revenueData.reduce((s, m) => s + m.collected, 0)
  const rate = Math.round((collected / total) * 100)

  return (
    <div className="bg-[#111e2b] border border-[#1a2e40] rounded-2xl p-6 h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold tracking-widest text-[#445a70] uppercase mb-1">Revenue 2026</h2>
          <p className="text-2xl font-semibold text-[#c9a96e]">R{(collected/1000).toFixed(0)}k collected</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#445a70] mb-1">Collection rate</p>
          <p className="text-lg font-semibold text-emerald-400">{rate}%</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={revenueData} barGap={4} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#1a2e40" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#445a70', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={v => `R${v/1000}k`} tick={{ fill: '#445a70', fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Legend
            wrapperStyle={{ paddingTop: 16, fontSize: 12, color: '#8aa0b8' }}
            iconType="circle" iconSize={8}
          />
          <Bar dataKey="invoiced"  name="Invoiced"   fill="#8a6d3f" radius={[4,4,0,0]} />
          <Bar dataKey="collected" name="Collected"  fill="#c9a96e" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
