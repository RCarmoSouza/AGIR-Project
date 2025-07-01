// Tipos TypeScript para o sistema AGIR
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Manager' | 'Developer' | 'Tester' | 'Designer';
  avatar?: string;
  hourlyRate?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Planning' | 'Active' | 'On Hold' | 'Completed';
  startDate: Date;
  endDate?: Date;
  manager: User;
  members: User[];
  hasSprintSupport: boolean;
  color?: string;
}

export interface Sprint {
  id: string;
  name: string;
  projectId: string;
  startDate: Date;
  endDate: Date;
  status: 'Planning' | 'Active' | 'Completed';
  goal: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'Epic' | 'Feature' | 'User Story' | 'Bug' | 'Task' | 'Subtask' | 'Spike' | 'Research' | 'Documentation' | 'Testing' | 'Improvement';
  status: 'Backlog' | 'To Do' | 'In Progress' | 'In Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee?: User;
  reporter: User;
  projectId: string;
  sprintId?: string;
  storyPoints?: number;
  estimatedHours?: number;
  actualHours?: number;
  parentTaskId?: string;
  level?: number;
  epicName?: string;
  tags: string[];
  comments: Comment[];
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedBy: User;
  uploadedAt: Date;
}

export interface TimeEntry {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  hours: number;
  description: string;
  projectId: string;
  taskId?: string;
  userId: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  cost?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardMetrics {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  totalHours: number;
  totalCost: number;
  activeSprints: number;
  teamMembers: number;
}

