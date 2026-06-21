import { useState } from 'react'
import { useStore, uid } from '../store'
import type { ManufacturingJob, CutlistItem } from '../store/types'
import Modal from '../components/Modal'
import { Input, Select, Textarea, Field, Btn, Badge, Stat, Th, Td, PageHeader, EmptyRow, DeleteBtn } from '../components/ui'

const STATUSES = ['pending','cutting','assembly','finishing','qa','complete'] as const
const PRIORITIES = ['low','medium','high','urgent'] as const

const STATUS_COLOR = { pending:'gray', cutting:'blue', assembly:'gold', finishing:'amber', qa:'amber', complete:'green' } as const
const PRIORITY_COLOR = { low:'gray', medium:'blue', high:'amber', urgent:'red' } as const

const EMPTY_JOB: Omit<ManufacturingJob,'id'|'cutlist'> = {
  jobNo:'', projectId:'', product:'', status:'pending', priority:'medium',
  dueDate:'', assignedTo:'Workshop Team', notes:'',
}

function CutlistEditor({ items, onChange }: { items: CutlistItem[]; onChange: (items: CutlistItem[]) => void }) {
  const add = () => onChange([...items, { id: uid(), material:'', description:'', length:0, width:0, thickness:0, qty:1, done:false }])
  const upd = (id: string, k: keyof CutlistItem, v: string | number | boolean) =>
    onChange(items.map(i => i.id === id ? { ...i, [k]: v } : i))
  const rem = (id: string) => onChange(items.filter(i => i.id !== id))
  const toggle = (id: string) => onChange(items.map(i => i.id === id ? { ...i, done: !i.done } : i))

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-[#8aa0b8] uppercase tracking-wider">Cut List ({items.length} items)</p>
        <Btn size="sm" variant="secondary" type="button" onClick={add}>+ Add Row</Btn>
      </div>
      {items.length > 0 && (
        <div className="rounded-xl border border-[#1a2e40] overflow-hidden mb-2">
          <div className="grid grid-cols-[1fr_1fr_80px_70px_70px_50px_24px_24px] gap-0 bg-[#0a1018] px-3 py-2 text-[9px] font-bold text-[#445a70] uppercase tracking-wider">
            <span>Material</span><span>Description</span><span>L (mm)</span><span>W (mm)</span><span>T (mm)</span><span>Qty</span><span>✓</span><span></span>
          </div>
          {items.map(item => (
            <div key={item.id} className={`grid grid-cols-[1fr_1fr_80px_70px_70px_50px_24px_24px] gap-1 px-3 py-2 border-t border-[#1a2e40] items-center ${item.done ? 'opacity-50' : ''}`}>
              <Input value={item.material} onChange={e => upd(item.id,'material',e.target.value)} placeholder="Cedar 20mm" />
              <Input value={item.description} onChange={e => upd(item.id,'description',e.target.value)} placeholder="Back wall" />
              <Input type="number" value={item.length} onChange={e => upd(item.id,'length',+e.target.value)} />
              <Input type="number" value={item.width}  onChange={e => upd(item.id,'width', +e.target.value)} />
              <Input type="number" value={item.thickness} onChange={e => upd(item.id,'thickness',+e.target.value)} />
              <Input type="number" value={item.qty} onChange={e => upd(item.id,'qty',+e.target.value)} min={1} />
              <button type="button" onClick={() => toggle(item.id)} className={`w-5 h-5 rounded border ${item.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[#1a2e40] text-transparent'} text-xs flex items-center justify-center`}>✓</button>
              <button type="button" onClick={() => rem(item.id)} className="text-[#445a70] hover:text-red-400 transition-colors text-xs">✕</button>
            </div>
          ))}
        </div>
      )}
      {items.length === 0 && <p className="text-xs text-[#445a70] italic py-3">No cut items yet. Click + Add Row to start.</p>}
    </div>
  )
}

function Form({ initial, projects, onSave, onCancel }: {
  initial?: ManufacturingJob
  projects: { id: string; client: string }[]
  onSave: (d: Omit<ManufacturingJob,'id'>) => void
  onCancel: () => void
}) {
  const [f, setF] = useState<Omit<ManufacturingJob,'id'|'cutlist'>>(initial ? { ...initial } : EMPTY_JOB)
  const [cutlist, setCutlist] = useState<CutlistItem[]>(initial?.cutlist ?? [])
  const s = <K extends keyof typeof f>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSave({ ...f, cutlist }) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Job No"><Input value={f.jobNo} onChange={s('jobNo')} placeholder="MFG-026-XX" /></Field>
        <Field label="Project">
          <Select value={f.projectId} onChange={s('projectId')}>
            <option value="">— Select project —</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.client}</option>)}
          </Select>
        </Field>
      </div>
      <Field label="Product / Description"><Input value={f.product} onChange={s('product')} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Status"><Select value={f.status} onChange={s('status')}>{STATUSES.map(s=><option key={s}>{s}</option>)}</Select></Field>
        <Field label="Priority"><Select value={f.priority} onChange={s('priority')}>{PRIORITIES.map(p=><option key={p}>{p}</option>)}</Select></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Due Date"><Input type="date" value={f.dueDate} onChange={s('dueDate')} /></Field>
        <Field label="Assigned To"><Input value={f.assignedTo} onChange={s('assignedTo')} /></Field>
      </div>
      <Field label="Notes"><Textarea value={f.notes} onChange={s('notes')} /></Field>
      <CutlistEditor items={cutlist} onChange={setCutlist} />
      <div className="flex gap-3 pt-2 border-t border-[#1a2e40]">
        <Btn type="submit">{initial ? 'Save changes' : 'Create job'}</Btn>
        <Btn variant="secondary" type="button" onClick={onCancel}>Cancel</Btn>
      </div>
    </form>
  )
}

export default function Manufacturing() {
  const { state, dispatch } = useStore()
  const [editing, setEditing] = useState<ManufacturingJob | null>(null)
  const [adding, setAdding]   = useState(false)

  const save = (data: Omit<ManufacturingJob,'id'>) => {
    if (editing) dispatch({ type:'UPD_MFG', payload: { ...data, id: editing.id } })
    else         dispatch({ type:'ADD_MFG', payload: { ...data, id: uid() } })
    setEditing(null); setAdding(false)
  }
  const del = (id: string) => { if (confirm('Delete job?')) dispatch({ type:'DEL_MFG', payload: id }) }
  const project = (id: string) => state.projects.find(p => p.id === id)

  const active   = state.manufacturingJobs.filter(j => !['complete','pending'].includes(j.status)).length
  const totalItems = state.manufacturingJobs.reduce((s, j) => s + j.cutlist.length, 0)
  const doneItems  = state.manufacturingJobs.reduce((s, j) => s + j.cutlist.filter(c => c.done).length, 0)

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      <PageHeader title="Manufacturing" sub={`${state.manufacturingJobs.length} jobs`} action={<Btn onClick={() => setAdding(true)}>+ New Job</Btn>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total Jobs"  value={state.manufacturingJobs.length} color="text-[#dce6f0]" />
        <Stat label="Active"      value={active} color="text-[#c9a96e]" />
        <Stat label="Cut Items"   value={`${doneItems}/${totalItems}`} color="text-emerald-400" sub="done / total" />
        <Stat label="Urgent"      value={state.manufacturingJobs.filter(j=>j.priority==='urgent').length} color="text-red-400" />
      </div>

      <div className="space-y-4">
        {state.manufacturingJobs.length === 0 && (
          <div className="bg-[#111e2b] border border-[#1a2e40] rounded-2xl p-12 text-center text-sm text-[#445a70] italic">No manufacturing jobs yet</div>
        )}
        {state.manufacturingJobs.map(job => {
          const proj = project(job.projectId)
          const cutDone = job.cutlist.filter(c => c.done).length
          const cutTotal = job.cutlist.length
          const pct = cutTotal > 0 ? Math.round((cutDone / cutTotal) * 100) : 0

          return (
            <div key={job.id} className="bg-[#111e2b] border border-[#1a2e40] rounded-2xl p-5 hover:border-[#243d52] transition-colors cursor-pointer" onClick={() => setEditing(job)}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-mono text-[#445a70]">{job.jobNo}</span>
                    <Badge color={STATUS_COLOR[job.status]}>{job.status}</Badge>
                    <Badge color={PRIORITY_COLOR[job.priority]}>{job.priority}</Badge>
                  </div>
                  <p className="font-semibold text-[#dce6f0]">{job.product}</p>
                  {proj && <p className="text-xs text-[#8aa0b8] mt-0.5">{proj.client} — {proj.location}</p>}
                </div>
                <div className="text-right flex-shrink-0" onClick={e => e.stopPropagation()}>
                  <p className="text-xs text-[#445a70] mb-1">Due: {job.dueDate}</p>
                  <DeleteBtn onClick={() => del(job.id)} />
                </div>
              </div>

              {cutTotal > 0 && (
                <div>
                  <div className="flex justify-between text-xs text-[#445a70] mb-1.5">
                    <span>Cutlist progress</span><span>{cutDone}/{cutTotal} items</span>
                  </div>
                  <div className="w-full h-2 bg-[#1a2e40] rounded-full overflow-hidden">
                    <div className="h-full bg-[#c9a96e] rounded-full transition-all" style={{ width:`${pct}%` }} />
                  </div>
                  <div className="grid grid-cols-[auto_1fr_80px_70px_70px_50px] gap-2 mt-3 text-[9px] font-bold text-[#445a70] uppercase tracking-wider px-1">
                    <span></span><span>Material → Description</span><span>L</span><span>W</span><span>T</span><span>Qty</span>
                  </div>
                  {job.cutlist.map(c => (
                    <div key={c.id} className={`grid grid-cols-[24px_1fr_80px_70px_70px_50px] gap-2 px-1 py-1.5 border-t border-[#1a2e40] text-xs items-center ${c.done ? 'opacity-40 line-through' : ''}`}>
                      <span className={`w-4 h-4 rounded border flex items-center justify-center text-[9px] ${c.done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-[#1a2e40]'}`}>{c.done ? '✓' : ''}</span>
                      <span className="text-[#8aa0b8]"><span className="text-[#dce6f0]">{c.material}</span> — {c.description}</span>
                      <span className="text-[#445a70]">{c.length}mm</span>
                      <span className="text-[#445a70]">{c.width}mm</span>
                      <span className="text-[#445a70]">{c.thickness}mm</span>
                      <span className="text-[#dce6f0] font-medium">×{c.qty}</span>
                    </div>
                  ))}
                </div>
              )}
              {cutTotal === 0 && <p className="text-xs text-[#445a70] italic">No cutlist items yet</p>}
            </div>
          )
        })}
      </div>

      {(adding || editing) && (
        <Modal title={editing ? `Edit Job — ${editing.jobNo}` : 'New Manufacturing Job'} onClose={() => { setAdding(false); setEditing(null) }} wide>
          <Form initial={editing ?? undefined} projects={state.projects} onSave={save} onCancel={() => { setAdding(false); setEditing(null) }} />
        </Modal>
      )}
    </div>
  )
}
