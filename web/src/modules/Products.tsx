import { useState } from 'react'
import { useStore, uid } from '../store'
import type { Product, ProductCategory } from '../store/types'
import Modal from '../components/Modal'
import { Input, Select, Textarea, Field, Btn, Badge, Stat, Th, Td, PageHeader, EmptyRow, DeleteBtn, formatZAR } from '../components/ui'

const CATS: ProductCategory[] = ['cold','hot','hybrid','sauna','ark','steam','accessory']
const CAT_LABELS: Record<ProductCategory, string> = {
  cold:'Cold Plunge', hot:'Hot Tub', hybrid:'Hybrid', sauna:'Sauna', ark:'ARK Series', steam:'Steam', accessory:'Accessory',
}
const CAT_COLOR: Record<ProductCategory, 'blue'|'red'|'purple'|'gold'|'green'|'sky'|'gray'> = {
  cold:'blue', hot:'red', hybrid:'purple', sauna:'gold', ark:'green', steam:'sky', accessory:'gray',
}
const CAT_ICON: Record<ProductCategory, string> = {
  cold:'❄️', hot:'♨️', hybrid:'🔄', sauna:'🪵', ark:'🏕️', steam:'💨', accessory:'🔩',
}

const EMPTY: Omit<Product,'id'> = {
  name:'', category:'cold', description:'', priceZAR:0, supplier:'', leadTimeWeeks:10, status:'available', notes:'',
}

function ProductForm({ initial, suppliers, onSave, onCancel }: {
  initial?: Product; suppliers: string[]
  onSave:(d:Omit<Product,'id'>)=>void; onCancel:()=>void
}) {
  const [f, setF] = useState<Omit<Product,'id'>>(initial ? { ...initial } : EMPTY)
  const s = <K extends keyof typeof f>(k:K) => (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setF(p=>({ ...p, [k]: (k==='priceZAR'||k==='leadTimeWeeks') ? +e.target.value : e.target.value }))

  return (
    <form onSubmit={e=>{e.preventDefault();onSave(f)}} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Product Name" required><Input value={f.name} onChange={s('name')} required autoFocus /></Field>
        <Field label="Category">
          <Select value={f.category} onChange={s('category')}>
            {CATS.map(c=><option key={c} value={c}>{CAT_LABELS[c]}</option>)}
          </Select>
        </Field>
      </div>
      <Field label="Description"><Textarea value={f.description} onChange={s('description')} rows={2} /></Field>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Price ZAR (ex VAT)"><Input type="number" min={0} value={f.priceZAR} onChange={s('priceZAR')} /></Field>
        <Field label="Lead Time (weeks)"><Input type="number" min={1} value={f.leadTimeWeeks} onChange={s('leadTimeWeeks')} /></Field>
        <Field label="Status">
          <Select value={f.status} onChange={s('status')}>
            <option value="available">Available</option>
            <option value="pre-order">Pre-order</option>
            <option value="discontinued">Discontinued</option>
          </Select>
        </Field>
      </div>
      <Field label="Supplier">
        <Select value={f.supplier} onChange={s('supplier')}>
          <option value="">— Select supplier —</option>
          {suppliers.map(s=><option key={s}>{s}</option>)}
          <option value="In-house">In-house (manufactured)</option>
        </Select>
      </Field>
      <Field label="Notes"><Textarea value={f.notes} onChange={s('notes')} rows={2} /></Field>
      <div className="flex gap-3 pt-2 border-t border-[#1b2c38]">
        <Btn type="submit">{initial ? 'Save changes' : 'Add product'}</Btn>
        <Btn variant="secondary" type="button" onClick={onCancel}>Cancel</Btn>
      </div>
    </form>
  )
}

export default function Products() {
  const { state, dispatch } = useStore()
  const [editing, setEditing] = useState<Product|null>(null)
  const [adding, setAdding]   = useState(false)
  const [cat, setCat]         = useState<ProductCategory|'all'>('all')

  const items = cat==='all' ? state.products : state.products.filter(p=>p.category===cat)
  const supplierNames = [...new Set(state.suppliers.map(s=>s.name))].sort()
  const totalCatalog = state.products.length
  const available    = state.products.filter(p=>p.status==='available').length

  const save = (data:Omit<Product,'id'>) => {
    if (editing) dispatch({ type:'UPD_PRODUCT', payload:{ ...data, id:editing.id } })
    else         dispatch({ type:'ADD_PRODUCT', payload:{ ...data, id:uid() } })
    setEditing(null); setAdding(false)
  }
  const del = (id:string) => { if(confirm('Remove product?')) dispatch({ type:'DEL_PRODUCT', payload:id }) }

  return (
    <div className="max-w-[1500px] mx-auto px-6 py-6">
      <PageHeader title="Products" sub={`${totalCatalog} in catalogue`} action={<Btn onClick={()=>setAdding(true)}>+ Add Product</Btn>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Catalogue Items" value={totalCatalog}    color="text-[#c8dce8]" />
        <Stat label="Available"       value={available}       color="text-emerald-400" />
        <Stat label="Pre-order"       value={state.products.filter(p=>p.status==='pre-order').length}     color="text-amber-400" />
        <Stat label="Avg Lead Time"   value={`${Math.round(state.products.reduce((s,p)=>s+p.leadTimeWeeks,0)/Math.max(state.products.length,1))}w`} color="text-[#c8dce8]" />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <button onClick={()=>setCat('all')} className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${cat==='all'?'bg-[#c4935a] text-[#06080b]':'bg-[#0e1820] text-[#5a7f95] hover:bg-[#1b2c38]'}`}>All</button>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCat(c)}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${cat===c?'bg-[#c4935a] text-[#06080b]':'bg-[#0e1820] text-[#5a7f95] hover:bg-[#1b2c38]'}`}>
            {CAT_ICON[c]} {CAT_LABELS[c]}
          </button>
        ))}
      </div>

      {/* Product grid cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.length===0 && <div className="col-span-3 bg-[#0e1820] border border-[#1b2c38] rounded-2xl p-12 text-center text-sm text-[#2e4455] italic">No products in this category</div>}
        {items.map(p=>(
          <div key={p.id} onClick={()=>setEditing(p)}
            className="bg-[#0e1820] border border-[#1b2c38] rounded-2xl p-5 hover:border-[#2d4558] transition-colors cursor-pointer relative">
            <div className="absolute top-4 right-4" onClick={e=>e.stopPropagation()}>
              <DeleteBtn onClick={()=>del(p.id)} />
            </div>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">{CAT_ICON[p.category]}</span>
              <div className="flex-1 min-w-0 pr-6">
                <p className="font-semibold text-[#c8dce8] text-sm leading-tight">{p.name}</p>
                <p className="text-[10px] text-[#5a7f95] mt-0.5">{p.supplier}</p>
              </div>
            </div>
            <div className="flex gap-2 mb-3 flex-wrap">
              <Badge color={CAT_COLOR[p.category]}>{CAT_LABELS[p.category]}</Badge>
              <Badge color={p.status==='available'?'green':p.status==='pre-order'?'amber':'red'}>{p.status}</Badge>
            </div>
            {p.description && <p className="text-xs text-[#5a7f95] mb-3 line-clamp-2">{p.description}</p>}
            <div className="flex items-center justify-between border-t border-[#1b2c38] pt-3">
              <span className="text-lg font-semibold text-[#c4935a]">{formatZAR(p.priceZAR)}</span>
              <span className="text-xs text-[#2e4455]">{p.leadTimeWeeks}w lead time</span>
            </div>
          </div>
        ))}
      </div>

      {(adding||editing) && (
        <Modal title={editing ? `Edit — ${editing.name}` : 'Add Product'} onClose={()=>{setAdding(false);setEditing(null)}}>
          <ProductForm initial={editing??undefined} suppliers={supplierNames} onSave={save} onCancel={()=>{setAdding(false);setEditing(null)}} />
        </Modal>
      )}
    </div>
  )
}
