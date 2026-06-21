export type ProjectStatus = 'planning' | 'in-progress' | 'qa' | 'complete'
export type ProductType  = 'sauna' | 'cold-plunge' | 'hot-tub' | 'pavilion' | 'steam'

export interface Project {
  id: string
  client: string
  location: string
  product: string
  type: ProductType
  value: number
  status: ProjectStatus
  progress: number
  stage: string
  manager: string
  startDate: string
  endDate: string
}

export interface Activity {
  id: string
  date: string
  event: string
  client: string
  type: 'invoice' | 'stage' | 'delivery' | 'qa' | 'start' | 'complete'
}

export interface RoadmapItem {
  id: string
  quarter: string
  title: string
  description: string
  status: 'complete' | 'in-progress' | 'upcoming'
  milestones: string[]
}

export const projects: Project[] = [
  {
    id: 'p1', client: 'House Athol', location: 'Athol, Johannesburg',
    product: 'Custom Indoor Sauna + Cold Plunge', type: 'sauna',
    value: 285000, status: 'in-progress', progress: 60, stage: 'Cladding',
    manager: 'Ari', startDate: '2026-03-15', endDate: '2026-06-30',
  },
  {
    id: 'p2', client: 'House Constantia', location: 'Constantia, Cape Town',
    product: 'Wellness Pavilion + Outdoor Sauna', type: 'pavilion',
    value: 480000, status: 'in-progress', progress: 80, stage: 'Electrical',
    manager: 'Ari', startDate: '2026-02-01', endDate: '2026-06-15',
  },
  {
    id: 'p3', client: 'Moove Sandton', location: 'Sandton, Johannesburg',
    product: 'Commercial Ice Bath Suite (×6)', type: 'cold-plunge',
    value: 380000, status: 'in-progress', progress: 70, stage: 'Plumbing',
    manager: 'Ari', startDate: '2026-04-01', endDate: '2026-07-01',
  },
  {
    id: 'p4', client: 'House Val de Vie', location: 'Val de Vie, Paarl',
    product: 'Outdoor Sauna + Cold Plunge + Pergola', type: 'sauna',
    value: 265000, status: 'in-progress', progress: 45, stage: 'Framing',
    manager: 'Ari', startDate: '2026-04-20', endDate: '2026-07-15',
  },
  {
    id: 'p5', client: 'House Bakoven', location: 'Bakoven, Cape Town',
    product: 'Custom Outdoor Sauna (Thermory)', type: 'sauna',
    value: 195000, status: 'in-progress', progress: 35, stage: 'Foundation',
    manager: 'Ari', startDate: '2026-05-01', endDate: '2026-07-30',
  },
  {
    id: 'p6', client: 'House Noordhoek', location: 'Noordhoek, Cape Town',
    product: 'Cold Plunge + Hot Tub Combo', type: 'hot-tub',
    value: 225000, status: 'in-progress', progress: 25, stage: 'Foundation',
    manager: 'Ari', startDate: '2026-05-15', endDate: '2026-08-01',
  },
  {
    id: 'p7', client: 'House Steenberg', location: 'Steenberg, Cape Town',
    product: 'Custom Indoor Sauna (Huum Drop)', type: 'sauna',
    value: 185000, status: 'qa', progress: 95, stage: 'Final Handover',
    manager: 'Ari', startDate: '2026-02-10', endDate: '2026-06-20',
  },
  {
    id: 'p8', client: 'House Camps Bay', location: 'Camps Bay, Cape Town',
    product: 'Outdoor Hot Tub + Sauna Combo', type: 'hot-tub',
    value: 310000, status: 'qa', progress: 90, stage: 'Snag List',
    manager: 'Ari', startDate: '2026-01-20', endDate: '2026-06-10',
  },
  {
    id: 'p9', client: 'Silvan Lodge', location: 'Kruger, Limpopo',
    product: 'Commercial Wellness Suite (Sauna + Cold + Steam)', type: 'steam',
    value: 680000, status: 'planning', progress: 0, stage: 'Design',
    manager: 'Ari', startDate: '2026-07-01', endDate: '2026-10-15',
  },
  {
    id: 'p10', client: 'House Clifton', location: 'Clifton, Cape Town',
    product: 'Indoor Sauna + Steam Room', type: 'steam',
    value: 320000, status: 'planning', progress: 0, stage: 'Proposal',
    manager: 'Ari', startDate: '2026-07-10', endDate: '2026-09-30',
  },
  {
    id: 'p11', client: 'House Morningside', location: 'Morningside, Jhb',
    product: 'Custom Indoor Sauna (Tulikivi)', type: 'sauna',
    value: 210000, status: 'planning', progress: 0, stage: 'Quote',
    manager: 'Ari', startDate: '2026-07-20', endDate: '2026-10-01',
  },
  {
    id: 'p12', client: 'House Bishopcourt', location: 'Bishopcourt, Cape Town',
    product: 'Cold Plunge Installation', type: 'cold-plunge',
    value: 145000, status: 'complete', progress: 100, stage: 'Handed Over',
    manager: 'Ari', startDate: '2026-01-10', endDate: '2026-03-15',
  },
  {
    id: 'p13', client: 'House Hout Bay', location: 'Hout Bay, Cape Town',
    product: 'Outdoor Sauna (Ark Pergola)', type: 'sauna',
    value: 165000, status: 'complete', progress: 100, stage: 'Handed Over',
    manager: 'Ari', startDate: '2025-11-01', endDate: '2026-02-28',
  },
  {
    id: 'p14', client: 'Black Sable', location: 'Constantia, Cape Town',
    product: 'Commercial Wellness: Sauna + Cold Plunge', type: 'cold-plunge',
    value: 420000, status: 'complete', progress: 100, stage: 'Handed Over',
    manager: 'Ari', startDate: '2025-10-01', endDate: '2026-02-01',
  },
  {
    id: 'p15', client: 'House Stellenbosch', location: 'Stellenbosch, WC',
    product: 'Indoor Sauna (Huum Cube)', type: 'sauna',
    value: 175000, status: 'complete', progress: 100, stage: 'Handed Over',
    manager: 'Ari', startDate: '2026-01-05', endDate: '2026-04-10',
  },
]

export const revenueData = [
  { month: 'Jan', invoiced: 330000, collected: 285000 },
  { month: 'Feb', invoiced: 420000, collected: 380000 },
  { month: 'Mar', invoiced: 510000, collected: 460000 },
  { month: 'Apr', invoiced: 390000, collected: 340000 },
  { month: 'May', invoiced: 575000, collected: 490000 },
  { month: 'Jun', invoiced: 210000, collected: 0 },
]

export const productMix = [
  { name: 'Custom Saunas',    value: 42, color: '#c9a96e' },
  { name: 'Cold Plunge',      value: 27, color: '#3b82f6' },
  { name: 'Hot Tubs',         value: 13, color: '#22c55e' },
  { name: 'Wellness Pavilion',value: 11, color: '#8b5cf6' },
  { name: 'Steam + Upgrades', value:  7, color: '#475569' },
]

export const activity: Activity[] = [
  { id: 'a1', date: '2026-06-21', event: 'Final QA sign-off submitted', client: 'House Steenberg', type: 'qa' },
  { id: 'a2', date: '2026-06-20', event: 'Invoice R480,000 sent', client: 'House Constantia', type: 'invoice' },
  { id: 'a3', date: '2026-06-19', event: 'Electrical stage completed', client: 'Moove Sandton', type: 'stage' },
  { id: 'a4', date: '2026-06-18', event: 'Thermory cladding delivered', client: 'House Bakoven', type: 'delivery' },
  { id: 'a5', date: '2026-06-17', event: 'Framing completed', client: 'House Val de Vie', type: 'stage' },
  { id: 'a6', date: '2026-06-16', event: 'Project kicked off', client: 'House Noordhoek', type: 'start' },
  { id: 'a7', date: '2026-06-14', event: 'Snag list cleared — handover booked', client: 'House Camps Bay', type: 'qa' },
  { id: 'a8', date: '2026-06-12', event: 'Proposal signed R680,000', client: 'Silvan Lodge', type: 'start' },
  { id: 'a9', date: '2026-06-10', event: 'Project complete — client signed off', client: 'House Stellenbosch', type: 'complete' },
  { id: 'a10', date: '2026-06-08', event: 'Huum Drop stove installed', client: 'House Athol', type: 'stage' },
]

export const roadmap: RoadmapItem[] = [
  {
    id: 'r1', quarter: 'Q1 2026', title: 'Digital Operations',
    description: 'Airtable system live across all 9 modules',
    status: 'complete',
    milestones: ['Project tracking live', 'Finance & invoicing', 'QA sign-off workflow', 'Contractor scheduling'],
  },
  {
    id: 'r2', quarter: 'Q2 2026', title: 'Client Portal',
    description: 'Clients track their own project progress in real time',
    status: 'in-progress',
    milestones: ['Portal design & build', 'Photo upload per stage', 'Payment link integration', 'Proposal delivery system'],
  },
  {
    id: 'r3', quarter: 'Q3 2026', title: 'Hospitality Division',
    description: 'Dedicated offering for lodges, hotels, and boutique resorts',
    status: 'upcoming',
    milestones: ['Lodge partnership programme', 'Commercial wellness packages', 'Site assessment SOP', 'Hospitality case studies'],
  },
  {
    id: 'r4', quarter: 'Q4 2026', title: 'Manufacturing Scale',
    description: 'Increase local prefab capacity to cut lead times',
    status: 'upcoming',
    milestones: ['Workshop expansion', 'Prefab sauna modules', 'Supplier consolidation', 'ISO quality framework'],
  },
]

export function kpis(ps: Project[]) {
  const ytdRevenue  = revenueData.reduce((s, m) => s + m.collected, 0)
  const active      = ps.filter(p => p.status === 'in-progress' || p.status === 'qa').length
  const pipeline    = ps.filter(p => p.status === 'planning').reduce((s, p) => s + p.value, 0)
  const avgValue    = Math.round(ps.reduce((s, p) => s + p.value, 0) / ps.length)
  const completed   = ps.filter(p => p.status === 'complete').length
  return { ytdRevenue, active, pipeline, avgValue, completed }
}
