import api from './api';
import useAppStore from '../stores/appStore';

class TaskService {
  async getTasks(filters = {}) {
    try {
      useAppStore.getState().setLoading('tasks', true);
      const response = await api.get('/tasks', { params: filters });
      const tasks = response.data;
      
      useAppStore.getState().setTasks(tasks);
      return tasks;
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      throw error;
    } finally {
      useAppStore.getState().setLoading('tasks', false);
    }
  }

  async getTasksByProject(projectId) {
    try {
      const response = await api.get(`/tasks?projectId=${projectId}`);
      const tasks = response.data;
      
      // Atualizar apenas as tarefas do projeto específico
      const allTasks = useAppStore.getState().tasks;
      const otherTasks = allTasks.filter(t => t.projectId !== projectId);
      useAppStore.getState().setTasks([...otherTasks, ...tasks]);
      
      return tasks;
    } catch (error) {
      console.error('Erro ao buscar tarefas do projeto:', error);
      throw error;
    }
  }

  async getTasksBySprint(sprintId) {
    try {
      const response = await api.get(`/tasks?sprintId=${sprintId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tarefas do sprint:', error);
      throw error;
    }
  }

  async getTaskById(id) {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error);
      throw error;
    }
  }

  async createTask(taskData) {
    try {
      const response = await api.post('/tasks', taskData);
      const newTask = response.data;
      
      useAppStore.getState().addTask(newTask);
      return newTask;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }
  }

  async updateTask(id, updates) {
    try {
      const response = await api.put(`/tasks/${id}`, updates);
      const updatedTask = response.data;
      
      useAppStore.getState().updateTask(id, updatedTask);
      return updatedTask;
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  }

  async deleteTask(id) {
    try {
      await api.delete(`/tasks/${id}`);
      useAppStore.getState().deleteTask(id);
      return true;
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      throw error;
    }
  }

  async moveTask(taskId, newStatus, newSprintId = null) {
    try {
      const response = await api.patch(`/tasks/${taskId}/move`, {
        status: newStatus,
        sprintId: newSprintId
      });
      const updatedTask = response.data;
      
      useAppStore.getState().moveTask(taskId, newStatus, newSprintId);
      return updatedTask;
    } catch (error) {
      console.error('Erro ao mover tarefa:', error);
      throw error;
    }
  }

  async updateTaskOrder(tasks) {
    try {
      const response = await api.patch('/tasks/reorder', {
        tasks: tasks.map((task, index) => ({
          id: task.id,
          order: index
        }))
      });
      
      useAppStore.getState().setTasks(tasks);
      return response.data;
    } catch (error) {
      console.error('Erro ao reordenar tarefas:', error);
      throw error;
    }
  }

  async getKanbanTasks(projectId = null) {
    try {
      const endpoint = projectId ? `/tasks/kanban?projectId=${projectId}` : '/tasks/kanban';
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tarefas do kanban:', error);
      throw error;
    }
  }

  async addTaskComment(taskId, comment) {
    try {
      const response = await api.post(`/tasks/${taskId}/comments`, { comment });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      throw error;
    }
  }

  async uploadTaskAttachment(taskId, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`/tasks/${taskId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload do anexo:', error);
      throw error;
    }
  }
}

export default new TaskService();

