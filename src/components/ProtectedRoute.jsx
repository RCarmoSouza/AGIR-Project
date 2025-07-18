import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAppStore from '../stores/appStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, currentUser } = useAppStore();

  useEffect(() => {
    console.log('ProtectedRoute - Debug:', {
      isAuthenticated,
      currentUser,
      hasUser: !!currentUser,
      localStorage: localStorage.getItem('agir-storage')
    });
  }, [isAuthenticated, currentUser]);

  // Se não estiver autenticado ou não tiver usuário, redireciona para login
  if (!isAuthenticated || !currentUser) {
    console.log('ProtectedRoute - Redirecionando para login:', {
      isAuthenticated,
      hasCurrentUser: !!currentUser
    });
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute - Usuário autenticado, renderizando children');
  // Se estiver autenticado, renderiza o componente filho
  return children;
};

export default ProtectedRoute;

