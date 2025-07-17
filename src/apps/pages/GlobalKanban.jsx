import React from 'react';

const GlobalKanban = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kanban Global</h1>
          <p className="text-gray-600 mt-2">Visualização centralizada de todas as suas tarefas</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="myTasks"
                defaultChecked
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="myTasks" className="ml-2 block text-sm text-gray-900">
                Apenas minhas tarefas
              </label>
            </div>
            
            <input
              type="text"
              placeholder="Buscar tarefas..."
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
            
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm">
              <option value="">Todos os projetos</option>
              <option value="1">Sistema de E-commerce</option>
              <option value="2">App Mobile</option>
            </select>
            
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm">
              <option value="">Todas as prioridades</option>
              <option value="Crítica">Crítica</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
            
            <span className="text-sm text-gray-500">0 tarefas encontradas</span>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">A Fazer</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Em Progresso</p>
              <p className="text-2xl font-bold text-gray-900">0<span className="text-sm text-gray-500">/3</span></p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Bloqueado</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Concluído</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        {/* Quadro Kanban */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-96">
          {/* A Fazer */}
          <div className="bg-blue-100 rounded-lg p-4 min-h-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">A Fazer</h3>
              <span className="px-2 py-1 rounded-full text-sm font-medium bg-white text-gray-700">0</span>
            </div>
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Nenhuma tarefa</p>
              <p className="text-xs">Arraste tarefas aqui</p>
            </div>
          </div>

          {/* Em Progresso */}
          <div className="bg-yellow-100 rounded-lg p-4 min-h-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Em Progresso</h3>
              <span className="px-2 py-1 rounded-full text-sm font-medium bg-white text-gray-700">0/3</span>
            </div>
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Nenhuma tarefa</p>
              <p className="text-xs">Arraste tarefas aqui</p>
            </div>
          </div>

          {/* Bloqueado */}
          <div className="bg-red-100 rounded-lg p-4 min-h-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Bloqueado</h3>
              <span className="px-2 py-1 rounded-full text-sm font-medium bg-white text-gray-700">0</span>
            </div>
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Nenhuma tarefa</p>
              <p className="text-xs">Arraste tarefas aqui</p>
            </div>
          </div>

          {/* Concluído */}
          <div className="bg-green-100 rounded-lg p-4 min-h-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Concluído</h3>
              <span className="px-2 py-1 rounded-full text-sm font-medium bg-white text-gray-700">0</span>
            </div>
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Nenhuma tarefa</p>
              <p className="text-xs">Arraste tarefas aqui</p>
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
          <h3 className="font-medium text-gray-900 mb-3">Legenda</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tipos de Tarefa</h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Epic</span>
                  <span className="text-xs text-gray-600">Épico</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Feature</span>
                  <span className="text-xs text-gray-600">Funcionalidade</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">User Story</span>
                  <span className="text-xs text-gray-600">História</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Prioridades</h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-xs text-gray-600">Crítica</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span className="text-xs text-gray-600">Alta</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-xs text-gray-600">Média</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-xs text-gray-600">Baixa</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">WIP Limits</h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">Em Progresso: máx 3</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-red-600">Vermelho = limite excedido</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Informações</h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">SP = Story Points</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">h = Horas estimadas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Responsável</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalKanban;

