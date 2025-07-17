import { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  ShieldCheckIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  EyeIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const SecurityDashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalUsers: 18,
    activeUsers: 16,
    inactiveUsers: 2,
    totalRoles: 4,
    recentLogins: 12,
    failedLogins: 3,
    pendingApprovals: 2
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'login',
      user: 'Maria Santos',
      action: 'Login realizado',
      timestamp: '2025-07-17 09:30:15',
      ip: '192.168.1.100'
    },
    {
      id: 2,
      type: 'user_created',
      user: 'Admin',
      action: 'Usuário "João Silva" criado',
      timestamp: '2025-07-17 08:45:22',
      ip: '192.168.1.50'
    },
    {
      id: 3,
      type: 'failed_login',
      user: 'pedro.oliveira@agir.com',
      action: 'Tentativa de login falhada',
      timestamp: '2025-07-17 08:15:33',
      ip: '192.168.1.200'
    },
    {
      id: 4,
      type: 'role_changed',
      user: 'Admin',
      action: 'Perfil de "Ana Costa" alterado para Manager',
      timestamp: '2025-07-16 16:20:10',
      ip: '192.168.1.50'
    },
    {
      id: 5,
      type: 'logout',
      user: 'Pedro Oliveira',
      action: 'Logout realizado',
      timestamp: '2025-07-16 18:00:45',
      ip: '192.168.1.150'
    }
  ]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'login':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'logout':
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
      case 'failed_login':
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      case 'user_created':
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
      case 'role_changed':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'login':
        return 'text-green-600';
      case 'logout':
        return 'text-gray-600';
      case 'failed_login':
        return 'text-red-600';
      case 'user_created':
        return 'text-blue-600';
      case 'role_changed':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Usuários</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.totalUsers}</p>
              <p className="text-sm text-green-600">
                {metrics.activeUsers} ativos, {metrics.inactiveUsers} inativos
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Perfis Configurados</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.totalRoles}</p>
              <p className="text-sm text-gray-600">Admin, Manager, User, Guest</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Logins Recentes</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.recentLogins}</p>
              <p className="text-sm text-gray-600">Últimas 24 horas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tentativas Falhadas</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.failedLogins}</p>
              <p className="text-sm text-red-600">Últimas 24 horas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ações rápidas */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Ações Rápidas</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/security/users/new')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UserPlusIcon className="h-6 w-6 text-blue-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Novo Usuário</p>
                <p className="text-sm text-gray-500">Cadastrar novo usuário</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/security/roles')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShieldCheckIcon className="h-6 w-6 text-green-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Gerenciar Perfis</p>
                <p className="text-sm text-gray-500">Configurar permissões</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/security/audit')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <EyeIcon className="h-6 w-6 text-purple-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Logs de Auditoria</p>
                <p className="text-sm text-gray-500">Visualizar atividades</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Atividades recentes */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Atividades Recentes</h3>
            <button
              onClick={() => navigate('/security/audit')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Ver todas
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${getActivityColor(activity.type)}`}>
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activity.user} • {activity.timestamp} • IP: {activity.ip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertas de segurança */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mt-1" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Alertas de Segurança
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>3 tentativas de login falhadas nas últimas 24 horas</li>
                <li>2 usuários com senhas que expiram em 7 dias</li>
                <li>1 usuário inativo há mais de 30 dias</li>
              </ul>
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate('/security/settings')}
                className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md hover:bg-yellow-200 transition-colors"
              >
                Configurar Políticas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;

