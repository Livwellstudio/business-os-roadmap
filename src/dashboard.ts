import chalk from 'chalk';
import { RoadmapManager } from './roadmap';
import { Phase, Feature } from './types';

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ─── Primitives ───────────────────────────────────────────────────────────────

function bar(pct: number, w = 40): string {
  const n = Math.round((pct / 100) * w);
  return chalk.green('█'.repeat(n)) + chalk.gray('░'.repeat(w - n));
}

function badge(status: string): string {
  switch (status) {
    case 'completed':   return chalk.bgGreen.black(' DONE        ');
    case 'in-progress': return chalk.bgYellow.black(' IN PROGRESS ');
    case 'on-hold':     return chalk.bgRed.white(  ' ON HOLD     ');
    default:            return chalk.bgGray.black(  ' PENDING     ');
  }
}

function icon(status: string): string {
  switch (status) {
    case 'completed':   return chalk.green('✓');
    case 'in-progress': return chalk.yellow('►');
    case 'on-hold':     return chalk.red('■');
    default:            return chalk.gray('○');
  }
}

function priorityChalk(p: string): chalk.Chalk {
  switch (p) {
    case 'critical': return chalk.red.bold;
    case 'high':     return chalk.yellow;
    case 'medium':   return chalk.cyan;
    default:         return chalk.gray;
  }
}

// ─── Data ─────────────────────────────────────────────────────────────────────

interface RoadmapBundle {
  manager: RoadmapManager;
  [key: string]: unknown;
}

function buildRoadmap(): RoadmapBundle {
  const m = new RoadmapManager('Livwell Business OS', 'Complete BOS for modern studios');

  const p1 = m.addPhase('Foundation',     'Auth, data layer, core APIs',          '2026-01-01', '2026-03-31');
  const p2 = m.addPhase('Core Modules',   'CRM, tasks, billing, reporting',        '2026-04-01', '2026-06-30');
  const p3 = m.addPhase('Growth & Scale', 'Automation, integrations, analytics',   '2026-07-01', '2026-12-31');

  const ms1a = m.addMilestone(p1.id, 'Auth & Identity',  'SSO + RBAC system',      '2026-02-01');
  const ms1b = m.addMilestone(p1.id, 'Data Layer',       'Schema + REST API',       '2026-03-01');
  const ms2a = m.addMilestone(p2.id, 'CRM Module',       'Contacts + pipeline',     '2026-05-01');
  const ms2b = m.addMilestone(p2.id, 'Task Management',  'Projects + tasks',        '2026-06-01');
  const ms3a = m.addMilestone(p3.id, 'Automation Engine','Visual workflow builder', '2026-09-01');
  const ms3b = m.addMilestone(p3.id, 'Analytics Suite',  'KPIs + custom reports',   '2026-11-01');

  const f1 = m.addFeature(p1.id, ms1a.id, 'SSO Integration',          'OAuth2 / SAML single sign-on',  'critical', 'Ari',       ['auth','security']);
  const f2 = m.addFeature(p1.id, ms1a.id, 'Role-Based Access Control', 'Granular permission system',    'high',     'Ari',       ['auth','rbac']);
  const f3 = m.addFeature(p1.id, ms1a.id, 'Multi-Factor Auth',         '2FA via SMS and TOTP',          'high',     'Ari',       ['auth','security']);
  const f4 = m.addFeature(p1.id, ms1b.id, 'Schema Design',             'Core entity data model',        'critical', 'Team',      ['database']);
  const f5 = m.addFeature(p1.id, ms1b.id, 'REST API v1',               '40+ endpoints, OpenAPI spec',   'high',     'Team',      ['api']);
        m.addFeature(p2.id, ms2a.id, 'Contact Management',       'Full CRM CRUD + history',       'high',     'Sales',     ['crm']);
        m.addFeature(p2.id, ms2a.id, 'Pipeline View',            'Visual Kanban sales pipeline',  'medium',   'Sales',     ['crm','ui']);
        m.addFeature(p2.id, ms2a.id, 'Email Integration',        'Two-way Gmail / Outlook sync',  'high',     'Sales',     ['crm','integrations']);
        m.addFeature(p2.id, ms2b.id, 'Project Boards',           'Kanban and list views',         'high',     'PM',        ['tasks']);
        m.addFeature(p2.id, ms2b.id, 'Time Tracking',            'Built-in time logging',         'medium',   'PM',        ['tasks','billing']);
        m.addFeature(p3.id, ms3a.id, 'Trigger Builder',          'Visual trigger config UI',      'high',     'Platform',  ['automation']);
        m.addFeature(p3.id, ms3a.id, 'Action Library',           '60+ pre-built actions',         'medium',   'Platform',  ['automation']);
        m.addFeature(p3.id, ms3a.id, 'Webhook Manager',          'Inbound and outbound hooks',    'medium',   'Platform',  ['automation','api']);
        m.addFeature(p3.id, ms3b.id, 'KPI Dashboard',            'Real-time business metrics',    'critical', 'Analytics', ['analytics']);
        m.addFeature(p3.id, ms3b.id, 'Report Builder',           'Drag-drop custom reports',      'medium',   'Analytics', ['analytics']);

  m.updateFeatureStatus(p1.id, ms1a.id, f1.id, 'completed');
  m.updateFeatureStatus(p1.id, ms1a.id, f2.id, 'completed');
  m.updateFeatureStatus(p1.id, ms1a.id, f3.id, 'in-progress');
  m.updateFeatureStatus(p1.id, ms1b.id, f4.id, 'completed');
  m.updateFeatureStatus(p1.id, ms1b.id, f5.id, 'in-progress');

  return { manager: m, p1, p2, p3, ms1a, ms1b, ms2a, ms2b, ms3a, ms3b };
}

// ─── Render sections ──────────────────────────────────────────────────────────

function renderHeader(): void {
  const W = 70;
  const top    = chalk.cyan('╔' + '═'.repeat(W) + '╗');
  const bottom = chalk.cyan('╚' + '═'.repeat(W) + '╝');
  const row    = (s: string) => chalk.cyan('║') + s + chalk.cyan('║');
  const blank  = row(' '.repeat(W));

  console.log(top);
  console.log(blank);
  console.log(row('  ' + chalk.bold.white('◆  L I V W E L L  ◆') + chalk.gray('  ─────────────────────────────────────────────────') + '  '));
  console.log(blank);
  console.log(row('  ' + chalk.bold.cyan('B U S I N E S S   O P E R A T I N G   S Y S T E M') + ' '.repeat(20) + ''));
  console.log(row('  ' + chalk.white('R O A D M A P   D A S H B O A R D') + chalk.gray('                      ') + chalk.dim('v 1 . 0          ')));
  console.log(blank);
  console.log(row(chalk.dim('  Livwell Studio  ·  2026 Q1 → Q4  ·  15 Features across 3 Phases' + ' '.repeat(5))));
  console.log(blank);
  console.log(bottom);
}

function renderStats(stats: ReturnType<RoadmapManager['getStats']>): void {
  console.log('');
  console.log('  ' + chalk.bold.white('OVERVIEW') + '  ' + chalk.gray('─'.repeat(60)));
  console.log('');

  const kpis = [
    { label: 'PHASES',     value: String(stats.totalPhases),       color: chalk.cyan.bold },
    { label: 'MILESTONES', value: String(stats.totalMilestones),   color: chalk.cyan.bold },
    { label: 'FEATURES',   value: String(stats.totalFeatures),     color: chalk.cyan.bold },
    { label: 'DONE',       value: String(stats.completedFeatures), color: chalk.green.bold },
    { label: 'ACTIVE',     value: String(stats.inProgressFeatures),color: chalk.yellow.bold },
    { label: 'PROGRESS',   value: stats.completionPercent + '%',   color: chalk.magenta.bold },
  ];

  const cw = 11;
  const g  = chalk.gray;
  console.log('  ' + g('┌' + ('─'.repeat(cw) + '┬').repeat(kpis.length - 1) + '─'.repeat(cw) + '┐'));

  const valRow = kpis.map(k => k.color(k.value.padStart(Math.ceil((cw + k.value.length) / 2)).padEnd(cw))).join(g('│'));
  console.log('  ' + g('│') + valRow + g('│'));

  const lblRow = kpis.map(k => g(k.label.padStart(Math.ceil((cw + k.label.length) / 2)).padEnd(cw))).join(g('│'));
  console.log('  ' + g('│') + lblRow + g('│'));

  console.log('  ' + g('└' + ('─'.repeat(cw) + '┴').repeat(kpis.length - 1) + '─'.repeat(cw) + '┘'));

  console.log('');
  console.log('  ' + chalk.gray('Overall  ') + bar(stats.completionPercent, 52) + '  ' + chalk.bold.white(stats.completionPercent + '%'));
}

function renderPhases(phases: Phase[]): void {
  console.log('');
  console.log('  ' + chalk.bold.white('PHASES') + '  ' + chalk.gray('─'.repeat(62)));

  for (const phase of phases) {
    const allFeatures = phase.milestones.flatMap((ms) => ms.features);
    const done   = allFeatures.filter((f) => f.status === 'completed').length;
    const active = allFeatures.filter((f) => f.status === 'in-progress').length;
    const total  = allFeatures.length;
    const pct    = total > 0 ? Math.round((done / total) * 100) : 0;

    console.log('');
    console.log(`  ${icon(phase.status)} ${chalk.bold.white('PHASE ' + phase.order + '  ·  ' + phase.name.toUpperCase())}  ${badge(phase.status)}`);
    console.log(`    ${chalk.gray(phase.startDate.slice(0, 7) + ' → ' + phase.endDate.slice(0, 7))}   ${chalk.dim(phase.description)}`);
    console.log(`    ${bar(pct, 46)}  ${chalk.bold.white(pct + '%')}   ${chalk.green(done + ' done')} ${chalk.yellow(active + ' active')} ${chalk.gray((total - done - active) + ' pending')}`);
    console.log('');

    for (const ms of phase.milestones) {
      const mDone  = ms.features.filter((f) => f.status === 'completed').length;
      const mTotal = ms.features.length;
      console.log(`    ${icon(ms.status)} ${chalk.bold.gray(ms.title)}  ${chalk.dim(mDone + '/' + mTotal)}`);

      for (const f of ms.features) {
        const pc = priorityChalk(f.priority);
        const tag = pc('[' + f.priority + ']');
        console.log(`       ${pc('▸')} ${icon(f.status)} ${chalk.white(f.title)}  ${chalk.dim(f.owner ?? '')}  ${tag}`);
      }
      console.log('');
    }
  }
}

function renderPriorities(manager: RoadmapManager): void {
  console.log('  ' + chalk.bold.white('PRIORITY BREAKDOWN') + '  ' + chalk.gray('─'.repeat(50)));
  console.log('');

  for (const p of ['critical', 'high', 'medium', 'low'] as const) {
    const features = manager.getFeaturesByPriority(p);
    if (features.length === 0) continue;

    const done   = features.filter((f) => f.status === 'completed').length;
    const active = features.filter((f) => f.status === 'in-progress').length;
    const total  = features.length;
    const bW     = 32;
    const dN     = Math.round((done   / total) * bW);
    const aN     = Math.round((active / total) * bW);
    const pN     = bW - dN - aN;

    const segBar = chalk.green('█'.repeat(dN)) + chalk.yellow('█'.repeat(aN)) + chalk.gray('░'.repeat(pN));
    const label  = p.toUpperCase().padEnd(8);
    const pc     = priorityChalk(p);

    console.log(`  ${pc(label)}  ${segBar}  ${chalk.white(total + ' features')}  ${chalk.green(done + '✓')} ${chalk.yellow(active + '►')} ${chalk.gray((total - done - active) + '○')}`);
  }
}

function renderActivity(manager: RoadmapManager): void {
  console.log('');
  console.log('  ' + chalk.bold.white('ACTIVITY FEED') + '  ' + chalk.gray('─'.repeat(55)));
  console.log('');

  const data = manager.toJSON();
  for (const phase of data.phases) {
    for (const ms of phase.milestones) {
      for (const f of ms.features) {
        if (f.status !== 'completed' && f.status !== 'in-progress') continue;
        const c = f.status === 'completed' ? chalk.green : chalk.yellow;
        console.log(`  ${icon(f.status)}  ${c.bold(f.title)}`);
        console.log(`     ${chalk.gray(ms.title + '  ·  ' + phase.name)}  ${chalk.dim(f.updatedAt.slice(0, 10))}`);
      }
    }
  }
}

// ─── Animation helpers ────────────────────────────────────────────────────────

async function spin(label: string, ms: number): Promise<void> {
  const frames = ['|', '/', '-', '\\'];
  const end = Date.now() + ms;
  let i = 0;
  while (Date.now() < end) {
    process.stdout.write(`\r  ${chalk.cyan(frames[i++ % 4])}  ${chalk.gray(label)}`);
    await sleep(60);
  }
  process.stdout.write('\r' + ' '.repeat(label.length + 10) + '\r');
}

function redraw(manager: RoadmapManager): void {
  process.stdout.write('\x1Bc');
  renderHeader();
  renderStats(manager.getStats());
  renderPhases(manager.toJSON().phases);
  renderPriorities(manager);
  renderActivity(manager);
  console.log('');
  console.log('  ' + chalk.gray('─'.repeat(68)));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const loadSteps = [
    'Initializing roadmap engine   ',
    'Loading phase data            ',
    'Calculating metrics           ',
    'Rendering dashboard           ',
  ];
  for (const step of loadSteps) {
    await spin(step + '...', 480);
  }

  const { manager } = buildRoadmap();
  redraw(manager);

  console.log(chalk.dim('  Simulating live feature deployments...\n'));
  await sleep(1500);

  // Live simulation: complete 3 more features one by one
  const live: Array<{ label: string; phaseId: string; msId: string; fId: string }> = [];

  // Collect in-progress and pending features to "complete" live
  const data = manager.toJSON();
  for (const phase of data.phases) {
    for (const ms of phase.milestones) {
      for (const f of ms.features) {
        if (f.status === 'in-progress' || f.status === 'not-started') {
          live.push({ label: f.title, phaseId: phase.id, msId: ms.id, fId: f.id });
        }
      }
    }
  }

  const toAnimate = live.slice(0, 3);

  for (const task of toAnimate) {
    process.stdout.write(`\n  ${chalk.yellow('►')}  Deploying: ${chalk.bold.white(task.label)}`);
    await sleep(400);
    await spin(`  Deploying: ${task.label}`, 1200);
    manager.updateFeatureStatus(task.phaseId, task.msId, task.fId, 'completed');
    redraw(manager);
    process.stdout.write(`  ${chalk.green('✓')}  ${chalk.green.bold('Deployed:')} ${chalk.white(task.label)}\n`);
    await sleep(800);
  }

  const final = manager.getStats();
  console.log('');
  console.log('  ' + chalk.gray('─'.repeat(68)));
  console.log(`\n  ${chalk.bold.green('SIMULATION COMPLETE')}  ·  ${chalk.bold.white(final.completionPercent + '%')} of roadmap delivered\n`);
}

main().catch(console.error);
