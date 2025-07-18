import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Header } from '../../components/Header'
import { useAppStore } from '../../stores/appStore'

// Mock do store
vi.mock('../../stores/appStore')
const mockUseAppStore = vi.mocked(useAppStore)

// Mock do react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Componente wrapper para testes
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Header', () => {
  const mockLogout = vi.fn()
  const mockUser = {
    id: '1',
    name: 'Admin User',
    email: 'admin@agir.com',
    role: 'ADMIN'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAppStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      logout: mockLogout,
      // Outros valores do store que podem ser necessários
      token: 'mock-token',
      login: vi.fn(),
      setUser: vi.fn(),
    })
  })

  it('deve renderizar o header com logo AGIR', () => {
    // Act
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )

    // Assert
    expect(screen.getByText('AGIR')).toBeInTheDocument()
    expect(screen.getByText('Sistema de Gestão Ágil')).toBeInTheDocument()
  })

  it('deve exibir informações do usuário logado', () => {
    // Act
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )

    // Assert
    expect(screen.getByText('Admin User')).toBeInTheDocument()
    expect(screen.getByText('admin@agir.com')).toBeInTheDocument()
  })

  it('deve navegar para dashboard ao clicar no logo', () => {
    // Act
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )

    const logo = screen.getByText('AGIR')
    fireEvent.click(logo)

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  })

  it('deve exibir menu de navegação', () => {
    // Act
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )

    // Assert
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Projetos')).toBeInTheDocument()
    expect(screen.getByText('Pessoas')).toBeInTheDocument()
    expect(screen.getByText('Kanban')).toBeInTheDocument()
  })

  it('deve navegar para páginas corretas ao clicar nos links', () => {
    // Act
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )

    // Test Dashboard navigation
    fireEvent.click(screen.getByText('Dashboard'))
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')

    // Test Projects navigation
    fireEvent.click(screen.getByText('Projetos'))
    expect(mockNavigate).toHaveBeenCalledWith('/projects')

    // Test People navigation
    fireEvent.click(screen.getByText('Pessoas'))
    expect(mockNavigate).toHaveBeenCalledWith('/people')

    // Test Kanban navigation
    fireEvent.click(screen.getByText('Kanban'))
    expect(mockNavigate).toHaveBeenCalledWith('/kanban')
  })

  it('deve exibir dropdown do usuário ao clicar no avatar', () => {
    // Act
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )

    const userButton = screen.getByRole('button', { name: /admin user/i })
    fireEvent.click(userButton)

    // Assert
    expect(screen.getByText('Perfil')).toBeInTheDocument()
    expect(screen.getByText('Configurações')).toBeInTheDocument()
    expect(screen.getByText('Sair')).toBeInTheDocument()
  })

  it('deve fazer logout ao clicar em Sair', () => {
    // Act
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )

    const userButton = screen.getByRole('button', { name: /admin user/i })
    fireEvent.click(userButton)

    const logoutButton = screen.getByText('Sair')
    fireEvent.click(logoutButton)

    // Assert
    expect(mockLogout).toHaveBeenCalled()
  })

  it('deve exibir role do usuário', () => {
    // Act
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )

    // Assert
    expect(screen.getByText('ADMIN')).toBeInTheDocument()
  })

  it('deve renderizar corretamente para usuário comum', () => {
    // Arrange
    const regularUser = {
      id: '2',
      name: 'Regular User',
      email: 'user@agir.com',
      role: 'USER'
    }

    mockUseAppStore.mockReturnValue({
      user: regularUser,
      isAuthenticated: true,
      logout: mockLogout,
      token: 'mock-token',
      login: vi.fn(),
      setUser: vi.fn(),
    })

    // Act
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )

    // Assert
    expect(screen.getByText('Regular User')).toBeInTheDocument()
    expect(screen.getByText('user@agir.com')).toBeInTheDocument()
    expect(screen.getByText('USER')).toBeInTheDocument()
  })

  it('deve ser responsivo em telas menores', () => {
    // Arrange
    // Simular tela pequena
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    })

    // Act
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )

    // Assert
    // Verificar se o menu mobile está presente
    const mobileMenuButton = screen.getByRole('button', { name: /menu/i })
    expect(mobileMenuButton).toBeInTheDocument()
  })

  it('deve abrir menu mobile ao clicar no botão', () => {
    // Arrange
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    })

    // Act
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )

    const mobileMenuButton = screen.getByRole('button', { name: /menu/i })
    fireEvent.click(mobileMenuButton)

    // Assert
    // Verificar se os links de navegação estão visíveis no menu mobile
    expect(screen.getAllByText('Dashboard')).toHaveLength(2) // Desktop + Mobile
    expect(screen.getAllByText('Projetos')).toHaveLength(2)
  })
})

