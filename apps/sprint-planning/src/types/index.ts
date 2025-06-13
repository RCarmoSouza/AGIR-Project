// Tipos principais para a ferramenta de planejamento de sprints

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'developer' | 'designer' | 'tester';
  avatar?: string;
  isExternal?: boolean;
  leaderId?: string; // ID do líder para aprovação
  hourlyRate?: number; // Taxa por hora para cálculo de custos
}

export interface TaskType {
  id: string;
  name: string;
  color: string;
  icon: string;
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
  url: string;
  size: number;
  type: string;
  uploadedBy: User;
  uploadedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'todo' | 'in-progress' | 'in-review' | 'done';
  projectId: string;
  sprintId?: string | null;
  assignee?: User;
  storyPoints?: number;
  estimatedHours?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  parentId?: string; // Para hierarquia de tarefas
  comments: Comment[];
  attachments: Attachment[];
}

export interface Sprint {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed';
  projectId: string;
  tasks: Task[];
  goal?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  teamMembers: User[];
  sprints: Sprint[];
  usesSprints: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para Timesheet
export interface TimesheetEntry {
  id: string;
  userId: string;
  user: User;
  projectId: string;
  project: Project;
  taskId?: string;
  task?: Task;
  date: Date;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  totalHours: number; // Calculado automaticamente
  description: string; // Obrigatório
  status: 'draft' | 'submitted' | 'approved_pm' | 'approved_leader' | 'rejected';
  approvedByPM?: User;
  approvedByLeader?: User;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimesheetSummary {
  totalHours: number;
  totalCost: number;
  entriesByProject: {
    projectId: string;
    projectName: string;
    hours: number;
    cost: number;
  }[];
  entriesByUser: {
    userId: string;
    userName: string;
    hours: number;
    cost: number;
  }[];
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: Task['status'];
  color: string;
  limit?: number;
}

