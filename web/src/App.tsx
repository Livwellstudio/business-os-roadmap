import { useState } from 'react'
import { StoreProvider } from './store'
import Sidebar, { Page } from './components/Sidebar'
import Overview     from './modules/Overview'
import Clients      from './modules/Clients'
import Products     from './modules/Products'
import Suppliers    from './modules/Suppliers'
import Manufacturing from './modules/Manufacturing'
import Financials   from './modules/Financials'
import Design       from './modules/Design'
import Collabs      from './modules/Collabs'

const TITLES: Record<Page, string> = {
  overview:'Overview', clients:'Clients', products:'Products', suppliers:'Suppliers',
  manufacturing:'Manufacturing', financials:'Financials', design:'Design & R&D', collabs:'Collabs',
}

function Inner() {
  const [page, setPage] = useState<Page>('overview')
  return (
    <div className="flex h-screen bg-[#06080b] overflow-hidden">
      <Sidebar current={page} onNav={setPage} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex-shrink-0 h-13 border-b border-[#1b2c38] px-6 flex items-center justify-between bg-[#06080b]" style={{ height: 52 }}>
          <span className="text-sm font-semibold text-[#c8dce8]">{TITLES[page]}</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-[#2e4455]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
            <span className="text-xs text-[#2e4455] hidden sm:block">
              {new Date().toLocaleDateString('en-ZA', { day:'numeric', month:'long', year:'numeric' })}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-[#06080b]">
          {page === 'overview'      && <Overview onNav={setPage} />}
          {page === 'clients'       && <Clients />}
          {page === 'products'      && <Products />}
          {page === 'suppliers'     && <Suppliers />}
          {page === 'manufacturing' && <Manufacturing />}
          {page === 'financials'    && <Financials />}
          {page === 'design'        && <Design />}
          {page === 'collabs'       && <Collabs />}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return <StoreProvider><Inner /></StoreProvider>
}
