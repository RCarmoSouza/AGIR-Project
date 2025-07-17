import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  UserCircleIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/api';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Dados de exemplo (será substituído pela integração com backend)
  const mockUsers = [
    {
      id: '1',
      email: 'admin@agir.com',
      person: {
        name: 'Administrador AGIR',
        position: 'Administrador do Sistema',
        department: 'TI'
      },
      role: 'ADMIN',
      isActive: true,
      lastLoginAt: '2025-07-17T09:30:00Z',
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: '2',
      email: 'joao.silva@agir.com',
      person: {
        name: 'João Silva',
        position: 'Gerente de Projetos',
        department: 'Projetos'
      },
      role: 'MANAGER',
      isActive: true,
      lastLoginAt: '2025-07-17T08:45:00Z',
      createdAt: '2025-02-15T00:00:00Z'
    },
    {
      id: '3',
      email: 'maria.santos@agir.com',
      person: {
        name: 'Maria Santos',
        position: 'Desenvolvedora Senior',
        department: 'Desenvolvimento'
      },
      role: 'USER',
      isActive: true,
      lastLoginAt: '2025-07-17T09:15:00Z',
      createdAt: '2025-03-01T00:00:00Z'
    },
    {
      id: '4',
      email: 'pedro.oliveira@agir.com',
      person: {
        name: 'Pedro Oliveira',
        position: 'Designer UX/UI',
        department: 'Design'
      },
      role: 'USER',
      isActive: true,
      lastLoginAt: '2025-07-16T17:30:00Z',
      createdAt: '2025-03-15T00:00:00Z'
    },
    {
      id: '5',
      email: 'ana.costa@agir.com',
      person: {
        name: 'Ana Costa',
        position: 'Analista de QA',
        department: 'Qualidade'
      },
      role: 'USER',
      isActive: false,
      lastLoginAt: '2025-07-10T14:20:00Z',
      createdAt: '2025-04-01T00:00:00Z'
    }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // TODO: Integrar com backend
      // const response = await userService.getUsers();
      // setUsers(response.data.users);
      
      // Por enquanto, usar dados mock
      setTimeout(() => {
        setUsers(mockUsers);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setUsers(mockUsers);
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      // TODO: Integrar com backend
      // await userService.toggleUserStatus(userId, !currentStatus);
      
      // Atualizar estado local
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, isActive: !currentStatus }
          : user
      ));
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    try {
      // TODO: Integrar com backend
      // await userService.deleteUser(userId);
      
      // Remover do estado local
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      ADMIN: { label: 'Admin', color: 'bg-red-100 text-red-800' },
      MANAGER: { label: 'Gerente', color: 'bg-blue-100 text-blue-800' },
      USER: { label: 'Usuário', color: 'bg-green-100 text-green-800' },
      GUEST: { label: 'Convidado', color: 'bg-gray-100 text-gray-800' }
    };

    const config = roleConfig[role] || roleConfig.USER;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Ativo
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Inativo
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.person.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !selectedRole || user.role === selectedRole;
    const matchesStatus = !selectedStatus || 
      (selectedStatus === 'active' && user.isActive) ||
      (selectedStatus === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h1>
          <p className="text-gray-600">Gerencie usuários, permissões e acessos do sistema</p>
        </div>
        <button
          onClick={() => navigate('/security/users/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Novo Usuário
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filtros
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Perfil
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos os perfis</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Gerente</option>
                  <option value="USER">Usuário</option>
                  <option value="GUEST">Convidado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos os status</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Tabela de usuários */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado em
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <UserCircleIcon className="h-6 w-6 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.person.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          {user.person.position} • {user.person.department}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.isActive)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Nunca'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => navigate(`/security/users/${user.id}/edit`)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar usuário"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id, user.isActive)}
                        className={user.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                        title={user.isActive ? "Desativar usuário" : "Ativar usuário"}
                      >
                        {user.isActive ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir usuário"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedRole || selectedStatus 
                ? 'Tente ajustar os filtros de busca.'
                : 'Comece criando um novo usuário.'
              }
            </p>
            {!searchTerm && !selectedRole && !selectedStatus && (
              <div className="mt-6">
                <button
                  onClick={() => navigate('/security/users/new')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Novo Usuário
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Estatísticas</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-blue-600">{users.length}</p>
            <p className="text-sm text-gray-500">Total de Usuários</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-green-600">
              {users.filter(u => u.isActive).length}
            </p>
            <p className="text-sm text-gray-500">Usuários Ativos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-red-600">
              {users.filter(u => !u.isActive).length}
            </p>
            <p className="text-sm text-gray-500">Usuários Inativos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-purple-600">
              {users.filter(u => u.role === 'ADMIN').length}
            </p>
            <p className="text-sm text-gray-500">Administradores</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

