import { authService as apiAuthService } from './api';
import useAppStore from '../stores/appStore';

class AuthService {
  async login(email, password) {
    try {
      console.log('Tentando login com:', { email, password: '***' });
      
      const response = await apiAuthService.login(email, password);
      
      console.log('Resposta do login:', response);
      
      if (response && response.success) {
        const { user, token } = response.data;
        
        // Atualizar estado global
        if (user) {
          useAppStore.getState().setCurrentUser(user);
          useAppStore.getState().login(user, token);
        }
        
        return { 
          success: true, 
          data: { user, token },
          user, 
          token 
        };
      } else {
        return { 
          success: false, 
          message: response.message || 'Erro ao fazer login' 
        };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      
      return { 
        success: false, 
        message: error.message || 'Erro de conexão com o servidor'
      };
    }
  }

  async logout() {
    try {
      await apiAuthService.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Limpar dados locais independente do resultado da API
      useAppStore.getState().logout();
    }
  }

  async getCurrentUser() {
    try {
      const response = await apiAuthService.getProfile();
      const user = response.data || response;
      
      useAppStore.getState().setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      this.logout();
      throw error;
    }
  }

  async refreshToken() {
    try {
      const response = await apiAuthService.refreshToken();
      
      if (response.success) {
        return { success: true, token: response.data.token };
      }
      
      return { success: false, message: 'Token não recebido' };
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      this.logout();
      return { success: false, message: 'Erro ao renovar token' };
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  getToken() {
    return localStorage.getItem('authToken');
  }
}

export default new AuthService();

