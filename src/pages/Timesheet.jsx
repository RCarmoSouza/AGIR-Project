import React, { useState } from 'react';
import { 
  ChevronDownIcon, 
  ChevronUpIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import useAppStore from '../stores/appStore';

const Timesheet = () => {
  const { 
    timeEntries, 
    projects, 
    tasks, 
    currentUser,
    addTimeEntry, 
    updateTimeEntry, 
    deleteTimeEntry,
    getProjectById,
    getTasksByProject
  } = useAppStore();

  // Estados para seções expansíveis
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [projectSummaryExpanded, setProjectSummaryExpanded] = useState(false);
  const [hoursSummaryExpanded, setHoursSummaryExpanded] = useState(false);

  // Estados para novo registro
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    projectId: '',
    taskId: '',
    description: ''
  });

  // Estados para filtros
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    projectId: '',
    status: ''
  });

  // Calcular horas
  const calculateHours = (startTime, endTime) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return Math.max(0, (endMinutes - startMinutes) / 60);
  };

  // Adicionar novo registro
  const handleAddEntry = () => {
    if (!newEntry.description.trim()) {
      alert('Descrição é obrigatória');
      return;
    }

    const hours = calculateHours(newEntry.startTime, newEntry.endTime);
    const cost = hours * (currentUser.hourlyRate || 0);

    addTimeEntry({
      ...newEntry,
      date: new Date(newEntry.date),
      hours,
      cost,
      userId: currentUser.id,
      status: 'Draft'
    });

    // Reset form
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      startTime: newEntry.endTime, // Próximo início = fim anterior
      endTime: '10:00',
      projectId: newEntry.projectId, // Manter projeto
      taskId: '',
      description: ''
    });
  };

  // Duplicar registro
  const handleDuplicate = (entry) => {
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      startTime: entry.startTime,
      endTime: entry.endTime,
      projectId: entry.projectId,
      taskId: entry.taskId || '',
      description: entry.description
    });
  };

  // Filtrar entradas
  const filteredEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const matchMonth = !filters.month || entryDate.getMonth() + 1 === filters.month;
    const matchYear = !filters.year || entryDate.getFullYear() === filters.year;
    const matchProject = !filters.projectId || entry.projectId === filters.projectId;
    const matchStatus = !filters.status || entry.status === filters.status;
    
    return matchMonth && matchYear && matchProject && matchStatus;
  });

  // Resumos
  const projectSummary = projects.map(project => {
    const projectEntries = filteredEntries.filter(e => e.projectId === project.id);
    const totalHours = projectEntries.reduce((sum, e) => sum + e.hours, 0);
    const totalCost = projectEntries.reduce((sum, e) => sum + (e.cost || 0), 0);
    
    return {
      project,
      hours: totalHours,
      cost: totalCost,
      entries: projectEntries.length
    };
  }).filter(summary => summary.entries > 0);

  const totalHours = filteredEntries.reduce((sum, e) => sum + e.hours, 0);
  const totalCost = filteredEntries.reduce((sum, e) => sum + (e.cost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Timesheet</h1>
        <p className="text-gray-600">Controle de horas trabalhadas</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between text-left"
        >
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="font-medium text-gray-900">Filtros</span>
          </div>
          {filtersExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        {filtersExpanded && (
          <div className="px-6 pb-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
                <select
                  value={filters.month}
                  onChange={(e) => setFilters({...filters, month: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {Array.from({length: 12}, (_, i) => (
                    <option key={i+1} value={i+1}>
                      {new Date(2024, i).toLocaleDateString('pt-BR', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                <select
                  value={filters.year}
                  onChange={(e) => setFilters({...filters, year: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value={2024}>2024</option>
                  <option value={2023}>2023</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Projeto</label>
                <select
                  value={filters.projectId}
                  onChange={(e) => setFilters({...filters, projectId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Todos os projetos</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Todos os status</option>
                  <option value="Draft">Rascunho</option>
                  <option value="Submitted">Enviado</option>
                  <option value="Approved">Aprovado</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resumo por Projeto */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={() => setProjectSummaryExpanded(!projectSummaryExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between text-left"
        >
          <span className="font-medium text-gray-900">Resumo por Projeto</span>
          {projectSummaryExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        {projectSummaryExpanded && (
          <div className="px-6 pb-4 border-t border-gray-200">
            <div className="mt-4 space-y-2">
              {projectSummary.map(summary => (
                <div key={summary.project.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: summary.project.color }}
                    />
                    <span className="text-sm font-medium">{summary.project.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {summary.hours.toFixed(2)}h • R$ {summary.cost.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Resumo de Horas e Custos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={() => setHoursSummaryExpanded(!hoursSummaryExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between text-left"
        >
          <span className="font-medium text-gray-900">Resumo de Horas e Custos</span>
          {hoursSummaryExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        {hoursSummaryExpanded && (
          <div className="px-6 pb-4 border-t border-gray-200">
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(2)}h</p>
                <p className="text-sm text-gray-600">Total de Horas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">R$ {totalCost.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Custo Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{filteredEntries.length}</p>
                <p className="text-sm text-gray-600">Registros</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">R$ {(currentUser.hourlyRate || 0)}</p>
                <p className="text-sm text-gray-600">Taxa/Hora</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Apontamentos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">Apontamentos</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Início</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fim</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projeto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Custo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Linha para novo registro */}
              <tr className="bg-blue-50">
                <td className="px-6 py-4">
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="time"
                    value={newEntry.startTime}
                    onChange={(e) => setNewEntry({...newEntry, startTime: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="time"
                    value={newEntry.endTime}
                    onChange={(e) => setNewEntry({...newEntry, endTime: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium">
                    {calculateHours(newEntry.startTime, newEntry.endTime).toFixed(2)}h
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={newEntry.projectId}
                    onChange={(e) => setNewEntry({...newEntry, projectId: e.target.value, taskId: ''})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="">Selecionar projeto</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    placeholder="Descrição da atividade *"
                    value={newEntry.description}
                    onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">Rascunho</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium">
                    R$ {(calculateHours(newEntry.startTime, newEntry.endTime) * (currentUser.hourlyRate || 0)).toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={handleAddEntry}
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title="Adicionar"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>

              {/* Registros existentes */}
              {filteredEntries.map((entry) => {
                const project = getProjectById(entry.projectId);
                return (
                  <tr key={entry.id}>
                    <td className="px-6 py-4 text-sm">
                      {new Date(entry.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm">{entry.startTime}</td>
                    <td className="px-6 py-4 text-sm">{entry.endTime}</td>
                    <td className="px-6 py-4 text-sm font-medium">{entry.hours.toFixed(2)}h</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: project?.color }}
                        />
                        <span>{project?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{entry.description}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        entry.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        entry.status === 'Submitted' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {entry.status === 'Draft' ? 'Rascunho' :
                         entry.status === 'Submitted' ? 'Enviado' : 'Aprovado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      R$ {(entry.cost || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <button
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Editar"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(entry)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Duplicar"
                        >
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteTimeEntry(entry.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Excluir"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Timesheet;

