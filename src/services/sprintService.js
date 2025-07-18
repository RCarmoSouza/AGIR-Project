import api from './api';
import useAppStore from '../stores/appStore';

class SprintService {
  async getSprints(projectId = null) {
    try {
      useAppStore.getState().setLoading('sprints', true);
      const endpoint = projectId ? `/sprints?projectId=${projectId}` : '/sprints';
      const response = await api.get(endpoint);
      const sprints = response.data;
      
      useAppStore.getState().setSprints(sprints);
      return sprints;
    } catch (error) {
      console.error('Erro ao buscar sprints:', error);
      throw error;
    } finally {
      useAppStore.getState().setLoading('sprints', false);
    }
  }

  async getSprintById(id) {
    try {
      const response = await api.get(`/sprints/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar sprint:', error);
      throw error;
    }
  }

  async createSprint(sprintData) {
    try {
      const response = await api.post('/sprints', sprintData);
      const newSprint = response.data;
      
      useAppStore.getState().addSprint(newSprint);
      return newSprint;
    } catch (error) {
      console.error('Erro ao criar sprint:', error);
      throw error;
    }
  }

  async updateSprint(id, updates) {
    try {
      const response = await api.put(`/sprints/${id}`, updates);
      const updatedSprint = response.data;
      
      useAppStore.getState().updateSprint(id, updatedSprint);
      return updatedSprint;
    } catch (error) {
      console.error('Erro ao atualizar sprint:', error);
      throw error;
    }
  }

  async deleteSprint(id) {
    try {
      await api.delete(`/sprints/${id}`);
      useAppStore.getState().deleteSprint(id);
      return true;
    } catch (error) {
      console.error('Erro ao excluir sprint:', error);
      throw error;
    }
  }

  async startSprint(id) {
    try {
      const response = await api.patch(`/sprints/${id}/start`);
      const updatedSprint = response.data;
      
      useAppStore.getState().updateSprint(id, updatedSprint);
      return updatedSprint;
    } catch (error) {
      console.error('Erro ao iniciar sprint:', error);
      throw error;
    }
  }

  async completeSprint(id) {
    try {
      const response = await api.patch(`/sprints/${id}/complete`);
      const updatedSprint = response.data;
      
      useAppStore.getState().updateSprint(id, updatedSprint);
      return updatedSprint;
    } catch (error) {
      console.error('Erro ao finalizar sprint:', error);
      throw error;
    }
  }

  async getSprintTasks(sprintId) {
    try {
      const response = await api.get(`/sprints/${sprintId}/tasks`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tarefas do sprint:', error);
      throw error;
    }
  }

  async addTaskToSprint(sprintId, taskId) {
    try {
      const response = await api.post(`/sprints/${sprintId}/tasks`, { taskId });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar tarefa ao sprint:', error);
      throw error;
    }
  }

  async removeTaskFromSprint(sprintId, taskId) {
    try {
      await api.delete(`/sprints/${sprintId}/tasks/${taskId}`);
      return true;
    } catch (error) {
      console.error('Erro ao remover tarefa do sprint:', error);
      throw error;
    }
  }

  async getSprintMetrics(sprintId) {
    try {
      const response = await api.get(`/sprints/${sprintId}/metrics`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar métricas do sprint:', error);
      throw error;
    }
  }

  async getActiveSprint(projectId) {
    try {
      const response = await api.get(`/sprints/active?projectId=${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar sprint ativo:', error);
      throw error;
    }
  }
}

export default new SprintService();

