import { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from 'react'
import type { AppState, AppAction } from './types'
import { seedState } from './seed'

const KEY = 'livwell-bos-v2'

function upd<T extends { id: string }>(arr: T[], item: T) { return arr.map(x => x.id === item.id ? item : x) }
function del<T extends { id: string }>(arr: T[], id: string) { return arr.filter(x => x.id !== id) }

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'RESET': return seedState
    case 'ADD_PROJECT':   return { ...state, projects: [...state.projects, action.payload] }
    case 'UPD_PROJECT':   return { ...state, projects: upd(state.projects, action.payload) }
    case 'DEL_PROJECT':   return { ...state, projects: del(state.projects, action.payload) }
    case 'ADD_INVENTORY': return { ...state, inventory: [...state.inventory, action.payload] }
    case 'UPD_INVENTORY': return { ...state, inventory: upd(state.inventory, action.payload) }
    case 'DEL_INVENTORY': return { ...state, inventory: del(state.inventory, action.payload) }
    case 'ADD_MFG':       return { ...state, manufacturingJobs: [...state.manufacturingJobs, action.payload] }
    case 'UPD_MFG':       return { ...state, manufacturingJobs: upd(state.manufacturingJobs, action.payload) }
    case 'DEL_MFG':       return { ...state, manufacturingJobs: del(state.manufacturingJobs, action.payload) }
    case 'ADD_VISIT':     return { ...state, siteVisits: [...state.siteVisits, action.payload] }
    case 'UPD_VISIT':     return { ...state, siteVisits: upd(state.siteVisits, action.payload) }
    case 'DEL_VISIT':     return { ...state, siteVisits: del(state.siteVisits, action.payload) }
    case 'ADD_QA':        return { ...state, qaSignoffs: [...state.qaSignoffs, action.payload] }
    case 'UPD_QA':        return { ...state, qaSignoffs: upd(state.qaSignoffs, action.payload) }
    case 'DEL_QA':        return { ...state, qaSignoffs: del(state.qaSignoffs, action.payload) }
    case 'ADD_SNAG':      return { ...state, snags: [...state.snags, action.payload] }
    case 'UPD_SNAG':      return { ...state, snags: upd(state.snags, action.payload) }
    case 'DEL_SNAG':      return { ...state, snags: del(state.snags, action.payload) }
    case 'ADD_INVOICE':   return { ...state, invoices: [...state.invoices, action.payload] }
    case 'UPD_INVOICE':   return { ...state, invoices: upd(state.invoices, action.payload) }
    case 'DEL_INVOICE':   return { ...state, invoices: del(state.invoices, action.payload) }
    case 'ADD_EXPENSE':   return { ...state, expenses: [...state.expenses, action.payload] }
    case 'UPD_EXPENSE':   return { ...state, expenses: upd(state.expenses, action.payload) }
    case 'DEL_EXPENSE':   return { ...state, expenses: del(state.expenses, action.payload) }
    case 'ADD_DESIGN':    return { ...state, designBriefs: [...state.designBriefs, action.payload] }
    case 'UPD_DESIGN':    return { ...state, designBriefs: upd(state.designBriefs, action.payload) }
    case 'DEL_DESIGN':    return { ...state, designBriefs: del(state.designBriefs, action.payload) }
    default: return state
  }
}

const Ctx = createContext<{ state: AppState; dispatch: Dispatch<AppAction> } | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const stored = localStorage.getItem(KEY)
  const initial: AppState = stored ? (JSON.parse(stored) as AppState) : seedState
  const [state, dispatch] = useReducer(reducer, initial)
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(state)) }, [state])
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore must be inside StoreProvider')
  return ctx
}

export function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2) }
