import { useState } from 'react'
import { useStore, uid } from '../store'
import type { SiteVisit } from '../store/types'
import Modal from '../components/Modal'
import { Input, Select, Textarea, Field, Btn, Badge, Stat, Th, Td, PageHeader, EmptyRow, DeleteBtn } from '../components/ui'

const TYPES = ['measurement','installation','inspection','handover','client-meeting'] as const
const TYPE_COLOR = { measurement:'blue', installation:'gold', inspection:'amber', handover:'green', 'client-meeting':'purple' } as const

const EMPTY: Omit<SiteVisit,'id'> = {
  projectId:'', client:'', date: new Date().toISOString().slice(0,10),
  type:'installation', team:'Ari', duration:4, notes:'', followUp:false,
}

function Form({ initial, projects, onSave, onCancel }: {
  initial?: SiteVisit
  projects: { id: string; client: string; location: string }[]
  onSave: (d: Omit<SiteVisit,'id'>) => void
  onCancel: () => void
}) {
  const [f, setF] = useState<Omit<SiteVisit,'id'>>(initial ? { ...initial } : EMPTY)
  const s = <K extends keyof typeof f>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF(p => ({ ...p, [k]: k === 'duration' ? +e.target.value : e.target.value }))

  const pickProject = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const proj = projects.find(p => p.id === e.target.value)
    setF(prev => ({ ...prev, projectId: e.target.value, client: proj?.client ?? prev.client }))
  }

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(f) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Project">
          <Select value={f.projectId} onChange={pickProject}>
            <option value="">— Select project —</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.client}</option>)}
          </Select>
        </Field>
        <Field label="Client"><Input value={f.client} onChange={s('client')} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Date" required><Input type="date" value={f.date} onChange={s('date')} required /></Field>
        <Field label="Visit Type">
          <Select value={f.type} onChange={s('type')}>{TYPES.map(t => <option key={t}>{t}</option>)}</Select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Team"><Input value={f.team} onChange={s('team')} placeholder="Ari + Simon" /></Field>
        <Field label="Duration (hours)"><Input type="number" min={0.5} step={0.5} value={f.duration} onChange={s('duration')} /></Field>
      </div>
      <Field label="Notes"><Textarea value={f.notes} onChange={s('notes')} rows={4} /></Field>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={f.followUp} onChange={e => setF(p => ({ ...p, followUp: e.target.checked }))}
          className="w-4 h-4 rounded border-[#1a2e40] accent-[#c9a96e]" />
        <span className="text-sm text-[#8aa0b8]">Follow-up required</span>
      </label>
      <div className="flex gap-3 pt-2 border-t border-[#1a2e40]">
        <Btn type="submit">{initial ? 'Save changes' : 'Log visit'}</Btn>
        <Btn variant="secondary" type="button" onClick={onCancel}>Cancel</Btn>
      </div>
    </form>
  )
}

export default function SiteVisits() {
  const { state, dispatch } = useStore()
  const [editing, setEditing] = useState<SiteVisit | null>(null)
  const [adding, setAdding]   = useState(false)

  const sorted = [...state.siteVisits].sort((a, b) => b.date.localeCompare(a.date))
  const followUps = state.siteVisits.filter(v => v.followUp).length
  const totalHours = state.siteVisits.reduce((s, v) => s + v.duration, 0)

  const save = (data: Omit<SiteVisit,'id'>) => {
    if (editing) dispatch({ type:'UPD_VISIT', payload: { ...data, id: editing.id } })
    else         dispatch({ type:'ADD_VISIT', payload: { ...data, id: uid() } })
    setEditing(null); setAdding(false)
  }
  const del = (id: string) => { if (confirm('Delete visit?')) dispatch({ type:'DEL_VISIT', payload: id }) }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      <PageHeader title="Site Visits" sub={`${state.siteVisits.length} logged`} action={<Btn onClick={() => setAdding(true)}>+ Log Visit</Btn>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total Visits"    value={state.siteVisits.length} color="text-[#dce6f0]" />
        <Stat label="Hours on Site"   value={`${totalHours}h`}        color="text-[#c9a96e]" />
        <Stat label="Follow-ups Due"  value={followUps}               color={followUps > 0 ? 'text-amber-400' : 'text-emerald-400'} />
        <Stat label="This Month"      value={state.siteVisits.filter(v => v.date.startsWith('2026-06')).length} color="text-[#dce6f0]" />
      </div>

      <div className="bg-[#111e2b] border border-[#1a2e40] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[#1a2e40]">
              <tr><Th>Date</Th><Th>Client</Th><Th>Type</Th><Th>Team</Th><Th>Duration</Th><Th>Follow-up</Th><Th>Notes</Th><Th></Th></tr>
            </thead>
            <tbody>
              {sorted.length === 0 && <EmptyRow cols={8} />}
              {sorted.map(v => (
                <tr key={v.id} onClick={() => setEditing(v)} className="border-b border-[#1a2e40] hover:bg-[#0f1a26] transition-colors cursor-pointer">
                  <Td className="text-[#c9a96e] font-medium whitespace-nowrap">{v.date}</Td>
                  <Td><span className="font-medium">{v.client}</span></Td>
                  <Td><Badge color={TYPE_COLOR[v.type]}>{v.type.replace('-', ' ')}</Badge></Td>
                  <Td className="text-[#8aa0b8] text-xs">{v.team}</Td>
                  <Td className="text-[#8aa0b8] text-xs">{v.duration}h</Td>
                  <Td>{v.followUp ? <Badge color="amber">Required</Badge> : <span className="text-xs text-[#445a70]">—</span>}</Td>
                  <Td className="max-w-[300px]"><span className="truncate block text-xs text-[#8aa0b8]">{v.notes}</span></Td>
                  <Td><DeleteBtn onClick={() => del(v.id)} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(adding || editing) && (
        <Modal title={editing ? 'Edit Visit' : 'Log Site Visit'} onClose={() => { setAdding(false); setEditing(null) }}>
          <Form initial={editing ?? undefined} projects={state.projects} onSave={save} onCancel={() => { setAdding(false); setEditing(null) }} />
        </Modal>
      )}
    </div>
  )
}
