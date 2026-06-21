import { useState } from 'react'
import { useStore, uid } from '../store'
import type { DesignBrief } from '../store/types'
import Modal from '../components/Modal'
import { Input, Select, Textarea, Field, Btn, Badge, Stat, PageHeader, EmptyRow, DeleteBtn } from '../components/ui'

const TYPES    = ['concept','technical','3d-model','material-spec','proposal'] as const
const STATUSES = ['draft','review','approved','revision'] as const

const TYPE_COLOR    = { concept:'purple', technical:'blue', '3d-model':'sky', 'material-spec':'gold', proposal:'green' } as const
const STATUS_COLOR  = { draft:'gray', review:'amber', approved:'green', revision:'red' } as const
const TYPE_ICON     = { concept:'💡', technical:'📐', '3d-model':'🧊', 'material-spec':'🪵', proposal:'📄' }

function Form({ initial, projects, onSave, onCancel }: {
  initial?: DesignBrief; projects: { id:string; client:string }[]
  onSave: (d: Omit<DesignBrief,'id'>) => void; onCancel: () => void
}) {
  const [f, setF] = useState<Omit<DesignBrief,'id'>>(initial ? { ...initial } : {
    projectId:'', title:'', type:'concept', status:'draft',
    designer:'Ari', createdDate: new Date().toISOString().slice(0,10), notes:'',
  })
  const s = <K extends keyof typeof f>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }))
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(f) }} className="space-y-4">
      <Field label="Project">
        <Select value={f.projectId} onChange={s('projectId')}>
          <option value="">— Select project —</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.client}</option>)}
        </Select>
      </Field>
      <Field label="Brief Title" required><Input value={f.title} onChange={s('title')} required /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Type"><Select value={f.type} onChange={s('type')}>{TYPES.map(t=><option key={t}>{t}</option>)}</Select></Field>
        <Field label="Status"><Select value={f.status} onChange={s('status')}>{STATUSES.map(s=><option key={s}>{s}</option>)}</Select></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Designer"><Input value={f.designer} onChange={s('designer')} /></Field>
        <Field label="Date"><Input type="date" value={f.createdDate} onChange={s('createdDate')} /></Field>
      </div>
      <Field label="Notes / Brief"><Textarea value={f.notes} onChange={s('notes')} rows={5} /></Field>
      <div className="flex gap-3 pt-2 border-t border-[#1a2e40]">
        <Btn type="submit">{initial ? 'Save changes' : 'Create brief'}</Btn>
        <Btn variant="secondary" type="button" onClick={onCancel}>Cancel</Btn>
      </div>
    </form>
  )
}

export default function Design() {
  const { state, dispatch } = useStore()
  const [editing, setEditing] = useState<DesignBrief | null>(null)
  const [adding, setAdding]   = useState(false)
  const [filter, setFilter]   = useState<string>('all')

  const items = filter === 'all' ? state.designBriefs : state.designBriefs.filter(d => d.status === filter)
  const projName = (id: string) => state.projects.find(p => p.id === id)?.client ?? '—'

  const approved  = state.designBriefs.filter(d => d.status === 'approved').length
  const inReview  = state.designBriefs.filter(d => d.status === 'review').length
  const revisions = state.designBriefs.filter(d => d.status === 'revision').length

  const save = (data: Omit<DesignBrief,'id'>) => {
    if (editing) dispatch({ type:'UPD_DESIGN', payload: { ...data, id: editing.id } })
    else         dispatch({ type:'ADD_DESIGN', payload: { ...data, id: uid() } })
    setEditing(null); setAdding(false)
  }
  const del = (id: string) => { if (confirm('Delete brief?')) dispatch({ type:'DEL_DESIGN', payload: id }) }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      <PageHeader title="Design" sub={`${state.designBriefs.length} briefs`} action={<Btn onClick={() => setAdding(true)}>+ New Brief</Btn>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total Briefs" value={state.designBriefs.length} color="text-[#dce6f0]" />
        <Stat label="Approved"     value={approved}   color="text-emerald-400" />
        <Stat label="In Review"    value={inReview}   color="text-amber-400" />
        <Stat label="Revisions"    value={revisions}  color={revisions > 0 ? 'text-red-400' : 'text-[#445a70]'} />
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {(['all',...STATUSES] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${filter===s ? 'bg-[#c9a96e] text-[#07090c]' : 'bg-[#111e2b] text-[#8aa0b8] hover:bg-[#1a2e40]'}`}>
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      {items.length === 0 && (
        <div className="bg-[#111e2b] border border-[#1a2e40] rounded-2xl p-12 text-center text-sm text-[#445a70] italic">
          No design briefs yet
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map(d => (
          <div key={d.id} onClick={() => setEditing(d)}
            className="bg-[#111e2b] border border-[#1a2e40] rounded-2xl p-5 hover:border-[#243d52] transition-colors cursor-pointer group relative">
            <div className="absolute top-4 right-4" onClick={e => e.stopPropagation()}>
              <DeleteBtn onClick={() => del(d.id)} />
            </div>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">{TYPE_ICON[d.type]}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#dce6f0] text-sm leading-tight mb-1">{d.title}</p>
                <p className="text-xs text-[#8aa0b8]">{projName(d.projectId)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge color={TYPE_COLOR[d.type]}>{d.type.replace('-', ' ')}</Badge>
              <Badge color={STATUS_COLOR[d.status]}>{d.status}</Badge>
            </div>
            {d.notes && <p className="text-xs text-[#8aa0b8] line-clamp-3 mb-3">{d.notes}</p>}
            <div className="flex items-center justify-between text-[10px] text-[#445a70] border-t border-[#1a2e40] pt-3">
              <span>{d.designer}</span>
              <span>{d.createdDate}</span>
            </div>
          </div>
        ))}
      </div>

      {(adding || editing) && (
        <Modal title={editing ? `Edit — ${editing.title}` : 'New Design Brief'} onClose={() => { setAdding(false); setEditing(null) }}>
          <Form initial={editing ?? undefined} projects={state.projects} onSave={save} onCancel={() => { setAdding(false); setEditing(null) }} />
        </Modal>
      )}
    </div>
  )
}
