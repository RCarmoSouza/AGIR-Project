// Tipos compartilhados entre módulos do AGIR

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'developer' | 'designer' | 'tester';
  avatar?: string;
  hourlyRate?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  budget?: number;
  color: string;
  ownerId: string;
  teamMembers: string[];
  settings: {
    usesSprints: boolean;
    sprintDuration: number;
    allowTimeTracking: boolean;
    requireApproval: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  sprintId?: string;
  parentTaskId?: string;
  assigneeId?: string;
  reporterId: string;
  storyPoints?: number;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
  attachments: Attachment[];
}

export interface TaskType {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
}

export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'lowest' | 'low' | 'medium' | 'high' | 'highest' | 'critical';

export interface Sprint {
  id: string;
  name: string;
  goal?: string;
  projectId: string;
  status: 'planning' | 'active' | 'completed';
  startDate: Date;
  endDate: Date;
  capacity?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface TimesheetEntry {
  id: string;
  date: string;
  projectId: string;
  projectName: string;
  taskId?: string;
  taskName?: string;
  startTime: string;
  endTime: string;
  hours: number;
  description: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  userId: string;
  userName: string;
  hourlyRate: number;
  cost: number;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: TaskStatus;
  color: string;
  wipLimit?: number;
  order: number;
}

// Estados da aplicação
export interface AppState {
  currentUser: User | null;
  selectedProject: Project | null;
  users: User[];
  projects: Project[];
  tasks: Task[];
  sprints: Sprint[];
  taskTypes: TaskType[];
  timesheetEntries: TimesheetEntry[];
}

// Ações da aplicação
export interface AppActions {
  // Usuários
  setCurrentUser: (user: User | null) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Projetos
  setSelectedProject: (project: Project | null) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;

  // Tarefas
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  moveTaskToSprint: (taskId: string, sprintId: string | null) => void;
  getTasksByProject: (projectId: string) => Task[];
  getTasksBySprint: (sprintId: string) => Task[];
  getBacklogTasks: (projectId: string) => Task[];

  // Sprints
  addSprint: (sprint: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSprint: (id: string, updates: Partial<Sprint>) => void;
  deleteSprint: (id: string) => void;
  getSprints: (projectId: string) => Sprint[];

  // Timesheet
  addTimesheetEntry: (entry: Omit<TimesheetEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTimesheetEntry: (id: string, updates: Partial<TimesheetEntry>) => void;
  deleteTimesheetEntry: (id: string) => void;
  getTimesheetEntries: (filters?: {
    userId?: string;
    projectId?: string;
    startDate?: string;
    endDate?: string;
    status?: TimesheetEntry['status'];
  }) => TimesheetEntry[];

  // Comentários e Anexos
  addComment: (taskId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addAttachment: (taskId: string, attachment: Omit<Attachment, 'id' | 'uploadedAt'>) => void;
  removeAttachment: (taskId: string, attachmentId: string) => void;

  // Utilitários
  loadSampleData: () => void;
  clearAllData: () => void;
}

