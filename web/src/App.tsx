import { useState } from 'react'
import { StoreProvider } from './store'
import Sidebar, { Page } from './components/Sidebar'
import Dashboard    from './modules/Dashboard'
import Projects     from './modules/Projects'
import Inventory    from './modules/Inventory'
import Manufacturing from './modules/Manufacturing'
import SiteVisits   from './modules/SiteVisits'
import QAQC         from './modules/QAQC'
import Financials   from './modules/Financials'
import Design       from './modules/Design'

const PAGE_TITLE: Record<Page, string> = {
  dashboard: 'Dashboard', projects: 'Projects', inventory: 'Inventory & Stock',
  manufacturing: 'Manufacturing', 'site-visits': 'Site Visits', qa: 'QA / QC',
  financials: 'Financials', design: 'Design',
}

function Inner() {
  const [page, setPage] = useState<Page>('dashboard')

  return (
    <div className="flex h-screen bg-[#07090c] overflow-hidden">
      <Sidebar current={page} onNav={setPage} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex-shrink-0 border-b border-[#1a2e40] bg-[#07090c] px-6 h-14 flex items-center justify-between">
          <h1 className="text-sm font-semibold text-[#dce6f0]">{PAGE_TITLE[page]}</h1>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-[#445a70]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
            <span className="text-xs text-[#445a70] hidden sm:block">
              {new Date().toLocaleDateString('en-ZA', { day:'numeric', month:'short', year:'numeric' })}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {page === 'dashboard'     && <Dashboard onNav={setPage} />}
          {page === 'projects'      && <Projects />}
          {page === 'inventory'     && <Inventory />}
          {page === 'manufacturing' && <Manufacturing />}
          {page === 'site-visits'   && <SiteVisits />}
          {page === 'qa'            && <QAQC />}
          {page === 'financials'    && <Financials />}
          {page === 'design'        && <Design />}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return <StoreProvider><Inner /></StoreProvider>
}
