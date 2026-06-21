import { useState } from 'react'
import { useStore, uid } from '../store'
import type { Invoice, Expense } from '../store/types'
import Modal from '../components/Modal'
import { Input, Select, Textarea, Field, Btn, Badge, Stat, Th, Td, PageHeader, EmptyRow, DeleteBtn, formatZAR } from '../components/ui'

const INV_STATUS = ['draft','sent','paid','overdue'] as const
const EXP_CATS  = ['materials','contractor','travel','equipment','admin','marketing'] as const
const INV_COLOR = { draft:'gray', sent:'gold', paid:'green', overdue:'red' } as const
const EXP_COLOR = { materials:'gold', contractor:'blue', travel:'purple', equipment:'sky', admin:'gray', marketing:'purple' } as const

function InvForm({ initial, projects, onSave, onCancel }: {
  initial?: Invoice; projects: { id:string; client:string }[]
  onSave: (d: Omit<Invoice,'id'>) => void; onCancel: () => void
}) {
  const [f, setF] = useState<Omit<Invoice,'id'>>(initial ? { ...initial } : {
    invoiceNo:`LW-2026-${String(Date.now()).slice(-3)}`, projectId:'', client:'',
    amount:0, status:'draft', issueDate: new Date().toISOString().slice(0,10),
    dueDate:'', notes:'',
  })
  const s = <K extends keyof typeof f>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF(p => ({ ...p, [k]: k === 'amount' ? +e.target.value : e.target.value }))
  const pickProj = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const proj = projects.find(p => p.id === e.target.value)
    setF(prev => ({ ...prev, projectId: e.target.value, client: proj?.client ?? prev.client }))
  }
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(f) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Invoice No"><Input value={f.invoiceNo} onChange={s('invoiceNo')} /></Field>
        <Field label="Project">
          <Select value={f.projectId} onChange={pickProj}>
            <option value="">— Select —</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.client}</option>)}
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Client"><Input value={f.client} onChange={s('client')} /></Field>
        <Field label="Amount (R)" required><Input type="number" min={0} value={f.amount} onChange={s('amount')} required /></Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Status"><Select value={f.status} onChange={s('status')}>{INV_STATUS.map(s=><option key={s}>{s}</option>)}</Select></Field>
        <Field label="Issue Date"><Input type="date" value={f.issueDate} onChange={s('issueDate')} /></Field>
        <Field label="Due Date"><Input type="date" value={f.dueDate} onChange={s('dueDate')} /></Field>
      </div>
      <Field label="Notes"><Textarea value={f.notes} onChange={s('notes')} /></Field>
      <div className="flex gap-3 pt-2 border-t border-[#1a2e40]">
        <Btn type="submit">{initial ? 'Save' : 'Create invoice'}</Btn>
        <Btn variant="secondary" type="button" onClick={onCancel}>Cancel</Btn>
      </div>
    </form>
  )
}

function ExpForm({ initial, projects, onSave, onCancel }: {
  initial?: Expense; projects: { id:string; client:string }[]
  onSave: (d: Omit<Expense,'id'>) => void; onCancel: () => void
}) {
  const [f, setF] = useState<Omit<Expense,'id'>>(initial ? { ...initial } : {
    projectId:'', description:'', category:'materials', amount:0,
    paidTo:'', date: new Date().toISOString().slice(0,10), notes:'',
  })
  const s = <K extends keyof typeof f>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF(p => ({ ...p, [k]: k === 'amount' ? +e.target.value : e.target.value }))
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(f) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Project">
          <Select value={f.projectId} onChange={s('projectId')}>
            <option value="">— Select —</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.client}</option>)}
          </Select>
        </Field>
        <Field label="Category"><Select value={f.category} onChange={s('category')}>{EXP_CATS.map(c=><option key={c}>{c}</option>)}</Select></Field>
      </div>
      <Field label="Description" required><Input value={f.description} onChange={s('description')} required /></Field>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Amount (R)" required><Input type="number" min={0} value={f.amount} onChange={s('amount')} required /></Field>
        <Field label="Paid To"><Input value={f.paidTo} onChange={s('paidTo')} /></Field>
        <Field label="Date"><Input type="date" value={f.date} onChange={s('date')} /></Field>
      </div>
      <Field label="Notes"><Textarea value={f.notes} onChange={s('notes')} /></Field>
      <div className="flex gap-3 pt-2 border-t border-[#1a2e40]">
        <Btn type="submit">{initial ? 'Save' : 'Log expense'}</Btn>
        <Btn variant="secondary" type="button" onClick={onCancel}>Cancel</Btn>
      </div>
    </form>
  )
}

export default function Financials() {
  const { state, dispatch } = useStore()
  const [tab, setTab]           = useState<'invoices'|'expenses'>('invoices')
  const [editInv, setEditInv]   = useState<Invoice | null>(null)
  const [addInv, setAddInv]     = useState(false)
  const [editExp, setEditExp]   = useState<Expense | null>(null)
  const [addExp, setAddExp]     = useState(false)

  const invoiced    = state.invoices.reduce((s, i) => s + i.amount, 0)
  const collected   = state.invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const outstanding = state.invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.amount, 0)
  const totalExp    = state.expenses.reduce((s, e) => s + e.amount, 0)
  const grossProfit = collected - totalExp

  const saveInv = (d: Omit<Invoice,'id'>) => {
    if (editInv) dispatch({ type:'UPD_INVOICE', payload: { ...d, id: editInv.id } })
    else         dispatch({ type:'ADD_INVOICE', payload: { ...d, id: uid() } })
    setEditInv(null); setAddInv(false)
  }
  const delInv = (id: string) => { if (confirm('Delete invoice?')) dispatch({ type:'DEL_INVOICE', payload: id }) }

  const saveExp = (d: Omit<Expense,'id'>) => {
    if (editExp) dispatch({ type:'UPD_EXPENSE', payload: { ...d, id: editExp.id } })
    else         dispatch({ type:'ADD_EXPENSE', payload: { ...d, id: uid() } })
    setEditExp(null); setAddExp(false)
  }
  const delExp = (id: string) => { if (confirm('Delete expense?')) dispatch({ type:'DEL_EXPENSE', payload: id }) }

  const projName = (id: string) => state.projects.find(p => p.id === id)?.client ?? '—'

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      <PageHeader title="Financials" sub="Invoices, expenses, and profit tracking" />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Stat label="Total Invoiced"  value={formatZAR(invoiced)}    color="text-[#dce6f0]" />
        <Stat label="Collected"       value={formatZAR(collected)}   color="text-emerald-400" />
        <Stat label="Outstanding"     value={formatZAR(outstanding)} color={outstanding > 0 ? 'text-amber-400' : 'text-emerald-400'} />
        <Stat label="Total Expenses"  value={formatZAR(totalExp)}    color="text-red-400" />
        <Stat label="Gross Profit"    value={formatZAR(grossProfit)} color={grossProfit >= 0 ? 'text-[#c9a96e]' : 'text-red-400'} />
      </div>

      <div className="flex gap-2 mb-5">
        {(['invoices','expenses'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`text-sm px-4 py-2 rounded-lg font-semibold transition-colors ${tab===t ? 'bg-[#c9a96e] text-[#07090c]' : 'bg-[#111e2b] text-[#8aa0b8] hover:bg-[#1a2e40]'}`}>
            {t === 'invoices' ? 'Invoices' : 'Expenses'}
          </button>
        ))}
        {tab === 'invoices'  && <Btn onClick={() => setAddInv(true)} className="ml-auto">+ New Invoice</Btn>}
        {tab === 'expenses'  && <Btn onClick={() => setAddExp(true)} className="ml-auto">+ Log Expense</Btn>}
      </div>

      {tab === 'invoices' && (
        <div className="bg-[#111e2b] border border-[#1a2e40] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-[#1a2e40]"><tr><Th>#</Th><Th>Client</Th><Th>Project</Th><Th>Amount</Th><Th>Status</Th><Th>Issue Date</Th><Th>Due Date</Th><Th></Th></tr></thead>
            <tbody>
              {state.invoices.length === 0 && <EmptyRow cols={8} />}
              {state.invoices.map(inv => (
                <tr key={inv.id} onClick={() => setEditInv(inv)} className="border-b border-[#1a2e40] hover:bg-[#0f1a26] transition-colors cursor-pointer">
                  <Td className="font-mono text-xs text-[#445a70]">{inv.invoiceNo}</Td>
                  <Td><span className="font-medium">{inv.client}</span></Td>
                  <Td className="text-xs text-[#8aa0b8]">{projName(inv.projectId)}</Td>
                  <Td className="font-semibold text-[#c9a96e]">{formatZAR(inv.amount)}</Td>
                  <Td><Badge color={INV_COLOR[inv.status]}>{inv.status}</Badge></Td>
                  <Td className="text-xs text-[#8aa0b8]">{inv.issueDate}</Td>
                  <Td className={`text-xs ${inv.status === 'overdue' ? 'text-red-400 font-semibold' : 'text-[#8aa0b8]'}`}>{inv.dueDate}</Td>
                  <Td><DeleteBtn onClick={() => delInv(inv.id)} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'expenses' && (
        <div className="bg-[#111e2b] border border-[#1a2e40] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-[#1a2e40]"><tr><Th>Date</Th><Th>Project</Th><Th>Description</Th><Th>Category</Th><Th>Amount</Th><Th>Paid To</Th><Th></Th></tr></thead>
            <tbody>
              {state.expenses.length === 0 && <EmptyRow cols={7} />}
              {[...state.expenses].sort((a, b) => b.date.localeCompare(a.date)).map(ex => (
                <tr key={ex.id} onClick={() => setEditExp(ex)} className="border-b border-[#1a2e40] hover:bg-[#0f1a26] transition-colors cursor-pointer">
                  <Td className="text-xs text-[#8aa0b8] whitespace-nowrap">{ex.date}</Td>
                  <Td className="text-xs text-[#8aa0b8]">{projName(ex.projectId)}</Td>
                  <Td><span className="font-medium text-sm">{ex.description}</span></Td>
                  <Td><Badge color={EXP_COLOR[ex.category]}>{ex.category}</Badge></Td>
                  <Td className="font-semibold text-red-400">{formatZAR(ex.amount)}</Td>
                  <Td className="text-xs text-[#8aa0b8]">{ex.paidTo}</Td>
                  <Td><DeleteBtn onClick={() => delExp(ex.id)} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(addInv || editInv) && (
        <Modal title={editInv ? `Edit — ${editInv.invoiceNo}` : 'New Invoice'} onClose={() => { setAddInv(false); setEditInv(null) }}>
          <InvForm initial={editInv ?? undefined} projects={state.projects} onSave={saveInv} onCancel={() => { setAddInv(false); setEditInv(null) }} />
        </Modal>
      )}
      {(addExp || editExp) && (
        <Modal title={editExp ? 'Edit Expense' : 'Log Expense'} onClose={() => { setAddExp(false); setEditExp(null) }}>
          <ExpForm initial={editExp ?? undefined} projects={state.projects} onSave={saveExp} onCancel={() => { setAddExp(false); setEditExp(null) }} />
        </Modal>
      )}
    </div>
  )
}
