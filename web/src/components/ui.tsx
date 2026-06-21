import React from 'react'

const inputCls = 'bg-[#0d1520] border border-[#1a2e40] rounded-lg px-3 py-2 text-[#dce6f0] text-sm placeholder-[#445a70] focus:outline-none focus:border-[#c9a96e] w-full transition-colors'

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputCls} {...props} />
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={inputCls + ' cursor-pointer'} {...props}>
      {children}
    </select>
  )
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={inputCls + ' resize-none'} rows={3} {...props} />
}

export function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-[#8aa0b8] mb-1.5 uppercase tracking-widest">
        {label}{required && <span className="text-[#c9a96e] ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

type BtnVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type BtnSize    = 'sm' | 'md'

export function Btn({
  variant = 'primary', size = 'md', children, className = '', ...props
}: { variant?: BtnVariant; size?: BtnSize } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = 'font-semibold rounded-lg transition-colors disabled:opacity-40 cursor-pointer'
  const sz   = size === 'sm' ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2'
  const v: Record<BtnVariant, string> = {
    primary:   'bg-[#c9a96e] hover:bg-[#e8c98a] text-[#07090c]',
    secondary: 'bg-[#1a2e40] hover:bg-[#243d52] text-[#8aa0b8]',
    danger:    'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20',
    ghost:     'hover:bg-[#1a2e40] text-[#8aa0b8]',
  }
  return <button className={`${base} ${sz} ${v[variant]} ${className}`} {...props}>{children}</button>
}

type BadgeColor = 'gold' | 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'gray' | 'sky'

export function Badge({ children, color = 'gray' }: { children: React.ReactNode; color?: BadgeColor }) {
  const c: Record<BadgeColor, string> = {
    gold:   'bg-[#c9a96e]/10 text-[#c9a96e] border-[#c9a96e]/20',
    blue:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
    red:    'bg-red-500/10 text-red-400 border-red-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    gray:   'bg-[#1a2e40] text-[#8aa0b8] border-[#1a2e40]',
    sky:    'bg-sky-500/10 text-sky-400 border-sky-500/20',
  }
  return <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${c[color]}`}>{children}</span>
}

export function Stat({ label, value, sub, color = 'text-[#dce6f0]' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-[#0d1520] border border-[#1a2e40] rounded-xl p-4">
      <p className="text-[10px] font-bold tracking-widest text-[#445a70] uppercase mb-2">{label}</p>
      <p className={`text-2xl font-semibold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-[#445a70] mt-1">{sub}</p>}
    </div>
  )
}

export function Th({ children }: { children?: React.ReactNode }) {
  return <th className="text-left text-[10px] font-bold text-[#445a70] uppercase tracking-widest px-4 py-3 whitespace-nowrap">{children}</th>
}

export function Td({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-sm text-[#dce6f0] ${className}`}>{children}</td>
}

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-semibold text-[#dce6f0]">{title}</h1>
        {sub && <p className="text-sm text-[#445a70] mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

export function EmptyRow({ cols, message = 'No records yet' }: { cols: number; message?: string }) {
  return (
    <tr>
      <td colSpan={cols} className="px-4 py-12 text-center text-sm text-[#445a70] italic">{message}</td>
    </tr>
  )
}

export function DeleteBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick() }}
      className="text-[#445a70] hover:text-red-400 transition-colors p-1 rounded"
      title="Delete"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
      </svg>
    </button>
  )
}

export function formatZAR(n: number) {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `R${(n / 1_000).toFixed(0)}k`
  return `R${n.toLocaleString()}`
}
