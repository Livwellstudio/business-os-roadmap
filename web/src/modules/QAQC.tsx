import { useState } from 'react'
import { useStore, uid } from '../store'
import type { QASignoff, Snag } from '../store/types'
import Modal from '../components/Modal'
import { Input, Select, Textarea, Field, Btn, Badge, Stat, Th, Td, PageHeader, EmptyRow, DeleteBtn } from '../components/ui'

const STAGES = ['Foundation','Framing','Cladding','Electrical','Final Handover'] as const
const QA_STATUS_COLOR = { pass:'green', fail:'red', pending:'amber' } as const
const SNAG_STATUS_COLOR = { open:'red', 'in-progress':'amber', complete:'green' } as const
const PRIORITY_COLOR = { low:'gray', medium:'blue', high:'red' } as const

function QAForm({ initial, projects, onSave, onCancel }: {
  initial?: QASignoff; projects: { id:string; client:string }[]
  onSave: (d: Omit<QASignoff,'id'>) => void; onCancel: () => void
}) {
  const [f, setF] = useState<Omit<QASignoff,'id'>>(initial ? { ...initial } : {
    projectId:'', stage:'Foundation', date: new Date().toISOString().slice(0,10),
    signedBy:'Ari', status:'pending', notes:'',
  })
  const s = <K extends keyof typeof f>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }))
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(f) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Project">
          <Select value={f.projectId} onChange={s('projectId')}>
            <option value="">— Select —</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.client}</option>)}
          </Select>
        </Field>
        <Field label="Stage"><Select value={f.stage} onChange={s('stage')}>{STAGES.map(st => <option key={st}>{st}</option>)}</Select></Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Date"><Input type="date" value={f.date} onChange={s('date')} /></Field>
        <Field label="Signed By"><Input value={f.signedBy} onChange={s('signedBy')} /></Field>
        <Field label="Result">
          <Select value={f.status} onChange={s('status')}>
            <option value="pending">Pending</option><option value="pass">Pass</option><option value="fail">Fail</option>
          </Select>
        </Field>
      </div>
      <Field label="Notes"><Textarea value={f.notes} onChange={s('notes')} /></Field>
      <div className="flex gap-3 pt-2 border-t border-[#1a2e40]">
        <Btn type="submit">{initial ? 'Save' : 'Add sign-off'}</Btn>
        <Btn variant="secondary" type="button" onClick={onCancel}>Cancel</Btn>
      </div>
    </form>
  )
}

function SnagForm({ initial, projects, onSave, onCancel }: {
  initial?: Snag; projects: { id:string; client:string }[]
  onSave: (d: Omit<Snag,'id'>) => void; onCancel: () => void
}) {
  const [f, setF] = useState<Omit<Snag,'id'>>(initial ? { ...initial } : {
    projectId:'', description:'', status:'open', priority:'medium',
    assignedTo:'', dateIdentified: new Date().toISOString().slice(0,10), notes:'',
  })
  const s = <K extends keyof typeof f>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }))
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(f) }} className="space-y-4">
      <Field label="Project">
        <Select value={f.projectId} onChange={s('projectId')}>
          <option value="">— Select —</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.client}</option>)}
        </Select>
      </Field>
      <Field label="Description" required><Textarea value={f.description} onChange={s('description')} required /></Field>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Status">
          <Select value={f.status} onChange={s('status')}>
            <option value="open">Open</option><option value="in-progress">In Progress</option><option value="complete">Complete</option>
          </Select>
        </Field>
        <Field label="Priority">
          <Select value={f.priority} onChange={s('priority')}>
            <option>low</option><option>medium</option><option>high</option>
          </Select>
        </Field>
        <Field label="Assigned To"><Input value={f.assignedTo} onChange={s('assignedTo')} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Date Identified"><Input type="date" value={f.dateIdentified} onChange={s('dateIdentified')} /></Field>
      </div>
      <Field label="Notes"><Textarea value={f.notes} onChange={s('notes')} /></Field>
      <div className="flex gap-3 pt-2 border-t border-[#1a2e40]">
        <Btn type="submit">{initial ? 'Save' : 'Add snag'}</Btn>
        <Btn variant="secondary" type="button" onClick={onCancel}>Cancel</Btn>
      </div>
    </form>
  )
}

export default function QAQC() {
  const { state, dispatch } = useStore()
  const [tab, setTab]         = useState<'signoffs'|'snags'>('signoffs')
  const [editQA, setEditQA]   = useState<QASignoff | null>(null)
  const [addQA, setAddQA]     = useState(false)
  const [editSnag, setEditSnag] = useState<Snag | null>(null)
  const [addSnag, setAddSnag] = useState(false)

  const projName = (id: string) => state.projects.find(p => p.id === id)?.client ?? id

  const saveQA = (d: Omit<QASignoff,'id'>) => {
    if (editQA) dispatch({ type:'UPD_QA', payload: { ...d, id: editQA.id } })
    else        dispatch({ type:'ADD_QA', payload: { ...d, id: uid() } })
    setEditQA(null); setAddQA(false)
  }
  const delQA = (id: string) => { if (confirm('Delete sign-off?')) dispatch({ type:'DEL_QA', payload: id }) }

  const saveSnag = (d: Omit<Snag,'id'>) => {
    if (editSnag) dispatch({ type:'UPD_SNAG', payload: { ...d, id: editSnag.id } })
    else          dispatch({ type:'ADD_SNAG', payload: { ...d, id: uid() } })
    setEditSnag(null); setAddSnag(false)
  }
  const delSnag = (id: string) => { if (confirm('Delete snag?')) dispatch({ type:'DEL_SNAG', payload: id }) }

  const openSnags = state.snags.filter(s => s.status !== 'complete').length
  const passRate  = state.qaSignoffs.length > 0 ? Math.round((state.qaSignoffs.filter(q => q.status === 'pass').length / state.qaSignoffs.length) * 100) : 0

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      <PageHeader title="QA / QC" sub="Quality assurance and snag tracking" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Sign-offs"   value={state.qaSignoffs.length} color="text-[#dce6f0]" />
        <Stat label="Pass Rate"   value={`${passRate}%`}          color={passRate >= 90 ? 'text-emerald-400' : 'text-amber-400'} />
        <Stat label="Open Snags"  value={openSnags}               color={openSnags > 0 ? 'text-red-400' : 'text-emerald-400'} />
        <Stat label="Total Snags" value={state.snags.length}      color="text-[#dce6f0]" />
      </div>

      <div className="flex gap-2 mb-5">
        {(['signoffs','snags'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`text-sm px-4 py-2 rounded-lg font-semibold transition-colors ${tab===t ? 'bg-[#c9a96e] text-[#07090c]' : 'bg-[#111e2b] text-[#8aa0b8] hover:bg-[#1a2e40]'}`}>
            {t === 'signoffs' ? 'QA Sign-offs' : 'Snag List'}
          </button>
        ))}
        {tab === 'signoffs' && <Btn onClick={() => setAddQA(true)} className="ml-auto">+ Add Sign-off</Btn>}
        {tab === 'snags'    && <Btn onClick={() => setAddSnag(true)} className="ml-auto">+ Add Snag</Btn>}
      </div>

      {tab === 'signoffs' && (
        <div className="bg-[#111e2b] border border-[#1a2e40] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-[#1a2e40]"><tr><Th>Project</Th><Th>Stage</Th><Th>Date</Th><Th>Signed By</Th><Th>Result</Th><Th>Notes</Th><Th></Th></tr></thead>
            <tbody>
              {state.qaSignoffs.length === 0 && <EmptyRow cols={7} />}
              {state.qaSignoffs.map(qa => (
                <tr key={qa.id} onClick={() => setEditQA(qa)} className="border-b border-[#1a2e40] hover:bg-[#0f1a26] transition-colors cursor-pointer">
                  <Td><span className="font-medium">{projName(qa.projectId)}</span></Td>
                  <Td><Badge color="gray">{qa.stage}</Badge></Td>
                  <Td className="text-xs text-[#8aa0b8]">{qa.date}</Td>
                  <Td className="text-xs text-[#8aa0b8]">{qa.signedBy}</Td>
                  <Td><Badge color={QA_STATUS_COLOR[qa.status]}>{qa.status}</Badge></Td>
                  <Td className="max-w-[250px]"><span className="truncate block text-xs text-[#8aa0b8]">{qa.notes}</span></Td>
                  <Td><DeleteBtn onClick={() => delQA(qa.id)} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'snags' && (
        <div className="bg-[#111e2b] border border-[#1a2e40] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-[#1a2e40]"><tr><Th>Project</Th><Th>Description</Th><Th>Status</Th><Th>Priority</Th><Th>Assigned</Th><Th>Raised</Th><Th></Th></tr></thead>
            <tbody>
              {state.snags.length === 0 && <EmptyRow cols={7} />}
              {state.snags.map(sn => (
                <tr key={sn.id} onClick={() => setEditSnag(sn)} className="border-b border-[#1a2e40] hover:bg-[#0f1a26] transition-colors cursor-pointer">
                  <Td><span className="font-medium">{projName(sn.projectId)}</span></Td>
                  <Td className="max-w-[280px]"><span className="text-xs text-[#8aa0b8] block">{sn.description}</span></Td>
                  <Td><Badge color={SNAG_STATUS_COLOR[sn.status]}>{sn.status.replace('-',' ')}</Badge></Td>
                  <Td><Badge color={PRIORITY_COLOR[sn.priority]}>{sn.priority}</Badge></Td>
                  <Td className="text-xs text-[#8aa0b8]">{sn.assignedTo}</Td>
                  <Td className="text-xs text-[#445a70]">{sn.dateIdentified}</Td>
                  <Td><DeleteBtn onClick={() => delSnag(sn.id)} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(addQA || editQA) && (
        <Modal title={editQA ? 'Edit Sign-off' : 'QA Sign-off'} onClose={() => { setAddQA(false); setEditQA(null) }}>
          <QAForm initial={editQA ?? undefined} projects={state.projects} onSave={saveQA} onCancel={() => { setAddQA(false); setEditQA(null) }} />
        </Modal>
      )}
      {(addSnag || editSnag) && (
        <Modal title={editSnag ? 'Edit Snag' : 'Add Snag'} onClose={() => { setAddSnag(false); setEditSnag(null) }}>
          <SnagForm initial={editSnag ?? undefined} projects={state.projects} onSave={saveSnag} onCancel={() => { setAddSnag(false); setEditSnag(null) }} />
        </Modal>
      )}
    </div>
  )
}
