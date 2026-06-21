import { useState } from 'react'
import { useStore, uid } from '../store'
import type { Collab, CollabType, CollabStatus } from '../store/types'
import Modal from '../components/Modal'
import { Input, Select, Textarea, Field, Btn, Badge, Stat, PageHeader, DeleteBtn, formatZAR } from '../components/ui'

const TYPE_ICON: Record<CollabType, string> = { lodge:'🏕️', commercial:'🏢', brand:'✦', residential:'🏠' }
const STATUS_COLOR: Record<CollabStatus,'gold'|'blue'|'green'|'red'> = {
  active:'gold', proposal:'blue', complete:'green', 'on-hold':'red',
}

const EMPTY: Omit<Collab,'id'> = {
  name:'', partner:'', type:'lodge', status:'proposal', value:0, products:'', description:'', notes:'',
}

function CollabForm({ initial, onSave, onCancel }: { initial?:Collab; onSave:(d:Omit<Collab,'id'>)=>void; onCancel:()=>void }) {
  const [f, setF] = useState<Omit<Collab,'id'>>(initial ? { ...initial } : EMPTY)
  const s = <K extends keyof typeof f>(k:K) => (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setF(p=>({ ...p, [k]: k==='value' ? +e.target.value : e.target.value }))
  return (
    <form onSubmit={e=>{e.preventDefault();onSave(f)}} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Collab Name" required><Input value={f.name} onChange={s('name')} required autoFocus /></Field>
        <Field label="Partner / Client"><Input value={f.partner} onChange={s('partner')} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Type">
          <Select value={f.type} onChange={s('type')}>
            {(['lodge','commercial','brand','residential'] as CollabType[]).map(t=><option key={t}>{t}</option>)}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={f.status} onChange={s('status')}>
            {(['active','proposal','complete','on-hold'] as CollabStatus[]).map(s=><option key={s}>{s}</option>)}
          </Select>
        </Field>
      </div>
      <Field label="Project Value (R)"><Input type="number" min={0} value={f.value} onChange={s('value')} /></Field>
      <Field label="Products / Services"><Textarea value={f.products} onChange={s('products')} rows={2} placeholder="e.g. ARK Pergola + Sauna + Cold Plunge" /></Field>
      <Field label="Description"><Textarea value={f.description} onChange={s('description')} rows={3} /></Field>
      <Field label="Notes"><Textarea value={f.notes} onChange={s('notes')} rows={2} /></Field>
      <div className="flex gap-3 pt-2 border-t border-[#1b2c38]">
        <Btn type="submit">{initial ? 'Save changes' : 'Add collab'}</Btn>
        <Btn variant="secondary" type="button" onClick={onCancel}>Cancel</Btn>
      </div>
    </form>
  )
}

export default function Collabs() {
  const { state, dispatch } = useStore()
  const [editing, setEditing] = useState<Collab|null>(null)
  const [adding, setAdding]   = useState(false)

  const totalValue = state.collabs.filter(c=>c.status==='active'||c.status==='proposal').reduce((s,c)=>s+c.value, 0)
  const save = (data:Omit<Collab,'id'>) => {
    if(editing) dispatch({type:'UPD_COLLAB',payload:{...data,id:editing.id}})
    else        dispatch({type:'ADD_COLLAB',payload:{...data,id:uid()}})
    setEditing(null); setAdding(false)
  }
  const del = (id:string) => { if(confirm('Delete collab?')) dispatch({type:'DEL_COLLAB',payload:id}) }

  return (
    <div className="max-w-[1500px] mx-auto px-6 py-6">
      <PageHeader title="Collabs" sub="Lodges · Commercial · Brand partnerships" action={<Btn onClick={()=>setAdding(true)}>+ New Collab</Btn>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Total Collabs" value={state.collabs.length}                                   color="text-[#c8dce8]" />
        <Stat label="Active"        value={state.collabs.filter(c=>c.status==='active').length}    color="text-[#c4935a]" />
        <Stat label="Pipeline"      value={state.collabs.filter(c=>c.status==='proposal').length}  color="text-blue-400" />
        <Stat label="Combined Value" value={formatZAR(totalValue)}                                 color="text-[#c4935a]" sub="active + proposal" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {state.collabs.length===0 && (
          <div className="col-span-2 bg-[#0e1820] border border-[#1b2c38] rounded-2xl p-12 text-center text-sm text-[#2e4455] italic">No collabs yet</div>
        )}
        {state.collabs.map(c=>(
          <div key={c.id} onClick={()=>setEditing(c)}
            className="bg-[#0e1820] border border-[#1b2c38] rounded-2xl p-6 hover:border-[#2d4558] transition-colors cursor-pointer relative">
            <div className="absolute top-5 right-5 flex items-center gap-2" onClick={e=>e.stopPropagation()}>
              <DeleteBtn onClick={()=>del(c.id)} />
            </div>

            <div className="flex items-start gap-4 mb-4">
              <span className="text-3xl">{TYPE_ICON[c.type]}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#c8dce8] text-base leading-tight">{c.name}</p>
                <p className="text-sm text-[#5a7f95] mt-0.5">{c.partner}</p>
              </div>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              <Badge color={STATUS_COLOR[c.status]}>{c.status}</Badge>
              <Badge color="gray">{c.type}</Badge>
              {c.value > 0 && <span className="text-xs font-semibold text-[#c4935a] ml-auto">{formatZAR(c.value)}</span>}
            </div>

            {c.products && (
              <div className="bg-[#070b0e] border border-[#1b2c38] rounded-lg px-3 py-2 mb-3">
                <p className="text-[10px] font-bold text-[#2e4455] uppercase tracking-wider mb-1">Products / Services</p>
                <p className="text-xs text-[#5a7f95]">{c.products}</p>
              </div>
            )}

            {c.description && <p className="text-xs text-[#5a7f95] mb-3 leading-relaxed">{c.description}</p>}
            {c.notes && <p className="text-xs text-[#2e4455] italic border-t border-[#1b2c38] pt-3 mt-3">{c.notes}</p>}
          </div>
        ))}
      </div>

      {(adding||editing) && (
        <Modal title={editing?`Edit — ${editing.name}`:'New Collab'} onClose={()=>{setAdding(false);setEditing(null)}} wide>
          <CollabForm initial={editing??undefined} onSave={save} onCancel={()=>{setAdding(false);setEditing(null)}} />
        </Modal>
      )}
    </div>
  )
}
