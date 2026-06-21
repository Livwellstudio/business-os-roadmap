export type Page = 'overview' | 'clients' | 'products' | 'suppliers' | 'manufacturing' | 'financials' | 'design' | 'collabs'

const NAV: { id: Page; label: string; path: string }[] = [
  { id:'overview',      label:'Overview',       path:'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z' },
  { id:'clients',       label:'Clients',        path:'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z' },
  { id:'products',      label:'Products',       path:'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' },
  { id:'suppliers',     label:'Suppliers',      path:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
  { id:'manufacturing', label:'Manufacturing',  path:'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z' },
  { id:'financials',    label:'Financials',     path:'M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
  { id:'design',        label:'Design & R&D',   path:'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z' },
  { id:'collabs',       label:'Collabs',        path:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0' },
]

export default function Sidebar({ current, onNav }: { current: Page; onNav: (p: Page) => void }) {
  return (
    <aside className="w-[220px] flex-shrink-0 bg-[#070b0e] border-r border-[#1b2c38] flex flex-col h-screen sticky top-0">
      {/* Wordmark */}
      <div className="px-5 pt-6 pb-5 border-b border-[#1b2c38]">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[#c4935a] text-base font-light tracking-[0.18em] uppercase">LivWell</span>
          <span className="text-[#2e4455] text-xs">Studio</span>
        </div>
        <p className="text-[9px] font-bold tracking-[0.28em] text-[#2e4455] uppercase mt-0.5">Business OS</p>
        <p className="text-[9px] text-[#2e4455] mt-0.5">Mint Salon Pty Ltd</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(item => {
          const active = current === item.id
          return (
            <button key={item.id} onClick={() => onNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                active
                  ? 'bg-[#c4935a]/10 text-[#c4935a] font-medium border border-[#c4935a]/15'
                  : 'text-[#5a7f95] hover:bg-[#0f1a23] hover:text-[#c8dce8]'
              }`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.path} />
              </svg>
              {item.label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c4935a] opacity-70" />}
            </button>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-[#1b2c38]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#c4935a]/20 border border-[#c4935a]/30 flex items-center justify-center text-[#c4935a] text-xs font-bold">A</div>
          <div>
            <p className="text-xs font-semibold text-[#c8dce8]">Ari Sztern</p>
            <p className="text-[9px] text-[#2e4455]">info@livwell.studio</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
