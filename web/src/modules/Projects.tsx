import { useState } from 'react'
import { useStore, uid } from '../store'
import type { Project, ProjectStatus, ProductType, CustomFieldDef, FieldType } from '../store/types'
import Modal from '../components/Modal'
import { Input, Select, Textarea, Field, Btn, Badge, Stat, Th, Td, PageHeader, EmptyRow, DeleteBtn, formatZAR } from '../components/ui'

// ─── constants ───────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<ProjectStatus, 'blue'|'gold'|'amber'|'green'> = {
  planning:'blue', 'in-progress':'gold', qa:'amber', complete:'green',
}

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text:'Text', number:'Number', date:'Date', textarea:'Long text',
  select:'Dropdown', url:'URL / Link', checkbox:'Checkbox',
}

const SECTION_COLORS: Record<string, string> = {
  Team: 'text-blue-400', Product: 'text-[#c9a96e]', Sales: 'text-purple-400',
  Site: 'text-emerald-400', Compliance: 'text-amber-400', Other: 'text-[#8aa0b8]',
}

// ─── inline field input renderer ─────────────────────────────────────────────

function FieldInput({ def, value, onChange }: { def: CustomFieldDef; value: string; onChange: (v: string) => void }) {
  switch (def.type) {
    case 'textarea':
      return <Textarea value={value} onChange={e => onChange(e.target.value)} rows={2} placeholder={def.label} />
    case 'select':
      return (
        <Select value={value} onChange={e => onChange(e.target.value)}>
          <option value="">— Select —</option>
          {def.options.map(o => <option key={o}>{o}</option>)}
        </Select>
      )
    case 'checkbox':
      return (
        <label className="flex items-center gap-2 cursor-pointer mt-1">
          <input type="checkbox" checked={value === 'true'}
            onChange={e => onChange(e.target.checked ? 'true' : '')}
            className="w-4 h-4 rounded accent-[#c9a96e]" />
          <span className="text-sm text-[#8aa0b8]">{def.label}</span>
        </label>
      )
    default:
      return <Input type={def.type as 'text'|'number'|'date'|'url'} value={value} onChange={e => onChange(e.target.value)} placeholder={def.type === 'url' ? 'https://' : def.label} />
  }
}

// ─── mini field builder ───────────────────────────────────────────────────────

interface NewFieldState { label: string; type: FieldType; required: boolean; options: string; section: string }

function FieldBuilder({ editTarget, onSave, onCancel }: {
  editTarget?: CustomFieldDef
  onSave: (data: Omit<CustomFieldDef,'id'|'order'>) => void
  onCancel: () => void
}) {
  const [f, setF] = useState<NewFieldState>({
    label:   editTarget?.label   ?? '',
    type:    editTarget?.type    ?? 'text',
    required:editTarget?.required?? false,
    options: editTarget?.options.join(', ') ?? '',
    section: editTarget?.section ?? 'Other',
  })

  return (
    <div className="bg-[#0a1018] border border-[#c9a96e]/30 rounded-xl p-4 mt-3 space-y-3">
      <p className="text-[10px] font-bold text-[#c9a96e] uppercase tracking-widest mb-1">
        {editTarget ? 'Edit field' : 'New custom field'}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Label *">
          <Input autoFocus value={f.label} onChange={e => setF(p => ({ ...p, label: e.target.value }))} placeholder="e.g. Architect" />
        </Field>
        <Field label="Type">
          <Select value={f.type} onChange={e => setF(p => ({ ...p, type: e.target.value as FieldType }))}>
            {(Object.entries(FIELD_TYPE_LABELS) as [FieldType, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
        </Field>
      </div>

      {f.type === 'select' && (
        <Field label="Options (comma-separated)">
          <Input value={f.options} onChange={e => setF(p => ({ ...p, options: e.target.value }))} placeholder="Option A, Option B, Option C" />
        </Field>
      )}

      <div className="grid grid-cols-2 gap-3 items-end">
        <Field label="Section / Group">
          <Select value={f.section} onChange={e => setF(p => ({ ...p, section: e.target.value }))}>
            {['Team','Product','Sales','Site','Compliance','Other'].map(s => <option key={s}>{s}</option>)}
          </Select>
        </Field>
        <label className="flex items-center gap-2 cursor-pointer pb-2">
          <input type="checkbox" checked={f.required} onChange={e => setF(p => ({ ...p, required: e.target.checked }))} className="accent-[#c9a96e]" />
          <span className="text-xs text-[#8aa0b8]">Required</span>
        </label>
      </div>

      <div className="flex gap-2 pt-1">
        <Btn size="sm" type="button"
          onClick={() => f.label.trim() && onSave({
            label: f.label.trim(),
            type: f.type,
            required: f.required,
            options: f.options.split(',').map(s => s.trim()).filter(Boolean),
            section: f.section,
          })}
          disabled={!f.label.trim()}>
          {editTarget ? 'Save field' : 'Add field'}
        </Btn>
        <Btn size="sm" variant="secondary" type="button" onClick={onCancel}>Cancel</Btn>
      </div>
    </div>
  )
}

// ─── custom fields panel ──────────────────────────────────────────────────────

function CustomFieldsPanel({
  defs, values, onChange
}: {
  defs: CustomFieldDef[]
  values: Record<string, string>
  onChange: (id: string, v: string) => void
}) {
  const { dispatch } = useStore()
  const [showBuilder, setShowBuilder] = useState(false)
  const [editingDef, setEditingDef]   = useState<CustomFieldDef | null>(null)

  const addDef = (data: Omit<CustomFieldDef,'id'|'order'>) => {
    dispatch({ type: 'ADD_FIELD_DEF', payload: { ...data, id: uid(), order: defs.length } })
    setShowBuilder(false)
  }

  const updDef = (data: Omit<CustomFieldDef,'id'|'order'>) => {
    if (!editingDef) return
    dispatch({ type: 'UPD_FIELD_DEF', payload: { ...data, id: editingDef.id, order: editingDef.order } })
    setEditingDef(null)
  }

  const delDef = (id: string) => {
    if (confirm('Remove this field from all projects?')) dispatch({ type: 'DEL_FIELD_DEF', payload: id })
  }

  const moveUp = (def: CustomFieldDef) => {
    const sorted = [...defs].sort((a,b) => a.order - b.order)
    const idx = sorted.findIndex(d => d.id === def.id)
    if (idx === 0) return
    const reordered = sorted.map((d, i) => ({
      ...d,
      order: i === idx ? sorted[idx-1].order : i === idx-1 ? sorted[idx].order : d.order,
    }))
    dispatch({ type: 'REORDER_FIELDS', payload: reordered })
  }

  const moveDown = (def: CustomFieldDef) => {
    const sorted = [...defs].sort((a,b) => a.order - b.order)
    const idx = sorted.findIndex(d => d.id === def.id)
    if (idx === sorted.length - 1) return
    const reordered = sorted.map((d, i) => ({
      ...d,
      order: i === idx ? sorted[idx+1].order : i === idx+1 ? sorted[idx].order : d.order,
    }))
    dispatch({ type: 'REORDER_FIELDS', payload: reordered })
  }

  const sorted = [...defs].sort((a,b) => a.order - b.order)

  // Group by section
  const sections = sorted.reduce<Record<string, CustomFieldDef[]>>((acc, d) => {
    const s = d.section || 'Other'
    if (!acc[s]) acc[s] = []
    acc[s].push(d)
    return acc
  }, {})

  return (
    <div className="mt-6 pt-5 border-t border-[#1a2e40]">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-bold text-[#8aa0b8] uppercase tracking-widest">Custom Fields</p>
        <button type="button" onClick={() => { setShowBuilder(true); setEditingDef(null) }}
          className="text-xs text-[#c9a96e] hover:text-[#e8c98a] transition-colors font-semibold">
          + Add field
        </button>
      </div>

      {sorted.length === 0 && !showBuilder && (
        <p className="text-xs text-[#445a70] italic mb-3">
          No custom fields yet. Click <span className="text-[#c9a96e]">+ Add field</span> to build your form.
        </p>
      )}

      {Object.entries(sections).map(([section, fields]) => (
        <div key={section} className="mb-5">
          <p className={`text-[9px] font-bold uppercase tracking-widest mb-3 ${SECTION_COLORS[section] ?? 'text-[#8aa0b8]'}`}>
            {section}
          </p>
          <div className="space-y-3">
            {fields.map(def => (
              <div key={def.id}>
                {editingDef?.id === def.id ? (
                  <FieldBuilder editTarget={def} onSave={updDef} onCancel={() => setEditingDef(null)} />
                ) : (
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5 group">
                      <label className="text-[10px] font-bold text-[#8aa0b8] uppercase tracking-widest flex-1">
                        {def.label}{def.required && <span className="text-[#c9a96e] ml-0.5">*</span>}
                      </label>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1a2e40] text-[#445a70]">
                        {FIELD_TYPE_LABELS[def.type]}
                      </span>
                      <button type="button" onClick={() => moveUp(def)}   title="Move up"   className="text-[#445a70] hover:text-[#dce6f0] text-[10px] px-0.5">↑</button>
                      <button type="button" onClick={() => moveDown(def)} title="Move down" className="text-[#445a70] hover:text-[#dce6f0] text-[10px] px-0.5">↓</button>
                      <button type="button" onClick={() => { setEditingDef(def); setShowBuilder(false) }}
                        className="text-[#445a70] hover:text-[#c9a96e] transition-colors text-xs p-0.5" title="Edit field">
                        ✎
                      </button>
                      <DeleteBtn onClick={() => delDef(def.id)} />
                    </div>
                    {def.type !== 'checkbox' ? (
                      <FieldInput def={def} value={values?.[def.id] ?? ''} onChange={v => onChange(def.id, v)} />
                    ) : (
                      <FieldInput def={def} value={values?.[def.id] ?? ''} onChange={v => onChange(def.id, v)} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {showBuilder && !editingDef && (
        <FieldBuilder onSave={addDef} onCancel={() => setShowBuilder(false)} />
      )}
    </div>
  )
}

// ─── project form ─────────────────────────────────────────────────────────────

const EMPTY: Omit<Project,'id'> = {
  client:'', location:'', product:'', type:'sauna', value:0, status:'planning',
  progress:0, stage:'', manager:'Ari', startDate:'', endDate:'', customFields:{},
}

function ProjectForm({ initial, onSave, onCancel }: {
  initial?: Project
  onSave: (d: Omit<Project,'id'>) => void
  onCancel: () => void
}) {
  const { state } = useStore()
  const [f, setF] = useState<Omit<Project,'id'>>(
    initial ? { ...initial, customFields: initial.customFields ?? {} } : EMPTY
  )

  const s = <K extends keyof typeof f>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setF(p => ({ ...p, [k]: k === 'value' || k === 'progress' ? +e.target.value : e.target.value }))

  const setCustom = (id: string, v: string) =>
    setF(p => ({ ...p, customFields: { ...(p.customFields ?? {}), [id]: v } }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(f) }} className="space-y-4">
      {/* Core fields */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Client" required><Input value={f.client} onChange={s('client')} required autoFocus /></Field>
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

      {/* Custom fields panel with inline builder */}
      <CustomFieldsPanel
        defs={state.customFieldDefs}
        values={f.customFields ?? {}}
        onChange={setCustom}
      />

      <div className="flex gap-3 pt-2 border-t border-[#1a2e40]">
        <Btn type="submit">{initial ? 'Save changes' : 'Add project'}</Btn>
        <Btn variant="secondary" type="button" onClick={onCancel}>Cancel</Btn>
      </div>
    </form>
  )
}

// ─── module page ──────────────────────────────────────────────────────────────

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

  const visibleDefs = [...state.customFieldDefs].sort((a,b) => a.order - b.order).slice(0, 2)

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      <PageHeader
        title="Projects"
        sub={`${state.projects.length} total · ${state.customFieldDefs.length} custom fields`}
        action={<Btn onClick={() => setAdding(true)}>+ New Project</Btn>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total Value"  value={formatZAR(totalVal)} color="text-[#c9a96e]" />
        <Stat label="Active"       value={active}              color="text-[#dce6f0]" />
        <Stat label="Delivered"    value={complete}            color="text-emerald-400" />
        <Stat label="In Planning"  value={state.projects.filter(p=>p.status==='planning').length} color="text-blue-400" />
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
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
              <tr>
                <Th>Client</Th><Th>Location</Th><Th>Status</Th><Th>Progress</Th><Th>Value</Th>
                {visibleDefs.map(d => <Th key={d.id}>{d.label}</Th>)}
                <Th>End</Th><Th></Th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && <EmptyRow cols={7 + visibleDefs.length} />}
              {items.map(p => (
                <tr key={p.id} onClick={() => setEditing(p)} className="border-b border-[#1a2e40] hover:bg-[#0f1a26] transition-colors cursor-pointer">
                  <Td>
                    <p className="font-medium text-[#dce6f0]">{p.client}</p>
                    <p className="text-[10px] text-[#445a70] mt-0.5">{p.product.slice(0,40)}{p.product.length > 40 ? '…' : ''}</p>
                  </Td>
                  <Td className="text-xs text-[#8aa0b8]">{p.location}</Td>
                  <Td><Badge color={STATUS_COLOR[p.status]}>{p.status.replace('-',' ')}</Badge></Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#1a2e40] rounded-full overflow-hidden">
                        <div className="h-full bg-[#c9a96e] rounded-full" style={{ width:`${p.progress}%` }} />
                      </div>
                      <span className="text-xs text-[#8aa0b8]">{p.progress}%</span>
                    </div>
                  </Td>
                  <Td className="font-semibold text-[#c9a96e]">{formatZAR(p.value)}</Td>
                  {visibleDefs.map(d => (
                    <Td key={d.id} className="text-xs text-[#8aa0b8] max-w-[120px]">
                      {d.type === 'checkbox'
                        ? (p.customFields?.[d.id] === 'true' ? <Badge color="green">Yes</Badge> : <span className="text-[#445a70]">—</span>)
                        : <span className="truncate block">{p.customFields?.[d.id] || '—'}</span>}
                    </Td>
                  ))}
                  <Td className="text-xs text-[#445a70]">{p.endDate}</Td>
                  <Td><DeleteBtn onClick={() => del(p.id)} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(adding || editing) && (
        <Modal
          title={editing ? `Edit — ${editing.client}` : 'New Project'}
          onClose={() => { setAdding(false); setEditing(null) }}
          wide
        >
          <ProjectForm initial={editing ?? undefined} onSave={save} onCancel={() => { setAdding(false); setEditing(null) }} />
        </Modal>
      )}
    </div>
  )
}
