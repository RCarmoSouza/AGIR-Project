import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '../../services/authService'
import axios from 'axios'

// Mock do axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios)

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      // Arrange
      const email = 'admin@agir.com'
      const password = 'admin123'
      const mockResponse = {
        data: {
          success: true,
          data: {
            token: 'mock-jwt-token',
            user: {
              id: '1',
              email,
              name: 'Admin',
              role: 'ADMIN'
            }
          }
        }
      }

      mockedAxios.post.mockResolvedValue(mockResponse)

      // Act
      const result = await authService.login(email, password)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data.token).toBe('mock-jwt-token')
      expect(result.data.user.email).toBe(email)
      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/login', {
        email,
        password
      })
    })

    it('deve falhar com credenciais inválidas', async () => {
      // Arrange
      const email = 'admin@agir.com'
      const password = 'senhaErrada'
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Credenciais inválidas'
          }
        }
      }

      mockedAxios.post.mockRejectedValue(mockError)

      // Act
      const result = await authService.login(email, password)

      // Assert
      expect(result.success).toBe(false)
      expect(result.message).toBe('Credenciais inválidas')
    })

    it('deve tratar erro de rede', async () => {
      // Arrange
      const email = 'admin@agir.com'
      const password = 'admin123'
      const networkError = new Error('Network Error')

      mockedAxios.post.mockRejectedValue(networkError)

      // Act
      const result = await authService.login(email, password)

      // Assert
      expect(result.success).toBe(false)
      expect(result.message).toBe('Erro de conexão com o servidor')
    })
  })

  describe('logout', () => {
    it('deve fazer logout com sucesso', async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          message: 'Logout realizado com sucesso'
        }
      }

      mockedAxios.post.mockResolvedValue(mockResponse)

      // Act
      const result = await authService.logout()

      // Assert
      expect(result.success).toBe(true)
      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/logout')
    })

    it('deve tratar erro no logout', async () => {
      // Arrange
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Erro no logout'
          }
        }
      }

      mockedAxios.post.mockRejectedValue(mockError)

      // Act
      const result = await authService.logout()

      // Assert
      expect(result.success).toBe(false)
      expect(result.message).toBe('Erro no logout')
    })
  })

  describe('validateToken', () => {
    it('deve validar token válido', async () => {
      // Arrange
      const token = 'valid-token'
      const mockResponse = {
        data: {
          success: true,
          data: {
            userId: '1',
            email: 'admin@agir.com',
            role: 'ADMIN'
          }
        }
      }

      mockedAxios.get.mockResolvedValue(mockResponse)

      // Act
      const result = await authService.validateToken(token)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data.userId).toBe('1')
      expect(mockedAxios.get).toHaveBeenCalledWith('/auth/validate', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    })

    it('deve falhar com token inválido', async () => {
      // Arrange
      const token = 'invalid-token'
      const mockError = {
        response: {
          status: 401,
          data: {
            success: false,
            message: 'Token inválido'
          }
        }
      }

      mockedAxios.get.mockRejectedValue(mockError)

      // Act
      const result = await authService.validateToken(token)

      // Assert
      expect(result.success).toBe(false)
      expect(result.message).toBe('Token inválido')
    })
  })

  describe('refreshToken', () => {
    it('deve renovar token com sucesso', async () => {
      // Arrange
      const refreshToken = 'refresh-token'
      const mockResponse = {
        data: {
          success: true,
          data: {
            token: 'new-jwt-token',
            refreshToken: 'new-refresh-token'
          }
        }
      }

      mockedAxios.post.mockResolvedValue(mockResponse)

      // Act
      const result = await authService.refreshToken(refreshToken)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data.token).toBe('new-jwt-token')
      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/refresh', {
        refreshToken
      })
    })

    it('deve falhar com refresh token inválido', async () => {
      // Arrange
      const refreshToken = 'invalid-refresh-token'
      const mockError = {
        response: {
          status: 401,
          data: {
            success: false,
            message: 'Refresh token inválido'
          }
        }
      }

      mockedAxios.post.mockRejectedValue(mockError)

      // Act
      const result = await authService.refreshToken(refreshToken)

      // Assert
      expect(result.success).toBe(false)
      expect(result.message).toBe('Refresh token inválido')
    })
  })
})

