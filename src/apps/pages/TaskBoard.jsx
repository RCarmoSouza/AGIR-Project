import React from 'react';

const TaskBoard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mural de Tarefas</h1>
        <p className="text-gray-600">Visualize a hierarquia completa de tarefas do projeto</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500">Em desenvolvimento - aqui mostraremos todas as tarefas incluindo as tarefas pai...</p>
      </div>
    </div>
  );
};

export default TaskBoard;

