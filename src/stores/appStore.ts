import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Project, Task, TaskType, Sprint, TimesheetEntry, TimesheetSummary } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  // Estado dos dados
  currentUser: User | null;
  users: User[];
  projects: Project[];
  tasks: Task[];
  taskTypes: TaskType[];
  selectedProject: Project | null;
  timesheetEntries: TimesheetEntry[];

  // Actions para usuários
  setCurrentUser: (user: User) => void;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;

  // Actions para projetos
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setSelectedProject: (project: Project | null) => void;
  getProjectById: (id: string) => Project | undefined;

  // Actions para tarefas
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksByProject: (projectId: string) => Task[];
  getTasksBySprint: (sprintId: string) => Task[];
  getBacklogTasks: (projectId: string) => Task[];
  moveTaskToSprint: (taskId: string, sprintId: string | null) => void;
  addComment: (taskId: string, content: string, author: User) => void;
  addAttachment: (taskId: string, attachment: any) => void;
  removeAttachment: (taskId: string, attachmentId: string) => void;
  getEpicForTask: (taskId: string) => string | null;

  // Actions para tipos de tarefa
  setTaskTypes: (taskTypes: TaskType[]) => void;
  addTaskType: (taskType: TaskType) => void;

  // Actions para sprints
  addSprint: (sprint: Sprint) => void;
  updateSprint: (projectId: string, sprintId: string, updates: Partial<Sprint>) => void;
  deleteSprint: (projectId: string, sprintId: string) => void;
  getSprints: (projectId: string) => Sprint[];

  // Actions para Timesheet
  addTimesheetEntry: (entry: TimesheetEntry) => void;
  updateTimesheetEntry: (id: string, updates: Partial<TimesheetEntry>) => void;
  deleteTimesheetEntry: (id: string) => void;
  getTimesheetSummary: (entries: TimesheetEntry[]) => TimesheetSummary;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      currentUser: null,
      users: [],
      projects: [],
      tasks: [],
      taskTypes: [],
      selectedProject: null,
      timesheetEntries: [],

      // Actions para usuários
      setCurrentUser: (user) => set({ currentUser: user }),
      setUsers: (users) => set({ users }),
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),

      // Actions para projetos
      setProjects: (projects) => set({ projects }),
      addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(project => 
          project.id === id ? { ...project, ...updates } : project
        )
      })),
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(project => project.id !== id)
      })),
      setSelectedProject: (project) => set({ selectedProject: project }),
      getProjectById: (id) => get().projects.find(project => project.id === id),

      // Actions para tarefas
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => {
        const newTask = {
          ...task,
          comments: [],
          attachments: [],
          level: task.parentId ? get().calculateTaskLevel(task.parentId) + 1 : 0,
          epicName: task.parentId ? get().calculateEpicName(task.parentId) : undefined,
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === id 
            ? { 
                ...task, 
                ...updates,
                epicName: updates.parentId !== undefined 
                  ? get().calculateEpicName(updates.parentId) 
                  : task.epicName
              } 
            : task
        )
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id)
      })),
      getTasksByProject: (projectId) => get().tasks.filter(task => task.projectId === projectId),
      getTasksBySprint: (sprintId) => get().tasks.filter(task => task.sprintId === sprintId),
      getBacklogTasks: (projectId) => get().tasks.filter(task => 
        task.projectId === projectId && 
        !task.sprintId &&
        !get().hasChildren(task.id) // Só mostra tarefas sem filhos
      ),
      moveTaskToSprint: (taskId, sprintId) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? { ...task, sprintId } : task
        )
      })),
      
      // Funções para hierarquia
      calculateTaskLevel: (parentId) => {
        if (!parentId) return 0;
        const parent = get().tasks.find(t => t.id === parentId);
        if (!parent) return 0;
        return (parent.level || 0) + 1;
      },
      
      calculateEpicName: (parentId) => {
        if (!parentId) return undefined;
        
        const findEpicInHierarchy = (taskId: string): string | undefined => {
          const task = get().tasks.find(t => t.id === taskId);
          if (!task) return undefined;
          
          // Se a tarefa atual é um épico, retorna seu nome
          if (task.type.name === 'Épico') {
            return task.title;
          }
          
          // Se tem pai, continua procurando
          if (task.parentId) {
            return findEpicInHierarchy(task.parentId);
          }
          
          return undefined;
        };
        
        return findEpicInHierarchy(parentId);
      },
      
      hasChildren: (taskId) => {
        return get().tasks.some(task => task.parentId === taskId);
      },
      
      getTaskChildren: (taskId) => {
        return get().tasks.filter(task => task.parentId === taskId);
      },
      
      // Actions para comentários
      addComment: (taskId, comment) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId 
            ? { 
                ...task, 
                comments: [...task.comments, comment]
              }
            : task
        )
      })),
      
      // Actions para anexos
      addAttachment: (taskId, attachment) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId 
            ? { 
                ...task, 
                attachments: [...task.attachments, attachment]
              }
            : task
        )
      })),
      
      removeAttachment: (taskId, attachmentId) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId 
            ? { 
                ...task, 
                attachments: task.attachments.filter(att => att.id !== attachmentId)
              }
            : task
        )
      })),

      // Actions para tipos de tarefa
      setTaskTypes: (taskTypes) => set({ taskTypes }),
      addTaskType: (taskType) => set((state) => ({ taskTypes: [...state.taskTypes, taskType] })),

      // Actions para sprints
      addSprint: (sprint) => set((state) => ({
        projects: state.projects.map(project => 
          project.id === sprint.projectId 
            ? { ...project, sprints: [...project.sprints, sprint] }
            : project
        )
      })),
      updateSprint: (projectId, sprintId, updates) => set((state) => ({
        projects: state.projects.map(project => 
          project.id === projectId 
            ? {
                ...project,
                sprints: project.sprints.map(sprint =>
                  sprint.id === sprintId ? { ...sprint, ...updates } : sprint
                )
              }
            : project
        )
      })),
      deleteSprint: (projectId, sprintId) => set((state) => ({
        projects: state.projects.map(project => 
          project.id === projectId 
            ? {
                ...project,
                sprints: project.sprints.filter(sprint => sprint.id !== sprintId)
              }
            : project
        )
      })),
      getSprints: (projectId) => {
        const project = get().projects.find(p => p.id === projectId);
        return project?.sprints || [];
      },

      // Actions para Timesheet
      addTimesheetEntry: (entry) => set((state) => ({
        timesheetEntries: [...state.timesheetEntries, entry]
      })),

      updateTimesheetEntry: (id, updates) => set((state) => ({
        timesheetEntries: state.timesheetEntries.map(entry => 
          entry.id === id ? { ...entry, ...updates } : entry
        )
      })),

      deleteTimesheetEntry: (id) => set((state) => ({
        timesheetEntries: state.timesheetEntries.filter(entry => entry.id !== id)
      })),

      getTimesheetSummary: (entries) => {
        const summary: TimesheetSummary = {
          totalHours: 0,
          totalCost: 0,
          entriesByProject: [],
          entriesByUser: []
        };

        // Calcular totais
        entries.forEach(entry => {
          summary.totalHours += entry.totalHours;
          summary.totalCost += entry.totalHours * (entry.user.hourlyRate || 0);
        });

        // Agrupar por projeto
        const projectMap = new Map<string, { hours: number; cost: number; name: string }>();
        entries.forEach(entry => {
          const existing = projectMap.get(entry.projectId) || { hours: 0, cost: 0, name: entry.project.name };
          existing.hours += entry.totalHours;
          existing.cost += entry.totalHours * (entry.user.hourlyRate || 0);
          projectMap.set(entry.projectId, existing);
        });

        summary.entriesByProject = Array.from(projectMap.entries()).map(([projectId, data]) => ({
          projectId,
          projectName: data.name,
          hours: data.hours,
          cost: data.cost
        }));

        // Agrupar por usuário
        const userMap = new Map<string, { hours: number; cost: number; name: string }>();
        entries.forEach(entry => {
          const existing = userMap.get(entry.userId) || { hours: 0, cost: 0, name: entry.user.name };
          existing.hours += entry.totalHours;
          existing.cost += entry.totalHours * (entry.user.hourlyRate || 0);
          userMap.set(entry.userId, existing);
        });

        summary.entriesByUser = Array.from(userMap.entries()).map(([userId, data]) => ({
          userId,
          userName: data.name,
          hours: data.hours,
          cost: data.cost
        }));

        return summary;
      }
    }),
    {
      name: 'sprint-planning-storage',
    }
  )
);

