// ─── Client Projects ─────────────────────────────────────────────────────────

export type ClientStatus   = 'lead' | 'proposal' | 'active' | 'qa' | 'complete' | 'on-hold'
export type ClientCategory = 'residential' | 'hospitality' | 'collab'
export type FieldType      = 'text' | 'number' | 'date' | 'textarea' | 'select' | 'url' | 'checkbox'

export interface ClientProject {
  id: string
  client: string
  location: string
  contactName: string
  category: ClientCategory
  products: string          // what's being installed
  status: ClientStatus
  value: number             // ZAR total project value
  progress: number          // 0-100
  stage: string             // current install stage
  lead: string              // Ari / team
  startDate: string
  endDate: string
  notes: string
  customFields: Record<string, string>
}

// ─── Product Catalog ─────────────────────────────────────────────────────────

export type ProductCategory = 'cold' | 'hot' | 'hybrid' | 'sauna' | 'steam' | 'ark' | 'accessory'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  description: string
  priceZAR: number
  supplier: string
  leadTimeWeeks: number
  status: 'available' | 'pre-order' | 'discontinued'
  notes: string
}

// ─── Suppliers ────────────────────────────────────────────────────────────────

export type SupplierCategory =
  | 'stoves' | 'timber' | 'plunge-tubs' | 'glass' | 'steel'
  | 'insulation' | 'lighting' | 'steam' | 'design-3d' | 'logistics'
  | 'fabrication' | 'sanitary' | 'cork' | 'other'

export interface Supplier {
  id: string
  name: string
  country: string
  category: SupplierCategory
  contactName: string
  email: string
  leadTimeDays: number
  status: 'active' | 'inactive'
  notes: string
}

// ─── Manufacturing ────────────────────────────────────────────────────────────

export type JobStatus = 'pending' | 'cutting' | 'welding' | 'assembly' | 'finishing' | 'qa' | 'complete'

export interface CutlistItem {
  id: string
  material: string
  description: string
  length: number      // mm
  width: number       // mm
  thickness: number   // mm
  qty: number
  done: boolean
}

export interface ManufacturingJob {
  id: string
  jobNo: string
  projectId: string
  product: string
  status: JobStatus
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo: string
  dueDate: string
  cutlist: CutlistItem[]
  notes: string
}

// ─── Financials ───────────────────────────────────────────────────────────────

export interface Invoice {
  id: string
  invoiceNo: string
  projectId: string
  client: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  issueDate: string
  dueDate: string
  notes: string
}

export interface Expense {
  id: string
  projectId: string
  description: string
  category: 'materials' | 'labour' | 'logistics' | 'equipment' | 'travel' | 'admin'
  amount: number
  supplier: string
  date: string
  notes: string
}

// ─── Design & R&D ─────────────────────────────────────────────────────────────

export type DesignType   = 'concept' | '3d-render' | 'technical-drawing' | 'specification' | 'proposal' | 'animation'
export type DesignStatus = 'briefed' | 'in-progress' | 'review' | 'approved' | 'revision'

export interface DesignJob {
  id: string
  projectId: string
  title: string
  type: DesignType
  assignedTo: string
  status: DesignStatus
  dueDate: string
  notes: string
}

// ─── Collabs ─────────────────────────────────────────────────────────────────

export type CollabStatus = 'active' | 'proposal' | 'complete' | 'on-hold'
export type CollabType   = 'lodge' | 'commercial' | 'brand' | 'residential'

export interface Collab {
  id: string
  name: string
  partner: string
  type: CollabType
  status: CollabStatus
  value: number
  products: string
  description: string
  notes: string
}

// ─── Custom Field Defs ────────────────────────────────────────────────────────

export interface CustomFieldDef {
  id: string
  label: string
  type: FieldType
  required: boolean
  options: string[]
  order: number
  section: string
}

// ─── App State ────────────────────────────────────────────────────────────────

export interface AppState {
  clients: ClientProject[]
  products: Product[]
  suppliers: Supplier[]
  manufacturingJobs: ManufacturingJob[]
  invoices: Invoice[]
  expenses: Expense[]
  designJobs: DesignJob[]
  collabs: Collab[]
  customFieldDefs: CustomFieldDef[]
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export type AppAction =
  | { type: 'RESET' }
  | { type: 'ADD_CLIENT';     payload: ClientProject }
  | { type: 'UPD_CLIENT';     payload: ClientProject }
  | { type: 'DEL_CLIENT';     payload: string }
  | { type: 'ADD_PRODUCT';    payload: Product }
  | { type: 'UPD_PRODUCT';    payload: Product }
  | { type: 'DEL_PRODUCT';    payload: string }
  | { type: 'ADD_SUPPLIER';   payload: Supplier }
  | { type: 'UPD_SUPPLIER';   payload: Supplier }
  | { type: 'DEL_SUPPLIER';   payload: string }
  | { type: 'ADD_MFG';        payload: ManufacturingJob }
  | { type: 'UPD_MFG';        payload: ManufacturingJob }
  | { type: 'DEL_MFG';        payload: string }
  | { type: 'ADD_INVOICE';    payload: Invoice }
  | { type: 'UPD_INVOICE';    payload: Invoice }
  | { type: 'DEL_INVOICE';    payload: string }
  | { type: 'ADD_EXPENSE';    payload: Expense }
  | { type: 'UPD_EXPENSE';    payload: Expense }
  | { type: 'DEL_EXPENSE';    payload: string }
  | { type: 'ADD_DESIGN';     payload: DesignJob }
  | { type: 'UPD_DESIGN';     payload: DesignJob }
  | { type: 'DEL_DESIGN';     payload: string }
  | { type: 'ADD_COLLAB';     payload: Collab }
  | { type: 'UPD_COLLAB';     payload: Collab }
  | { type: 'DEL_COLLAB';     payload: string }
  | { type: 'ADD_FIELD_DEF';  payload: CustomFieldDef }
  | { type: 'UPD_FIELD_DEF';  payload: CustomFieldDef }
  | { type: 'DEL_FIELD_DEF';  payload: string }
  | { type: 'REORDER_FIELDS'; payload: CustomFieldDef[] }
