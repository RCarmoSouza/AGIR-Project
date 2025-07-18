import api from './api';
import useAppStore from '../stores/appStore';

class UserService {
  async getUsers() {
    try {
      useAppStore.getState().setLoading('users', true);
      const response = await api.get('/users');
      const users = response.data;
      
      useAppStore.getState().setUsers(users);
      return users;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    } finally {
      useAppStore.getState().setLoading('users', false);
    }
  }

  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const response = await api.post('/users', userData);
      const newUser = response.data;
      
      useAppStore.getState().addUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  async updateUser(id, updates) {
    try {
      const response = await api.put(`/users/${id}`, updates);
      const updatedUser = response.data;
      
      useAppStore.getState().updateUser(id, updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      await api.delete(`/users/${id}`);
      useAppStore.getState().deleteUser(id);
      return true;
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      throw error;
    }
  }

  async changeUserStatus(id, status) {
    try {
      const response = await api.patch(`/users/${id}/status`, { status });
      const updatedUser = response.data;
      
      useAppStore.getState().updateUser(id, updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
      throw error;
    }
  }

  async changeUserPassword(id, currentPassword, newPassword) {
    try {
      const response = await api.patch(`/users/${id}/password`, {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw error;
    }
  }

  async getUserRoles() {
    try {
      const response = await api.get('/users/roles');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar perfis:', error);
      throw error;
    }
  }

  async updateUserRole(userId, role) {
    try {
      const response = await api.patch(`/users/${userId}/role`, { role });
      const updatedUser = response.data;
      
      useAppStore.getState().updateUser(userId, updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Erro ao alterar perfil do usuário:', error);
      throw error;
    }
  }

  async getUserPermissions(userId) {
    try {
      const response = await api.get(`/users/${userId}/permissions`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar permissões do usuário:', error);
      throw error;
    }
  }

  async getSecurityMetrics() {
    try {
      const response = await api.get('/users/security/metrics');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar métricas de segurança:', error);
      throw error;
    }
  }

  async getAuditLogs(filters = {}) {
    try {
      const response = await api.get('/users/audit-logs', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar logs de auditoria:', error);
      throw error;
    }
  }

  async getSecuritySettings() {
    try {
      const response = await api.get('/users/security/settings');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar configurações de segurança:', error);
      throw error;
    }
  }

  async updateSecuritySettings(settings) {
    try {
      const response = await api.put('/users/security/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar configurações de segurança:', error);
      throw error;
    }
  }
}

export default new UserService();

