import api from './api';
import useAppStore from '../stores/appStore';

class ProjectService {
  async getProjects(params = {}) {
    try {
      useAppStore.getState().setLoading('projects', true);
      const response = await api.get('/projects', { params });
      
      if (response.data.success) {
        const projects = response.data.data.projects;
        useAppStore.getState().setProjects(projects);
        return {
          projects,
          pagination: response.data.data.pagination
        };
      } else {
        throw new Error(response.data.message || 'Erro ao buscar projetos');
      }
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      throw error;
    } finally {
      useAppStore.getState().setLoading('projects', false);
    }
  }

  async getProjectById(id) {
    try {
      const response = await api.get(`/projects/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar projeto');
      }
    } catch (error) {
      console.error('Erro ao buscar projeto:', error);
      throw error;
    }
  }

  async createProject(projectData) {
    try {
      console.log('🚀 [FRONTEND] Iniciando criação de projeto');
      console.log('📝 [FRONTEND] Dados enviados:', JSON.stringify(projectData, null, 2));
      
      const response = await api.post('/projects', projectData);
      
      console.log('📡 [FRONTEND] Resposta recebida:', JSON.stringify(response.data, null, 2));
      
      if (response.data.success) {
        const newProject = response.data.data;
        console.log('✅ [FRONTEND] Projeto criado com sucesso:', newProject);
        useAppStore.getState().addProject(newProject);
        return newProject;
      } else {
        console.log('❌ [FRONTEND] Erro na resposta:', response.data.message);
        throw new Error(response.data.message || 'Erro ao criar projeto');
      }
    } catch (error) {
      console.error('💥 [FRONTEND] Erro ao criar projeto:', error);
      console.error('📍 [FRONTEND] Detalhes do erro:', error.response?.data);
      throw error;
    }
  }

  async updateProject(id, updates) {
    try {
      const response = await api.put(`/projects/${id}`, updates);
      
      if (response.data.success) {
        const updatedProject = response.data.data;
        useAppStore.getState().updateProject(id, updatedProject);
        return updatedProject;
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar projeto');
      }
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      throw error;
    }
  }

  async deleteProject(id) {
    try {
      const response = await api.delete(`/projects/${id}`);
      
      if (response.data.success) {
        useAppStore.getState().deleteProject(id);
        return true;
      } else {
        throw new Error(response.data.message || 'Erro ao deletar projeto');
      }
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      throw error;
    }
  }

  async getProjectStats() {
    try {
      const response = await api.get('/projects/stats');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar estatísticas');
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas de projetos:', error);
      throw error;
    }
  }

  async getProjectTasks(projectId, params = {}) {
    try {
      const response = await api.get(`/projects/${projectId}/tasks`, { params });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar tarefas do projeto');
      }
    } catch (error) {
      console.error('Erro ao buscar tarefas do projeto:', error);
      throw error;
    }
  }
}

const projectService = new ProjectService();

export default projectService;
export { projectService };

