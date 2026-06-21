import { RoadmapManager } from '../src/roadmap';

describe('RoadmapManager', () => {
  let manager: RoadmapManager;
  let phaseId: string;
  let milestoneId: string;
  let featureId: string;

  beforeEach(() => {
    manager = new RoadmapManager('Test Roadmap', 'A test business OS roadmap');
    const phase = manager.addPhase('Phase 1', 'First phase', '2026-01-01', '2026-03-31');
    phaseId = phase.id;
    const milestone = manager.addMilestone(phaseId, 'M1', 'First milestone', '2026-02-01');
    milestoneId = milestone.id;
    const feature = manager.addFeature(phaseId, milestoneId, 'Feature A', 'Desc A', 'high', 'Alice', ['tag1']);
    featureId = feature.id;
  });

  describe('Initialization', () => {
    it('creates a roadmap with correct name and description', () => {
      const data = manager.toJSON();
      expect(data.name).toBe('Test Roadmap');
      expect(data.description).toBe('A test business OS roadmap');
      expect(data.version).toBe('1.0.0');
    });

    it('generates a unique id', () => {
      const m2 = new RoadmapManager('Other', 'Other');
      expect(manager.toJSON().id).not.toBe(m2.toJSON().id);
    });

    it('serializes and restores via fromJSON', () => {
      const data = manager.toJSON();
      const restored = RoadmapManager.fromJSON(data);
      expect(restored.toJSON().id).toBe(data.id);
      expect(restored.toJSON().phases.length).toBe(1);
    });
  });

  describe('Phases', () => {
    it('adds a phase with correct order', () => {
      const phase2 = manager.addPhase('Phase 2', 'Second phase', '2026-04-01', '2026-06-30');
      expect(phase2.order).toBe(2);
      expect(manager.toJSON().phases.length).toBe(2);
    });

    it('new phase has not-started status', () => {
      const data = manager.toJSON();
      expect(data.phases[0].status).toBe('not-started');
    });

    it('updates phase status', () => {
      manager.updatePhaseStatus(phaseId, 'in-progress');
      expect(manager.toJSON().phases[0].status).toBe('in-progress');
    });

    it('throws when phase not found', () => {
      expect(() => manager.updatePhaseStatus('bad-id', 'completed')).toThrow('Phase not found: bad-id');
    });
  });

  describe('Milestones', () => {
    it('adds a milestone to the correct phase', () => {
      const m2 = manager.addMilestone(phaseId, 'M2', 'Second milestone', '2026-03-01');
      expect(manager.toJSON().phases[0].milestones.length).toBe(2);
      expect(m2.status).toBe('not-started');
    });

    it('throws when milestone phase not found', () => {
      expect(() => manager.addMilestone('bad-id', 'X', 'Y', '2026-01-01')).toThrow('Phase not found: bad-id');
    });
  });

  describe('Features', () => {
    it('adds a feature with correct fields', () => {
      const f = manager.toJSON().phases[0].milestones[0].features[0];
      expect(f.title).toBe('Feature A');
      expect(f.priority).toBe('high');
      expect(f.owner).toBe('Alice');
      expect(f.tags).toEqual(['tag1']);
      expect(f.status).toBe('not-started');
    });

    it('defaults priority to medium when not specified', () => {
      const f = manager.addFeature(phaseId, milestoneId, 'Feature B', 'Desc B');
      expect(f.priority).toBe('medium');
    });

    it('updates feature status', () => {
      manager.updateFeatureStatus(phaseId, milestoneId, featureId, 'completed');
      const f = manager.toJSON().phases[0].milestones[0].features[0];
      expect(f.status).toBe('completed');
    });

    it('throws when feature not found', () => {
      expect(() => manager.updateFeatureStatus(phaseId, milestoneId, 'bad-id', 'completed')).toThrow('Feature not found: bad-id');
    });
  });

  describe('Status propagation', () => {
    it('milestone becomes in-progress when a feature is in-progress', () => {
      manager.updateFeatureStatus(phaseId, milestoneId, featureId, 'in-progress');
      expect(manager.toJSON().phases[0].milestones[0].status).toBe('in-progress');
    });

    it('milestone becomes completed when all features are completed', () => {
      manager.updateFeatureStatus(phaseId, milestoneId, featureId, 'completed');
      expect(manager.toJSON().phases[0].milestones[0].status).toBe('completed');
    });

    it('phase becomes in-progress when a milestone is in-progress', () => {
      manager.updateFeatureStatus(phaseId, milestoneId, featureId, 'in-progress');
      expect(manager.toJSON().phases[0].status).toBe('in-progress');
    });

    it('phase becomes completed when all milestones are completed', () => {
      manager.updateFeatureStatus(phaseId, milestoneId, featureId, 'completed');
      expect(manager.toJSON().phases[0].status).toBe('completed');
    });
  });

  describe('Stats', () => {
    it('calculates correct totals for empty roadmap', () => {
      const fresh = new RoadmapManager('Empty', 'No phases');
      const stats = fresh.getStats();
      expect(stats.totalPhases).toBe(0);
      expect(stats.totalMilestones).toBe(0);
      expect(stats.totalFeatures).toBe(0);
      expect(stats.completionPercent).toBe(0);
    });

    it('calculates completion percent correctly', () => {
      manager.addFeature(phaseId, milestoneId, 'Feature B', 'Desc B', 'medium');
      manager.updateFeatureStatus(phaseId, milestoneId, featureId, 'completed');
      const stats = manager.getStats();
      expect(stats.totalFeatures).toBe(2);
      expect(stats.completedFeatures).toBe(1);
      expect(stats.completionPercent).toBe(50);
    });

    it('reflects 100% completion when all features are done', () => {
      manager.updateFeatureStatus(phaseId, milestoneId, featureId, 'completed');
      expect(manager.getStats().completionPercent).toBe(100);
    });
  });

  describe('Querying', () => {
    it('filters phases by status', () => {
      manager.updatePhaseStatus(phaseId, 'in-progress');
      const phases = manager.getPhasesByStatus('in-progress');
      expect(phases.length).toBe(1);
      expect(phases[0].id).toBe(phaseId);
    });

    it('filters features by priority', () => {
      manager.addFeature(phaseId, milestoneId, 'Feature B', 'Desc B', 'low');
      const high = manager.getFeaturesByPriority('high');
      expect(high.length).toBe(1);
      expect(high[0].title).toBe('Feature A');
    });

    it('searches features by title', () => {
      manager.addFeature(phaseId, milestoneId, 'Login Flow', 'Auth login page', 'medium');
      const results = manager.searchFeatures('login');
      expect(results.length).toBe(1);
      expect(results[0].title).toBe('Login Flow');
    });

    it('searches features by tag', () => {
      const results = manager.searchFeatures('tag1');
      expect(results.length).toBe(1);
      expect(results[0].title).toBe('Feature A');
    });

    it('returns empty array when search finds nothing', () => {
      expect(manager.searchFeatures('xyznotfound')).toHaveLength(0);
    });
  });
});
