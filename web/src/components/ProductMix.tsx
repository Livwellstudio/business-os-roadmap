import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts'
import { productMix } from '../data/livwell'

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-[#0d1520] border border-[#1a2e40] rounded-xl px-4 py-3 text-sm shadow-xl">
      <p style={{ color: d.payload.color }} className="font-semibold">{d.name}</p>
      <p className="text-[#dce6f0]">{d.value}% of revenue mix</p>
    </div>
  )
}

export default function ProductMix() {
  return (
    <div className="bg-[#111e2b] border border-[#1a2e40] rounded-2xl p-6 h-full">
      <h2 className="text-sm font-semibold tracking-widest text-[#445a70] uppercase mb-1">Product Mix</h2>
      <p className="text-2xl font-semibold text-[#dce6f0] mb-6">Revenue by category</p>

      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={productMix}
            cx="50%" cy="50%"
            innerRadius={52} outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {productMix.map((entry) => (
              <Cell key={entry.name} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="space-y-2 mt-4">
        {productMix.map(item => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
              <span className="text-xs text-[#8aa0b8]">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-20 h-1 rounded-full bg-[#1a2e40] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
              </div>
              <span className="text-xs font-semibold text-[#dce6f0] w-6 text-right">{item.value}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
