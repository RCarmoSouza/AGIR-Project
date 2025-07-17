import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set, get) => ({
      // Estado do usuário
      currentUser: {
        id: '1',
        name: 'Ana Silva',
        email: 'ana.silva@agir.com',
        role: 'Manager',
        hourlyRate: 150
      },

      // Projetos
      projects: [
        {
          id: '1',
          name: 'Sistema de E-commerce',
          acronym: 'SEC',
          description: 'Desenvolvimento de plataforma de vendas online',
          status: 'Active',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-06-30'),
          manager: { id: '1', name: 'Ana Silva', role: 'Manager' },
          members: [
            { id: '1', name: 'Ana Silva', role: 'Manager' },
            { id: '2', name: 'Carlos Santos', role: 'Developer' },
            { id: '3', name: 'Maria Oliveira', role: 'Designer' }
          ],
          hasSprintSupport: true,
          color: '#3B82F6',
          taskCounter: 4
        },
        {
          id: '2',
          name: 'App Mobile',
          acronym: 'APP',
          description: 'Aplicativo móvel para iOS e Android',
          status: 'Planning',
          startDate: new Date('2024-03-01'),
          manager: { id: '1', name: 'Ana Silva', role: 'Manager' },
          members: [
            { id: '1', name: 'Ana Silva', role: 'Manager' },
            { id: '4', name: 'João Costa', role: 'Developer' }
          ],
          hasSprintSupport: true,
          color: '#10B981',
          taskCounter: 0
        },
        {
          id: '3',
          name: 'Website Institucional',
          acronym: 'WEI',
          description: 'Site corporativo da empresa',
          status: 'Completed',
          startDate: new Date('2023-11-01'),
          endDate: new Date('2024-01-15'),
          manager: { id: '1', name: 'Ana Silva', role: 'Manager' },
          members: [
            { id: '1', name: 'Ana Silva', role: 'Manager' },
            { id: '3', name: 'Maria Oliveira', role: 'Designer' }
          ],
          hasSprintSupport: false,
          color: '#8B5CF6',
          taskCounter: 0
        }
      ],

      // Sprints
      sprints: [
        {
          id: '1',
          name: 'Sprint 1 - Setup Inicial',
          projectId: '1',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-01-29'),
          status: 'Completed',
          goal: 'Configurar ambiente de desenvolvimento e estrutura base'
        },
        {
          id: '2',
          name: 'Sprint 2 - Autenticação',
          projectId: '1',
          startDate: new Date('2024-01-30'),
          endDate: new Date('2024-02-13'),
          status: 'Active',
          goal: 'Implementar sistema de login e registro de usuários'
        }
      ],

          // Tarefas
      tasks: [
        {
          id: 'SEC-1',
          title: 'Configurar ambiente de desenvolvimento',
          description: 'Configurar ambiente local e ferramentas de desenvolvimento',
          type: 'Task',
          status: 'Concluído',
          priority: 'High',
          assignee: { id: '2', name: 'Carlos Santos', role: 'Developer' },
          reporter: { id: '1', name: 'Ana Silva', role: 'Manager' },
          projectId: '1',
          sprintId: null,
          storyPoints: 3,
          estimatedHours: 8,
          actualHours: 6,
          progress: 100,
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-01-17'),
          duration: 3,
          predecessors: [],
          successors: ['SEC-2'],
          dependencyType: 'FS',
          workstream: 'Infrastructure',
          level: 0,
          parentId: null,
          tags: ['setup', 'environment'],
          comments: [],
          attachments: [],
          schedulingMode: 'automatic',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-17')
        },
        {
          id: 'SEC-2',
          title: 'Criar sistema de autenticação',
          description: 'Implementar login, logout e controle de acesso',
          type: 'Epic',
          status: 'Em Progresso',
          priority: 'High',
          assignee: { id: '2', name: 'Carlos Santos', role: 'Developer' },
          reporter: { id: '1', name: 'Ana Silva', role: 'Manager' },
          projectId: '1',
          sprintId: '1',
          storyPoints: 8,
          estimatedHours: 20,
          actualHours: 12,
          progress: 60,
          startDate: new Date('2024-01-18'),
          endDate: new Date('2024-01-25'),
          duration: 6,
          predecessors: ['SEC-1'],
          successors: ['SEC-3'],
          dependencyType: 'FS',
          workstream: 'Backend',
          level: 0,
          parentId: null,
          tags: ['auth', 'security'],
          comments: [],
          attachments: [],
          schedulingMode: 'automatic',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20'),
          hasChildren: true,
          isExpanded: true
        },
        {
          id: 'SEC-2.1',
          title: 'Implementar backend de autenticação',
          description: 'Criar APIs de login e logout',
          type: 'Task',
          status: 'Em Progresso',
          priority: 'High',
          assignee: { id: '2', name: 'Carlos Santos', role: 'Developer' },
          reporter: { id: '1', name: 'Ana Silva', role: 'Manager' },
          projectId: '1',
          sprintId: '1',
          storyPoints: 5,
          estimatedHours: 12,
          actualHours: 8,
          progress: 70,
          startDate: new Date('2024-01-18'),
          endDate: new Date('2024-01-22'),
          duration: 4,
          predecessors: ['SEC-1'],
          successors: ['SEC-2.2'],
          dependencyType: 'FS',
          workstream: 'Backend',
          level: 1,
          parentId: 'SEC-2',
          tags: ['auth', 'backend'],
          comments: [],
          attachments: [],
          schedulingMode: 'automatic',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20')
        },
        {
          id: 'SEC-2.2',
          title: 'Criar middleware de segurança',
          description: 'Implementar validação de tokens e proteção de rotas',
          type: 'Task',
          status: 'A Fazer',
          priority: 'High',
          assignee: { id: '2', name: 'Carlos Santos', role: 'Developer' },
          reporter: { id: '1', name: 'Ana Silva', role: 'Manager' },
          projectId: '1',
          sprintId: '1',
          storyPoints: 3,
          estimatedHours: 8,
          actualHours: 0,
          progress: 0,
          startDate: new Date('2024-01-23'),
          endDate: new Date('2024-01-25'),
          duration: 2,
          predecessors: ['SEC-2.1'],
          successors: [],
          dependencyType: 'FS',
          workstream: 'Backend',
          level: 1,
          parentId: 'SEC-2',
          tags: ['auth', 'security'],
          comments: [],
          attachments: [],
          schedulingMode: 'automatic',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20')
        },
        {
          id: 'SEC-3',
          title: 'Design da interface de login',
          description: 'Criar wireframes e protótipos da tela de login',
          type: 'Epic',
          status: 'A Fazer',
          priority: 'Medium',
          assignee: { id: '3', name: 'Maria Oliveira', role: 'Designer' },
          reporter: { id: '1', name: 'Ana Silva', role: 'Manager' },
          projectId: '1',
          sprintId: '2',
          storyPoints: 5,
          estimatedHours: 16,
          actualHours: 0,
          progress: 0,
          startDate: new Date('2024-01-26'),
          endDate: new Date('2024-02-02'),
          duration: 5,
          predecessors: ['SEC-2'],
          successors: ['SEC-4', 'SEC-5'],
          dependencyType: 'FS',
          workstream: 'Frontend',
          level: 0,
          parentId: null,
          tags: ['design', 'ui'],
          comments: [],
          attachments: [],
          schedulingMode: 'automatic',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-26'),
          hasChildren: true,
          isExpanded: true
        },
        {
          id: 'SEC-3.1',
          title: 'Criar wireframes',
          description: 'Desenvolver wireframes da tela de login',
          type: 'Task',
          status: 'A Fazer',
          priority: 'Medium',
          assignee: { id: '3', name: 'Maria Oliveira', role: 'Designer' },
          reporter: { id: '1', name: 'Ana Silva', role: 'Manager' },
          projectId: '1',
          sprintId: '2',
          storyPoints: 2,
          estimatedHours: 6,
          actualHours: 0,
          progress: 0,
          startDate: new Date('2024-01-26'),
          endDate: new Date('2024-01-28'),
          duration: 2,
          predecessors: ['SEC-2'],
          successors: ['SEC-3.2'],
          dependencyType: 'FS',
          workstream: 'UX',
          level: 1,
          parentId: 'SEC-3',
          tags: ['wireframe', 'ux'],
          comments: [],
          attachments: [],
          schedulingMode: 'automatic',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-26')
        },
        {
          id: 'SEC-3.2',
          title: 'Desenvolver protótipo interativo',
          description: 'Criar protótipo clicável no Figma',
          type: 'Task',
          status: 'A Fazer',
          priority: 'Medium',
          assignee: { id: '3', name: 'Maria Oliveira', role: 'Designer' },
          reporter: { id: '1', name: 'Ana Silva', role: 'Manager' },
          projectId: '1',
          sprintId: '2',
          storyPoints: 3,
          estimatedHours: 10,
          actualHours: 0,
          progress: 0,
          startDate: new Date('2024-01-29'),
          endDate: new Date('2024-02-02'),
          duration: 3,
          predecessors: ['SEC-3.1'],
          successors: [],
          dependencyType: 'FS',
          workstream: 'UX',
          level: 1,
          parentId: 'SEC-3',
          tags: ['prototype', 'figma'],
          comments: [],
          attachments: [],
          schedulingMode: 'automatic',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-26')
        },
        {
          id: 'SEC-4',
          title: 'Implementar tela de login',
          description: 'Desenvolver componente React da tela de login',
          type: 'Task',
          status: 'A Fazer',
          priority: 'High',
          assignee: { id: '4', name: 'Pedro Costa', role: 'Frontend Developer' },
          reporter: { id: '1', name: 'Ana Silva', role: 'Manager' },
          projectId: '1',
          sprintId: '2',
          storyPoints: 5,
          estimatedHours: 15,
          actualHours: 0,
          progress: 0,
          startDate: new Date('2024-02-03'),
          endDate: new Date('2024-02-07'),
          duration: 4,
          predecessors: ['SEC-3'],
          successors: ['SEC-6'],
          dependencyType: 'FS',
          workstream: 'Frontend',
          level: 0,
          parentId: null,
          tags: ['react', 'frontend'],
          comments: [],
          attachments: [],
          schedulingMode: 'automatic',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-26')
        },
        {
          id: 'SEC-5',
          title: 'Testes de usabilidade',
          description: 'Realizar testes com usuários finais',
          type: 'Task',
          status: 'A Fazer',
          priority: 'Medium',
          assignee: { id: '3', name: 'Maria Oliveira', role: 'Designer' },
          reporter: { id: '1', name: 'Ana Silva', role: 'Manager' },
          projectId: '1',
          sprintId: '2',
          storyPoints: 3,
          estimatedHours: 12,
          actualHours: 0,
          progress: 0,
          startDate: new Date('2024-02-08'),
          endDate: new Date('2024-02-12'),
          duration: 3,
          predecessors: ['SEC-4'],
          successors: [],
          dependencyType: 'FS',
          workstream: 'QA',
          level: 0,
          parentId: null,
          tags: ['testing', 'usability'],
          comments: [],
          attachments: [],
          schedulingMode: 'automatic',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-26')
        },
        {
          id: 'SEC-6',
          title: 'Integração frontend-backend',
          description: 'Conectar interface com APIs de autenticação',
          type: 'Task',
          status: 'A Fazer',
          priority: 'High',
          assignee: { id: '2', name: 'Carlos Santos', role: 'Developer' },
          reporter: { id: '1', name: 'Ana Silva', role: 'Manager' },
          projectId: '1',
          sprintId: '2',
          storyPoints: 4,
          estimatedHours: 10,
          actualHours: 0,
          progress: 0,
          startDate: new Date('2024-02-08'),
          endDate: new Date('2024-02-12'),
          duration: 3,
          predecessors: ['SEC-4'],
          successors: ['SEC-7'],
          dependencyType: 'FS',
          workstream: 'Integration',
          level: 0,
          parentId: null,
          tags: ['integration', 'api'],
          comments: [],
          attachments: [],
          schedulingMode: 'automatic',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-26')
        },
        {
          id: 'SEC-7',
          title: 'Testes de segurança',
          description: 'Realizar testes de penetração e vulnerabilidades',
          type: 'Task',
          status: 'A Fazer',
          priority: 'High',
          assignee: { id: '5', name: 'Ana Costa', role: 'QA Engineer' },
          reporter: { id: '1', name: 'Ana Silva', role: 'Manager' },
          projectId: '1',
          sprintId: '2',
          storyPoints: 3,
          estimatedHours: 8,
          actualHours: 0,
          progress: 0,
          startDate: new Date('2024-02-13'),
          endDate: new Date('2024-02-15'),
          duration: 2,
          predecessors: ['SEC-6'],
          successors: [],
          dependencyType: 'FS',
          workstream: 'Security',
          level: 0,
          parentId: null,
          tags: ['security', 'testing'],
          comments: [],
          attachments: [],
          schedulingMode: 'automatic',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-26')
        },
        {
          id: 'SEC-8',
          title: 'Implementar validação de formulário',
          description: 'Adicionar validações client-side e server-side',
          type: 'Task',
          status: 'A Fazer',
          priority: 'Medium',
          assignee: { id: '2', name: 'Carlos Santos', role: 'Developer' },
          reporter: { id: '1', name: 'Ana Silva', role: 'Manager' },
          projectId: '1',
          sprintId: '2',
          storyPoints: 2,
          estimatedHours: 6,
          actualHours: 0,
          progress: 0,
          startDate: new Date('2024-02-16'),
          endDate: new Date('2024-02-18'),
          duration: 2,
          predecessors: ['SEC-7'],
          successors: [],
          dependencyType: 'FS',
          workstream: 'Backend',
          level: 0,
          parentId: null,
          tags: ['validation', 'forms'],
          comments: [],
          attachments: [],
          schedulingMode: 'automatic',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-26')
        },
        // Adicionar tarefas para outros projetos
        {
          id: '5',
          title: 'Desenvolver carrinho de compras',
          description: 'Implementar funcionalidade de carrinho para app mobile',
          type: 'Feature',
          status: 'A Fazer',
          priority: 'High',
          assignee: { id: '3', name: 'Pedro Lima', role: 'Developer' },
          reporter: { id: '1', name: 'Ana Silva', role: 'Manager' },
          projectId: '2', // App Mobile
          sprintId: null,
          storyPoints: 8,
          estimatedHours: 16,
          actualHours: 0,
          progress: 0,
          startDate: new Date('2024-02-05'),
          endDate: new Date('2024-02-12'),
          duration: 6,
          predecessors: [],
          successors: [],
          dependencyType: 'FS',
          workstream: 'Mobile',
          level: 0,
          parentId: null,
          tags: ['mobile', 'ecommerce'],
          comments: [],
          attachments: [],
          schedulingMode: 'automatic',
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date('2024-02-01')
        },
        {
          id: '6',
          title: 'Criar página inicial',
          description: 'Desenvolver landing page do website institucional',
          type: 'User Story',
          status: 'A Fazer',
          priority: 'Medium',
          assignee: { id: '4', name: 'Julia Costa', role: 'Designer' },
          reporter: { id: '1', name: 'Ana Silva', role: 'Manager' },
          projectId: '3', // Website Institucional
          sprintId: null,
          storyPoints: 5,
          estimatedHours: 12,
          actualHours: 0,
          progress: 0,
          startDate: new Date('2024-02-10'),
          endDate: new Date('2024-02-15'),
          duration: 4,
          predecessors: [],
          successors: [],
          dependencyType: 'FS',
          workstream: 'Website',
          level: 0,
          parentId: null,
          tags: ['website', 'design'],
          comments: [],
          attachments: [],
          schedulingMode: 'automatic',
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date('2024-02-01')
        }
      ],

      // Entradas de tempo
      timeEntries: [
        {
          id: '1',
          date: new Date(),
          startTime: '09:00',
          endTime: '10:00',
          hours: 1,
          description: 'Reunião de planejamento do sprint',
          projectId: '1',
          taskId: '2',
          userId: '1',
          status: 'Draft',
          cost: 150,
          schedulingMode: 'automatic',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],

      // Projeto selecionado
      selectedProjectId: '1',

      // Actions
      addProject: (project) => set((state) => {
        const newId = Date.now().toString();
        return {
          projects: [...state.projects, { 
            ...project, 
            id: newId,
            taskCounter: 0,
            schedulingMode: 'automatic',
          createdAt: new Date(),
            updatedAt: new Date()
          }]
        };
      }),

      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p)
      })),

      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id)
      })),

      addSprint: (sprint) => set((state) => ({
        sprints: [...state.sprints, { ...sprint, id: Date.now().toString() }]
      })),

      updateSprint: (id, updates) => set((state) => ({
        sprints: state.sprints.map(s => s.id === id ? { ...s, ...updates } : s)
      })),

      addTask: (task) => set((state) => {
        const project = state.projects.find(p => p.id === task.projectId);
        if (!project) return state;
        
        const newTaskCounter = (project.taskCounter || 0) + 1;
        const taskId = `${project.acronym}-${newTaskCounter}`;
        
        return {
          projects: state.projects.map(p => 
            p.id === task.projectId 
              ? { ...p, taskCounter: newTaskCounter }
              : p
          ),
          tasks: [...state.tasks, { 
            ...task, 
            id: taskId,
            schedulingMode: 'automatic',
          createdAt: new Date(),
            updatedAt: new Date()
          }]
        };
      }),

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t)
      })),

      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, {
          ...task,
          schedulingMode: 'automatic',
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),

      updateTasksOrder: (orderedTasks) => set((state) => ({
        tasks: orderedTasks.map((task, index) => ({
          ...task,
          order: index,
          updatedAt: new Date()
        }))
      })),

      moveTask: (taskId, newStatus, newSprintId = null) => set((state) => ({
        tasks: state.tasks.map(t => 
          t.id === taskId 
            ? { ...t, status: newStatus, sprintId: newSprintId, updatedAt: new Date() }
            : t
        )
      })),

      addTimeEntry: (entry) => set((state) => ({
        timeEntries: [...state.timeEntries, {
          ...entry,
          id: Date.now().toString(),
          schedulingMode: 'automatic',
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      })),

      updateTimeEntry: (id, updates) => set((state) => ({
        timeEntries: state.timeEntries.map(e => 
          e.id === id ? { ...e, ...updates, updatedAt: new Date() } : e
        )
      })),

      deleteTimeEntry: (id) => set((state) => ({
        timeEntries: state.timeEntries.filter(e => e.id !== id)
      })),

      setSelectedProject: (projectId) => set({ selectedProjectId: projectId }),

      // Getters
      getProjectById: (id) => get().projects.find(p => p.id === id),
      getTasksByProject: (projectId) => get().tasks.filter(t => t.projectId === projectId),
      getTasksBySprint: (sprintId) => get().tasks.filter(t => t.sprintId === sprintId),
      getSprintsByProject: (projectId) => get().sprints.filter(s => s.projectId === projectId),
      getTimeEntriesByProject: (projectId) => get().timeEntries.filter(e => e.projectId === projectId),
      
      // Função para verificar se uma tarefa tem filhas
      hasChildTasks: (taskId) => {
        const tasks = get().tasks;
        return tasks.some(task => task.parentId === taskId);
      },
      
      // Função para obter apenas tarefas sem filhas (tarefas folha)
      getLeafTasks: (tasks) => {
        const allTasks = get().tasks;
        return tasks.filter(task => !allTasks.some(t => t.parentId === task.id));
      },
      
      // Função para obter tarefas folha por projeto
      getLeafTasksByProject: (projectId) => {
        const projectTasks = get().tasks.filter(t => t.projectId === projectId);
        return get().getLeafTasks(projectTasks);
      },
      
      // Função para obter tarefas folha por sprint
      getLeafTasksBySprint: (sprintId) => {
        const sprintTasks = get().tasks.filter(t => t.sprintId === sprintId);
        return get().getLeafTasks(sprintTasks);
      },
      
      // Função para obter todas as tarefas do sistema (para Kanban global)
      getAllTasks: () => {
        return get().tasks;
      },
      
      getDashboardMetrics: () => {
        const state = get();
        return {
          totalProjects: state.projects.length,
          activeProjects: state.projects.filter(p => p.status === 'Active').length,
          totalTasks: state.tasks.length,
          completedTasks: state.tasks.filter(t => t.status === 'Concluído').length,
          totalHours: state.timeEntries.reduce((sum, e) => sum + e.hours, 0),
          totalCost: state.timeEntries.reduce((sum, e) => sum + (e.cost || 0), 0),
          activeSprints: state.sprints.filter(s => s.status === 'Active').length,
          teamMembers: new Set(state.projects.flatMap(p => p.members.map(m => m.id))).size
        };
      },

      // Funções EVM para o Gantt
      calculateProjectEVM: (projectId, asOfDate) => {
        const state = get();
        const projectTasks = state.tasks.filter(t => t.projectId === projectId);
        
        let totalPV = 0;
        let totalEV = 0;
        let totalAC = 0;
        
        projectTasks.forEach(task => {
          const plannedCost = task.plannedCost || 0;
          const actualCost = task.actualCost || 0;
          const earnedValue = task.earnedValue || 0;
          
          totalPV += plannedCost;
          totalEV += earnedValue;
          totalAC += actualCost;
        });
        
        const CV = totalEV - totalAC;
        const SV = totalEV - totalPV;
        const CPI = totalAC > 0 ? totalEV / totalAC : 0;
        const SPI = totalPV > 0 ? totalEV / totalPV : 0;
        
        return {
          PV: totalPV,
          EV: totalEV,
          AC: totalAC,
          CV: CV,
          SV: SV,
          CPI: CPI,
          SPI: SPI,
          costStatus: CV >= 0 ? 'On Budget' : 'Over Budget',
          scheduleStatus: SV >= 0 ? 'On Schedule' : 'Behind Schedule'
        };
      },

      calculateTaskEVM: (taskId, asOfDate) => {
        const state = get();
        const task = state.tasks.find(t => t.id === taskId);
        
        if (!task) return null;
        
        const plannedCost = task.plannedCost || 0;
        const actualCost = task.actualCost || 0;
        const earnedValue = task.earnedValue || 0;
        
        const CV = earnedValue - actualCost;
        const SV = earnedValue - plannedCost;
        const CPI = actualCost > 0 ? earnedValue / actualCost : 0;
        const SPI = plannedCost > 0 ? earnedValue / plannedCost : 0;
        
        return {
          PV: plannedCost,
          EV: earnedValue,
          AC: actualCost,
          CV: CV,
          SV: SV,
          CPI: CPI,
          SPI: SPI
        };
      },

      getWorkstreamCosts: (projectId) => {
        const state = get();
        const projectTasks = state.tasks.filter(t => t.projectId === projectId);
        const workstreams = {};
        
        projectTasks.forEach(task => {
          const workstream = task.workstream || 'Sem Workstream';
          if (!workstreams[workstream]) {
            workstreams[workstream] = {
              plannedCost: 0,
              actualCost: 0,
              earnedValue: 0
            };
          }
          
          workstreams[workstream].plannedCost += task.plannedCost || 0;
          workstreams[workstream].actualCost += task.actualCost || 0;
          workstreams[workstream].earnedValue += task.earnedValue || 0;
        });
        
        return workstreams;
      }
    }),
    {
      name: 'agir-storage',
      partialize: (state) => ({
        projects: state.projects,
        sprints: state.sprints,
        tasks: state.tasks,
        timeEntries: state.timeEntries,
        selectedProjectId: state.selectedProjectId
      })
    }
  )
);

export default useAppStore;

