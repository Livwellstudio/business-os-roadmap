export type Status = 'not-started' | 'in-progress' | 'completed' | 'on-hold';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Feature {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  owner?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: Status;
  features: Feature[];
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  order: number;
  status: Status;
  startDate: string;
  endDate: string;
  milestones: Milestone[];
}

export interface Roadmap {
  id: string;
  name: string;
  description: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  phases: Phase[];
}

export interface RoadmapStats {
  totalPhases: number;
  totalMilestones: number;
  totalFeatures: number;
  completedFeatures: number;
  inProgressFeatures: number;
  completionPercent: number;
}
