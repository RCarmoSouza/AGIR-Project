import { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon,
  KeyIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CogIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

const SecuritySettings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState({
    // Políticas de senha
    passwordPolicy: {
      minLength: 6,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
      passwordExpiration: 90, // dias
      preventReuse: 5 // últimas N senhas
    },
    
    // Configurações de sessão
    sessionSettings: {
      sessionTimeout: 24, // horas
      maxConcurrentSessions: 3,
      requireReauthentication: false,
      logoutOnClose: false
    },
    
    // Configurações de login
    loginSettings: {
      maxFailedAttempts: 5,
      lockoutDuration: 30, // minutos
      enableTwoFactor: false,
      allowSocialLogin: true
    },
    
    // Configurações de auditoria
    auditSettings: {
      logUserActions: true,
      logSystemEvents: true,
      retentionPeriod: 365, // dias
      enableRealTimeAlerts: true
    },
    
    // Configurações de API
    apiSettings: {
      enableApiAccess: true,
      apiKey: 'agir_api_key_1234567890abcdef',
      rateLimitPerHour: 1000,
      requireApiKeyAuth: true
    }
  });

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Senhas fracas detectadas',
      message: '3 usuários estão usando senhas que não atendem às políticas de segurança',
      action: 'Forçar alteração'
    },
    {
      id: 2,
      type: 'info',
      title: 'Backup de segurança',
      message: 'Último backup realizado há 2 dias',
      action: 'Executar backup'
    }
  ]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // TODO: Integrar com backend
      // const response = await securityService.getSettings();
      // setSettings(response.data);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // TODO: Integrar com backend
      // await securityService.updateSettings(settings);
      console.log('Configurações salvas:', settings);
      
      // Simular sucesso
      setTimeout(() => {
        setSaving(false);
        alert('Configurações salvas com sucesso!');
      }, 1000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setSaving(false);
    }
  };

  const updateSetting = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const generateNewApiKey = () => {
    const newKey = 'agir_api_key_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    updateSetting('apiSettings', 'apiKey', newKey);
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Configurações de Segurança</h1>
        <p className="text-gray-600">Configure políticas de segurança, autenticação e auditoria</p>
      </div>

      {/* Alertas de segurança */}
      {alerts.length > 0 && (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className={`border rounded-lg p-4 ${getAlertColor(alert.type)}`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {alert.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {alert.message}
                  </p>
                  {alert.action && (
                    <div className="mt-3">
                      <button className="text-sm bg-white px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50">
                        {alert.action}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Políticas de Senha */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <KeyIcon className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Políticas de Senha</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comprimento mínimo
              </label>
              <input
                type="number"
                min="4"
                max="32"
                value={settings.passwordPolicy.minLength}
                onChange={(e) => updateSetting('passwordPolicy', 'minLength', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requireUppercase"
                  checked={settings.passwordPolicy.requireUppercase}
                  onChange={(e) => updateSetting('passwordPolicy', 'requireUppercase', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="requireUppercase" className="ml-2 block text-sm text-gray-900">
                  Exigir letras maiúsculas
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requireLowercase"
                  checked={settings.passwordPolicy.requireLowercase}
                  onChange={(e) => updateSetting('passwordPolicy', 'requireLowercase', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="requireLowercase" className="ml-2 block text-sm text-gray-900">
                  Exigir letras minúsculas
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requireNumbers"
                  checked={settings.passwordPolicy.requireNumbers}
                  onChange={(e) => updateSetting('passwordPolicy', 'requireNumbers', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="requireNumbers" className="ml-2 block text-sm text-gray-900">
                  Exigir números
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requireSpecialChars"
                  checked={settings.passwordPolicy.requireSpecialChars}
                  onChange={(e) => updateSetting('passwordPolicy', 'requireSpecialChars', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="requireSpecialChars" className="ml-2 block text-sm text-gray-900">
                  Exigir caracteres especiais
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiração da senha (dias)
              </label>
              <input
                type="number"
                min="0"
                max="365"
                value={settings.passwordPolicy.passwordExpiration}
                onChange={(e) => updateSetting('passwordPolicy', 'passwordExpiration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">0 = nunca expira</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prevenir reutilização (últimas N senhas)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={settings.passwordPolicy.preventReuse}
                onChange={(e) => updateSetting('passwordPolicy', 'preventReuse', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Configurações de Sessão */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Configurações de Sessão</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timeout da sessão (horas)
              </label>
              <input
                type="number"
                min="1"
                max="168"
                value={settings.sessionSettings.sessionTimeout}
                onChange={(e) => updateSetting('sessionSettings', 'sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Máximo de sessões simultâneas
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.sessionSettings.maxConcurrentSessions}
                onChange={(e) => updateSetting('sessionSettings', 'maxConcurrentSessions', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requireReauthentication"
                  checked={settings.sessionSettings.requireReauthentication}
                  onChange={(e) => updateSetting('sessionSettings', 'requireReauthentication', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="requireReauthentication" className="ml-2 block text-sm text-gray-900">
                  Exigir reautenticação para ações sensíveis
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="logoutOnClose"
                  checked={settings.sessionSettings.logoutOnClose}
                  onChange={(e) => updateSetting('sessionSettings', 'logoutOnClose', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="logoutOnClose" className="ml-2 block text-sm text-gray-900">
                  Logout automático ao fechar navegador
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Configurações de Login */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Configurações de Login</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Máximo de tentativas falhadas
              </label>
              <input
                type="number"
                min="3"
                max="20"
                value={settings.loginSettings.maxFailedAttempts}
                onChange={(e) => updateSetting('loginSettings', 'maxFailedAttempts', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duração do bloqueio (minutos)
              </label>
              <input
                type="number"
                min="5"
                max="1440"
                value={settings.loginSettings.lockoutDuration}
                onChange={(e) => updateSetting('loginSettings', 'lockoutDuration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableTwoFactor"
                  checked={settings.loginSettings.enableTwoFactor}
                  onChange={(e) => updateSetting('loginSettings', 'enableTwoFactor', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableTwoFactor" className="ml-2 block text-sm text-gray-900">
                  Habilitar autenticação de dois fatores
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowSocialLogin"
                  checked={settings.loginSettings.allowSocialLogin}
                  onChange={(e) => updateSetting('loginSettings', 'allowSocialLogin', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="allowSocialLogin" className="ml-2 block text-sm text-gray-900">
                  Permitir login social (Google, Microsoft)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Configurações de API */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <CogIcon className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Configurações de API</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableApiAccess"
                checked={settings.apiSettings.enableApiAccess}
                onChange={(e) => updateSetting('apiSettings', 'enableApiAccess', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enableApiAccess" className="ml-2 block text-sm text-gray-900">
                Habilitar acesso via API
              </label>
            </div>

            {settings.apiSettings.enableApiAccess && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chave da API
                  </label>
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={settings.apiSettings.apiKey}
                        readOnly
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showApiKey ? (
                          <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={generateNewApiKey}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Gerar Nova
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Limite de requisições por hora
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    value={settings.apiSettings.rateLimitPerHour}
                    onChange={(e) => updateSetting('apiSettings', 'rateLimitPerHour', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireApiKeyAuth"
                    checked={settings.apiSettings.requireApiKeyAuth}
                    onChange={(e) => updateSetting('apiSettings', 'requireApiKeyAuth', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireApiKeyAuth" className="ml-2 block text-sm text-gray-900">
                    Exigir autenticação por chave da API
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Configurações de Auditoria */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Configurações de Auditoria</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="logUserActions"
                  checked={settings.auditSettings.logUserActions}
                  onChange={(e) => updateSetting('auditSettings', 'logUserActions', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="logUserActions" className="ml-2 block text-sm text-gray-900">
                  Registrar ações dos usuários
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="logSystemEvents"
                  checked={settings.auditSettings.logSystemEvents}
                  onChange={(e) => updateSetting('auditSettings', 'logSystemEvents', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="logSystemEvents" className="ml-2 block text-sm text-gray-900">
                  Registrar eventos do sistema
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableRealTimeAlerts"
                  checked={settings.auditSettings.enableRealTimeAlerts}
                  onChange={(e) => updateSetting('auditSettings', 'enableRealTimeAlerts', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableRealTimeAlerts" className="ml-2 block text-sm text-gray-900">
                  Habilitar alertas em tempo real
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período de retenção dos logs (dias)
              </label>
              <input
                type="number"
                min="30"
                max="2555"
                value={settings.auditSettings.retentionPeriod}
                onChange={(e) => updateSetting('auditSettings', 'retentionPeriod', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Logs mais antigos serão automaticamente removidos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botão de salvar */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Salvando...
            </div>
          ) : (
            'Salvar Configurações'
          )}
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;

