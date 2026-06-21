import { useState } from 'react'
import { useStore, uid } from '../store'
import type { Supplier, SupplierCategory } from '../store/types'
import Modal from '../components/Modal'
import { Input, Select, Textarea, Field, Btn, Badge, Stat, Th, Td, PageHeader, EmptyRow, DeleteBtn } from '../components/ui'

const CATS: SupplierCategory[] = ['stoves','timber','plunge-tubs','glass','steel','insulation','lighting','steam','design-3d','fabrication','sanitary','cork','logistics','other']
const CAT_COLOR: Record<SupplierCategory, 'gold'|'green'|'blue'|'gray'|'amber'|'red'|'purple'|'sky'> = {
  stoves:'red', timber:'gold', 'plunge-tubs':'blue', glass:'sky', steel:'gray',
  insulation:'gray', lighting:'amber', steam:'sky', 'design-3d':'purple',
  fabrication:'amber', sanitary:'gray', cork:'green', logistics:'gray', other:'gray',
}
const COUNTRY_FLAG: Record<string,string> = {
  Estonia:'🇪🇪', Finland:'🇫🇮', 'South Africa':'🇿🇦', China:'🇨🇳', Portugal:'🇵🇹', USA:'🇺🇸', Italy:'🇮🇹', India:'🇮🇳',
}

const EMPTY: Omit<Supplier,'id'> = {
  name:'', country:'South Africa', category:'other', contactName:'', email:'', leadTimeDays:14, status:'active', notes:'',
}

function SupplierForm({ initial, onSave, onCancel }: { initial?:Supplier; onSave:(d:Omit<Supplier,'id'>)=>void; onCancel:()=>void }) {
  const [f, setF] = useState<Omit<Supplier,'id'>>(initial ? { ...initial } : EMPTY)
  const s = <K extends keyof typeof f>(k:K) => (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setF(p=>({ ...p, [k]: k==='leadTimeDays' ? +e.target.value : e.target.value }))

  return (
    <form onSubmit={e=>{e.preventDefault();onSave(f)}} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Supplier Name" required><Input value={f.name} onChange={s('name')} required autoFocus /></Field>
        <Field label="Country"><Input value={f.country} onChange={s('country')} placeholder="South Africa" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category">
          <Select value={f.category} onChange={s('category')}>
            {CATS.map(c=><option key={c} value={c}>{c.replace('-',' ')}</option>)}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={f.status} onChange={s('status')}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Contact Name"><Input value={f.contactName} onChange={s('contactName')} /></Field>
        <Field label="Email"><Input type="email" value={f.email} onChange={s('email')} /></Field>
      </div>
      <Field label="Lead Time (days)"><Input type="number" min={1} value={f.leadTimeDays} onChange={s('leadTimeDays')} /></Field>
      <Field label="Notes"><Textarea value={f.notes} onChange={s('notes')} rows={3} /></Field>
      <div className="flex gap-3 pt-2 border-t border-[#1b2c38]">
        <Btn type="submit">{initial ? 'Save changes' : 'Add supplier'}</Btn>
        <Btn variant="secondary" type="button" onClick={onCancel}>Cancel</Btn>
      </div>
    </form>
  )
}

export default function Suppliers() {
  const { state, dispatch } = useStore()
  const [editing, setEditing] = useState<Supplier|null>(null)
  const [adding, setAdding]   = useState(false)
  const [cat, setCat]         = useState<SupplierCategory|'all'>('all')
  const [search, setSearch]   = useState('')

  const items = state.suppliers
    .filter(s => cat==='all' || s.category===cat)
    .filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.country.toLowerCase().includes(search.toLowerCase()))

  const countries = [...new Set(state.suppliers.map(s=>s.country))].length
  const save = (data:Omit<Supplier,'id'>) => {
    if (editing) dispatch({ type:'UPD_SUPPLIER', payload:{ ...data, id:editing.id } })
    else         dispatch({ type:'ADD_SUPPLIER', payload:{ ...data, id:uid() } })
    setEditing(null); setAdding(false)
  }
  const del = (id:string) => { if(confirm('Remove supplier?')) dispatch({ type:'DEL_SUPPLIER', payload:id }) }

  return (
    <div className="max-w-[1500px] mx-auto px-6 py-6">
      <PageHeader title="Suppliers" sub={`${state.suppliers.length} in mRP`} action={<Btn onClick={()=>setAdding(true)}>+ Add Supplier</Btn>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total Suppliers"  value={state.suppliers.length} color="text-[#c8dce8]" />
        <Stat label="Active"           value={state.suppliers.filter(s=>s.status==='active').length} color="text-emerald-400" />
        <Stat label="Countries"        value={countries}              color="text-[#c4935a]" />
        <Stat label="Avg Lead Time"    value={`${Math.round(state.suppliers.reduce((s,p)=>s+p.leadTimeDays,0)/Math.max(state.suppliers.length,1))}d`} color="text-[#c8dce8]" />
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search suppliers..." style={{ maxWidth:220 }} />
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setCat('all')} className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${cat==='all'?'bg-[#c4935a] text-[#06080b]':'bg-[#0e1820] text-[#5a7f95] hover:bg-[#1b2c38]'}`}>All</button>
          {CATS.filter(c=>state.suppliers.some(s=>s.category===c)).map(c=>(
            <button key={c} onClick={()=>setCat(c)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${cat===c?'bg-[#c4935a] text-[#06080b]':'bg-[#0e1820] text-[#5a7f95] hover:bg-[#1b2c38]'}`}>
              {c.replace('-',' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0e1820] border border-[#1b2c38] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[#1b2c38]">
              <tr><Th>Supplier</Th><Th>Country</Th><Th>Category</Th><Th>Contact</Th><Th>Lead Time</Th><Th>Status</Th><Th>Notes</Th><Th></Th></tr>
            </thead>
            <tbody>
              {items.length===0 && <EmptyRow cols={8} />}
              {items.map(sup=>(
                <tr key={sup.id} onClick={()=>setEditing(sup)} className="border-b border-[#1b2c38] hover:bg-[#0c1520] transition-colors cursor-pointer">
                  <Td><span className="font-semibold text-[#c8dce8]">{sup.name}</span></Td>
                  <Td className="text-sm">{COUNTRY_FLAG[sup.country]??'🌍'} <span className="text-[#5a7f95] text-xs ml-1">{sup.country}</span></Td>
                  <Td><Badge color={CAT_COLOR[sup.category]}>{sup.category.replace('-',' ')}</Badge></Td>
                  <Td className="text-xs text-[#5a7f95]">{sup.contactName||'—'}</Td>
                  <Td>
                    <span className={`text-sm font-semibold ${sup.leadTimeDays > 50 ? 'text-amber-400' : 'text-[#c8dce8]'}`}>{sup.leadTimeDays}d</span>
                  </Td>
                  <Td><Badge color={sup.status==='active'?'green':'gray'}>{sup.status}</Badge></Td>
                  <Td className="max-w-[250px]"><span className="text-xs text-[#3d5a6e] truncate block">{sup.notes}</span></Td>
                  <Td><DeleteBtn onClick={()=>del(sup.id)} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(adding||editing) && (
        <Modal title={editing ? `Edit — ${editing.name}` : 'Add Supplier'} onClose={()=>{setAdding(false);setEditing(null)}}>
          <SupplierForm initial={editing??undefined} onSave={save} onCancel={()=>{setAdding(false);setEditing(null)}} />
        </Modal>
      )}
    </div>
  )
}
