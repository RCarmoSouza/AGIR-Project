import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, AlertTriangle, Link, ArrowRight } from 'lucide-react';
import { DEPENDENCY_TYPES, DependencyValidator } from '../../utils/dateCalculationEngine';

/**
 * Modal para gerenciamento de dependências entre tarefas
 * 
 * Permite adicionar, editar e remover dependências, incluindo:
 * - Seleção de tarefa predecessora
 * - Tipo de dependência (FS, SS, FF, SF)
 * - Configuração de lag/lead
 * - Validação de dependências circulares
 */
const DependencyModal = ({ 
  isOpen, 
  onClose, 
  task, 
  allTasks, 
  onSave 
}) => {
  const [dependencies, setDependencies] = useState([]);
  const [newDependency, setNewDependency] = useState({
    taskId: '',
    type: DEPENDENCY_TYPES.FS,
    lag: 0
  });
  const [validationErrors, setValidationErrors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Inicializa dependências quando o modal abre
  useEffect(() => {
    if (isOpen && task) {
      setDependencies(task.predecessors || []);
      setValidationErrors([]);
      setNewDependency({
        taskId: '',
        type: DEPENDENCY_TYPES.FS,
        lag: 0
      });
      setSearchTerm('');
    }
  }, [isOpen, task]);

  // Filtra tarefas disponíveis para dependência
  const availableTasks = allTasks.filter(t => {
    if (!t || t.id === task?.id) return false;
    if (dependencies.some(dep => dep.taskId === t.id)) return false;
    if (searchTerm && !t.title?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Tipos de dependência com descrições
  const dependencyTypeOptions = [
    { value: DEPENDENCY_TYPES.FS, label: 'FS - Fim para Início', description: 'A tarefa só pode começar após o fim da predecessora' },
    { value: DEPENDENCY_TYPES.SS, label: 'SS - Início para Início', description: 'A tarefa só pode começar após o início da predecessora' },
    { value: DEPENDENCY_TYPES.FF, label: 'FF - Fim para Fim', description: 'A tarefa só pode terminar após o fim da predecessora' },
    { value: DEPENDENCY_TYPES.SF, label: 'SF - Início para Fim', description: 'A tarefa só pode terminar após o início da predecessora' }
  ];

  // Adiciona nova dependência
  const handleAddDependency = () => {
    console.log('Tentando adicionar dependência:', newDependency);
    
    if (!newDependency.taskId) {
      console.log('Nenhuma tarefa selecionada');
      return;
    }

    // Valida se não cria dependência circular
    const validation = DependencyValidator.validateNewDependency(
      allTasks, 
      newDependency.taskId, 
      task.id
    );

    if (!validation.valid) {
      setValidationErrors([validation.error]);
      return;
    }

    const updatedDependencies = [...dependencies, { ...newDependency }];
    console.log('Dependências atualizadas:', updatedDependencies);
    setDependencies(updatedDependencies);
    setNewDependency({
      taskId: '',
      type: DEPENDENCY_TYPES.FS,
      lag: 0
    });
    setValidationErrors([]);
    setSearchTerm('');
  };

  // Remove dependência
  const handleRemoveDependency = (index) => {
    const updatedDependencies = dependencies.filter((_, i) => i !== index);
    setDependencies(updatedDependencies);
    setValidationErrors([]);
  };

  // Atualiza dependência existente
  const handleUpdateDependency = (index, field, value) => {
    const updatedDependencies = [...dependencies];
    updatedDependencies[index] = {
      ...updatedDependencies[index],
      [field]: value
    };
    setDependencies(updatedDependencies);
  };

  // Salva alterações
  const handleSave = () => {
    // Validação final
    const testTask = { ...task, predecessors: dependencies };
    const testTasks = allTasks.map(t => t.id === task.id ? testTask : t);
    
    try {
      const cycles = DependencyValidator.detectCircularDependencies(testTasks);
      if (cycles.length > 0) {
        setValidationErrors([`Dependências circulares detectadas: ${cycles.map(c => c.join(' → ')).join(', ')}`]);
        return;
      }

      onSave(dependencies);
      onClose();
    } catch (error) {
      setValidationErrors([error.message]);
    }
  };

  // Obtém nome da tarefa por ID
  const getTaskName = (taskId) => {
    const foundTask = allTasks.find(t => t.id === taskId);
    return foundTask ? foundTask.title : `Tarefa ${taskId}`;
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Link className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Gerenciar Dependências
              </h2>
              <p className="text-sm text-gray-600">
                {task?.title} (ID: {task?.id})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Erros de validação */}
          {validationErrors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-sm font-medium text-red-800">Erro de Validação</h3>
              </div>
              {validationErrors.map((error, index) => (
                <p key={index} className="text-sm text-red-700">{error}</p>
              ))}
            </div>
          )}

          {/* Adicionar nova dependência */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Adicionar Nova Dependência
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Seleção de tarefa predecessora */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarefa Predecessora
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Pesquisar tarefa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={newDependency.taskId}
                    onChange={(e) => setNewDependency({ ...newDependency, taskId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione uma tarefa...</option>
                    {availableTasks.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.id} - {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tipo de dependência */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  value={newDependency.type}
                  onChange={(e) => setNewDependency({ ...newDependency, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {dependencyTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lag/Lead */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lag/Lead (dias)
                </label>
                <input
                  type="number"
                  min="-30"
                  max="30"
                  value={newDependency.lag}
                  onChange={(e) => setNewDependency({ ...newDependency, lag: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Positivo = atraso, Negativo = adiantamento
                </p>
              </div>
            </div>

            {/* Descrição do tipo selecionado */}
            {newDependency.type && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  {dependencyTypeOptions.find(opt => opt.value === newDependency.type)?.description}
                </p>
              </div>
            )}

            <button
              onClick={handleAddDependency}
              disabled={!newDependency.taskId}
              className="mt-4 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Dependência</span>
            </button>
          </div>

          {/* Lista de dependências existentes */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Dependências Atuais ({dependencies.length})
            </h3>

            {dependencies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Link className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhuma dependência configurada</p>
                <p className="text-sm">Esta tarefa não depende de outras tarefas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dependencies.map((dep, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg">
                    {/* Ícone do tipo */}
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-mono text-sm">
                        {getDependencyIcon(dep.type)}
                      </span>
                    </div>

                    {/* Informações da dependência */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {getTaskName(dep.taskId)}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{task?.name}</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">
                          Tipo: {dep.type}
                        </span>
                        {dep.lag !== 0 && (
                          <span className="text-sm text-gray-500">
                            {dep.lag > 0 ? `+${dep.lag}` : dep.lag} dias
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Controles de edição */}
                    <div className="flex items-center space-x-2">
                      {/* Tipo de dependência */}
                      <select
                        value={dep.type}
                        onChange={(e) => handleUpdateDependency(index, 'type', e.target.value)}
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {dependencyTypeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.value}
                          </option>
                        ))}
                      </select>

                      {/* Lag/Lead */}
                      <input
                        type="number"
                        min="-30"
                        max="30"
                        value={dep.lag}
                        onChange={(e) => handleUpdateDependency(index, 'lag', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />

                      {/* Botão remover */}
                      <button
                        onClick={() => handleRemoveDependency(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Remover dependência"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {dependencies.length} dependência(s) configurada(s)
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Salvar Dependências
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DependencyModal;

