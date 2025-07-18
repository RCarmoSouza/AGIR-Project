import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set, get) => ({
      // Estado do usuário (será carregado via API)
      currentUser: null,
      isAuthenticated: false,
      
      // Estados de loading
      loading: {
        projects: false,
        tasks: false,
        users: false,
        sprints: false,
        timeEntries: false,
        people: false
      },

      // Dados da aplicação (vazios inicialmente)
      projects: [],
      sprints: [],
      tasks: [],
      timeEntries: [],
      users: [],
      people: [],

      // Projeto selecionado
      selectedProjectId: null,

      // Actions para autenticação
      setCurrentUser: (user) => set({ currentUser: user, isAuthenticated: !!user }),
      logout: () => set({ currentUser: null, isAuthenticated: false }),

      // Actions para loading states
      setLoading: (key, value) => set((state) => ({
        loading: { ...state.loading, [key]: value }
      })),

      // Actions para projetos
      setProjects: (projects) => set({ projects }),
      addProject: (project) => set((state) => ({
        projects: [...state.projects, project]
      })),
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id)
      })),

      // Actions para sprints
      setSprints: (sprints) => set({ sprints }),
      addSprint: (sprint) => set((state) => ({
        sprints: [...state.sprints, sprint]
      })),
      updateSprint: (id, updates) => set((state) => ({
        sprints: state.sprints.map(s => s.id === id ? { ...s, ...updates } : s)
      })),
      deleteSprint: (id) => set((state) => ({
        sprints: state.sprints.filter(s => s.id !== id)
      })),

      // Actions para tarefas
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, task]
      })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),
      moveTask: (taskId, newStatus, newSprintId = null) => set((state) => ({
        tasks: state.tasks.map(t => 
          t.id === taskId 
            ? { ...t, status: newStatus, sprintId: newSprintId }
            : t
        )
      })),

      // Actions para usuários
      setUsers: (users) => set({ users }),
      addUser: (user) => set((state) => ({
        users: [...state.users, user]
      })),
      updateUser: (id, updates) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, ...updates } : u)
      })),
      deleteUser: (id) => set((state) => ({
        users: state.users.filter(u => u.id !== id)
      })),

      // Actions para timesheet
      setTimeEntries: (timeEntries) => set({ timeEntries }),
      addTimeEntry: (entry) => set((state) => ({
        timeEntries: [...state.timeEntries, entry]
      })),
      updateTimeEntry: (id, updates) => set((state) => ({
        timeEntries: state.timeEntries.map(e => 
          e.id === id ? { ...e, ...updates } : e
        )
      })),
      deleteTimeEntry: (id) => set((state) => ({
        timeEntries: state.timeEntries.filter(e => e.id !== id)
      })),

      // Actions para pessoas
      setPeople: (people) => set({ people }),
      addPerson: (person) => set((state) => ({
        people: [...state.people, person]
      })),
      updatePerson: (id, updates) => set((state) => ({
        people: state.people.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      removePerson: (id) => set((state) => ({
        people: state.people.filter(p => p.id !== id)
      })),

      // Seleção de projeto
      setSelectedProject: (projectId) => set({ selectedProjectId: projectId }),

      // Getters
      getProjectById: (id) => get().projects.find(p => p.id === id),
      getTasksByProject: (projectId) => get().tasks.filter(t => t.projectId === projectId),
      getTasksBySprint: (sprintId) => get().tasks.filter(t => t.sprintId === sprintId),
      getSprintsByProject: (projectId) => get().sprints.filter(s => s.projectId === projectId),
      getTimeEntriesByProject: (projectId) => get().timeEntries.filter(e => e.projectId === projectId),
      getAllTasks: () => get().tasks,

      // Métricas do dashboard (calculadas a partir dos dados reais)
      getDashboardMetrics: () => {
        const state = get();
        return {
          totalProjects: state.projects.length,
          activeProjects: state.projects.filter(p => p.status === 'Active').length,
          totalTasks: state.tasks.length,
          completedTasks: state.tasks.filter(t => t.status === 'Concluído').length,
          totalHours: state.timeEntries.reduce((sum, e) => sum + (e.hours || 0), 0),
          totalCost: state.timeEntries.reduce((sum, e) => sum + (e.cost || 0), 0),
          activeSprints: state.sprints.filter(s => s.status === 'Active').length,
          teamMembers: new Set(state.users.map(u => u.id)).size
        };
      },

      // Limpar todos os dados (útil para logout)
      clearAllData: () => set({
        projects: [],
        sprints: [],
        tasks: [],
        timeEntries: [],
        users: [],
        people: [],
        selectedProjectId: null,
        currentUser: null,
        isAuthenticated: false
      })
    }),
    {
      name: 'agir-storage',
      partialize: (state) => ({
        // Persistir apenas dados essenciais, não dados de API
        selectedProjectId: state.selectedProjectId,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAppStore;
export { useAppStore };

