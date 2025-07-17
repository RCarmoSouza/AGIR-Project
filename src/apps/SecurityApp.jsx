import { Routes, Route } from 'react-router-dom';
import { 
  ChartBarIcon,
  UsersIcon,
  ShieldCheckIcon,
  CogIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import ModuleLayout from '../components/ModuleLayout';
import SecurityDashboard from './pages/SecurityDashboard';
import UserManagement from './pages/UserManagement';
import UserForm from './pages/UserForm';
import RoleManagement from './pages/RoleManagement';
import SecuritySettings from './pages/SecuritySettings';
import AuditLogs from './pages/AuditLogs';

const SecurityApp = () => {
  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: ChartBarIcon,
      path: '/security',
      exact: true
    },
    {
      id: 'users',
      label: 'Usuários',
      icon: UsersIcon,
      path: '/security/users'
    },
    {
      id: 'roles',
      label: 'Perfis e Permissões',
      icon: ShieldCheckIcon,
      path: '/security/roles'
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: CogIcon,
      path: '/security/settings'
    },
    {
      id: 'audit',
      label: 'Logs de Auditoria',
      icon: DocumentTextIcon,
      path: '/security/audit'
    }
  ];

  return (
    <ModuleLayout 
      title="Segurança" 
      subtitle="Gestão de usuários, perfis e configurações de segurança"
      sidebarItems={sidebarItems}
    >
      <Routes>
        <Route path="/" element={<SecurityDashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/users/new" element={<UserForm />} />
        <Route path="/users/:id/edit" element={<UserForm />} />
        <Route path="/roles" element={<RoleManagement />} />
        <Route path="/settings" element={<SecuritySettings />} />
        <Route path="/audit" element={<AuditLogs />} />
      </Routes>
    </ModuleLayout>
  );
};

export default SecurityApp;

