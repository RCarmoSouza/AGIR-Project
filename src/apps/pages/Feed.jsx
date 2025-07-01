import React from 'react';
import { BellIcon, ChatBubbleLeftIcon, UserIcon } from '@heroicons/react/24/outline';

const Feed = () => {
  const feedItems = [
    {
      id: 1,
      type: 'mention',
      user: 'Carlos Santos',
      action: 'mencionou você em',
      target: 'Configurar ambiente de desenvolvimento',
      project: 'Sistema de E-commerce',
      time: '2 horas atrás',
      avatar: 'CS',
      unread: true
    },
    {
      id: 2,
      type: 'comment',
      user: 'Maria Oliveira',
      action: 'comentou em',
      target: 'Design da interface de login',
      project: 'App Mobile',
      time: '4 horas atrás',
      avatar: 'MO',
      unread: true
    },
    {
      id: 3,
      type: 'assignment',
      user: 'Ana Silva',
      action: 'atribuiu você à tarefa',
      target: 'Implementar validação de formulário',
      project: 'Sistema de E-commerce',
      time: '6 horas atrás',
      avatar: 'AS',
      unread: false
    }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'mention':
        return UserIcon;
      case 'comment':
        return ChatBubbleLeftIcon;
      default:
        return BellIcon;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'mention':
        return 'bg-blue-100 text-blue-600';
      case 'comment':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
        <p className="text-gray-600">Acompanhe menções, comentários e atividades dos seus projetos</p>
      </div>

      {/* Feed Items */}
      <div className="space-y-4">
        {feedItems.map((item) => {
          const Icon = getIcon(item.type);
          return (
            <div
              key={item.id}
              className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow ${
                item.unread ? 'border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColor(item.type)}`}>
                  <Icon className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">{item.avatar}</span>
                    </div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{item.user}</span> {item.action}{' '}
                      <span className="font-medium text-blue-600">{item.target}</span>
                    </p>
                    {item.unread && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  
                  <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                    <span>{item.project}</span>
                    <span>•</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {feedItems.length === 0 && (
        <div className="text-center py-12">
          <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notificação</h3>
          <p className="text-gray-500">Quando alguém mencionar você ou comentar em suas tarefas, aparecerá aqui.</p>
        </div>
      )}
    </div>
  );
};

export default Feed;

