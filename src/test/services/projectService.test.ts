import { describe, it, expect, vi, beforeEach } from 'vitest'
import { projectService } from '../../services/projectService'
import axios from 'axios'

// Mock do axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios)

describe('ProjectService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProjects', () => {
    it('deve buscar lista de projetos', async () => {
      // Arrange
      const mockProjects = [
        {
          id: '1',
          name: 'Projeto 1',
          metadata: { acronym: 'P1', description: 'Descrição 1' },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Projeto 2',
          metadata: { acronym: 'P2', description: 'Descrição 2' },
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z'
        }
      ]

      const mockResponse = {
        data: {
          success: true,
          data: mockProjects
        }
      }

      mockedAxios.get.mockResolvedValue(mockResponse)

      // Act
      const result = await projectService.getProjects()

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
      expect(result.data[0].name).toBe('Projeto 1')
      expect(mockedAxios.get).toHaveBeenCalledWith('/projects')
    })

    it('deve tratar erro ao buscar projetos', async () => {
      // Arrange
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Erro ao buscar projetos'
          }
        }
      }

      mockedAxios.get.mockRejectedValue(mockError)

      // Act
      const result = await projectService.getProjects()

      // Assert
      expect(result.success).toBe(false)
      expect(result.message).toBe('Erro ao buscar projetos')
    })
  })

  describe('createProject', () => {
    it('deve criar projeto com dados válidos', async () => {
      // Arrange
      const projectData = {
        name: 'Novo Projeto',
        acronym: 'NP',
        description: 'Descrição do novo projeto'
      }

      const mockCreatedProject = {
        id: '1',
        name: projectData.name,
        metadata: {
          acronym: projectData.acronym,
          description: projectData.description,
          color: '#3B82F6'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }

      const mockResponse = {
        data: {
          success: true,
          data: mockCreatedProject,
          message: 'Projeto criado com sucesso'
        }
      }

      mockedAxios.post.mockResolvedValue(mockResponse)

      // Act
      const result = await projectService.createProject(projectData)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data.name).toBe(projectData.name)
      expect(result.message).toBe('Projeto criado com sucesso')
      expect(mockedAxios.post).toHaveBeenCalledWith('/projects', projectData)
    })

    it('deve falhar com dados inválidos', async () => {
      // Arrange
      const invalidData = {
        // name é obrigatório
        acronym: 'NP'
      }

      const mockError = {
        response: {
          status: 400,
          data: {
            success: false,
            message: 'Nome é obrigatório'
          }
        }
      }

      mockedAxios.post.mockRejectedValue(mockError)

      // Act
      const result = await projectService.createProject(invalidData)

      // Assert
      expect(result.success).toBe(false)
      expect(result.message).toBe('Nome é obrigatório')
    })

    it('deve tratar erro de rede', async () => {
      // Arrange
      const projectData = {
        name: 'Projeto Teste',
        acronym: 'PT'
      }

      const networkError = new Error('Network Error')
      mockedAxios.post.mockRejectedValue(networkError)

      // Act
      const result = await projectService.createProject(projectData)

      // Assert
      expect(result.success).toBe(false)
      expect(result.message).toBe('Erro de conexão com o servidor')
    })
  })

  describe('getProject', () => {
    it('deve buscar projeto específico', async () => {
      // Arrange
      const projectId = '1'
      const mockProject = {
        id: projectId,
        name: 'Projeto Específico',
        metadata: { acronym: 'PE', description: 'Descrição específica' },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }

      const mockResponse = {
        data: {
          success: true,
          data: mockProject
        }
      }

      mockedAxios.get.mockResolvedValue(mockResponse)

      // Act
      const result = await projectService.getProject(projectId)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data.id).toBe(projectId)
      expect(result.data.name).toBe('Projeto Específico')
      expect(mockedAxios.get).toHaveBeenCalledWith(`/projects/${projectId}`)
    })

    it('deve retornar erro para projeto inexistente', async () => {
      // Arrange
      const projectId = 'inexistente'
      const mockError = {
        response: {
          status: 404,
          data: {
            success: false,
            message: 'Projeto não encontrado'
          }
        }
      }

      mockedAxios.get.mockRejectedValue(mockError)

      // Act
      const result = await projectService.getProject(projectId)

      // Assert
      expect(result.success).toBe(false)
      expect(result.message).toBe('Projeto não encontrado')
    })
  })

  describe('updateProject', () => {
    it('deve atualizar projeto existente', async () => {
      // Arrange
      const projectId = '1'
      const updateData = {
        name: 'Projeto Atualizado',
        acronym: 'PA',
        description: 'Nova descrição'
      }

      const mockUpdatedProject = {
        id: projectId,
        name: updateData.name,
        metadata: {
          acronym: updateData.acronym,
          description: updateData.description,
          color: '#3B82F6'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z'
      }

      const mockResponse = {
        data: {
          success: true,
          data: mockUpdatedProject,
          message: 'Projeto atualizado com sucesso'
        }
      }

      mockedAxios.put.mockResolvedValue(mockResponse)

      // Act
      const result = await projectService.updateProject(projectId, updateData)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data.name).toBe(updateData.name)
      expect(result.message).toBe('Projeto atualizado com sucesso')
      expect(mockedAxios.put).toHaveBeenCalledWith(`/projects/${projectId}`, updateData)
    })

    it('deve falhar ao atualizar projeto inexistente', async () => {
      // Arrange
      const projectId = 'inexistente'
      const updateData = { name: 'Novo Nome' }

      const mockError = {
        response: {
          status: 404,
          data: {
            success: false,
            message: 'Projeto não encontrado'
          }
        }
      }

      mockedAxios.put.mockRejectedValue(mockError)

      // Act
      const result = await projectService.updateProject(projectId, updateData)

      // Assert
      expect(result.success).toBe(false)
      expect(result.message).toBe('Projeto não encontrado')
    })
  })

  describe('deleteProject', () => {
    it('deve deletar projeto existente', async () => {
      // Arrange
      const projectId = '1'
      const mockResponse = {
        data: {
          success: true,
          message: 'Projeto deletado com sucesso'
        }
      }

      mockedAxios.delete.mockResolvedValue(mockResponse)

      // Act
      const result = await projectService.deleteProject(projectId)

      // Assert
      expect(result.success).toBe(true)
      expect(result.message).toBe('Projeto deletado com sucesso')
      expect(mockedAxios.delete).toHaveBeenCalledWith(`/projects/${projectId}`)
    })

    it('deve falhar ao deletar projeto inexistente', async () => {
      // Arrange
      const projectId = 'inexistente'
      const mockError = {
        response: {
          status: 404,
          data: {
            success: false,
            message: 'Projeto não encontrado'
          }
        }
      }

      mockedAxios.delete.mockRejectedValue(mockError)

      // Act
      const result = await projectService.deleteProject(projectId)

      // Assert
      expect(result.success).toBe(false)
      expect(result.message).toBe('Projeto não encontrado')
    })
  })
})

