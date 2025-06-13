'use client';

import { useAppStore } from '@/stores/appStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  FolderIcon, 
  CalendarDaysIcon, 
  ClockIcon,
  ChartBarIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, badge: '1' },
  { name: 'Projetos', href: '/projects', icon: FolderIcon, badge: '2' },
  { name: 'Sprints', href: '/sprints', icon: CalendarDaysIcon, badge: '3' },
  { name: 'Timesheet', href: '/timesheet', icon: ClockIcon, badge: '4' },
  { name: 'Relatórios', href: '/reports', icon: ChartBarIcon, badge: '5' },
  { name: 'Configurações', href: '/settings', icon: Cog6ToothIcon, badge: '6' },
];

const badgeColors = [
  'bg-green-500',
  'bg-blue-500', 
  'bg-yellow-500',
  'bg-orange-500',
  'bg-purple-500',
  'bg-cyan-500'
];

export function Sidebar() {
  const pathname = usePathname();
  const { selectedProject } = useAppStore();

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">SP</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Sprint Planning</h2>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item, index) => {
          const isActive = pathname === item.href || 
            (item.href === '/' && pathname === '/') ||
            (item.href === '/projects' && pathname === '/') ||
            (item.href === '/sprints' && pathname.startsWith('/sprints'));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                <span className={cn(
                  'absolute -top-2 -right-2 w-5 h-5 text-xs font-bold text-white rounded-full flex items-center justify-center',
                  badgeColors[index]
                )}>
                  {item.badge}
                </span>
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Projeto Atual */}
      {selectedProject && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Projeto Atual
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {selectedProject.name}
            </h4>
            <p className="text-xs text-gray-500 mt-1 capitalize">
              {selectedProject.status}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

