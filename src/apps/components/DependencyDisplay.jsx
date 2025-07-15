import React from 'react';
import { Link, ArrowRight, AlertTriangle } from 'lucide-react';
import { DEPENDENCY_TYPES } from '../../utils/dateCalculationEngine';

/**
 * Componente para exibir dependências de uma tarefa na tabela
 * 
 * Mostra uma visualização compacta das dependências com:
 * - Número de dependências
 * - Tipos de dependência
 * - Indicadores visuais
 * - Botão para abrir modal de edição
 */
const DependencyDisplay = ({ 
  task, 
  allTasks, 
  onEditDependencies,
  hasCircularDependency = false 
}) => {
  const dependencies = task.predecessors || [];
  
  // Se não tem dependências
  if (dependencies.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <button
          onClick={() => onEditDependencies(task)}
          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="Adicionar dependências"
        >
          <Link className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Obtém nome da tarefa por ID
  const getTaskName = (taskId) => {
    const foundTask = allTasks.find(t => t.id === taskId);
    return foundTask ? foundTask.name : `Tarefa ${taskId}`;
  };

  // Obtém ícone do tipo de dependência
  const getDependencyIcon = (type) => {
    switch (type) {
      case DEPENDENCY_TYPES.FS: return '→';
      case DEPENDENCY_TYPES.SS: return '⇉';
      case DEPENDENCY_TYPES.FF: return '⇇';
      case DEPENDENCY_TYPES.SF: return '↱';
      default: return '→';
    }
  };

  // Obtém cor do tipo de dependência
  const getDependencyColor = (type) => {
    switch (type) {
      case DEPENDENCY_TYPES.FS: return 'text-blue-600';
      case DEPENDENCY_TYPES.SS: return 'text-green-600';
      case DEPENDENCY_TYPES.FF: return 'text-purple-600';
      case DEPENDENCY_TYPES.SF: return 'text-orange-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Indicador de erro circular */}
      {hasCircularDependency && (
        <AlertTriangle className="w-4 h-4 text-red-500" title="Dependência circular detectada" />
      )}

      {/* Contador de dependências */}
      <div className="flex items-center space-x-1">
        <span className="text-xs font-medium text-gray-600">
          {dependencies.length}
        </span>
        <Link className="w-3 h-3 text-gray-400" />
      </div>

      {/* Visualização compacta das dependências */}
      <div className="flex items-center space-x-1 max-w-32 overflow-hidden">
        {dependencies.slice(0, 3).map((dep, index) => (
          <div key={index} className="flex items-center space-x-1">
            {/* Ícone do tipo */}
            <span 
              className={`text-xs font-mono ${getDependencyColor(dep.type)}`}
              title={`${dep.type}: ${getTaskName(dep.taskId)}`}
            >
              {getDependencyIcon(dep.type)}
            </span>
            
            {/* ID da tarefa predecessora */}
            <span className="text-xs text-gray-500" title={getTaskName(dep.taskId)}>
              {dep.taskId}
            </span>

            {/* Lag/Lead */}
            {dep.lag !== 0 && (
              <span className="text-xs text-gray-400">
                {dep.lag > 0 ? `+${dep.lag}` : dep.lag}
              </span>
            )}
          </div>
        ))}
        
        {/* Indicador de mais dependências */}
        {dependencies.length > 3 && (
          <span className="text-xs text-gray-400">
            +{dependencies.length - 3}
          </span>
        )}
      </div>

      {/* Botão para editar */}
      <button
        onClick={() => onEditDependencies(task)}
        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
        title="Editar dependências"
      >
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};

/**
 * Componente para exibir dependências em formato de tooltip/popover
 */
export const DependencyTooltip = ({ dependencies, allTasks, isVisible, position }) => {
  if (!isVisible || !dependencies || dependencies.length === 0) return null;

  const getTaskName = (taskId) => {
    const foundTask = allTasks.find(t => t.id === taskId);
    return foundTask ? foundTask.name : `Tarefa ${taskId}`;
  };

  const getDependencyTypeLabel = (type) => {
    switch (type) {
      case DEPENDENCY_TYPES.FS: return 'Fim → Início';
      case DEPENDENCY_TYPES.SS: return 'Início → Início';
      case DEPENDENCY_TYPES.FF: return 'Fim → Fim';
      case DEPENDENCY_TYPES.SF: return 'Início → Fim';
      default: return type;
    }
  };

  return (
    <div 
      className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-64"
      style={{ 
        left: position?.x || 0, 
        top: position?.y || 0,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <h4 className="text-sm font-medium text-gray-900 mb-2">
        Dependências ({dependencies.length})
      </h4>
      <div className="space-y-2">
        {dependencies.map((dep, index) => (
          <div key={index} className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">
                {dep.taskId}
              </span>
              <span className="text-gray-500 truncate max-w-32">
                {getTaskName(dep.taskId)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">
                {getDependencyTypeLabel(dep.type)}
              </span>
              {dep.lag !== 0 && (
                <span className="text-gray-500">
                  {dep.lag > 0 ? `+${dep.lag}d` : `${dep.lag}d`}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Componente simplificado para exibição inline
 */
export const DependencyInline = ({ dependencies, allTasks, maxDisplay = 2 }) => {
  if (!dependencies || dependencies.length === 0) {
    return <span className="text-xs text-gray-400">Nenhuma</span>;
  }

  const getTaskName = (taskId) => {
    const foundTask = allTasks.find(t => t.id === taskId);
    return foundTask ? foundTask.name : `T${taskId}`;
  };

  return (
    <div className="flex items-center space-x-1 text-xs">
      {dependencies.slice(0, maxDisplay).map((dep, index) => (
        <span key={index} className="text-gray-600" title={getTaskName(dep.taskId)}>
          {dep.taskId}
          {dep.type !== DEPENDENCY_TYPES.FS && (
            <span className="text-gray-400">({dep.type})</span>
          )}
          {index < Math.min(dependencies.length, maxDisplay) - 1 && ', '}
        </span>
      ))}
      {dependencies.length > maxDisplay && (
        <span className="text-gray-400">+{dependencies.length - maxDisplay}</span>
      )}
    </div>
  );
};

export default DependencyDisplay;

