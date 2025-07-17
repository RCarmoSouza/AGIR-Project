import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import GlobalKanban from './pages/GlobalKanban';
import { Squares2X2Icon, HomeIcon } from '@heroicons/react/24/outline';

const KanbanApp = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header customizado */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <HomeIcon className="w-5 h-5 mr-2" />
                AGIR
              </Link>
              <span className="text-gray-400">/</span>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Squares2X2Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Kanban</h1>
                  <p className="text-sm text-gray-500">Visualização centralizada de tarefas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="p-6">
        <Routes>
          <Route path="/" element={<GlobalKanban />} />
          <Route path="/board" element={<GlobalKanban />} />
        </Routes>
      </main>
    </div>
  );
};

export default KanbanApp;

