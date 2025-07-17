import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
    status: 'ACTIVE'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Dados mock para edição
  const mockUsers = {
    '1': {
      id: '1',
      name: 'Administrador AGIR',
      email: 'admin@agir.com',
      phone: '(11) 99999-0001',
      role: 'ADMIN',
      status: 'ACTIVE'
    },
    '2': {
      id: '2',
      name: 'João Silva',
      email: 'joao.silva@agir.com',
      phone: '(11) 99999-0002',
      role: 'MANAGER',
      status: 'ACTIVE'
    }
  };

  useEffect(() => {
    if (isEditing && id) {
      // TODO: Buscar dados do usuário da API
      const userData = mockUsers[id];
      if (userData) {
        setFormData({
          ...userData,
          password: '',
          confirmPassword: ''
        });
      }
    }
  }, [id, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Nome obrigatório
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    // Email obrigatório e válido
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Senha obrigatória apenas para novos usuários
    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = 'Senha é obrigatória';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem';
      }
    } else if (formData.password) {
      // Se está editando e preencheu senha, validar
      if (formData.password.length < 6) {
        newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Integrar com API
      console.log('Dados do usuário:', formData);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirecionar para lista de usuários
      navigate('/security/users');
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      alert('Erro ao salvar usuário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/security/users');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <UserIcon className="h-8 w-8 text-orange-500 mr-3" />
              {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
            </h1>
            <p className="text-gray-600">
              {isEditing 
                ? 'Atualize os dados do usuário' 
                : 'Preencha os dados para criar um novo usuário'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <div className="relative">
                  <UserIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Digite o nome completo"
                    className={`pl-10 pr-4 py-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <EnvelopeIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="usuario@agir.com"
                    className={`pl-10 pr-4 py-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <div className="relative">
                  <PhoneIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Perfil */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Perfil de Acesso *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="USER">Usuário</option>
                  <option value="MANAGER">Gerente</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

            </div>
          </div>

          {/* Configurações de Acesso */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações de Acesso</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isEditing ? 'Nova Senha (deixe em branco para manter atual)' : 'Senha *'}
                </label>
                <div className="relative">
                  <KeyIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Digite a senha"
                    className={`pl-10 pr-10 py-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirmar Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isEditing ? 'Confirmar Nova Senha' : 'Confirmar Senha *'}
                </label>
                <div className="relative">
                  <KeyIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirme a senha"
                    className={`pl-10 pr-10 py-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ACTIVE">Ativo</option>
                  <option value="INACTIVE">Inativo</option>
                </select>
              </div>

            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar Usuário')}
            </button>
          </div>

        </form>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Informações sobre o cadastro de usuários
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Este formulário é apenas para dados de autenticação e acesso ao sistema</li>
                <li>Informações profissionais (cargo, departamento, especialização) são gerenciadas no módulo <strong>Pessoas</strong></li>
                <li>Após criar o usuário, vincule-o a uma pessoa no módulo correspondente</li>
                <li>Senhas devem ter pelo menos 6 caracteres para segurança básica</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default UserForm;

