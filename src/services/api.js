import axios from 'axios';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT nas requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response.data; // Retorna apenas os dados da resposta
  },
  (error) => {
    // Tratar diferentes tipos de erro
    if (error.response) {
      // Erro de resposta do servidor
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token expirado ou inválido
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          window.location.href = '/login';
          break;
        case 403:
          // Acesso negado
          console.error('Acesso negado:', data.message);
          break;
        case 404:
          // Recurso não encontrado
          console.error('Recurso não encontrado:', data.message);
          break;
        case 429:
          // Rate limit excedido
          console.error('Muitas requisições:', data.message);
          break;
        case 500:
          // Erro interno do servidor
          console.error('Erro interno do servidor:', data.message);
          break;
        default:
          console.error('Erro na API:', data.message || 'Erro desconhecido');
      }
      
      return Promise.reject(data || error);
    } else if (error.request) {
      // Erro de rede
      console.error('Erro de rede:', error.message);
      return Promise.reject({
        success: false,
        message: 'Erro de conexão com o servidor'
      });
    } else {
      // Erro de configuração
      console.error('Erro de configuração:', error.message);
      return Promise.reject({
        success: false,
        message: 'Erro na configuração da requisição'
      });
    }
  }
);

// Serviços de autenticação
export const authService = {
  // Login tradicional
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    return response;
  },

  // Registro de usuário
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    return response;
  },

  // Login com Google
  googleLogin: async (token, tenantId = 'default') => {
    const response = await api.post('/auth/google', { token, tenantId });
    if (response.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    return response;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    if (response.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response;
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
  },

  // Obter perfil do usuário
  getProfile: async () => {
    return await api.get('/auth/me');
  },

  // Alterar senha
  changePassword: async (currentPassword, newPassword) => {
    return await api.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
  },

  // Esqueci minha senha
  forgotPassword: async (email) => {
    return await api.post('/auth/forgot-password', { email });
  },

  // Redefinir senha
  resetPassword: async (token, newPassword) => {
    return await api.post('/auth/reset-password', { token, newPassword });
  }
};

// Serviços de usuários
export const userService = {
  // Listar usuários
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/users${queryString ? `?${queryString}` : ''}`);
  },

  // Obter usuário específico
  getUser: async (id) => {
    return await api.get(`/users/${id}`);
  },

  // Criar usuário
  createUser: async (userData) => {
    return await api.post('/users', userData);
  },

  // Atualizar usuário
  updateUser: async (id, userData) => {
    return await api.put(`/users/${id}`, userData);
  },

  // Deletar usuário
  deleteUser: async (id) => {
    return await api.delete(`/users/${id}`);
  },

  // Ativar/desativar usuário
  toggleUserStatus: async (id, isActive) => {
    return await api.patch(`/users/${id}/status`, { isActive });
  }
};

// Serviços de tarefas
export const taskService = {
  // Listar tarefas
  getTasks: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/tasks${queryString ? `?${queryString}` : ''}`);
  },

  // Obter tarefas para Kanban
  getKanbanTasks: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/tasks/kanban${queryString ? `?${queryString}` : ''}`);
  },

  // Obter tarefa específica
  getTask: async (id) => {
    return await api.get(`/tasks/${id}`);
  },

  // Criar tarefa
  createTask: async (taskData) => {
    return await api.post('/tasks', taskData);
  },

  // Atualizar tarefa
  updateTask: async (id, taskData) => {
    return await api.put(`/tasks/${id}`, taskData);
  },

  // Atualizar status da tarefa
  updateTaskStatus: async (id, status) => {
    return await api.patch(`/tasks/${id}/status`, { status });
  },

  // Deletar tarefa
  deleteTask: async (id) => {
    return await api.delete(`/tasks/${id}`);
  }
};

// Serviços de projetos
export const projectService = {
  // Listar projetos
  getProjects: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/projects${queryString ? `?${queryString}` : ''}`);
  },

  // Obter projeto específico
  getProject: async (id) => {
    return await api.get(`/projects/${id}`);
  },

  // Criar projeto
  createProject: async (projectData) => {
    return await api.post('/projects', projectData);
  },

  // Atualizar projeto
  updateProject: async (id, projectData) => {
    return await api.put(`/projects/${id}`, projectData);
  },

  // Deletar projeto
  deleteProject: async (id) => {
    return await api.delete(`/projects/${id}`);
  }
};

// Função utilitária para verificar se o usuário está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('currentUser');
  return !!(token && user);
};

// Função utilitária para obter o usuário atual
export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

// Função utilitária para verificar permissões
export const hasPermission = (resource, action) => {
  const user = getCurrentUser();
  if (!user) return false;

  // Lógica de permissões baseada em roles
  const permissions = {
    ADMIN: ['*'],
    MANAGER: ['projects:*', 'tasks:*', 'people:read', 'timesheet:*', 'users:read'],
    USER: ['tasks:read', 'tasks:update', 'timesheet:create', 'timesheet:read'],
    GUEST: ['tasks:read']
  };

  const userPermissions = permissions[user.role] || [];
  
  return userPermissions.includes('*') || 
         userPermissions.includes(`${resource}:*`) || 
         userPermissions.includes(`${resource}:${action}`);
};

export default api;

