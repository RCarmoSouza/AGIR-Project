import { User, Project, Task, Sprint, TaskType, TimesheetEntry, Comment, Attachment } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Usuários de exemplo com taxas horárias
export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@empresa.com',
    role: 'manager',
    avatar: 'AS',
    isExternal: false,
    hourlyRate: 150
  },
  {
    id: '2',
    name: 'Carlos Santos',
    email: 'carlos.santos@empresa.com',
    role: 'developer',
    avatar: 'CS',
    isExternal: false,
    leaderId: '1',
    hourlyRate: 120
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@empresa.com',
    role: 'designer',
    avatar: 'MO',
    isExternal: false,
    leaderId: '1',
    hourlyRate: 100
  },
  {
    id: '4',
    name: 'João Costa',
    email: 'joao.costa@empresa.com',
    role: 'tester',
    avatar: 'JC',
    isExternal: false,
    leaderId: '1',
    hourlyRate: 90
  }
];

// Tipos de tarefa padrão
export const defaultTaskTypes: TaskType[] = [
  { id: '1', name: 'Épico', color: '#8B5CF6', icon: '🎯' },
  { id: '2', name: 'User Story', color: '#10B981', icon: '📖' },
  { id: '3', name: 'Issue', color: '#3B82F6', icon: '❗' },
  { id: '4', name: 'Ação', color: '#F59E0B', icon: '⚡' },
  { id: '5', name: 'Passo de Teste', color: '#EF4444', icon: '🧪' },
  { id: '6', name: 'Fase', color: '#6366F1', icon: '📋' },
  { id: '7', name: 'Etapa', color: '#8B5CF6', icon: '📝' },
  { id: '8', name: 'Feature', color: '#10B981', icon: '✨' },
  { id: '9', name: 'Bug', color: '#EF4444', icon: '🐛' },
  { id: '10', name: 'Melhoria', color: '#F59E0B', icon: '⚡' },
  { id: '11', name: 'Tarefa', color: '#6B7280', icon: '✅' }
];

// Projetos de exemplo
export const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Sistema de E-commerce',
    description: 'Desenvolvimento de uma plataforma completa de e-commerce com funcionalidades de carrinho, pagamento e gestão de produtos.',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-06-30'),
    status: 'active',
    members: [sampleUsers[0], sampleUsers[1], sampleUsers[2]],
    sprints: [
      {
        id: 's1',
        projectId: '1',
        name: 'Sprint 1 - Autenticação',
        goal: 'Implementar sistema de login e registro de usuários',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-29'),
        status: 'completed',
        tasks: []
      },
      {
        id: 's2',
        projectId: '1',
        name: 'Sprint 2 - Catálogo de Produtos',
        goal: 'Criar listagem e visualização de produtos',
        startDate: new Date('2024-01-30'),
        endDate: new Date('2024-02-13'),
        status: 'active',
        tasks: []
      }
    ],
    usesSprints: true
  },
  {
    id: '2',
    name: 'App Mobile de Delivery',
    description: 'Aplicativo móvel para delivery de comida com geolocalização e pagamento integrado.',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-08-15'),
    status: 'planning',
    members: [sampleUsers[0], sampleUsers[3]],
    sprints: [],
    usesSprints: true
  },
  {
    id: '3',
    name: 'Dashboard Analytics',
    description: 'Painel de controle para visualização de métricas e relatórios de negócio.',
    startDate: new Date('2024-03-01'),
    status: 'active',
    members: [sampleUsers[1], sampleUsers[2], sampleUsers[3]],
    sprints: [],
    usesSprints: false
  }
];

// Tarefas de exemplo
export const sampleTasks: Task[] = [
  {
    id: 't1',
    title: 'Implementar tela de login',
    description: 'Criar interface de usuário para autenticação com email e senha',
    type: defaultTaskTypes[1], // User Story
    status: 'done',
    priority: 'high',
    assignee: sampleUsers[1],
    reporter: sampleUsers[0],
    estimatedHours: 8,
    storyPoints: 5,
    sprintId: 's1',
    projectId: '1',
    linkedTasks: [],
    tags: ['frontend', 'auth'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 't2',
    title: 'Configurar banco de dados de usuários',
    description: 'Criar tabelas e modelos para armazenamento de dados de usuários',
    type: defaultTaskTypes[10], // Tarefa
    status: 'done',
    priority: 'high',
    assignee: sampleUsers[2],
    reporter: sampleUsers[0],
    estimatedHours: 6,
    storyPoints: 3,
    sprintId: 's1',
    projectId: '1',
    linkedTasks: ['t1'],
    tags: ['backend', 'database'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 't3',
    title: 'Criar API de produtos',
    description: 'Desenvolver endpoints REST para CRUD de produtos',
    type: defaultTaskTypes[7], // Feature
    status: 'in-progress',
    priority: 'medium',
    assignee: sampleUsers[2],
    reporter: sampleUsers[0],
    estimatedHours: 12,
    storyPoints: 8,
    sprintId: 's2',
    projectId: '1',
    linkedTasks: [],
    tags: ['backend', 'api'],
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-02-05'),
  },
  {
    id: 't4',
    title: 'Design da interface do catálogo',
    description: 'Criar wireframes e protótipos para a listagem de produtos',
    type: defaultTaskTypes[10], // Tarefa
    status: 'review',
    priority: 'medium',
    assignee: sampleUsers[1],
    reporter: sampleUsers[0],
    estimatedHours: 4,
    storyPoints: 2,
    sprintId: 's2',
    projectId: '1',
    linkedTasks: ['t3'],
    tags: ['design', 'frontend'],
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-02-03'),
  },
  {
    id: 't5',
    title: 'Implementar carrinho de compras',
    description: 'Funcionalidade para adicionar/remover produtos do carrinho',
    type: defaultTaskTypes[1], // User Story
    status: 'backlog',
    priority: 'high',
    assignee: sampleUsers[1],
    reporter: sampleUsers[0],
    estimatedHours: 16,
    storyPoints: 13,
    projectId: '1',
    linkedTasks: ['t3'],
    tags: ['frontend', 'ecommerce'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 't6',
    title: 'Configurar sistema de pagamento',
    description: 'Integração com gateway de pagamento (Stripe/PagSeguro)',
    type: defaultTaskTypes[0], // Épico
    status: 'backlog',
    priority: 'critical',
    reporter: sampleUsers[0],
    estimatedHours: 24,
    storyPoints: 21,
    projectId: '1',
    linkedTasks: [],
    tags: ['backend', 'payment'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  // Tarefas para o projeto de Dashboard Analytics (sem sprints)
  {
    id: 't7',
    title: 'Criar gráficos de vendas',
    description: 'Implementar visualizações de dados de vendas com charts.js',
    type: defaultTaskTypes[7], // Feature
    status: 'todo',
    priority: 'medium',
    assignee: sampleUsers[2],
    reporter: sampleUsers[0],
    estimatedHours: 10,
    storyPoints: 5,
    projectId: '3',
    linkedTasks: [],
    tags: ['frontend', 'charts'],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: 't8',
    title: 'Conectar com API de dados',
    description: 'Integrar dashboard com APIs externas de dados',
    type: defaultTaskTypes[10], // Tarefa
    status: 'in-progress',
    priority: 'high',
    assignee: sampleUsers[1],
    reporter: sampleUsers[0],
    estimatedHours: 8,
    storyPoints: 5,
    projectId: '3',
    linkedTasks: [],
    tags: ['backend', 'integration'],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-05'),
  }
];

export function initializeSampleData() {
  return {
    users: sampleUsers,
    projects: sampleProjects,
    tasks: sampleTasks,
    taskTypes: defaultTaskTypes
  };
}

