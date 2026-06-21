type Page = 'dashboard' | 'projects' | 'inventory' | 'manufacturing' | 'site-visits' | 'qa' | 'financials' | 'design'

const ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: 'dashboard',     label: 'Dashboard',     icon: 'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z' },
  { id: 'projects',      label: 'Projects',      icon: 'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z' },
  { id: 'inventory',     label: 'Inventory',     icon: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' },
  { id: 'manufacturing', label: 'Manufacturing', icon: 'M12 2a10 10 0 110 20A10 10 0 0112 2zm0 4v4l3 3' },
  { id: 'site-visits',   label: 'Site Visits',   icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z' },
  { id: 'qa',            label: 'QA / QC',       icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { id: 'financials',    label: 'Financials',    icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
  { id: 'design',        label: 'Design',        icon: 'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z' },
]

interface Props {
  current: Page
  onNav: (p: Page) => void
}

export default function Sidebar({ current, onNav }: Props) {
  return (
    <aside className="w-[220px] flex-shrink-0 bg-[#0a1018] border-r border-[#1a2e40] flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-[#1a2e40]">
        <span className="text-[#c9a96e] text-base font-light tracking-[0.15em] uppercase">Livwell</span>
        <p className="text-[9px] font-bold tracking-[0.25em] text-[#445a70] uppercase mt-0.5">Business OS</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {ITEMS.map(item => {
          const active = current === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                active
                  ? 'bg-[#c9a96e]/10 text-[#c9a96e] font-medium'
                  : 'text-[#8aa0b8] hover:bg-[#111e2b] hover:text-[#dce6f0]'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              {item.label}
              {active && <span className="ml-auto w-1 h-1 rounded-full bg-[#c9a96e]" />}
            </button>
          )
        })}
      </nav>

      <div className="px-5 py-4 border-t border-[#1a2e40]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1a2e40] flex items-center justify-center text-[#c9a96e] text-xs font-bold">A</div>
          <div>
            <p className="text-xs font-medium text-[#dce6f0]">Ari</p>
            <p className="text-[9px] text-[#445a70]">info@livwell.studio</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export type { Page }
