import { Feature, Milestone, Phase, Roadmap, RoadmapStats, Status, Priority } from './types';
import { generateId, now } from './utils';

export class RoadmapManager {
  private roadmap: Roadmap;

  constructor(name: string, description: string) {
    this.roadmap = {
      id: generateId(),
      name,
      description,
      version: '1.0.0',
      createdAt: now(),
      updatedAt: now(),
      phases: [],
    };
  }

  static fromJSON(data: Roadmap): RoadmapManager {
    const manager = new RoadmapManager(data.name, data.description);
    manager.roadmap = data;
    return manager;
  }

  toJSON(): Roadmap {
    return this.roadmap;
  }

  addPhase(name: string, description: string, startDate: string, endDate: string): Phase {
    const phase: Phase = {
      id: generateId(),
      name,
      description,
      order: this.roadmap.phases.length + 1,
      status: 'not-started',
      startDate,
      endDate,
      milestones: [],
    };
    this.roadmap.phases.push(phase);
    this.touch();
    return phase;
  }

  addMilestone(phaseId: string, title: string, description: string, targetDate: string): Milestone {
    const phase = this.getPhase(phaseId);
    const milestone: Milestone = {
      id: generateId(),
      title,
      description,
      targetDate,
      status: 'not-started',
      features: [],
    };
    phase.milestones.push(milestone);
    this.touch();
    return milestone;
  }

  addFeature(
    phaseId: string,
    milestoneId: string,
    title: string,
    description: string,
    priority: Priority = 'medium',
    owner?: string,
    tags: string[] = []
  ): Feature {
    const milestone = this.getMilestone(phaseId, milestoneId);
    const feature: Feature = {
      id: generateId(),
      title,
      description,
      status: 'not-started',
      priority,
      owner,
      tags,
      createdAt: now(),
      updatedAt: now(),
    };
    milestone.features.push(feature);
    this.touch();
    return feature;
  }

  updateFeatureStatus(phaseId: string, milestoneId: string, featureId: string, status: Status): Feature {
    const feature = this.getFeature(phaseId, milestoneId, featureId);
    feature.status = status;
    feature.updatedAt = now();
    this.syncMilestoneStatus(phaseId, milestoneId);
    this.syncPhaseStatus(phaseId);
    this.touch();
    return feature;
  }

  updatePhaseStatus(phaseId: string, status: Status): Phase {
    const phase = this.getPhase(phaseId);
    phase.status = status;
    this.touch();
    return phase;
  }

  getStats(): RoadmapStats {
    let totalMilestones = 0;
    let totalFeatures = 0;
    let completedFeatures = 0;
    let inProgressFeatures = 0;

    for (const phase of this.roadmap.phases) {
      totalMilestones += phase.milestones.length;
      for (const milestone of phase.milestones) {
        totalFeatures += milestone.features.length;
        for (const feature of milestone.features) {
          if (feature.status === 'completed') completedFeatures++;
          if (feature.status === 'in-progress') inProgressFeatures++;
        }
      }
    }

    return {
      totalPhases: this.roadmap.phases.length,
      totalMilestones,
      totalFeatures,
      completedFeatures,
      inProgressFeatures,
      completionPercent: totalFeatures > 0 ? Math.round((completedFeatures / totalFeatures) * 100) : 0,
    };
  }

  getPhasesByStatus(status: Status): Phase[] {
    return this.roadmap.phases.filter((p) => p.status === status);
  }

  getFeaturesByPriority(priority: Priority): Feature[] {
    const features: Feature[] = [];
    for (const phase of this.roadmap.phases) {
      for (const milestone of phase.milestones) {
        features.push(...milestone.features.filter((f) => f.priority === priority));
      }
    }
    return features;
  }

  searchFeatures(query: string): Feature[] {
    const q = query.toLowerCase();
    const results: Feature[] = [];
    for (const phase of this.roadmap.phases) {
      for (const milestone of phase.milestones) {
        results.push(
          ...milestone.features.filter(
            (f) =>
              f.title.toLowerCase().includes(q) ||
              f.description.toLowerCase().includes(q) ||
              f.tags.some((t) => t.toLowerCase().includes(q))
          )
        );
      }
    }
    return results;
  }

  private getPhase(phaseId: string): Phase {
    const phase = this.roadmap.phases.find((p) => p.id === phaseId);
    if (!phase) throw new Error(`Phase not found: ${phaseId}`);
    return phase;
  }

  private getMilestone(phaseId: string, milestoneId: string): Milestone {
    const phase = this.getPhase(phaseId);
    const milestone = phase.milestones.find((m) => m.id === milestoneId);
    if (!milestone) throw new Error(`Milestone not found: ${milestoneId}`);
    return milestone;
  }

  private getFeature(phaseId: string, milestoneId: string, featureId: string): Feature {
    const milestone = this.getMilestone(phaseId, milestoneId);
    const feature = milestone.features.find((f) => f.id === featureId);
    if (!feature) throw new Error(`Feature not found: ${featureId}`);
    return feature;
  }

  private syncMilestoneStatus(phaseId: string, milestoneId: string): void {
    const milestone = this.getMilestone(phaseId, milestoneId);
    if (milestone.features.length === 0) return;
    const allComplete = milestone.features.every((f) => f.status === 'completed');
    const anyInProgress = milestone.features.some((f) => f.status === 'in-progress');
    if (allComplete) milestone.status = 'completed';
    else if (anyInProgress) milestone.status = 'in-progress';
  }

  private syncPhaseStatus(phaseId: string): void {
    const phase = this.getPhase(phaseId);
    if (phase.milestones.length === 0) return;
    const allComplete = phase.milestones.every((m) => m.status === 'completed');
    const anyInProgress = phase.milestones.some((m) => m.status === 'in-progress');
    if (allComplete) phase.status = 'completed';
    else if (anyInProgress) phase.status = 'in-progress';
  }

  private touch(): void {
    this.roadmap.updatedAt = now();
  }
}
