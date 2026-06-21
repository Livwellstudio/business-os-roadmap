import { useState } from 'react'
import { useStore, uid } from '../store'
import type { DesignJob, DesignType, DesignStatus } from '../store/types'
import Modal from '../components/Modal'
import { Input, Select, Textarea, Field, Btn, Badge, Stat, PageHeader, DeleteBtn } from '../components/ui'

const TYPES: DesignType[] = ['concept','3d-render','technical-drawing','specification','proposal','animation']
const STATUSES: DesignStatus[] = ['briefed','in-progress','review','approved','revision']
const TYPE_ICON: Record<DesignType, string> = {
  concept:'💡', '3d-render':'🧊', 'technical-drawing':'📐', specification:'📋', proposal:'📄', animation:'🎬',
}
const STATUS_COLOR: Record<DesignStatus,'gold'|'blue'|'amber'|'green'|'red'> = {
  briefed:'blue', 'in-progress':'gold', review:'amber', approved:'green', revision:'red',
}
const TEAM = ['Ari','Tyron','Afrim','Garreth','Artvion','Workshop']

const EMPTY: Omit<DesignJob,'id'> = {
  projectId:'', title:'', type:'concept', assignedTo:'Afrim',
  status:'briefed', dueDate:'', notes:'',
}

function DesignForm({ initial, clients, onSave, onCancel }: {
  initial?:DesignJob; clients:{id:string;client:string}[]
  onSave:(d:Omit<DesignJob,'id'>)=>void; onCancel:()=>void
}) {
  const [f, setF] = useState<Omit<DesignJob,'id'>>(initial ? { ...initial } : EMPTY)
  const s = <K extends keyof typeof f>(k:K) => (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setF(p=>({ ...p, [k]: e.target.value }))
  return (
    <form onSubmit={e=>{e.preventDefault();onSave(f)}} className="space-y-4">
      <Field label="Project">
        <Select value={f.projectId} onChange={s('projectId')}>
          <option value="">— Select (leave empty for general R&D) —</option>
          {clients.map(c=><option key={c.id} value={c.id}>{c.client}</option>)}
        </Select>
      </Field>
      <Field label="Brief Title" required><Input value={f.title} onChange={s('title')} required autoFocus /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Type">
          <Select value={f.type} onChange={s('type')}>
            {TYPES.map(t=><option key={t} value={t}>{TYPE_ICON[t]} {t.replace('-',' ')}</option>)}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={f.status} onChange={s('status')}>{STATUSES.map(s=><option key={s}>{s}</option>)}</Select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Assigned To">
          <Select value={f.assignedTo} onChange={s('assignedTo')}>{TEAM.map(t=><option key={t}>{t}</option>)}</Select>
        </Field>
        <Field label="Due Date"><Input type="date" value={f.dueDate} onChange={s('dueDate')} /></Field>
      </div>
      <Field label="Notes / Brief"><Textarea value={f.notes} onChange={s('notes')} rows={4} /></Field>
      <div className="flex gap-3 pt-2 border-t border-[#1b2c38]">
        <Btn type="submit">{initial ? 'Save changes' : 'Create brief'}</Btn>
        <Btn variant="secondary" type="button" onClick={onCancel}>Cancel</Btn>
      </div>
    </form>
  )
}

export default function Design() {
  const { state, dispatch } = useStore()
  const [editing, setEditing] = useState<DesignJob|null>(null)
  const [adding, setAdding]   = useState(false)
  const [statusF, setStatusF] = useState<DesignStatus|'all'>('all')

  const items = statusF==='all' ? state.designJobs : state.designJobs.filter(d=>d.status===statusF)
  const projName = (id:string) => id ? (state.clients.find(c=>c.id===id)?.client??'—') : '— General R&D —'
  const inProgress = state.designJobs.filter(d=>d.status==='in-progress').length
  const needsReview = state.designJobs.filter(d=>d.status==='review'||d.status==='revision').length

  const save = (data:Omit<DesignJob,'id'>) => {
    if(editing) dispatch({type:'UPD_DESIGN',payload:{...data,id:editing.id}})
    else        dispatch({type:'ADD_DESIGN',payload:{...data,id:uid()}})
    setEditing(null); setAdding(false)
  }
  const del = (id:string) => { if(confirm('Delete design brief?')) dispatch({type:'DEL_DESIGN',payload:id}) }

  return (
    <div className="max-w-[1500px] mx-auto px-6 py-6">
      <PageHeader title="Design & R&D" sub={`${state.designJobs.length} briefs · Team: Tyron · Afrim · Garreth · Artvion`} action={<Btn onClick={()=>setAdding(true)}>+ New Brief</Btn>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total Briefs"  value={state.designJobs.length} color="text-[#c8dce8]" />
        <Stat label="In Progress"   value={inProgress}              color="text-[#c4935a]" />
        <Stat label="Needs Review"  value={needsReview}             color={needsReview>0?'text-amber-400':'text-emerald-400'} />
        <Stat label="Approved"      value={state.designJobs.filter(d=>d.status==='approved').length} color="text-emerald-400" />
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        <button onClick={()=>setStatusF('all')} className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${statusF==='all'?'bg-[#c4935a] text-[#06080b]':'bg-[#0e1820] text-[#5a7f95] hover:bg-[#1b2c38]'}`}>All</button>
        {STATUSES.map(s=>(
          <button key={s} onClick={()=>setStatusF(s)}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${statusF===s?'bg-[#c4935a] text-[#06080b]':'bg-[#0e1820] text-[#5a7f95] hover:bg-[#1b2c38]'}`}>
            {s.replace('-',' ')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.length===0 && <div className="col-span-3 bg-[#0e1820] border border-[#1b2c38] rounded-2xl p-12 text-center text-sm text-[#2e4455] italic">No design briefs</div>}
        {items.map(d=>(
          <div key={d.id} onClick={()=>setEditing(d)}
            className="bg-[#0e1820] border border-[#1b2c38] rounded-2xl p-5 hover:border-[#2d4558] transition-colors cursor-pointer relative">
            <div className="absolute top-4 right-4" onClick={e=>e.stopPropagation()}>
              <DeleteBtn onClick={()=>del(d.id)} />
            </div>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">{TYPE_ICON[d.type]}</span>
              <div className="flex-1 min-w-0 pr-5">
                <p className="font-semibold text-[#c8dce8] text-sm leading-tight">{d.title}</p>
                <p className="text-[10px] text-[#5a7f95] mt-0.5">{projName(d.projectId)}</p>
              </div>
            </div>
            <div className="flex gap-2 mb-3 flex-wrap">
              <Badge color="gray">{d.type.replace('-',' ')}</Badge>
              <Badge color={STATUS_COLOR[d.status]}>{d.status.replace('-',' ')}</Badge>
            </div>
            {d.notes && <p className="text-xs text-[#5a7f95] line-clamp-3 mb-3">{d.notes}</p>}
            <div className="flex items-center justify-between text-[10px] text-[#2e4455] border-t border-[#1b2c38] pt-3">
              <span className="font-semibold text-[#3d5a6e]">{d.assignedTo}</span>
              {d.dueDate && <span>Due {d.dueDate}</span>}
            </div>
          </div>
        ))}
      </div>

      {(adding||editing) && (
        <Modal title={editing?`Edit — ${editing.title}`:'New Design Brief'} onClose={()=>{setAdding(false);setEditing(null)}}>
          <DesignForm initial={editing??undefined} clients={state.clients} onSave={save} onCancel={()=>{setAdding(false);setEditing(null)}} />
        </Modal>
      )}
    </div>
  )
}
