import { useState } from 'react'
import { useStore, uid } from '../store'
import type { Project, ProjectStatus, ProductType } from '../store/types'
import Modal from '../components/Modal'
import { Input, Select, Field, Btn, Badge, Stat, Th, Td, PageHeader, EmptyRow, DeleteBtn, formatZAR } from '../components/ui'

const STATUS_COLOR: Record<ProjectStatus, 'blue'|'gold'|'amber'|'green'> = {
  planning: 'blue', 'in-progress': 'gold', qa: 'amber', complete: 'green',
}

const EMPTY: Omit<Project, 'id'> = {
  client:'', location:'', product:'', type:'sauna', value:0, status:'planning',
  progress:0, stage:'', manager:'Ari', startDate:'', endDate:'',
}

function Form({ initial, onSave, onCancel }: { initial?: Project; onSave: (d: Omit<Project,'id'>) => void; onCancel: () => void }) {
  const [f, setF] = useState<Omit<Project,'id'>>(initial ? { ...initial } : EMPTY)
  const s = <K extends keyof typeof f>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF(p => ({ ...p, [k]: k === 'value' || k === 'progress' ? +e.target.value : e.target.value }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(f) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Client" required><Input value={f.client} onChange={s('client')} required /></Field>
        <Field label="Location"><Input value={f.location} onChange={s('location')} /></Field>
      </div>
      <Field label="Product / Scope"><Input value={f.product} onChange={s('product')} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Type">
          <Select value={f.type} onChange={s('type')}>
            {(['sauna','cold-plunge','hot-tub','pavilion','steam'] as ProductType[]).map(t => <option key={t}>{t}</option>)}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={f.status} onChange={s('status')}>
            {(['planning','in-progress','qa','complete'] as ProjectStatus[]).map(t => <option key={t}>{t}</option>)}
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Value (R)"><Input type="number" value={f.value} onChange={s('value')} /></Field>
        <Field label="Progress %"><Input type="number" min={0} max={100} value={f.progress} onChange={s('progress')} /></Field>
        <Field label="Stage"><Input value={f.stage} onChange={s('stage')} /></Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Manager"><Input value={f.manager} onChange={s('manager')} /></Field>
        <Field label="Start Date"><Input type="date" value={f.startDate} onChange={s('startDate')} /></Field>
        <Field label="End Date"><Input type="date" value={f.endDate} onChange={s('endDate')} /></Field>
      </div>
      <div className="flex gap-3 pt-2 border-t border-[#1a2e40]">
        <Btn type="submit">{initial ? 'Save changes' : 'Add project'}</Btn>
        <Btn variant="secondary" type="button" onClick={onCancel}>Cancel</Btn>
      </div>
    </form>
  )
}

export default function Projects() {
  const { state, dispatch } = useStore()
  const [editing, setEditing] = useState<Project | null>(null)
  const [adding, setAdding]   = useState(false)
  const [filter, setFilter]   = useState<ProjectStatus | 'all'>('all')

  const items = filter === 'all' ? state.projects : state.projects.filter(p => p.status === filter)

  const save = (data: Omit<Project,'id'>) => {
    if (editing) dispatch({ type:'UPD_PROJECT', payload: { ...data, id: editing.id } })
    else         dispatch({ type:'ADD_PROJECT', payload: { ...data, id: uid() } })
    setEditing(null); setAdding(false)
  }

  const del = (id: string) => { if (confirm('Delete project?')) dispatch({ type:'DEL_PROJECT', payload: id }) }

  const totalVal = state.projects.reduce((s, p) => s + p.value, 0)
  const active   = state.projects.filter(p => p.status === 'in-progress' || p.status === 'qa').length
  const complete = state.projects.filter(p => p.status === 'complete').length

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      <PageHeader title="Projects" sub={`${state.projects.length} total`} action={<Btn onClick={() => setAdding(true)}>+ New Project</Btn>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total Value"   value={formatZAR(totalVal)} color="text-[#c9a96e]" />
        <Stat label="Active"        value={active}              color="text-[#dce6f0]" />
        <Stat label="Delivered"     value={complete}            color="text-emerald-400" />
        <Stat label="In Planning"   value={state.projects.filter(p=>p.status==='planning').length} color="text-blue-400" />
      </div>

      <div className="flex gap-2 mb-4">
        {(['all','planning','in-progress','qa','complete'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${filter===s ? 'bg-[#c9a96e] text-[#07090c]' : 'bg-[#111e2b] text-[#8aa0b8] hover:bg-[#1a2e40]'}`}>
            {s === 'all' ? 'All' : s.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="bg-[#111e2b] border border-[#1a2e40] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[#1a2e40]">
              <tr><Th>Client</Th><Th>Location</Th><Th>Product</Th><Th>Status</Th><Th>Progress</Th><Th>Value</Th><Th>End Date</Th><Th></Th></tr>
            </thead>
            <tbody>
              {items.length === 0 && <EmptyRow cols={8} />}
              {items.map(p => (
                <tr key={p.id} onClick={() => setEditing(p)} className="border-b border-[#1a2e40] hover:bg-[#0f1a26] transition-colors cursor-pointer">
                  <Td><span className="font-medium">{p.client}</span></Td>
                  <Td className="text-[#8aa0b8]">{p.location}</Td>
                  <Td className="max-w-[200px]"><span className="truncate block text-[#8aa0b8] text-xs">{p.product}</span></Td>
                  <Td><Badge color={STATUS_COLOR[p.status]}>{p.status.replace('-',' ')}</Badge></Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-[#1a2e40] rounded-full overflow-hidden">
                        <div className="h-full bg-[#c9a96e] rounded-full" style={{ width:`${p.progress}%` }} />
                      </div>
                      <span className="text-xs text-[#8aa0b8]">{p.progress}%</span>
                    </div>
                  </Td>
                  <Td className="font-medium text-[#c9a96e]">{formatZAR(p.value)}</Td>
                  <Td className="text-[#8aa0b8] text-xs">{p.endDate}</Td>
                  <Td><DeleteBtn onClick={() => del(p.id)} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(adding || editing) && (
        <Modal title={editing ? `Edit — ${editing.client}` : 'New Project'} onClose={() => { setAdding(false); setEditing(null) }}>
          <Form initial={editing ?? undefined} onSave={save} onCancel={() => { setAdding(false); setEditing(null) }} />
        </Modal>
      )}
    </div>
  )
}
