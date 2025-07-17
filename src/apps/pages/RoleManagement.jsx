import { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon,
  PencilIcon,
  EyeIcon,
  UserGroupIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const RoleManagement = () => {
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [loading, setLoading] = useState(true);

  // Dados mock dos perfis
  const mockRoles = [
    {
      id: 'ADMIN',
      name: 'Administrador',
      description: 'Acesso total ao sistema, pode gerenciar usuários e configurações',
      userCount: 2,
      color: 'bg-red-100 text-red-800',
      isSystem: true
    },
    {
      id: 'MANAGER',
      name: 'Gerente',
      description: 'Pode gerenciar projetos, equipes e visualizar relatórios',
      userCount: 4,
      color: 'bg-blue-100 text-blue-800',
      isSystem: true
    },
    {
      id: 'USER',
      name: 'Usuário',
      description: 'Acesso padrão para colaboradores, pode gerenciar suas próprias tarefas',
      userCount: 12,
      color: 'bg-green-100 text-green-800',
      isSystem: true
    },
    {
      id: 'GUEST',
      name: 'Convidado',
      description: 'Acesso limitado apenas para visualização',
      userCount: 0,
      color: 'bg-gray-100 text-gray-800',
      isSystem: true
    }
  ];

  // Dados mock das permissões organizadas por módulo
  const mockPermissions = [
    {
      module: 'Usuários',
      permissions: [
        { id: 'users:read', name: 'Visualizar usuários', description: 'Ver lista e detalhes de usuários' },
        { id: 'users:create', name: 'Criar usuários', description: 'Cadastrar novos usuários' },
        { id: 'users:update', name: 'Editar usuários', description: 'Modificar dados de usuários' },
        { id: 'users:delete', name: 'Excluir usuários', description: 'Remover usuários do sistema' }
      ]
    },
    {
      module: 'Projetos',
      permissions: [
        { id: 'projects:read', name: 'Visualizar projetos', description: 'Ver lista e detalhes de projetos' },
        { id: 'projects:create', name: 'Criar projetos', description: 'Cadastrar novos projetos' },
        { id: 'projects:update', name: 'Editar projetos', description: 'Modificar dados de projetos' },
        { id: 'projects:delete', name: 'Excluir projetos', description: 'Remover projetos do sistema' },
        { id: 'projects:manage_team', name: 'Gerenciar equipe', description: 'Adicionar/remover membros da equipe' }
      ]
    },
    {
      module: 'Tarefas',
      permissions: [
        { id: 'tasks:read', name: 'Visualizar tarefas', description: 'Ver lista e detalhes de tarefas' },
        { id: 'tasks:create', name: 'Criar tarefas', description: 'Cadastrar novas tarefas' },
        { id: 'tasks:update', name: 'Editar tarefas', description: 'Modificar dados de tarefas' },
        { id: 'tasks:delete', name: 'Excluir tarefas', description: 'Remover tarefas do sistema' },
        { id: 'tasks:assign', name: 'Atribuir tarefas', description: 'Designar responsáveis por tarefas' }
      ]
    },
    {
      module: 'Timesheet',
      permissions: [
        { id: 'timesheet:read', name: 'Visualizar apontamentos', description: 'Ver apontamentos de horas' },
        { id: 'timesheet:create', name: 'Criar apontamentos', description: 'Registrar horas trabalhadas' },
        { id: 'timesheet:update', name: 'Editar apontamentos', description: 'Modificar apontamentos próprios' },
        { id: 'timesheet:approve', name: 'Aprovar apontamentos', description: 'Aprovar/rejeitar apontamentos' },
        { id: 'timesheet:reports', name: 'Relatórios de horas', description: 'Visualizar relatórios de timesheet' }
      ]
    },
    {
      module: 'Pessoas',
      permissions: [
        { id: 'people:read', name: 'Visualizar pessoas', description: 'Ver lista e detalhes de pessoas' },
        { id: 'people:create', name: 'Cadastrar pessoas', description: 'Adicionar novas pessoas' },
        { id: 'people:update', name: 'Editar pessoas', description: 'Modificar dados de pessoas' },
        { id: 'people:delete', name: 'Excluir pessoas', description: 'Remover pessoas do sistema' }
      ]
    },
    {
      module: 'Configurações',
      permissions: [
        { id: 'settings:read', name: 'Visualizar configurações', description: 'Ver configurações do sistema' },
        { id: 'settings:update', name: 'Alterar configurações', description: 'Modificar configurações do sistema' },
        { id: 'audit:read', name: 'Logs de auditoria', description: 'Visualizar logs de atividades' },
        { id: 'system:admin', name: 'Administração total', description: 'Acesso completo ao sistema' }
      ]
    }
  ];

  // Permissões por perfil
  const mockRolePermissions = {
    ADMIN: [
      'users:read', 'users:create', 'users:update', 'users:delete',
      'projects:read', 'projects:create', 'projects:update', 'projects:delete', 'projects:manage_team',
      'tasks:read', 'tasks:create', 'tasks:update', 'tasks:delete', 'tasks:assign',
      'timesheet:read', 'timesheet:create', 'timesheet:update', 'timesheet:approve', 'timesheet:reports',
      'people:read', 'people:create', 'people:update', 'people:delete',
      'settings:read', 'settings:update', 'audit:read', 'system:admin'
    ],
    MANAGER: [
      'users:read',
      'projects:read', 'projects:create', 'projects:update', 'projects:manage_team',
      'tasks:read', 'tasks:create', 'tasks:update', 'tasks:assign',
      'timesheet:read', 'timesheet:approve', 'timesheet:reports',
      'people:read', 'people:update'
    ],
    USER: [
      'projects:read',
      'tasks:read', 'tasks:create', 'tasks:update',
      'timesheet:read', 'timesheet:create', 'timesheet:update',
      'people:read'
    ],
    GUEST: [
      'projects:read',
      'tasks:read',
      'people:read'
    ]
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: Integrar com backend
      // const [rolesResponse, permissionsResponse] = await Promise.all([
      //   roleService.getRoles(),
      //   roleService.getPermissions()
      // ]);
      
      // Usar dados mock
      setRoles(mockRoles);
      setPermissions(mockPermissions);
      setRolePermissions(mockRolePermissions);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (roleId, permissionId) => {
    return rolePermissions[roleId]?.includes(permissionId) || false;
  };

  const togglePermission = async (roleId, permissionId) => {
    try {
      const currentPermissions = rolePermissions[roleId] || [];
      const hasCurrentPermission = currentPermissions.includes(permissionId);
      
      let newPermissions;
      if (hasCurrentPermission) {
        newPermissions = currentPermissions.filter(p => p !== permissionId);
      } else {
        newPermissions = [...currentPermissions, permissionId];
      }

      // TODO: Integrar com backend
      // await roleService.updateRolePermissions(roleId, newPermissions);

      // Atualizar estado local
      setRolePermissions(prev => ({
        ...prev,
        [roleId]: newPermissions
      }));
    } catch (error) {
      console.error('Erro ao atualizar permissão:', error);
    }
  };

  const getPermissionCount = (roleId) => {
    return rolePermissions[roleId]?.length || 0;
  };

  const getTotalPermissions = () => {
    return permissions.reduce((total, module) => total + module.permissions.length, 0);
  };

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Perfis e Permissões</h1>
        <p className="text-gray-600">Configure os perfis de acesso e suas respectivas permissões</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Perfis */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Perfis de Acesso</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {roles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedRole === role.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{role.name}</p>
                        <p className="text-sm text-gray-500">{role.userCount} usuários</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role.color}`}>
                      {role.id}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{role.description}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>{getPermissionCount(role.id)} de {getTotalPermissions()} permissões</span>
                    {role.isSystem && (
                      <span className="text-blue-600">Sistema</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detalhes do Perfil e Permissões */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações do Perfil */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Perfil: {roles.find(r => r.id === selectedRole)?.name}
                </h3>
                <div className="flex items-center space-x-2">
                  <UserGroupIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {roles.find(r => r.id === selectedRole)?.userCount} usuários
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                {roles.find(r => r.id === selectedRole)?.description}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Permissões ativas: {getPermissionCount(selectedRole)} de {getTotalPermissions()}
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(getPermissionCount(selectedRole) / getTotalPermissions()) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Matriz de Permissões */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Permissões</h3>
              <p className="text-sm text-gray-600">
                Configure as permissões específicas para este perfil
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {permissions.map((module) => (
                  <div key={module.module}>
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      {module.module}
                    </h4>
                    <div className="space-y-2">
                      {module.permissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => togglePermission(selectedRole, permission.id)}
                                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                  hasPermission(selectedRole, permission.id)
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'border-gray-300 hover:border-blue-500'
                                }`}
                              >
                                {hasPermission(selectedRole, permission.id) && (
                                  <CheckIcon className="h-3 w-3 text-white" />
                                )}
                              </button>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {permission.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {permission.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Aviso sobre perfis do sistema */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Perfis do Sistema
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Os perfis marcados como "Sistema" são padrões do AGIR e suas permissões 
                    básicas não podem ser removidas. Você pode adicionar permissões extras, 
                    mas as permissões essenciais serão mantidas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;

