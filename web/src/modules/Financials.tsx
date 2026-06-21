import { useState } from 'react'
import { useStore, uid } from '../store'
import type { Invoice, Expense } from '../store/types'
import Modal from '../components/Modal'
import { Input, Select, Textarea, Field, Btn, Badge, Stat, Th, Td, PageHeader, EmptyRow, DeleteBtn, formatZAR } from '../components/ui'

const INV_STATUS_COLOR: Record<string,'green'|'gold'|'red'|'gray'> = { paid:'green', sent:'gold', overdue:'red', draft:'gray' }

function InvForm({ initial, clients, onSave, onCancel }: { initial?:Invoice; clients:{id:string;client:string}[]; onSave:(d:Omit<Invoice,'id'>)=>void; onCancel:()=>void }) {
  const nextNo = `INV-0${90 + Math.floor(Math.random()*10)}`
  const [f, setF] = useState<Omit<Invoice,'id'>>(initial ? { ...initial } : {
    invoiceNo: nextNo, projectId:'', client:'', amount:0, status:'draft',
    issueDate: new Date().toISOString().slice(0,10), dueDate:'', notes:'',
  })
  const s = <K extends keyof typeof f>(k:K) => (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setF(p=>({ ...p, [k]: k==='amount' ? +e.target.value : e.target.value }))
  const pickClient = (e:React.ChangeEvent<HTMLSelectElement>) => {
    const c = clients.find(c=>c.id===e.target.value)
    setF(p=>({ ...p, projectId:e.target.value, client:c?.client??p.client }))
  }
  return (
    <form onSubmit={e=>{e.preventDefault();onSave(f)}} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Invoice No"><Input value={f.invoiceNo} onChange={s('invoiceNo')} /></Field>
        <Field label="Client Project">
          <Select value={f.projectId} onChange={pickClient}>
            <option value="">— Select —</option>
            {clients.map(c=><option key={c.id} value={c.id}>{c.client}</option>)}
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Client Name"><Input value={f.client} onChange={s('client')} /></Field>
        <Field label="Amount (R ex VAT)" required><Input type="number" min={0} value={f.amount} onChange={s('amount')} required /></Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Status"><Select value={f.status} onChange={s('status')}><option value="draft">Draft</option><option value="sent">Sent</option><option value="paid">Paid</option><option value="overdue">Overdue</option></Select></Field>
        <Field label="Issue Date"><Input type="date" value={f.issueDate} onChange={s('issueDate')} /></Field>
        <Field label="Due Date"><Input type="date" value={f.dueDate} onChange={s('dueDate')} /></Field>
      </div>
      <Field label="Notes"><Textarea value={f.notes} onChange={s('notes')} rows={2} /></Field>
      <div className="flex gap-3 pt-2 border-t border-[#1b2c38]">
        <Btn type="submit">{initial ? 'Save' : 'Create invoice'}</Btn>
        <Btn variant="secondary" type="button" onClick={onCancel}>Cancel</Btn>
      </div>
    </form>
  )
}

function ExpForm({ initial, clients, suppliers, onSave, onCancel }: {
  initial?:Expense; clients:{id:string;client:string}[]; suppliers:string[]
  onSave:(d:Omit<Expense,'id'>)=>void; onCancel:()=>void
}) {
  const [f, setF] = useState<Omit<Expense,'id'>>(initial ? { ...initial } : {
    projectId:'', description:'', category:'materials', amount:0,
    supplier:'', date: new Date().toISOString().slice(0,10), notes:'',
  })
  const s = <K extends keyof typeof f>(k:K) => (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setF(p=>({ ...p, [k]: k==='amount' ? +e.target.value : e.target.value }))
  return (
    <form onSubmit={e=>{e.preventDefault();onSave(f)}} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Project">
          <Select value={f.projectId} onChange={s('projectId')}>
            <option value="">— Select —</option>
            {clients.map(c=><option key={c.id} value={c.id}>{c.client}</option>)}
          </Select>
        </Field>
        <Field label="Category">
          <Select value={f.category} onChange={s('category')}>
            {['materials','labour','logistics','equipment','travel','admin'].map(c=><option key={c}>{c}</option>)}
          </Select>
        </Field>
      </div>
      <Field label="Description" required><Input value={f.description} onChange={s('description')} required /></Field>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Amount (R)" required><Input type="number" min={0} value={f.amount} onChange={s('amount')} required /></Field>
        <Field label="Supplier">
          <Select value={f.supplier} onChange={s('supplier')}>
            <option value="">— Select —</option>
            {suppliers.map(s=><option key={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Date"><Input type="date" value={f.date} onChange={s('date')} /></Field>
      </div>
      <Field label="Notes"><Textarea value={f.notes} onChange={s('notes')} rows={2} /></Field>
      <div className="flex gap-3 pt-2 border-t border-[#1b2c38]">
        <Btn type="submit">{initial ? 'Save' : 'Log expense'}</Btn>
        <Btn variant="secondary" type="button" onClick={onCancel}>Cancel</Btn>
      </div>
    </form>
  )
}

export default function Financials() {
  const { state, dispatch } = useStore()
  const [tab, setTab]       = useState<'invoices'|'expenses'>('invoices')
  const [editInv, setEditInv] = useState<Invoice|null>(null)
  const [addInv, setAddInv]   = useState(false)
  const [editExp, setEditExp] = useState<Expense|null>(null)
  const [addExp, setAddExp]   = useState(false)

  const collected   = state.invoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.amount, 0)
  const outstanding = state.invoices.filter(i=>i.status==='sent'||i.status==='overdue').reduce((s,i)=>s+i.amount, 0)
  const overdue     = state.invoices.filter(i=>i.status==='overdue').reduce((s,i)=>s+i.amount, 0)
  const totalExp    = state.expenses.reduce((s,e)=>s+e.amount, 0)
  const margin      = collected - totalExp

  const saveInv = (d:Omit<Invoice,'id'>) => { if(editInv) dispatch({type:'UPD_INVOICE',payload:{...d,id:editInv.id}}); else dispatch({type:'ADD_INVOICE',payload:{...d,id:uid()}}); setEditInv(null);setAddInv(false) }
  const delInv  = (id:string) => { if(confirm('Delete invoice?')) dispatch({type:'DEL_INVOICE',payload:id}) }
  const saveExp = (d:Omit<Expense,'id'>) => { if(editExp) dispatch({type:'UPD_EXPENSE',payload:{...d,id:editExp.id}}); else dispatch({type:'ADD_EXPENSE',payload:{...d,id:uid()}}); setEditExp(null);setAddExp(false) }
  const delExp  = (id:string) => { if(confirm('Delete expense?')) dispatch({type:'DEL_EXPENSE',payload:id}) }

  const projName  = (id:string) => state.clients.find(c=>c.id===id)?.client ?? '—'
  const suppliers = [...new Set(state.suppliers.map(s=>s.name))].sort()

  const EXP_COLOR: Record<string,'gold'|'blue'|'purple'|'sky'|'gray'> = { materials:'gold', labour:'blue', logistics:'purple', equipment:'sky', travel:'gray', admin:'gray' }

  return (
    <div className="max-w-[1500px] mx-auto px-6 py-6">
      <PageHeader title="Financials" sub="Invoices · Expenses · Margins" />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Stat label="Collected"    value={formatZAR(collected)}   color="text-emerald-400" />
        <Stat label="Outstanding"  value={formatZAR(outstanding)} color={outstanding>0?'text-amber-400':'text-emerald-400'} />
        <Stat label="Overdue"      value={formatZAR(overdue)}     color={overdue>0?'text-red-400':'text-emerald-400'} />
        <Stat label="Total Costs"  value={formatZAR(totalExp)}    color="text-red-400" />
        <Stat label="Gross Margin" value={formatZAR(margin)}      color={margin>=0?'text-[#c4935a]':'text-red-400'} />
      </div>

      <div className="flex gap-2 mb-5">
        {(['invoices','expenses'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`text-sm px-4 py-2 rounded-lg font-semibold transition-colors ${tab===t?'bg-[#c4935a] text-[#06080b]':'bg-[#0e1820] text-[#5a7f95] hover:bg-[#1b2c38]'}`}>
            {t==='invoices'?'Invoices':'Expenses'}
          </button>
        ))}
        {tab==='invoices' && <Btn onClick={()=>setAddInv(true)} className="ml-auto">+ New Invoice</Btn>}
        {tab==='expenses' && <Btn onClick={()=>setAddExp(true)} className="ml-auto">+ Log Expense</Btn>}
      </div>

      {tab==='invoices' && (
        <div className="bg-[#0e1820] border border-[#1b2c38] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-[#1b2c38]">
              <tr><Th>#</Th><Th>Client</Th><Th>Amount</Th><Th>Status</Th><Th>Issued</Th><Th>Due</Th><Th>Notes</Th><Th></Th></tr>
            </thead>
            <tbody>
              {state.invoices.length===0 && <EmptyRow cols={8} />}
              {[...state.invoices].sort((a,b)=>b.invoiceNo.localeCompare(a.invoiceNo)).map(inv=>(
                <tr key={inv.id} onClick={()=>setEditInv(inv)} className="border-b border-[#1b2c38] hover:bg-[#0c1520] transition-colors cursor-pointer">
                  <Td className="font-mono text-xs text-[#3d5a6e]">{inv.invoiceNo}</Td>
                  <Td><span className="font-semibold text-[#c8dce8]">{inv.client}</span></Td>
                  <Td className="font-semibold text-[#c4935a]">{formatZAR(inv.amount)}</Td>
                  <Td><Badge color={INV_STATUS_COLOR[inv.status]}>{inv.status}</Badge></Td>
                  <Td className="text-xs text-[#5a7f95]">{inv.issueDate}</Td>
                  <Td className={`text-xs ${inv.status==='overdue'?'text-red-400 font-semibold':'text-[#5a7f95]'}`}>{inv.dueDate}</Td>
                  <Td className="max-w-[200px]"><span className="text-xs text-[#3d5a6e] truncate block">{inv.notes}</span></Td>
                  <Td><DeleteBtn onClick={()=>delInv(inv.id)} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab==='expenses' && (
        <div className="bg-[#0e1820] border border-[#1b2c38] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-[#1b2c38]">
              <tr><Th>Date</Th><Th>Project</Th><Th>Description</Th><Th>Category</Th><Th>Amount</Th><Th>Supplier</Th><Th></Th></tr>
            </thead>
            <tbody>
              {state.expenses.length===0 && <EmptyRow cols={7} />}
              {[...state.expenses].sort((a,b)=>b.date.localeCompare(a.date)).map(ex=>(
                <tr key={ex.id} onClick={()=>setEditExp(ex)} className="border-b border-[#1b2c38] hover:bg-[#0c1520] transition-colors cursor-pointer">
                  <Td className="text-xs text-[#5a7f95] whitespace-nowrap">{ex.date}</Td>
                  <Td className="text-xs text-[#5a7f95]">{projName(ex.projectId)}</Td>
                  <Td><span className="font-medium text-[#c8dce8] text-sm">{ex.description}</span></Td>
                  <Td><Badge color={EXP_COLOR[ex.category]??'gray'}>{ex.category}</Badge></Td>
                  <Td className="font-semibold text-red-400">{formatZAR(ex.amount)}</Td>
                  <Td className="text-xs text-[#5a7f95]">{ex.supplier}</Td>
                  <Td><DeleteBtn onClick={()=>delExp(ex.id)} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(addInv||editInv) && <Modal title={editInv?`Edit — ${editInv.invoiceNo}`:'New Invoice'} onClose={()=>{setAddInv(false);setEditInv(null)}}><InvForm initial={editInv??undefined} clients={state.clients} onSave={saveInv} onCancel={()=>{setAddInv(false);setEditInv(null)}} /></Modal>}
      {(addExp||editExp) && <Modal title={editExp?'Edit Expense':'Log Expense'} onClose={()=>{setAddExp(false);setEditExp(null)}}><ExpForm initial={editExp??undefined} clients={state.clients} suppliers={suppliers} onSave={saveExp} onCancel={()=>{setAddExp(false);setEditExp(null)}} /></Modal>}
    </div>
  )
}
