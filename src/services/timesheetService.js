import api from './api';
import useAppStore from '../stores/appStore';

class TimesheetService {
  async getTimeEntries(filters = {}) {
    try {
      useAppStore.getState().setLoading('timeEntries', true);
      const response = await api.get('/timesheet', { params: filters });
      const timeEntries = response.data;
      
      useAppStore.getState().setTimeEntries(timeEntries);
      return timeEntries;
    } catch (error) {
      console.error('Erro ao buscar entradas de tempo:', error);
      throw error;
    } finally {
      useAppStore.getState().setLoading('timeEntries', false);
    }
  }

  async getTimeEntryById(id) {
    try {
      const response = await api.get(`/timesheet/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar entrada de tempo:', error);
      throw error;
    }
  }

  async createTimeEntry(entryData) {
    try {
      const response = await api.post('/timesheet', entryData);
      const newEntry = response.data;
      
      useAppStore.getState().addTimeEntry(newEntry);
      return newEntry;
    } catch (error) {
      console.error('Erro ao criar entrada de tempo:', error);
      throw error;
    }
  }

  async updateTimeEntry(id, updates) {
    try {
      const response = await api.put(`/timesheet/${id}`, updates);
      const updatedEntry = response.data;
      
      useAppStore.getState().updateTimeEntry(id, updatedEntry);
      return updatedEntry;
    } catch (error) {
      console.error('Erro ao atualizar entrada de tempo:', error);
      throw error;
    }
  }

  async deleteTimeEntry(id) {
    try {
      await api.delete(`/timesheet/${id}`);
      useAppStore.getState().deleteTimeEntry(id);
      return true;
    } catch (error) {
      console.error('Erro ao excluir entrada de tempo:', error);
      throw error;
    }
  }

  async duplicateTimeEntry(id) {
    try {
      const response = await api.post(`/timesheet/${id}/duplicate`);
      const newEntry = response.data;
      
      useAppStore.getState().addTimeEntry(newEntry);
      return newEntry;
    } catch (error) {
      console.error('Erro ao duplicar entrada de tempo:', error);
      throw error;
    }
  }

  async submitTimeEntry(id) {
    try {
      const response = await api.patch(`/timesheet/${id}/submit`);
      const updatedEntry = response.data;
      
      useAppStore.getState().updateTimeEntry(id, updatedEntry);
      return updatedEntry;
    } catch (error) {
      console.error('Erro ao submeter entrada de tempo:', error);
      throw error;
    }
  }

  async approveTimeEntry(id, level) {
    try {
      const response = await api.patch(`/timesheet/${id}/approve`, { level });
      const updatedEntry = response.data;
      
      useAppStore.getState().updateTimeEntry(id, updatedEntry);
      return updatedEntry;
    } catch (error) {
      console.error('Erro ao aprovar entrada de tempo:', error);
      throw error;
    }
  }

  async rejectTimeEntry(id, reason) {
    try {
      const response = await api.patch(`/timesheet/${id}/reject`, { reason });
      const updatedEntry = response.data;
      
      useAppStore.getState().updateTimeEntry(id, updatedEntry);
      return updatedEntry;
    } catch (error) {
      console.error('Erro ao rejeitar entrada de tempo:', error);
      throw error;
    }
  }

  async getTimeEntriesByProject(projectId, filters = {}) {
    try {
      const response = await api.get(`/timesheet/project/${projectId}`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar entradas de tempo do projeto:', error);
      throw error;
    }
  }

  async getTimeEntriesByUser(userId, filters = {}) {
    try {
      const response = await api.get(`/timesheet/user/${userId}`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar entradas de tempo do usuário:', error);
      throw error;
    }
  }

  async getTimesheetSummary(filters = {}) {
    try {
      const response = await api.get('/timesheet/summary', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar resumo do timesheet:', error);
      throw error;
    }
  }

  async getTimesheetReports(type, filters = {}) {
    try {
      const response = await api.get(`/timesheet/reports/${type}`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatórios do timesheet:', error);
      throw error;
    }
  }

  async exportTimesheet(format, filters = {}) {
    try {
      const response = await api.get('/timesheet/export', {
        params: { format, ...filters },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao exportar timesheet:', error);
      throw error;
    }
  }

  async getLastTimeEntry(userId, date) {
    try {
      const response = await api.get(`/timesheet/last-entry`, {
        params: { userId, date }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar última entrada de tempo:', error);
      throw error;
    }
  }
}

export default new TimesheetService();

