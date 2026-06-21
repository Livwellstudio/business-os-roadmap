import { useState } from 'react'
import { useStore, uid } from '../store'
import type { ClientProject, ClientStatus, ClientCategory, CustomFieldDef, FieldType } from '../store/types'
import Modal from '../components/Modal'
import { Input, Select, Textarea, Field, Btn, Badge, Stat, Th, Td, PageHeader, EmptyRow, DeleteBtn, formatZAR } from '../components/ui'

const STATUS_COLOR: Record<ClientStatus, 'green'|'gold'|'amber'|'blue'|'red'|'gray'> = {
  complete:'green', active:'gold', qa:'amber', proposal:'blue', lead:'gray', 'on-hold':'red',
}
const FIELD_LABELS: Record<FieldType, string> = {
  text:'Text', number:'Number', date:'Date', textarea:'Long text', select:'Dropdown', url:'URL', checkbox:'Checkbox',
}
const SECTION_COLOR: Record<string,string> = {
  Team:'text-blue-400', Product:'text-[#c4935a]', Sales:'text-purple-400',
  Site:'text-emerald-400', Compliance:'text-amber-400', Other:'text-[#5a7f95]',
}

// ─── Field input renderer ─────────────────────────────────────────────────────
function FieldInput({ def, value, onChange }: { def: CustomFieldDef; value: string; onChange:(v:string)=>void }) {
  const val = value ?? ''
  if (def.type === 'textarea') return <Textarea value={val} onChange={e=>onChange(e.target.value)} rows={2} />
  if (def.type === 'select') return (
    <Select value={val} onChange={e=>onChange(e.target.value)}>
      <option value="">— select —</option>
      {def.options.map(o=><option key={o}>{o}</option>)}
    </Select>
  )
  if (def.type === 'checkbox') return (
    <label className="flex items-center gap-2 cursor-pointer mt-1">
      <input type="checkbox" checked={val==='true'} onChange={e=>onChange(e.target.checked?'true':'')} className="w-4 h-4 accent-[#c4935a]" />
      <span className="text-sm text-[#5a7f95]">{def.label}</span>
    </label>
  )
  return <Input type={def.type as 'text'|'number'|'date'|'url'} value={val} onChange={e=>onChange(e.target.value)} placeholder={def.label} />
}

// ─── Field builder ────────────────────────────────────────────────────────────
function FieldBuilder({ target, onSave, onCancel }: {
  target?: CustomFieldDef
  onSave: (d: Omit<CustomFieldDef,'id'|'order'>) => void
  onCancel: () => void
}) {
  const [f, setF] = useState({ label:target?.label??'', type:(target?.type??'text') as FieldType, required:target?.required??false, options:target?.options.join(', ')??'', section:target?.section??'Other' })
  return (
    <div className="bg-[#070b0e] border border-[#c4935a]/25 rounded-xl p-4 mt-3 space-y-3">
      <p className="text-[10px] font-bold text-[#c4935a] uppercase tracking-widest">{target ? 'Edit field' : 'New custom field'}</p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Label *"><Input autoFocus value={f.label} onChange={e=>setF(p=>({...p,label:e.target.value}))} placeholder="e.g. Architect" /></Field>
        <Field label="Type">
          <Select value={f.type} onChange={e=>setF(p=>({...p,type:e.target.value as FieldType}))}>
            {(Object.entries(FIELD_LABELS) as [FieldType,string][]).map(([k,v])=><option key={k} value={k}>{v}</option>)}
          </Select>
        </Field>
      </div>
      {f.type==='select' && <Field label="Options (comma-separated)"><Input value={f.options} onChange={e=>setF(p=>({...p,options:e.target.value}))} placeholder="Option A, Option B" /></Field>}
      <div className="grid grid-cols-2 gap-3 items-end">
        <Field label="Section">
          <Select value={f.section} onChange={e=>setF(p=>({...p,section:e.target.value}))}>
            {['Team','Product','Sales','Site','Compliance','Other'].map(s=><option key={s}>{s}</option>)}
          </Select>
        </Field>
        <label className="flex items-center gap-2 cursor-pointer pb-2">
          <input type="checkbox" checked={f.required} onChange={e=>setF(p=>({...p,required:e.target.checked}))} className="accent-[#c4935a]" />
          <span className="text-xs text-[#5a7f95]">Required</span>
        </label>
      </div>
      <div className="flex gap-2">
        <Btn size="sm" type="button" disabled={!f.label.trim()} onClick={()=>f.label.trim()&&onSave({ label:f.label.trim(), type:f.type, required:f.required, options:f.options.split(',').map(s=>s.trim()).filter(Boolean), section:f.section })}>
          {target ? 'Save field' : 'Add field'}
        </Btn>
        <Btn size="sm" variant="secondary" type="button" onClick={onCancel}>Cancel</Btn>
      </div>
    </div>
  )
}

// ─── Custom fields panel ──────────────────────────────────────────────────────
function CustomPanel({ defs, values, onChange }: { defs:CustomFieldDef[]; values:Record<string,string>; onChange:(id:string,v:string)=>void }) {
  const { dispatch } = useStore()
  const [showBuilder, setShowBuilder] = useState(false)
  const [editDef, setEditDef] = useState<CustomFieldDef|null>(null)
  const sorted = [...defs].sort((a,b)=>a.order-b.order)
  const sections = sorted.reduce<Record<string,CustomFieldDef[]>>((acc,d)=>{ const s=d.section||'Other'; if(!acc[s])acc[s]=[]; acc[s].push(d); return acc },{})

  const addDef = (data: Omit<CustomFieldDef,'id'|'order'>) => {
    dispatch({ type:'ADD_FIELD_DEF', payload:{ ...data, id:uid(), order:defs.length } })
    setShowBuilder(false)
  }
  const updDef = (data: Omit<CustomFieldDef,'id'|'order'>) => {
    if(!editDef) return
    dispatch({ type:'UPD_FIELD_DEF', payload:{ ...data, id:editDef.id, order:editDef.order } })
    setEditDef(null)
  }
  const delDef = (id:string) => { if(confirm('Remove this field from all clients?')) dispatch({ type:'DEL_FIELD_DEF', payload:id }) }
  const move = (def:CustomFieldDef, dir:1|-1) => {
    const s = [...defs].sort((a,b)=>a.order-b.order)
    const i = s.findIndex(d=>d.id===def.id)
    const j = i+dir
    if(j<0||j>=s.length) return
    const reordered = s.map((d,idx)=>({ ...d, order: idx===i ? s[j].order : idx===j ? s[i].order : d.order }))
    dispatch({ type:'REORDER_FIELDS', payload:reordered })
  }

  return (
    <div className="mt-6 pt-5 border-t border-[#1b2c38]">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-bold text-[#5a7f95] uppercase tracking-widest">Custom Fields</p>
        <button type="button" onClick={()=>{setShowBuilder(true);setEditDef(null)}} className="text-xs text-[#c4935a] hover:text-[#e8b87a] font-semibold">+ Add field</button>
      </div>
      {sorted.length===0 && !showBuilder && <p className="text-xs text-[#2e4455] italic mb-2">Click <span className="text-[#c4935a]">+ Add field</span> to build your form.</p>}
      {Object.entries(sections).map(([section, fields]) => (
        <div key={section} className="mb-5">
          <p className={`text-[9px] font-bold uppercase tracking-widest mb-3 ${SECTION_COLOR[section]??'text-[#5a7f95]'}`}>{section}</p>
          <div className="space-y-3">
            {fields.map(def => (
              <div key={def.id}>
                {editDef?.id===def.id ? (
                  <FieldBuilder target={def} onSave={updDef} onCancel={()=>setEditDef(null)} />
                ) : (
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="text-[10px] font-bold text-[#5a7f95] uppercase tracking-widest flex-1">
                        {def.label}{def.required && <span className="text-[#c4935a] ml-0.5">*</span>}
                      </label>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1b2c38] text-[#2e4455]">{FIELD_LABELS[def.type]}</span>
                      <button type="button" onClick={()=>move(def,-1)} className="text-[#2e4455] hover:text-[#c8dce8] text-[10px] px-0.5">↑</button>
                      <button type="button" onClick={()=>move(def, 1)} className="text-[#2e4455] hover:text-[#c8dce8] text-[10px] px-0.5">↓</button>
                      <button type="button" onClick={()=>{setEditDef(def);setShowBuilder(false)}} className="text-[#2e4455] hover:text-[#c4935a] text-xs p-0.5">✎</button>
                      <DeleteBtn onClick={()=>delDef(def.id)} />
                    </div>
                    <FieldInput def={def} value={values?.[def.id]??''} onChange={v=>onChange(def.id,v)} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      {showBuilder && !editDef && <FieldBuilder onSave={addDef} onCancel={()=>setShowBuilder(false)} />}
    </div>
  )
}

// ─── Client form ─────────────────────────────────────────────────────────────
const EMPTY: Omit<ClientProject,'id'> = {
  client:'', location:'', contactName:'', category:'residential', products:'',
  status:'lead', value:0, progress:0, stage:'', lead:'Ari', startDate:'', endDate:'', notes:'', customFields:{},
}

function ClientForm({ initial, onSave, onCancel }: { initial?:ClientProject; onSave:(d:Omit<ClientProject,'id'>)=>void; onCancel:()=>void }) {
  const { state } = useStore()
  const [f, setF] = useState<Omit<ClientProject,'id'>>(initial ? { ...initial, customFields:initial.customFields??{} } : EMPTY)
  const s = <K extends keyof typeof f>(k:K) => (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setF(p=>({ ...p, [k]: (k==='value'||k==='progress') ? +e.target.value : e.target.value }))

  return (
    <form onSubmit={e=>{e.preventDefault();onSave(f)}} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Client / Project Name" required><Input value={f.client} onChange={s('client')} required autoFocus /></Field>
        <Field label="Location"><Input value={f.location} onChange={s('location')} placeholder="Constantia, Cape Town" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Contact Name"><Input value={f.contactName} onChange={s('contactName')} /></Field>
        <Field label="Category">
          <Select value={f.category} onChange={s('category')}>
            {(['residential','hospitality','collab'] as ClientCategory[]).map(c=><option key={c}>{c}</option>)}
          </Select>
        </Field>
      </div>
      <Field label="Products / Scope"><Textarea value={f.products} onChange={s('products')} rows={2} placeholder="e.g. Custom Sauna + FT ColdPlunge1 + Cariitti Lighting" /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Status">
          <Select value={f.status} onChange={s('status')}>
            {(['lead','proposal','active','qa','complete','on-hold'] as ClientStatus[]).map(s=><option key={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Stage"><Input value={f.stage} onChange={s('stage')} placeholder="e.g. Mechanical & Electrical" /></Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Project Value (R)"><Input type="number" value={f.value} onChange={s('value')} /></Field>
        <Field label="Progress %"><Input type="number" min={0} max={100} value={f.progress} onChange={s('progress')} /></Field>
        <Field label="Lead"><Input value={f.lead} onChange={s('lead')} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Start Date"><Input type="date" value={f.startDate} onChange={s('startDate')} /></Field>
        <Field label="End Date"><Input type="date" value={f.endDate} onChange={s('endDate')} /></Field>
      </div>
      <Field label="Notes"><Textarea value={f.notes} onChange={s('notes')} rows={3} /></Field>
      <CustomPanel defs={state.customFieldDefs} values={f.customFields??{}} onChange={(id,v)=>setF(p=>({...p,customFields:{...(p.customFields??{}), [id]:v}}))} />
      <div className="flex gap-3 pt-2 border-t border-[#1b2c38]">
        <Btn type="submit">{initial ? 'Save changes' : 'Add client'}</Btn>
        <Btn variant="secondary" type="button" onClick={onCancel}>Cancel</Btn>
      </div>
    </form>
  )
}

// ─── Module page ─────────────────────────────────────────────────────────────
export default function Clients() {
  const { state, dispatch } = useStore()
  const [editing, setEditing] = useState<ClientProject|null>(null)
  const [adding, setAdding]   = useState(false)
  const [filter, setFilter]   = useState<ClientStatus|'all'>('all')

  const items = filter==='all' ? state.clients : state.clients.filter(c=>c.status===filter)
  const total = state.clients.reduce((s,c)=>s+c.value, 0)
  const active = state.clients.filter(c=>c.status==='active'||c.status==='qa').length

  const save = (data: Omit<ClientProject,'id'>) => {
    if (editing) dispatch({ type:'UPD_CLIENT', payload:{ ...data, id:editing.id } })
    else         dispatch({ type:'ADD_CLIENT', payload:{ ...data, id:uid() } })
    setEditing(null); setAdding(false)
  }
  const del = (id:string) => { if(confirm('Delete client?')) dispatch({ type:'DEL_CLIENT', payload:id }) }

  return (
    <div className="max-w-[1500px] mx-auto px-6 py-6">
      <PageHeader title="Clients" sub={`${state.clients.length} total · ${state.customFieldDefs.length} custom fields`} action={<Btn onClick={()=>setAdding(true)}>+ New Client</Btn>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total Portfolio" value={formatZAR(total)} color="text-[#c4935a]" />
        <Stat label="Active On Site"  value={active}           color="text-[#c8dce8]" />
        <Stat label="In Pipeline"     value={state.clients.filter(c=>c.status==='proposal'||c.status==='lead').length} color="text-blue-400" />
        <Stat label="Completed"       value={state.clients.filter(c=>c.status==='complete').length} color="text-emerald-400" />
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {(['all','active','qa','proposal','lead','complete','on-hold'] as const).map(s=>(
          <button key={s} onClick={()=>setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${filter===s?'bg-[#c4935a] text-[#06080b]':'bg-[#0e1820] text-[#5a7f95] hover:bg-[#1b2c38]'}`}>
            {s==='all'?'All':s.replace('-',' ')}
          </button>
        ))}
      </div>

      <div className="bg-[#0e1820] border border-[#1b2c38] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[#1b2c38]">
              <tr><Th>Client</Th><Th>Location</Th><Th>Scope</Th><Th>Status</Th><Th>Progress</Th><Th>Value</Th><Th>Lead</Th><Th></Th></tr>
            </thead>
            <tbody>
              {items.length===0 && <EmptyRow cols={8} />}
              {items.map(c=>(
                <tr key={c.id} onClick={()=>setEditing(c)} className="border-b border-[#1b2c38] hover:bg-[#0c1520] transition-colors cursor-pointer">
                  <Td>
                    <p className="font-semibold text-[#c8dce8]">{c.client}</p>
                    {c.contactName && <p className="text-[10px] text-[#2e4455]">{c.contactName}</p>}
                  </Td>
                  <Td className="text-xs text-[#5a7f95]">{c.location}</Td>
                  <Td className="max-w-[220px]"><span className="text-xs text-[#5a7f95] block truncate">{c.products}</span></Td>
                  <Td><Badge color={STATUS_COLOR[c.status]}>{c.status.replace('-',' ')}</Badge></Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#1b2c38] rounded-full overflow-hidden">
                        <div className="h-full bg-[#c4935a] rounded-full" style={{width:`${c.progress}%`}} />
                      </div>
                      <span className="text-[10px] text-[#5a7f95]">{c.progress}%</span>
                    </div>
                  </Td>
                  <Td className="font-semibold text-[#c4935a]">{formatZAR(c.value)}</Td>
                  <Td className="text-xs text-[#5a7f95]">{c.lead}</Td>
                  <Td><DeleteBtn onClick={()=>del(c.id)} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(adding||editing) && (
        <Modal title={editing ? `Edit — ${editing.client}` : 'New Client'} onClose={()=>{setAdding(false);setEditing(null)}} wide>
          <ClientForm initial={editing??undefined} onSave={save} onCancel={()=>{setAdding(false);setEditing(null)}} />
        </Modal>
      )}
    </div>
  )
}
