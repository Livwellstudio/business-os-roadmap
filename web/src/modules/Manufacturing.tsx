import { useState } from 'react'
import { useStore, uid } from '../store'
import type { ManufacturingJob, CutlistItem, JobStatus } from '../store/types'
import Modal from '../components/Modal'
import { Input, Select, Textarea, Field, Btn, Badge, Stat, PageHeader, DeleteBtn } from '../components/ui'

const STATUSES: JobStatus[] = ['pending','cutting','welding','assembly','finishing','qa','complete']
const STATUS_COLOR: Record<JobStatus, string> = {
  pending:'#3d5a6e', cutting:'#3b82f6', welding:'#f59e0b', assembly:'#c4935a',
  finishing:'#a78bfa', qa:'#fb923c', complete:'#22c55e',
}

function CutlistEditor({ items, onChange }: { items:CutlistItem[]; onChange:(items:CutlistItem[])=>void }) {
  const add = () => onChange([...items, { id:uid(), material:'', description:'', length:0, width:0, thickness:0, qty:1, done:false }])
  const upd = (id:string, k:keyof CutlistItem, v:string|number|boolean) => onChange(items.map(i=>i.id===id?{...i,[k]:v}:i))
  const rem = (id:string) => onChange(items.filter(i=>i.id!==id))

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold text-[#5a7f95] uppercase tracking-wider">Cut List ({items.length} items)</p>
        <Btn size="sm" variant="secondary" type="button" onClick={add}>+ Add Row</Btn>
      </div>
      {items.length > 0 && (
        <div className="rounded-xl border border-[#1b2c38] overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_75px_65px_65px_50px_26px_26px] gap-0 bg-[#070b0e] px-3 py-2 text-[9px] font-bold text-[#2e4455] uppercase tracking-wider">
            <span>Material</span><span>Description</span><span>L mm</span><span>W mm</span><span>T mm</span><span>Qty</span><span>✓</span><span></span>
          </div>
          {items.map(item=>(
            <div key={item.id} className={`grid grid-cols-[1fr_1fr_75px_65px_65px_50px_26px_26px] gap-1 px-3 py-2 border-t border-[#1b2c38] items-center ${item.done?'opacity-40':''}`}>
              <Input value={item.material} onChange={e=>upd(item.id,'material',e.target.value)} placeholder="Thermory 28mm" />
              <Input value={item.description} onChange={e=>upd(item.id,'description',e.target.value)} placeholder="Roof boards" />
              <Input type="number" value={item.length}    onChange={e=>upd(item.id,'length',+e.target.value)} />
              <Input type="number" value={item.width}     onChange={e=>upd(item.id,'width',+e.target.value)} />
              <Input type="number" value={item.thickness} onChange={e=>upd(item.id,'thickness',+e.target.value)} />
              <Input type="number" value={item.qty}       onChange={e=>upd(item.id,'qty',+e.target.value)} min={1} />
              <button type="button" onClick={()=>upd(item.id,'done',!item.done)}
                className={`w-5 h-5 rounded border text-[10px] flex items-center justify-center ${item.done?'bg-emerald-500 border-emerald-500 text-white':'border-[#1b2c38]'}`}>
                {item.done?'✓':''}
              </button>
              <button type="button" onClick={()=>rem(item.id)} className="text-[#2e4455] hover:text-red-400 text-xs">✕</button>
            </div>
          ))}
        </div>
      )}
      {items.length===0 && <p className="text-xs text-[#2e4455] italic py-2">No items. Click + Add Row to start the cut list.</p>}
    </div>
  )
}

function JobForm({ initial, clients, onSave, onCancel }: {
  initial?: ManufacturingJob; clients:{id:string;client:string}[]
  onSave:(d:Omit<ManufacturingJob,'id'>)=>void; onCancel:()=>void
}) {
  const [f, setF] = useState<Omit<ManufacturingJob,'id'|'cutlist'>>(initial ? { ...initial } : {
    jobNo:'', projectId:'', product:'', status:'pending', priority:'medium',
    assignedTo:'Tyron', dueDate:'', notes:'',
  })
  const [cutlist, setCutlist] = useState<CutlistItem[]>(initial?.cutlist??[])
  const s = <K extends keyof typeof f>(k:K) => (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setF(p=>({ ...p, [k]: e.target.value }))

  return (
    <form onSubmit={e=>{e.preventDefault();onSave({ ...f, cutlist })}} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Job No"><Input value={f.jobNo} onChange={s('jobNo')} placeholder="MFG-026-XXX" /></Field>
        <Field label="Client Project">
          <Select value={f.projectId} onChange={s('projectId')}>
            <option value="">— Select —</option>
            {clients.map(c=><option key={c.id} value={c.id}>{c.client}</option>)}
          </Select>
        </Field>
      </div>
      <Field label="Product / Description"><Input value={f.product} onChange={s('product')} placeholder="e.g. ARK Pergola Frame" /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Status">
          <Select value={f.status} onChange={s('status')}>{STATUSES.map(s=><option key={s}>{s}</option>)}</Select>
        </Field>
        <Field label="Priority">
          <Select value={f.priority} onChange={s('priority')}>
            <option>low</option><option>medium</option><option>high</option><option>urgent</option>
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Due Date"><Input type="date" value={f.dueDate} onChange={s('dueDate')} /></Field>
        <Field label="Assigned To">
          <Select value={f.assignedTo} onChange={s('assignedTo')}>
            {['Tyron','Afrim','Workshop','Garreth','Ari'].map(t=><option key={t}>{t}</option>)}
          </Select>
        </Field>
      </div>
      <Field label="Notes"><Textarea value={f.notes} onChange={s('notes')} rows={2} /></Field>
      <CutlistEditor items={cutlist} onChange={setCutlist} />
      <div className="flex gap-3 pt-2 border-t border-[#1b2c38]">
        <Btn type="submit">{initial ? 'Save changes' : 'Create job'}</Btn>
        <Btn variant="secondary" type="button" onClick={onCancel}>Cancel</Btn>
      </div>
    </form>
  )
}

export default function Manufacturing() {
  const { state, dispatch } = useStore()
  const [editing, setEditing] = useState<ManufacturingJob|null>(null)
  const [adding, setAdding]   = useState(false)
  const [statusF, setStatusF] = useState<JobStatus|'all'>('all')

  const items = statusF==='all' ? state.manufacturingJobs : state.manufacturingJobs.filter(j=>j.status===statusF)
  const active = state.manufacturingJobs.filter(j=>!['complete','pending'].includes(j.status)).length
  const totalItems = state.manufacturingJobs.reduce((s,j)=>s+j.cutlist.length, 0)
  const doneItems  = state.manufacturingJobs.reduce((s,j)=>s+j.cutlist.filter(c=>c.done).length, 0)

  const save = (data:Omit<ManufacturingJob,'id'>) => {
    if (editing) dispatch({ type:'UPD_MFG', payload:{ ...data, id:editing.id } })
    else         dispatch({ type:'ADD_MFG', payload:{ ...data, id:uid() } })
    setEditing(null); setAdding(false)
  }
  const del = (id:string) => { if(confirm('Delete job?')) dispatch({ type:'DEL_MFG', payload:id }) }
  const projName = (id:string) => state.clients.find(c=>c.id===id)?.client ?? '—'

  return (
    <div className="max-w-[1500px] mx-auto px-6 py-6">
      <PageHeader title="Manufacturing" sub={`${state.manufacturingJobs.length} jobs`} action={<Btn onClick={()=>setAdding(true)}>+ New Job</Btn>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total Jobs"   value={state.manufacturingJobs.length} color="text-[#c8dce8]" />
        <Stat label="In Workshop"  value={active}                          color="text-[#c4935a]" />
        <Stat label="Cut Progress" value={`${doneItems}/${totalItems}`}    color="text-emerald-400" sub="items done" />
        <Stat label="Urgent"       value={state.manufacturingJobs.filter(j=>j.priority==='urgent').length} color="text-red-400" />
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        <button onClick={()=>setStatusF('all')} className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${statusF==='all'?'bg-[#c4935a] text-[#06080b]':'bg-[#0e1820] text-[#5a7f95] hover:bg-[#1b2c38]'}`}>All</button>
        {STATUSES.map(s=>(
          <button key={s} onClick={()=>setStatusF(s)}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${statusF===s?'bg-[#c4935a] text-[#06080b]':'bg-[#0e1820] text-[#5a7f95] hover:bg-[#1b2c38]'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {items.length===0 && <div className="bg-[#0e1820] border border-[#1b2c38] rounded-2xl p-12 text-center text-sm text-[#2e4455] italic">No manufacturing jobs</div>}
        {items.map(job=>{
          const done = job.cutlist.filter(c=>c.done).length
          const total = job.cutlist.length
          const pct = total > 0 ? Math.round((done/total)*100) : 0

          return (
            <div key={job.id} className="bg-[#0e1820] border border-[#1b2c38] rounded-2xl p-5 hover:border-[#2d4558] transition-colors cursor-pointer" onClick={()=>setEditing(job)}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-mono text-[#3d5a6e]">{job.jobNo}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ color:STATUS_COLOR[job.status], background:STATUS_COLOR[job.status]+'18' }}>{job.status}</span>
                    <Badge color={job.priority==='urgent'?'red':job.priority==='high'?'amber':job.priority==='medium'?'blue':'gray'}>{job.priority}</Badge>
                  </div>
                  <p className="font-semibold text-[#c8dce8]">{job.product}</p>
                  <p className="text-xs text-[#5a7f95] mt-0.5">{projName(job.projectId)} · {job.assignedTo} · Due {job.dueDate}</p>
                </div>
                <div onClick={e=>e.stopPropagation()}><DeleteBtn onClick={()=>del(job.id)} /></div>
              </div>

              {total > 0 && (
                <>
                  <div className="flex items-center justify-between text-xs text-[#3d5a6e] mb-2">
                    <span>Cut list progress</span><span>{done}/{total} items cut</span>
                  </div>
                  <div className="w-full h-2 bg-[#1b2c38] rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-[#c4935a] rounded-full transition-all" style={{ width:`${pct}%` }} />
                  </div>
                  <div className="grid grid-cols-[20px_1fr_75px_65px_65px_50px] gap-1 text-[9px] font-bold text-[#2e4455] uppercase tracking-wider px-1 mb-1">
                    <span></span><span>Material — Description</span><span>L</span><span>W</span><span>T</span><span>Qty</span>
                  </div>
                  {job.cutlist.map(c=>(
                    <div key={c.id} className={`grid grid-cols-[20px_1fr_75px_65px_65px_50px] gap-1 px-1 py-1.5 border-t border-[#1b2c38] text-xs items-center ${c.done?'opacity-30 line-through':''}`}>
                      <span className={`w-4 h-4 rounded border flex items-center justify-center text-[9px] ${c.done?'border-emerald-500 bg-emerald-500 text-white':'border-[#1b2c38]'}`}>{c.done?'✓':''}</span>
                      <span><span className="text-[#c8dce8]">{c.material}</span><span className="text-[#3d5a6e]"> — {c.description}</span></span>
                      <span className="text-[#3d5a6e]">{c.length}mm</span>
                      <span className="text-[#3d5a6e]">{c.width}mm</span>
                      <span className="text-[#3d5a6e]">{c.thickness}mm</span>
                      <span className="text-[#c8dce8] font-medium">×{c.qty}</span>
                    </div>
                  ))}
                </>
              )}
              {total===0 && <p className="text-xs text-[#2e4455] italic">No cut list yet. Click to edit and add items.</p>}
              {job.notes && <p className="text-xs text-[#3d5a6e] mt-3 pt-3 border-t border-[#1b2c38]">{job.notes}</p>}
            </div>
          )
        })}
      </div>

      {(adding||editing) && (
        <Modal title={editing?`Edit — ${editing.jobNo}`:'New Manufacturing Job'} onClose={()=>{setAdding(false);setEditing(null)}} wide>
          <JobForm initial={editing??undefined} clients={state.clients} onSave={save} onCancel={()=>{setAdding(false);setEditing(null)}} />
        </Modal>
      )}
    </div>
  )
}
