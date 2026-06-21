import type { AppState } from './types'

export const seedState: AppState = {
  customFieldDefs: [
    { id:'cf1', label:'Architect',          type:'text',     required:false, options:[],                                                       order:0, section:'Team' },
    { id:'cf2', label:'Interior Designer',  type:'text',     required:false, options:[],                                                       order:1, section:'Team' },
    { id:'cf3', label:'Electrical Contractor', type:'text',  required:false, options:[],                                                       order:2, section:'Team' },
    { id:'cf4', label:'Product Series',     type:'select',   required:false, options:['Cube','Drop','Ark','Custom','Commercial'],              order:3, section:'Product' },
    { id:'cf5', label:'Stove Model',        type:'text',     required:false, options:[],                                                       order:4, section:'Product' },
    { id:'cf6', label:'Referral Source',    type:'select',   required:false, options:['Word of mouth','Instagram','Architect','Referral','Direct inquiry'], order:5, section:'Sales' },
    { id:'cf7', label:'Site Access Notes',  type:'textarea', required:false, options:[],                                                       order:6, section:'Site' },
    { id:'cf8', label:'Council Approval',   type:'checkbox', required:false, options:[],                                                       order:7, section:'Compliance' },
  ],

  projects: [
    { id:'p1',  client:'House Athol',       location:'Athol, Johannesburg',      product:'Custom Indoor Sauna + Cold Plunge',       type:'sauna',        value:285000, status:'in-progress', progress:60, stage:'Cladding',       manager:'Ari', startDate:'2026-03-15', endDate:'2026-06-30', customFields:{ cf1:'Studio Artvion', cf4:'Custom', cf5:'Huum Drop 9kw', cf6:'Referral' } },
    { id:'p2',  client:'House Constantia',  location:'Constantia, Cape Town',    product:'Wellness Pavilion + Outdoor Sauna',       type:'pavilion',     value:480000, status:'in-progress', progress:80, stage:'Electrical',     manager:'Ari', startDate:'2026-02-01', endDate:'2026-06-15', customFields:{ cf1:'Alex Barnard Architects', cf4:'Ark', cf6:'Word of mouth' } },
    { id:'p3',  client:'Moove Sandton',     location:'Sandton, Johannesburg',    product:'Commercial Ice Bath Suite (×6)',           type:'cold-plunge',  value:380000, status:'in-progress', progress:70, stage:'Plumbing',       manager:'Ari', startDate:'2026-04-01', endDate:'2026-07-01', customFields:{ cf4:'Commercial', cf6:'Direct inquiry' } },
    { id:'p4',  client:'House Val de Vie',  location:'Val de Vie, Paarl',        product:'Outdoor Sauna + Cold Plunge + Pergola',   type:'sauna',        value:265000, status:'in-progress', progress:45, stage:'Framing',        manager:'Ari', startDate:'2026-04-20', endDate:'2026-07-15', customFields:{ cf4:'Ark', cf5:'Tulikivi', cf6:'Architect' } },
    { id:'p5',  client:'House Bakoven',     location:'Bakoven, Cape Town',       product:'Custom Outdoor Sauna (Thermory)',          type:'sauna',        value:195000, status:'in-progress', progress:35, stage:'Foundation',     manager:'Ari', startDate:'2026-05-01', endDate:'2026-07-30', customFields:{ cf4:'Custom', cf6:'Instagram' } },
    { id:'p6',  client:'House Noordhoek',   location:'Noordhoek, Cape Town',     product:'Cold Plunge + Hot Tub Combo',             type:'hot-tub',      value:225000, status:'in-progress', progress:25, stage:'Foundation',     manager:'Ari', startDate:'2026-05-15', endDate:'2026-08-01', customFields:{} },
    { id:'p7',  client:'House Steenberg',   location:'Steenberg, Cape Town',     product:'Custom Indoor Sauna (Huum Drop)',          type:'sauna',        value:185000, status:'qa',          progress:95, stage:'Final Handover', manager:'Ari', startDate:'2026-02-10', endDate:'2026-06-20', customFields:{ cf4:'Drop', cf5:'Huum Drop 4.5kw' } },
    { id:'p8',  client:'House Camps Bay',   location:'Camps Bay, Cape Town',     product:'Outdoor Hot Tub + Sauna Combo',           type:'hot-tub',      value:310000, status:'qa',          progress:90, stage:'Snag List',      manager:'Ari', startDate:'2026-01-20', endDate:'2026-06-10', customFields:{ cf6:'Word of mouth' } },
    { id:'p9',  client:'Silvan Lodge',      location:'Kruger, Limpopo',          product:'Commercial Wellness Suite',               type:'steam',        value:680000, status:'planning',    progress:0,  stage:'Design',         manager:'Ari', startDate:'2026-07-01', endDate:'2026-10-15', customFields:{ cf4:'Commercial', cf6:'Referral' } },
    { id:'p10', client:'House Clifton',     location:'Clifton, Cape Town',       product:'Indoor Sauna + Steam Room',               type:'steam',        value:320000, status:'planning',    progress:0,  stage:'Proposal',       manager:'Ari', startDate:'2026-07-10', endDate:'2026-09-30', customFields:{} },
    { id:'p11', client:'House Morningside', location:'Morningside, Jhb',         product:'Custom Indoor Sauna (Tulikivi)',           type:'sauna',        value:210000, status:'planning',    progress:0,  stage:'Quote',          manager:'Ari', startDate:'2026-07-20', endDate:'2026-10-01', customFields:{ cf4:'Custom', cf5:'Tulikivi', cf6:'Instagram' } },
    { id:'p12', client:'House Bishopcourt', location:'Bishopcourt, Cape Town',   product:'Cold Plunge Installation',                type:'cold-plunge',  value:145000, status:'complete',    progress:100,stage:'Handed Over',    manager:'Ari', startDate:'2026-01-10', endDate:'2026-03-15', customFields:{ cf6:'Word of mouth' } },
    { id:'p13', client:'House Hout Bay',    location:'Hout Bay, Cape Town',      product:'Outdoor Sauna (Ark Pergola)',              type:'sauna',        value:165000, status:'complete',    progress:100,stage:'Handed Over',    manager:'Ari', startDate:'2025-11-01', endDate:'2026-02-28', customFields:{ cf4:'Ark', cf6:'Referral' } },
    { id:'p14', client:'Black Sable',       location:'Constantia, Cape Town',    product:'Commercial Wellness: Sauna + Cold Plunge', type:'cold-plunge', value:420000, status:'complete',    progress:100,stage:'Handed Over',    manager:'Ari', startDate:'2025-10-01', endDate:'2026-02-01', customFields:{ cf4:'Commercial', cf6:'Direct inquiry' } },
    { id:'p15', client:'House Stellenbosch',location:'Stellenbosch, WC',         product:'Indoor Sauna (Huum Cube)',                 type:'sauna',        value:175000, status:'complete',    progress:100,stage:'Handed Over',    manager:'Ari', startDate:'2026-01-05', endDate:'2026-04-10', customFields:{ cf4:'Cube', cf5:'Huum Cube 6', cf6:'Referral' } },
  ],

  inventory: [
    { id:'i1',  name:'Thermory Exterior Cladding 28mm', sku:'TMR-EXT-28', category:'timber',      unit:'m',   qty:85,  minQty:20, costPrice:320,  supplier:'Thermory SA',     location:'Workshop Bay A' },
    { id:'i2',  name:'Cedar Interior Lining 20mm',      sku:'CDR-INT-20', category:'timber',      unit:'m',   qty:120, minQty:30, costPrice:180,  supplier:'Woodstock Timber', location:'Workshop Bay A' },
    { id:'i3',  name:'Huum Drop 9kw Sauna Stove',       sku:'HUM-DRP-9',  category:'stoves',      unit:'pcs', qty:3,   minQty:1,  costPrice:8500, supplier:'Huum Baltic',      location:'Storeroom' },
    { id:'i4',  name:'Huum Drop 4.5kw Sauna Stove',     sku:'HUM-DRP-4',  category:'stoves',      unit:'pcs', qty:2,   minQty:1,  costPrice:6200, supplier:'Huum Baltic',      location:'Storeroom' },
    { id:'i5',  name:'Tulikivi Soapstone Stove',        sku:'TLK-SOAP',   category:'stoves',      unit:'pcs', qty:1,   minQty:1,  costPrice:22000,supplier:'Tulikivi FI',      location:'Storeroom' },
    { id:'i6',  name:'Sauna Stones 20kg Bag',           sku:'STN-20KG',   category:'accessories', unit:'pcs', qty:15,  minQty:5,  costPrice:280,  supplier:'Nordic Wellness',  location:'Storeroom' },
    { id:'i7',  name:'Vapour Barrier 2mm PE',           sku:'VPR-PE-2',   category:'insulation',  unit:'m²',  qty:200, minQty:50, costPrice:45,   supplier:'Build-It SA',      location:'Workshop Bay B' },
    { id:'i8',  name:'Rockwool Sauna Insulation 100mm', sku:'RCK-100',    category:'insulation',  unit:'m²',  qty:150, minQty:40, costPrice:95,   supplier:'Build-It SA',      location:'Workshop Bay B' },
    { id:'i9',  name:'Sauna Temperature Controller',    sku:'CTRL-TMP',   category:'electrical',  unit:'pcs', qty:8,   minQty:2,  costPrice:1200, supplier:'Electric Park',    location:'Electrical Store' },
    { id:'i10', name:'Sauna Door Glass 8mm (700×1900)', sku:'DOR-GLS-8',  category:'accessories', unit:'pcs', qty:4,   minQty:1,  costPrice:3800, supplier:'Cape Glass',       location:'Storeroom' },
    { id:'i11', name:'Cold Plunge Chiller 1500W',       sku:'CHIL-1500',  category:'electrical',  unit:'pcs', qty:2,   minQty:1,  costPrice:12500,supplier:'Chilltech',        location:'Storeroom' },
    { id:'i12', name:'Stainless M8 Coach Screws 100pk', sku:'SS-M8-100',  category:'hardware',    unit:'pcs', qty:24,  minQty:5,  costPrice:180,  supplier:'Bolt & Nut SA',    location:'Hardware Rack' },
    { id:'i13', name:'LED Sauna Light 12V Waterproof',  sku:'LED-SAU-12', category:'electrical',  unit:'pcs', qty:20,  minQty:5,  costPrice:320,  supplier:'Electric Park',    location:'Electrical Store' },
    { id:'i14', name:'Sauna Bench Kiuas Profile 42mm',  sku:'BNC-PRF-42', category:'timber',      unit:'m',   qty:60,  minQty:15, costPrice:95,   supplier:'Nordic Wellness',  location:'Workshop Bay A' },
    { id:'i15', name:'Hot Tub Acrylic Shell 1800mm',    sku:'TUB-ACR-18', category:'accessories', unit:'pcs', qty:1,   minQty:1,  costPrice:18000,supplier:'AquaForm SA',      location:'Storeroom' },
  ],

  manufacturingJobs: [
    {
      id:'mfg1', jobNo:'MFG-026-01', projectId:'p1', product:'Indoor Sauna — Athol', status:'assembly',
      priority:'high', dueDate:'2026-06-25', assignedTo:'Workshop Team', notes:'Thermory cladding, benches × 2 tier',
      cutlist: [
        { id:'cl1', material:'Cedar 20mm',   description:'Back wall cladding',  length:2100, width:120, thickness:20, qty:18, done:true },
        { id:'cl2', material:'Cedar 20mm',   description:'Side wall cladding',  length:1800, width:120, thickness:20, qty:14, done:true },
        { id:'cl3', material:'Kiuas 42mm',   description:'Top bench',           length:1800, width:400, thickness:42, qty:3,  done:false },
        { id:'cl4', material:'Kiuas 42mm',   description:'Lower bench',         length:1800, width:350, thickness:42, qty:3,  done:false },
        { id:'cl5', material:'Pine 18mm CLS', description:'Bench support frame', length:400,  width:90,  thickness:45, qty:8,  done:false },
      ],
    },
    {
      id:'mfg2', jobNo:'MFG-026-02', projectId:'p5', product:'Outdoor Sauna — Bakoven', status:'cutting',
      priority:'medium', dueDate:'2026-07-10', assignedTo:'Workshop Team', notes:'Full Thermory exterior + cedar interior',
      cutlist: [
        { id:'cl6', material:'Thermory 28mm', description:'Exterior wall cladding', length:2400, width:120, thickness:28, qty:32, done:false },
        { id:'cl7', material:'Thermory 28mm', description:'Roof cladding',          length:1600, width:120, thickness:28, qty:16, done:false },
        { id:'cl8', material:'Cedar 20mm',    description:'Interior lining',        length:2100, width:120, thickness:20, qty:24, done:false },
      ],
    },
    {
      id:'mfg3', jobNo:'MFG-026-03', projectId:'p4', product:'Pergola Ark — Val de Vie', status:'pending',
      priority:'medium', dueDate:'2026-07-20', assignedTo:'Workshop Team', notes:'Ark-style pergola with integrated sauna',
      cutlist: [],
    },
  ],

  siteVisits: [
    { id:'sv1', projectId:'p7', client:'House Steenberg',   date:'2026-06-21', type:'inspection',      team:'Ari',         duration:2, notes:'Final QA walkthrough. Minor grout touch-up needed on bench support.', followUp:true },
    { id:'sv2', projectId:'p2', client:'House Constantia',  date:'2026-06-20', type:'installation',    team:'Ari + Tyron', duration:6, notes:'Electrical first fix complete. Stove wiring routed.', followUp:false },
    { id:'sv3', projectId:'p3', client:'Moove Sandton',     date:'2026-06-19', type:'installation',    team:'Ari + Simon', duration:8, notes:'3 of 6 plunge units set in position. Plumbing first fix in progress.', followUp:false },
    { id:'sv4', projectId:'p5', client:'House Bakoven',     date:'2026-06-17', type:'measurement',     team:'Ari',         duration:2, notes:'Final site measure. Slope on deck requires 40mm packers on east wall.', followUp:true },
    { id:'sv5', projectId:'p9', client:'Silvan Lodge',      date:'2026-06-12', type:'client-meeting',  team:'Ari',         duration:3, notes:'Concept walk-through with owner. Approved Ark pavilion + 2 cold plunge + sauna. Budget R680k confirmed.', followUp:false },
    { id:'sv6', projectId:'p4', client:'House Val de Vie',  date:'2026-06-10', type:'installation',    team:'Ari + Tyron', duration:7, notes:'Foundation poured. Frame delivery confirmed for 18 June.', followUp:false },
  ],

  qaSignoffs: [
    { id:'qa1', projectId:'p12', stage:'Foundation',     date:'2026-01-18', signedBy:'Ari', status:'pass', notes:'Concrete slab level. Drainage verified.' },
    { id:'qa2', projectId:'p12', stage:'Framing',        date:'2026-01-28', signedBy:'Ari', status:'pass', notes:'Frame square and plumb.' },
    { id:'qa3', projectId:'p12', stage:'Cladding',       date:'2026-02-10', signedBy:'Ari', status:'pass', notes:'Thermory joints tight. No gaps.' },
    { id:'qa4', projectId:'p12', stage:'Electrical',     date:'2026-02-20', signedBy:'Ari', status:'pass', notes:'Controller wired. GFCI breaker confirmed.' },
    { id:'qa5', projectId:'p12', stage:'Final Handover', date:'2026-03-14', signedBy:'Ari', status:'pass', notes:'Client walkthrough complete. Signed off.' },
    { id:'qa6', projectId:'p7',  stage:'Foundation',     date:'2026-02-15', signedBy:'Ari', status:'pass', notes:'Slab level. Vapour barrier installed.' },
    { id:'qa7', projectId:'p7',  stage:'Framing',        date:'2026-03-01', signedBy:'Ari', status:'pass', notes:'Frame complete.' },
    { id:'qa8', projectId:'p7',  stage:'Cladding',       date:'2026-04-10', signedBy:'Ari', status:'pass', notes:'Cedar lining done. Bench installed.' },
    { id:'qa9', projectId:'p7',  stage:'Electrical',     date:'2026-05-20', signedBy:'Ari', status:'pass', notes:'Huum controller functional at 80°C.' },
    { id:'qa10',projectId:'p7',  stage:'Final Handover', date:'2026-06-21', signedBy:'Ari', status:'pending', notes:'Awaiting client walkthrough appointment.' },
  ],

  snags: [
    { id:'sn1', projectId:'p7', description:'Minor grout gap on bench support bracket — east wall', status:'open',        priority:'low',    assignedTo:'Simon', dateIdentified:'2026-06-21', notes:'Touch up with teak filler.' },
    { id:'sn2', projectId:'p8', description:'Hot tub jet cover doesn\'t clip flush on port #3',    status:'in-progress', priority:'medium', assignedTo:'Tyron', dateIdentified:'2026-06-14', notes:'Replacement cover ordered.' },
    { id:'sn3', projectId:'p8', description:'Exterior cladding — small knot crack at 1.2m height', status:'complete',    priority:'low',    assignedTo:'Simon', dateIdentified:'2026-06-05', notes:'Filled and oiled.' },
    { id:'sn4', projectId:'p2', description:'Conduit run for stove needs rerouting past skylight', status:'open',        priority:'high',   assignedTo:'Ari',   dateIdentified:'2026-06-20', notes:'Reroute before final plasterboard.' },
  ],

  invoices: [
    { id:'inv1',  invoiceNo:'LW-2026-001', projectId:'p13', client:'House Hout Bay',    amount:165000, status:'paid',    issueDate:'2026-02-20', dueDate:'2026-03-07', notes:'Final payment — project complete.' },
    { id:'inv2',  invoiceNo:'LW-2026-002', projectId:'p14', client:'Black Sable',       amount:420000, status:'paid',    issueDate:'2026-01-28', dueDate:'2026-02-14', notes:'' },
    { id:'inv3',  invoiceNo:'LW-2026-003', projectId:'p15', client:'House Stellenbosch',amount:87500,  status:'paid',    issueDate:'2026-01-10', dueDate:'2026-01-25', notes:'50% deposit.' },
    { id:'inv4',  invoiceNo:'LW-2026-004', projectId:'p15', client:'House Stellenbosch',amount:87500,  status:'paid',    issueDate:'2026-04-05', dueDate:'2026-04-20', notes:'Final payment.' },
    { id:'inv5',  invoiceNo:'LW-2026-005', projectId:'p12', client:'House Bishopcourt', amount:145000, status:'paid',    issueDate:'2026-03-10', dueDate:'2026-03-25', notes:'Full payment on completion.' },
    { id:'inv6',  invoiceNo:'LW-2026-006', projectId:'p1',  client:'House Athol',       amount:142500, status:'paid',    issueDate:'2026-03-14', dueDate:'2026-03-29', notes:'50% deposit.' },
    { id:'inv7',  invoiceNo:'LW-2026-007', projectId:'p2',  client:'House Constantia',  amount:240000, status:'paid',    issueDate:'2026-02-05', dueDate:'2026-02-20', notes:'50% deposit.' },
    { id:'inv8',  invoiceNo:'LW-2026-008', projectId:'p3',  client:'Moove Sandton',     amount:190000, status:'paid',    issueDate:'2026-04-05', dueDate:'2026-04-20', notes:'50% deposit.' },
    { id:'inv9',  invoiceNo:'LW-2026-009', projectId:'p8',  client:'House Camps Bay',   amount:155000, status:'sent',    issueDate:'2026-05-15', dueDate:'2026-05-30', notes:'50% deposit.' },
    { id:'inv10', invoiceNo:'LW-2026-010', projectId:'p4',  client:'House Val de Vie',  amount:132500, status:'sent',    issueDate:'2026-04-22', dueDate:'2026-05-07', notes:'50% deposit.' },
    { id:'inv11', invoiceNo:'LW-2026-011', projectId:'p2',  client:'House Constantia',  amount:240000, status:'sent',    issueDate:'2026-06-01', dueDate:'2026-06-16', notes:'Progress payment — 80%.' },
    { id:'inv12', invoiceNo:'LW-2026-012', projectId:'p9',  client:'Silvan Lodge',      amount:204000, status:'draft',   issueDate:'2026-06-21', dueDate:'2026-07-05', notes:'30% deposit on contract sign.' },
    { id:'inv13', invoiceNo:'LW-2026-013', projectId:'p6',  client:'House Noordhoek',   amount:112500, status:'overdue', issueDate:'2026-05-20', dueDate:'2026-06-04', notes:'50% deposit — follow up required.' },
  ],

  expenses: [
    { id:'ex1',  projectId:'p1',  description:'Thermory cladding order 30m',      category:'materials',   amount:9600,  paidTo:'Thermory SA',      date:'2026-03-20', notes:'' },
    { id:'ex2',  projectId:'p1',  description:'Huum Drop 9kw stove',              category:'materials',   amount:8500,  paidTo:'Huum Baltic',      date:'2026-03-22', notes:'' },
    { id:'ex3',  projectId:'p2',  description:'Pavilion structural steel frame',  category:'materials',   amount:38000, paidTo:'Cape Steel',       date:'2026-02-08', notes:'' },
    { id:'ex4',  projectId:'p2',  description:'Electrician — first fix',          category:'contractor',  amount:6500,  paidTo:'Garreth Electric', date:'2026-06-15', notes:'' },
    { id:'ex5',  projectId:'p3',  description:'6× cold plunge acrylic shells',    category:'materials',   amount:48000, paidTo:'AquaForm SA',      date:'2026-04-05', notes:'' },
    { id:'ex6',  projectId:'p3',  description:'Plumber — rough-in',              category:'contractor',  amount:9200,  paidTo:'Nordic Plumbing',  date:'2026-06-18', notes:'' },
    { id:'ex7',  projectId:'p4',  description:'Ark pergola timber kit',           category:'materials',   amount:22000, paidTo:'Timber City',      date:'2026-04-25', notes:'' },
    { id:'ex8',  projectId:'p5',  description:'Thermory cladding full order',     category:'materials',   amount:14400, paidTo:'Thermory SA',      date:'2026-05-05', notes:'' },
    { id:'ex9',  projectId:'p9',  description:'Site trip to Kruger — flights',   category:'travel',      amount:3800,  paidTo:'Kulula',           date:'2026-06-12', notes:'' },
    { id:'ex10', projectId:'p9',  description:'Concept design — 3D renders',     category:'materials',   amount:12000, paidTo:'Studio Artvion',   date:'2026-06-15', notes:'' },
  ],

  designBriefs: [
    { id:'db1', projectId:'p9',  title:'Silvan Lodge — Wellness Suite Concept',  type:'concept',       status:'approved', designer:'Studio Artvion', createdDate:'2026-06-10', notes:'3 pavilion zones: sauna, cold plunge, steam. Biophilic design language. Approved by owner.' },
    { id:'db2', projectId:'p10', title:'House Clifton — Indoor Sauna Layout',   type:'technical',     status:'draft',    designer:'Ari',            createdDate:'2026-06-18', notes:'Constraints: 2.4m ceiling, existing marble floor. Door swing must face east.' },
    { id:'db3', projectId:'p11', title:'House Morningside — Tulikivi Proposal', type:'proposal',      status:'review',   designer:'Ari',            createdDate:'2026-06-19', notes:'Client wants soapstone stove as centrepiece. 2-tier bench. Backrests.' },
    { id:'db4', projectId:'p4',  title:'Val de Vie — Material Specification',   type:'material-spec', status:'approved', designer:'Ari',            createdDate:'2026-04-22', notes:'Thermory SIL for exterior. Cedar kelo for interior. Stainless fixings throughout.' },
    { id:'db5', projectId:'p2',  title:'House Constantia — 3D Render Package', type:'3d-model',      status:'approved', designer:'Studio Artvion', createdDate:'2026-02-03', notes:'Client approved render set v3. Night-mode lighting key selling point.' },
  ],
}
