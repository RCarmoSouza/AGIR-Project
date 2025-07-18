import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import useAppStore from '../stores/appStore';
import authService from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAppStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro quando usuário começar a digitar
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData.email, formData.password);
      
      console.log('Resposta do login:', response);
      
      if (response.success) {
        // Extrair dados do usuário da resposta
        const userData = response.data?.user || response.user;
        
        console.log('Dados do usuário:', userData);
        
        if (userData) {
          // Salvar dados do usuário no store
          setCurrentUser(userData);
          
          console.log('Usuário salvo no store, redirecionando...');
          console.log('Estado antes do navigate:', { isAuthenticated: true, userData });
          
          // Aguardar um pouco para garantir que o estado foi atualizado
          setTimeout(() => {
            console.log('Executando navigate para /');
            navigate('/', { replace: true });
          }, 100);
        } else {
          setError('Dados do usuário não recebidos');
        }
      } else {
        setError(response.message || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro de conexão. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'admin@agir.com',
      password: 'admin123'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Logo e Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">AGIR</h2>
          <p className="mt-2 text-sm text-gray-600">Sistema de Gestão Ágil</p>
          <p className="text-xs text-gray-500">Faça login para acessar o sistema</p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="seu@email.com"
              />
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Botão Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Credenciais de Demo */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Credenciais de demonstração:</p>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Usar credenciais de demo
              </button>
            </div>
            
            <div className="mt-4 bg-gray-50 rounded-md p-3">
              <div className="text-xs text-gray-600 space-y-1">
                <div><strong>Admin:</strong> admin@agir.com / admin123</div>
                <div><strong>Gerente:</strong> joao.silva@agir.com / 123456</div>
                <div><strong>Usuário:</strong> maria.santos@agir.com / 123456</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Sistema AGIR v1.0 - Gestão Ágil de Projetos
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

