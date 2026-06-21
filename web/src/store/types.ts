export type ProjectStatus = 'planning' | 'in-progress' | 'qa' | 'complete'
export type ProductType   = 'sauna' | 'cold-plunge' | 'hot-tub' | 'pavilion' | 'steam'
export type FieldType     = 'text' | 'number' | 'date' | 'textarea' | 'select' | 'url' | 'checkbox'

export interface CustomFieldDef {
  id: string
  label: string
  type: FieldType
  required: boolean
  options: string[]   // for select type
  order: number
  section: string     // grouping label, e.g. "Team", "Site", "Compliance"
}

export interface Project {
  id: string; client: string; location: string; product: string
  type: ProductType; value: number; status: ProjectStatus
  progress: number; stage: string; manager: string
  startDate: string; endDate: string
  customFields: Record<string, string>
}

export interface InventoryItem {
  id: string; name: string; sku: string
  category: 'timber' | 'hardware' | 'electrical' | 'plumbing' | 'insulation' | 'stoves' | 'accessories' | 'tools'
  unit: 'pcs' | 'm' | 'm²' | 'kg' | 'L' | 'sets'
  qty: number; minQty: number; costPrice: number
  supplier: string; location: string
}

export interface CutlistItem {
  id: string; material: string; description: string
  length: number; width: number; thickness: number; qty: number; done: boolean
}

export interface ManufacturingJob {
  id: string; jobNo: string; projectId: string; product: string
  status: 'pending' | 'cutting' | 'assembly' | 'finishing' | 'qa' | 'complete'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate: string; assignedTo: string; notes: string
  cutlist: CutlistItem[]
}

export interface SiteVisit {
  id: string; projectId: string; client: string; date: string
  type: 'measurement' | 'installation' | 'inspection' | 'handover' | 'client-meeting'
  team: string; duration: number; notes: string; followUp: boolean
}

export interface QASignoff {
  id: string; projectId: string
  stage: 'Foundation' | 'Framing' | 'Cladding' | 'Electrical' | 'Final Handover'
  date: string; signedBy: string; status: 'pass' | 'fail' | 'pending'; notes: string
}

export interface Snag {
  id: string; projectId: string; description: string
  status: 'open' | 'in-progress' | 'complete'
  priority: 'low' | 'medium' | 'high'
  assignedTo: string; dateIdentified: string; notes: string
}

export interface Invoice {
  id: string; invoiceNo: string; projectId: string; client: string
  amount: number; status: 'draft' | 'sent' | 'paid' | 'overdue'
  issueDate: string; dueDate: string; notes: string
}

export interface Expense {
  id: string; projectId: string; description: string
  category: 'materials' | 'contractor' | 'travel' | 'equipment' | 'admin' | 'marketing'
  amount: number; paidTo: string; date: string; notes: string
}

export interface DesignBrief {
  id: string; projectId: string; title: string
  type: 'concept' | 'technical' | '3d-model' | 'material-spec' | 'proposal'
  status: 'draft' | 'review' | 'approved' | 'revision'
  designer: string; createdDate: string; notes: string
}

export interface AppState {
  projects: Project[]
  inventory: InventoryItem[]
  manufacturingJobs: ManufacturingJob[]
  siteVisits: SiteVisit[]
  qaSignoffs: QASignoff[]
  snags: Snag[]
  invoices: Invoice[]
  expenses: Expense[]
  designBriefs: DesignBrief[]
  customFieldDefs: CustomFieldDef[]
}

export type AppAction =
  | { type: 'RESET' }
  | { type: 'ADD_FIELD_DEF'; payload: CustomFieldDef }
  | { type: 'UPD_FIELD_DEF'; payload: CustomFieldDef }
  | { type: 'DEL_FIELD_DEF'; payload: string }
  | { type: 'REORDER_FIELDS'; payload: CustomFieldDef[] }
  | { type: 'ADD_PROJECT';    payload: Project }
  | { type: 'UPD_PROJECT';    payload: Project }
  | { type: 'DEL_PROJECT';    payload: string }
  | { type: 'ADD_INVENTORY';  payload: InventoryItem }
  | { type: 'UPD_INVENTORY';  payload: InventoryItem }
  | { type: 'DEL_INVENTORY';  payload: string }
  | { type: 'ADD_MFG';        payload: ManufacturingJob }
  | { type: 'UPD_MFG';        payload: ManufacturingJob }
  | { type: 'DEL_MFG';        payload: string }
  | { type: 'ADD_VISIT';      payload: SiteVisit }
  | { type: 'UPD_VISIT';      payload: SiteVisit }
  | { type: 'DEL_VISIT';      payload: string }
  | { type: 'ADD_QA';         payload: QASignoff }
  | { type: 'UPD_QA';         payload: QASignoff }
  | { type: 'DEL_QA';         payload: string }
  | { type: 'ADD_SNAG';       payload: Snag }
  | { type: 'UPD_SNAG';       payload: Snag }
  | { type: 'DEL_SNAG';       payload: string }
  | { type: 'ADD_INVOICE';    payload: Invoice }
  | { type: 'UPD_INVOICE';    payload: Invoice }
  | { type: 'DEL_INVOICE';    payload: string }
  | { type: 'ADD_EXPENSE';    payload: Expense }
  | { type: 'UPD_EXPENSE';    payload: Expense }
  | { type: 'DEL_EXPENSE';    payload: string }
  | { type: 'ADD_DESIGN';     payload: DesignBrief }
  | { type: 'UPD_DESIGN';     payload: DesignBrief }
  | { type: 'DEL_DESIGN';     payload: string }
