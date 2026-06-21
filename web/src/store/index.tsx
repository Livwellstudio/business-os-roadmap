import { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from 'react'
import type { AppState, AppAction } from './types'
import { seedState } from './seed'

const KEY = 'livwell-bos-v3'

function upd<T extends { id: string }>(arr: T[], item: T) { return arr.map(x => x.id === item.id ? item : x) }
function del<T extends { id: string }>(arr: T[], id: string) { return arr.filter(x => x.id !== id) }

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'RESET': return seedState

    case 'ADD_CLIENT':     return { ...state, clients:           [...state.clients,           action.payload] }
    case 'UPD_CLIENT':     return { ...state, clients:           upd(state.clients,           action.payload) }
    case 'DEL_CLIENT':     return { ...state, clients:           del(state.clients,           action.payload) }

    case 'ADD_PRODUCT':    return { ...state, products:          [...state.products,          action.payload] }
    case 'UPD_PRODUCT':    return { ...state, products:          upd(state.products,          action.payload) }
    case 'DEL_PRODUCT':    return { ...state, products:          del(state.products,          action.payload) }

    case 'ADD_SUPPLIER':   return { ...state, suppliers:         [...state.suppliers,         action.payload] }
    case 'UPD_SUPPLIER':   return { ...state, suppliers:         upd(state.suppliers,         action.payload) }
    case 'DEL_SUPPLIER':   return { ...state, suppliers:         del(state.suppliers,         action.payload) }

    case 'ADD_MFG':        return { ...state, manufacturingJobs: [...state.manufacturingJobs, action.payload] }
    case 'UPD_MFG':        return { ...state, manufacturingJobs: upd(state.manufacturingJobs, action.payload) }
    case 'DEL_MFG':        return { ...state, manufacturingJobs: del(state.manufacturingJobs, action.payload) }

    case 'ADD_INVOICE':    return { ...state, invoices:          [...state.invoices,          action.payload] }
    case 'UPD_INVOICE':    return { ...state, invoices:          upd(state.invoices,          action.payload) }
    case 'DEL_INVOICE':    return { ...state, invoices:          del(state.invoices,          action.payload) }

    case 'ADD_EXPENSE':    return { ...state, expenses:          [...state.expenses,          action.payload] }
    case 'UPD_EXPENSE':    return { ...state, expenses:          upd(state.expenses,          action.payload) }
    case 'DEL_EXPENSE':    return { ...state, expenses:          del(state.expenses,          action.payload) }

    case 'ADD_DESIGN':     return { ...state, designJobs:        [...state.designJobs,        action.payload] }
    case 'UPD_DESIGN':     return { ...state, designJobs:        upd(state.designJobs,        action.payload) }
    case 'DEL_DESIGN':     return { ...state, designJobs:        del(state.designJobs,        action.payload) }

    case 'ADD_COLLAB':     return { ...state, collabs:           [...state.collabs,           action.payload] }
    case 'UPD_COLLAB':     return { ...state, collabs:           upd(state.collabs,           action.payload) }
    case 'DEL_COLLAB':     return { ...state, collabs:           del(state.collabs,           action.payload) }

    case 'ADD_FIELD_DEF':  return { ...state, customFieldDefs: [...state.customFieldDefs, action.payload] }
    case 'UPD_FIELD_DEF':  return { ...state, customFieldDefs: upd(state.customFieldDefs, action.payload) }
    case 'DEL_FIELD_DEF':  return { ...state, customFieldDefs: del(state.customFieldDefs, action.payload) }
    case 'REORDER_FIELDS': return { ...state, customFieldDefs: action.payload }

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
