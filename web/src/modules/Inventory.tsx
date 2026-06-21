import { useState } from 'react'
import { useStore, uid } from '../store'
import type { InventoryItem } from '../store/types'
import Modal from '../components/Modal'
import { Input, Select, Field, Btn, Badge, Stat, Th, Td, PageHeader, EmptyRow, DeleteBtn, formatZAR } from '../components/ui'

const CATS = ['timber','hardware','electrical','plumbing','insulation','stoves','accessories','tools'] as const
const UNITS = ['pcs','m','m²','kg','L','sets'] as const

const EMPTY: Omit<InventoryItem,'id'> = {
  name:'', sku:'', category:'timber', unit:'pcs', qty:0, minQty:0, costPrice:0, supplier:'', location:'',
}

function Form({ initial, onSave, onCancel }: { initial?: InventoryItem; onSave: (d: Omit<InventoryItem,'id'>) => void; onCancel: () => void }) {
  const [f, setF] = useState<Omit<InventoryItem,'id'>>(initial ? { ...initial } : EMPTY)
  const s = <K extends keyof typeof f>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF(p => ({ ...p, [k]: ['qty','minQty','costPrice'].includes(k as string) ? +e.target.value : e.target.value }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(f) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Item Name" required><Input value={f.name} onChange={s('name')} required /></Field>
        <Field label="SKU"><Input value={f.sku} onChange={s('sku')} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category">
          <Select value={f.category} onChange={s('category')}>{CATS.map(c=><option key={c}>{c}</option>)}</Select>
        </Field>
        <Field label="Unit">
          <Select value={f.unit} onChange={s('unit')}>{UNITS.map(u=><option key={u}>{u}</option>)}</Select>
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Qty on Hand"><Input type="number" min={0} value={f.qty} onChange={s('qty')} /></Field>
        <Field label="Min Stock"><Input type="number" min={0} value={f.minQty} onChange={s('minQty')} /></Field>
        <Field label="Cost Price (R)"><Input type="number" min={0} value={f.costPrice} onChange={s('costPrice')} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Supplier"><Input value={f.supplier} onChange={s('supplier')} /></Field>
        <Field label="Location"><Input value={f.location} onChange={s('location')} /></Field>
      </div>
      <div className="flex gap-3 pt-2 border-t border-[#1a2e40]">
        <Btn type="submit">{initial ? 'Save changes' : 'Add item'}</Btn>
        <Btn variant="secondary" type="button" onClick={onCancel}>Cancel</Btn>
      </div>
    </form>
  )
}

export default function Inventory() {
  const { state, dispatch } = useStore()
  const [editing, setEditing] = useState<InventoryItem | null>(null)
  const [adding, setAdding]   = useState(false)
  const [search, setSearch]   = useState('')
  const [cat, setCat]         = useState<string>('all')

  const items = state.inventory
    .filter(i => cat === 'all' || i.category === cat)
    .filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase()))

  const lowStock = state.inventory.filter(i => i.qty <= i.minQty)
  const totalValue = state.inventory.reduce((s, i) => s + i.qty * i.costPrice, 0)

  const save = (data: Omit<InventoryItem,'id'>) => {
    if (editing) dispatch({ type:'UPD_INVENTORY', payload: { ...data, id: editing.id } })
    else         dispatch({ type:'ADD_INVENTORY', payload: { ...data, id: uid() } })
    setEditing(null); setAdding(false)
  }

  const del = (id: string) => { if (confirm('Delete item?')) dispatch({ type:'DEL_INVENTORY', payload: id }) }

  const adjustQty = (item: InventoryItem, delta: number) => {
    dispatch({ type:'UPD_INVENTORY', payload: { ...item, qty: Math.max(0, item.qty + delta) } })
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      <PageHeader title="Inventory & Stock" sub={`${state.inventory.length} items`} action={<Btn onClick={() => setAdding(true)}>+ Add Item</Btn>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total Items"   value={state.inventory.length} color="text-[#dce6f0]" />
        <Stat label="Stock Value"   value={formatZAR(totalValue)}  color="text-[#c9a96e]" />
        <Stat label="Low Stock"     value={lowStock.length}        color={lowStock.length > 0 ? 'text-red-400' : 'text-emerald-400'} sub={lowStock.length > 0 ? 'needs reorder' : 'all stocked'} />
        <Stat label="Suppliers"     value={new Set(state.inventory.map(i => i.supplier)).size} color="text-[#dce6f0]" />
      </div>

      {lowStock.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="text-red-400 text-lg">⚠</span>
          <div>
            <p className="text-sm font-semibold text-red-400 mb-1">Low stock alert</p>
            <p className="text-xs text-[#8aa0b8]">{lowStock.map(i => i.name).join(' · ')}</p>
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-4 flex-wrap">
        <Input className="max-w-xs" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} />
        <Select value={cat} onChange={e => setCat(e.target.value)} style={{ maxWidth: 160 }}>
          <option value="all">All categories</option>
          {CATS.map(c => <option key={c}>{c}</option>)}
        </Select>
      </div>

      <div className="bg-[#111e2b] border border-[#1a2e40] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[#1a2e40]">
              <tr><Th>Item</Th><Th>SKU</Th><Th>Category</Th><Th>Qty</Th><Th>Min</Th><Th>Status</Th><Th>Cost</Th><Th>Stock Value</Th><Th>Supplier</Th><Th>Location</Th><Th></Th></tr>
            </thead>
            <tbody>
              {items.length === 0 && <EmptyRow cols={11} />}
              {items.map(i => {
                const low = i.qty <= i.minQty
                return (
                  <tr key={i.id} onClick={() => setEditing(i)} className="border-b border-[#1a2e40] hover:bg-[#0f1a26] transition-colors cursor-pointer">
                    <Td><span className="font-medium">{i.name}</span></Td>
                    <Td className="text-[#445a70] text-xs font-mono">{i.sku}</Td>
                    <Td><Badge color="gray">{i.category}</Badge></Td>
                    <Td>
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <button onClick={() => adjustQty(i, -1)} className="w-5 h-5 rounded bg-[#1a2e40] text-[#8aa0b8] hover:text-[#dce6f0] text-xs flex items-center justify-center">−</button>
                        <span className={`text-sm font-semibold w-8 text-center ${low ? 'text-red-400' : 'text-[#dce6f0]'}`}>{i.qty}</span>
                        <button onClick={() => adjustQty(i, 1)}  className="w-5 h-5 rounded bg-[#1a2e40] text-[#8aa0b8] hover:text-[#dce6f0] text-xs flex items-center justify-center">+</button>
                      </div>
                    </Td>
                    <Td className="text-[#445a70] text-xs">{i.minQty}</Td>
                    <Td><Badge color={low ? 'red' : 'green'}>{low ? 'Low' : 'OK'}</Badge></Td>
                    <Td className="text-xs text-[#8aa0b8]">R{i.costPrice.toLocaleString()}/{i.unit}</Td>
                    <Td className="text-[#c9a96e] text-sm font-medium">{formatZAR(i.qty * i.costPrice)}</Td>
                    <Td className="text-xs text-[#8aa0b8]">{i.supplier}</Td>
                    <Td className="text-xs text-[#445a70]">{i.location}</Td>
                    <Td><DeleteBtn onClick={() => del(i.id)} /></Td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {(adding || editing) && (
        <Modal title={editing ? `Edit — ${editing.name}` : 'Add Inventory Item'} onClose={() => { setAdding(false); setEditing(null) }}>
          <Form initial={editing ?? undefined} onSave={save} onCancel={() => { setAdding(false); setEditing(null) }} />
        </Modal>
      )}
    </div>
  )
}
