import { RoadmapManager } from './roadmap';

function demo(): void {
  const manager = new RoadmapManager(
    'Livwell Business OS Roadmap',
    'End-to-end roadmap for building and scaling the Livwell Business Operating System'
  );

  // Phase 1: Foundation
  const phase1 = manager.addPhase(
    'Foundation',
    'Core infrastructure, authentication, and data architecture',
    '2026-01-01',
    '2026-03-31'
  );

  const m1 = manager.addMilestone(phase1.id, 'Auth & Identity', 'User authentication and role management', '2026-02-01');
  const f1 = manager.addFeature(phase1.id, m1.id, 'SSO Integration', 'Single sign-on via OAuth2', 'critical', 'Ari', ['auth', 'security']);
  const f2 = manager.addFeature(phase1.id, m1.id, 'Role-Based Access Control', 'Granular permission system', 'high', 'Ari', ['auth', 'rbac']);

  const m2 = manager.addMilestone(phase1.id, 'Data Layer', 'Database schema and API foundation', '2026-03-01');
  manager.addFeature(phase1.id, m2.id, 'Schema Design', 'Core entity schema', 'critical', 'Team', ['database']);
  manager.addFeature(phase1.id, m2.id, 'REST API v1', 'Initial REST endpoints', 'high', 'Team', ['api']);

  // Phase 2: Core Modules
  const phase2 = manager.addPhase(
    'Core Modules',
    'CRM, task management, and reporting modules',
    '2026-04-01',
    '2026-06-30'
  );

  const m3 = manager.addMilestone(phase2.id, 'CRM Module', 'Customer relationship management', '2026-05-01');
  manager.addFeature(phase2.id, m3.id, 'Contact Management', 'CRUD for contacts', 'high', 'Sales', ['crm']);
  manager.addFeature(phase2.id, m3.id, 'Pipeline View', 'Visual sales pipeline', 'medium', 'Sales', ['crm', 'ui']);

  // Phase 3: Growth
  const phase3 = manager.addPhase(
    'Growth & Automation',
    'Integrations, automations, and analytics',
    '2026-07-01',
    '2026-12-31'
  );

  const m4 = manager.addMilestone(phase3.id, 'Automation Engine', 'Workflow automation system', '2026-09-01');
  manager.addFeature(phase3.id, m4.id, 'Trigger Builder', 'Visual trigger configuration', 'high', 'Platform', ['automation']);
  manager.addFeature(phase3.id, m4.id, 'Action Library', '50+ pre-built actions', 'medium', 'Platform', ['automation', 'integrations']);

  // Simulate progress
  manager.updateFeatureStatus(phase1.id, m1.id, f1.id, 'completed');
  manager.updateFeatureStatus(phase1.id, m1.id, f2.id, 'in-progress');

  const stats = manager.getStats();

  console.log('\n========================================');
  console.log(` Livwell Business OS Roadmap`);
  console.log('========================================');
  console.log(`  Phases      : ${stats.totalPhases}`);
  console.log(`  Milestones  : ${stats.totalMilestones}`);
  console.log(`  Features    : ${stats.totalFeatures}`);
  console.log(`  Completed   : ${stats.completedFeatures}`);
  console.log(`  In Progress : ${stats.inProgressFeatures}`);
  console.log(`  Progress    : ${stats.completionPercent}%`);
  console.log('========================================\n');

  const critical = manager.getFeaturesByPriority('critical');
  console.log(`Critical features (${critical.length}):`);
  critical.forEach((f) => console.log(`  [${f.status}] ${f.title}`));
  console.log();

  const authFeatures = manager.searchFeatures('auth');
  console.log(`Search "auth" (${authFeatures.length} results):`);
  authFeatures.forEach((f) => console.log(`  ${f.title} — ${f.tags.join(', ')}`));
}

demo();
