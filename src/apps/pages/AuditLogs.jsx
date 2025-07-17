import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  ClockIcon,
  UserIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [dateRange, setDateRange] = useState('today');
  const [showFilters, setShowFilters] = useState(false);

  // Dados mock dos logs
  const mockLogs = [
    {
      id: '1',
      timestamp: '2025-07-17T10:30:15Z',
      type: 'user_login',
      user: 'Maria Santos',
      userId: '3',
      action: 'Login realizado com sucesso',
      details: 'Login via email/senha',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'info'
    },
    {
      id: '2',
      timestamp: '2025-07-17T10:25:33Z',
      type: 'user_created',
      user: 'Admin AGIR',
      userId: '1',
      action: 'Usuário criado',
      details: 'Novo usuário "João Silva" criado com perfil MANAGER',
      ipAddress: '192.168.1.50',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'info'
    },
    {
      id: '3',
      timestamp: '2025-07-17T10:20:45Z',
      type: 'failed_login',
      user: 'pedro.oliveira@agir.com',
      userId: null,
      action: 'Tentativa de login falhada',
      details: 'Senha incorreta - 3ª tentativa',
      ipAddress: '192.168.1.200',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      severity: 'warning'
    },
    {
      id: '4',
      timestamp: '2025-07-17T10:15:22Z',
      type: 'permission_changed',
      user: 'Admin AGIR',
      userId: '1',
      action: 'Permissões alteradas',
      details: 'Perfil de "Ana Costa" alterado de USER para MANAGER',
      ipAddress: '192.168.1.50',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'warning'
    },
    {
      id: '5',
      timestamp: '2025-07-17T10:10:11Z',
      type: 'task_created',
      user: 'João Silva',
      userId: '2',
      action: 'Tarefa criada',
      details: 'Nova tarefa "Implementar autenticação" criada no projeto Sistema E-commerce',
      ipAddress: '192.168.1.75',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'info'
    },
    {
      id: '6',
      timestamp: '2025-07-17T10:05:33Z',
      type: 'system_backup',
      user: 'Sistema',
      userId: null,
      action: 'Backup automático executado',
      details: 'Backup completo do banco de dados realizado com sucesso',
      ipAddress: 'localhost',
      userAgent: 'AGIR-System/1.0',
      severity: 'info'
    },
    {
      id: '7',
      timestamp: '2025-07-17T09:55:44Z',
      type: 'user_logout',
      user: 'Pedro Oliveira',
      userId: '4',
      action: 'Logout realizado',
      details: 'Usuário fez logout do sistema',
      ipAddress: '192.168.1.150',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      severity: 'info'
    },
    {
      id: '8',
      timestamp: '2025-07-17T09:50:12Z',
      type: 'security_alert',
      user: 'Sistema',
      userId: null,
      action: 'Alerta de segurança',
      details: 'Múltiplas tentativas de login falhadas detectadas para pedro.oliveira@agir.com',
      ipAddress: '192.168.1.200',
      userAgent: 'Sistema de Monitoramento',
      severity: 'error'
    }
  ];

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      // TODO: Integrar com backend
      // const response = await auditService.getLogs({
      //   search: searchTerm,
      //   type: selectedType,
      //   user: selectedUser,
      //   dateRange: dateRange
      // });
      // setLogs(response.data.logs);
      
      // Usar dados mock
      setTimeout(() => {
        setLogs(mockLogs);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      setLogs(mockLogs);
      setLoading(false);
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'user_login':
      case 'user_logout':
        return <UserIcon className="h-4 w-4" />;
      case 'system_backup':
      case 'security_alert':
        return <ComputerDesktopIcon className="h-4 w-4" />;
      case 'failed_login':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getLogColor = (severity) => {
    switch (severity) {
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'info':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityBadge = (severity) => {
    const config = {
      error: { label: 'Erro', color: 'bg-red-100 text-red-800' },
      warning: { label: 'Aviso', color: 'bg-yellow-100 text-yellow-800' },
      info: { label: 'Info', color: 'bg-blue-100 text-blue-800' }
    };

    const severityConfig = config[severity] || config.info;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityConfig.color}`}>
        {severityConfig.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const exportLogs = () => {
    // TODO: Implementar exportação
    console.log('Exportando logs...');
    alert('Funcionalidade de exportação será implementada em breve');
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !selectedType || log.type === selectedType;
    const matchesUser = !selectedUser || log.userId === selectedUser;

    return matchesSearch && matchesType && matchesUser;
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
          <h1 className="text-2xl font-bold text-gray-900">Logs de Auditoria</h1>
          <p className="text-gray-600">Visualize e monitore todas as atividades do sistema</p>
        </div>
        <button
          onClick={exportLogs}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
          Exportar
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
                  placeholder="Buscar nos logs..."
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
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Evento
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos os tipos</option>
                  <option value="user_login">Login de usuário</option>
                  <option value="user_logout">Logout de usuário</option>
                  <option value="failed_login">Login falhado</option>
                  <option value="user_created">Usuário criado</option>
                  <option value="permission_changed">Permissão alterada</option>
                  <option value="task_created">Tarefa criada</option>
                  <option value="system_backup">Backup do sistema</option>
                  <option value="security_alert">Alerta de segurança</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuário
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos os usuários</option>
                  <option value="1">Admin AGIR</option>
                  <option value="2">João Silva</option>
                  <option value="3">Maria Santos</option>
                  <option value="4">Pedro Oliveira</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Período
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="today">Hoje</option>
                  <option value="week">Última semana</option>
                  <option value="month">Último mês</option>
                  <option value="quarter">Último trimestre</option>
                  <option value="year">Último ano</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Lista de logs */}
        <div className="divide-y divide-gray-200">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 p-2 rounded-full ${getLogColor(log.severity)}`}>
                  {getLogIcon(log.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">
                        {log.action}
                      </p>
                      {getSeverityBadge(log.severity)}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDate(log.timestamp)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {log.details}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                    <span>Usuário: {log.user}</span>
                    <span>IP: {log.ipAddress}</span>
                    <span>ID: {log.id}</span>
                  </div>
                </div>
                <button className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600">
                  <EyeIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum log encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedType || selectedUser 
                ? 'Tente ajustar os filtros de busca.'
                : 'Não há logs de auditoria para exibir.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Eventos</p>
              <p className="text-2xl font-semibold text-gray-900">{logs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Logins Hoje</p>
              <p className="text-2xl font-semibold text-gray-900">
                {logs.filter(l => l.type === 'user_login').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tentativas Falhadas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {logs.filter(l => l.type === 'failed_login').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ComputerDesktopIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Alertas de Segurança</p>
              <p className="text-2xl font-semibold text-gray-900">
                {logs.filter(l => l.severity === 'error').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;

