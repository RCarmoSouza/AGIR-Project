'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/appStore';
import { TimesheetEntry, Project, Task, User } from '@/types';
import { 
  ChevronDownIcon, 
  ChevronUpIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function TimesheetPage() {
  const { 
    projects, 
    users, 
    currentUser,
    timesheetEntries,
    addTimesheetEntry,
    updateTimesheetEntry,
    deleteTimesheetEntry,
    getTimesheetSummary
  } = useAppStore();

  const [showFilters, setShowFilters] = useState(false);
  const [showProjectSummary, setShowProjectSummary] = useState(false);
  const [showHoursSummary, setShowHoursSummary] = useState(false);
  
  // Filtros
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Novo apontamento
  const [newEntry, setNewEntry] = useState({
    projectId: '',
    taskId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    description: ''
  });

  // Edição inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<Partial<TimesheetEntry>>({});

  // Filtrar entradas
  const filteredEntries = timesheetEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const monthMatch = entryDate.getMonth() === selectedMonth;
    const yearMatch = entryDate.getFullYear() === selectedYear;
    const projectMatch = selectedProjects.length === 0 || selectedProjects.includes(entry.projectId);
    const statusMatch = selectedStatus === 'all' || entry.status === selectedStatus;
    
    return monthMatch && yearMatch && projectMatch && statusMatch;
  });

  // Calcular horas totais
  const calculateHours = (startTime: string, endTime: string): number => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return (endMinutes - startMinutes) / 60;
  };

  // Sugerir hora de início baseada no último registro
  const getSuggestedStartTime = (): string => {
    if (!currentUser) return '09:00';
    
    const userEntries = timesheetEntries
      .filter(entry => entry.userId === currentUser.id && 
               format(new Date(entry.date), 'yyyy-MM-dd') === newEntry.date)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return userEntries.length > 0 ? userEntries[0].endTime : '09:00';
  };

  // Adicionar novo apontamento
  const handleAddEntry = () => {
    if (!currentUser || !newEntry.projectId || !newEntry.description.trim()) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const project = projects.find(p => p.id === newEntry.projectId);
    const task = newEntry.taskId ? 
      project?.sprints.flatMap(s => s.tasks).find(t => t.id === newEntry.taskId) : 
      undefined;

    const totalHours = calculateHours(newEntry.startTime, newEntry.endTime);

    const entry: TimesheetEntry = {
      id: `timesheet-${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      projectId: newEntry.projectId,
      project: project!,
      taskId: newEntry.taskId || undefined,
      task,
      date: new Date(newEntry.date),
      startTime: newEntry.startTime,
      endTime: newEntry.endTime,
      totalHours,
      description: newEntry.description,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    addTimesheetEntry(entry);

    // Reset form
    setNewEntry({
      projectId: '',
      taskId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: getSuggestedStartTime(),
      endTime: '10:00',
      description: ''
    });
  };

  // Duplicar apontamento
  const handleDuplicate = (entry: TimesheetEntry) => {
    const duplicated: TimesheetEntry = {
      ...entry,
      id: `timesheet-${Date.now()}`,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    addTimesheetEntry(duplicated);
  };

  // Editar apontamento
  const handleEdit = (entry: TimesheetEntry) => {
    setEditingId(entry.id);
    setEditingEntry(entry);
  };

  const handleSaveEdit = () => {
    if (editingId && editingEntry) {
      const totalHours = calculateHours(editingEntry.startTime!, editingEntry.endTime!);
      
      updateTimesheetEntry(editingId, {
        ...editingEntry,
        totalHours,
        updatedAt: new Date()
      });
      
      setEditingId(null);
      setEditingEntry({});
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingEntry({});
  };

  // Obter tarefas do projeto selecionado
  const getProjectTasks = (projectId: string): Task[] => {
    const project = projects.find(p => p.id === projectId);
    return project?.sprints.flatMap(s => s.tasks) || [];
  };

  const summary = getTimesheetSummary(filteredEntries);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timesheet</h1>
          <p className="text-gray-600">Controle de horas trabalhadas</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ClockIcon className="h-4 w-4" />
          <span>{summary.totalHours.toFixed(2)}h este mês</span>
          <CurrencyDollarIcon className="h-4 w-4 ml-4" />
          <span>R$ {summary.totalCost.toFixed(2)}</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
        >
          <span className="font-medium text-gray-900">Filtros</span>
          {showFilters ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        {showFilters && (
          <div className="px-4 pb-4 border-t bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mês
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {format(new Date(2024, i, 1), 'MMMM', { locale: ptBR })}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ano
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {[2023, 2024, 2025].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">Todos</option>
                  <option value="draft">Rascunho</option>
                  <option value="submitted">Enviado</option>
                  <option value="approved_pm">Aprovado PM</option>
                  <option value="approved_leader">Aprovado Líder</option>
                  <option value="rejected">Rejeitado</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resumo por Projeto */}
      <div className="bg-white rounded-lg border">
        <button
          onClick={() => setShowProjectSummary(!showProjectSummary)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
        >
          <span className="font-medium text-gray-900">Resumo por Projeto</span>
          {showProjectSummary ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        {showProjectSummary && (
          <div className="px-4 pb-4 border-t">
            <div className="mt-4 space-y-2">
              {summary.entriesByProject.map(project => (
                <div key={project.projectId} className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">{project.projectName}</span>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{project.hours.toFixed(2)}h</div>
                    <div className="text-xs text-gray-500">R$ {project.cost.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Resumo de Horas e Custos */}
      <div className="bg-white rounded-lg border">
        <button
          onClick={() => setShowHoursSummary(!showHoursSummary)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
        >
          <span className="font-medium text-gray-900">Resumo de Horas e Custos</span>
          {showHoursSummary ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        {showHoursSummary && (
          <div className="px-4 pb-4 border-t">
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{summary.totalHours.toFixed(2)}h</div>
                <div className="text-sm text-blue-600">Total de Horas</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">R$ {summary.totalCost.toFixed(2)}</div>
                <div className="text-sm text-green-600">Custo Total</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{filteredEntries.length}</div>
                <div className="text-sm text-purple-600">Apontamentos</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Apontamentos - Formato Planilhão */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50">
          <h3 className="font-medium text-gray-900">Apontamentos</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projeto
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarefa
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Início
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fim
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horas
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Linha para novo apontamento */}
              <tr className="bg-blue-50">
                <td className="px-4 py-3">
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    className="w-full text-sm border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={newEntry.projectId}
                    onChange={(e) => setNewEntry({ ...newEntry, projectId: e.target.value, taskId: '' })}
                    className="w-full text-sm border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Selecione...</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={newEntry.taskId}
                    onChange={(e) => setNewEntry({ ...newEntry, taskId: e.target.value })}
                    className="w-full text-sm border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                    disabled={!newEntry.projectId}
                  >
                    <option value="">Opcional...</option>
                    {getProjectTasks(newEntry.projectId).map(task => (
                      <option key={task.id} value={task.id}>{task.title}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="time"
                    value={newEntry.startTime}
                    onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })}
                    className="w-full text-sm border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="time"
                    value={newEntry.endTime}
                    onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })}
                    className="w-full text-sm border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {calculateHours(newEntry.startTime, newEntry.endTime).toFixed(2)}h
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={newEntry.description}
                    onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                    placeholder="Descrição da atividade..."
                    className="w-full text-sm border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  Rascunho
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={handleAddEntry}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusIcon className="h-3 w-3 mr-1" />
                    Adicionar
                  </button>
                </td>
              </tr>

              {/* Apontamentos existentes */}
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  {editingId === entry.id ? (
                    // Modo de edição
                    <>
                      <td className="px-4 py-3">
                        <input
                          type="date"
                          value={format(new Date(editingEntry.date!), 'yyyy-MM-dd')}
                          onChange={(e) => setEditingEntry({ ...editingEntry, date: new Date(e.target.value) })}
                          className="w-full text-sm border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={editingEntry.projectId}
                          onChange={(e) => setEditingEntry({ ...editingEntry, projectId: e.target.value })}
                          className="w-full text-sm border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                        >
                          {projects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={editingEntry.taskId || ''}
                          onChange={(e) => setEditingEntry({ ...editingEntry, taskId: e.target.value || undefined })}
                          className="w-full text-sm border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">Opcional...</option>
                          {getProjectTasks(editingEntry.projectId!).map(task => (
                            <option key={task.id} value={task.id}>{task.title}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="time"
                          value={editingEntry.startTime}
                          onChange={(e) => setEditingEntry({ ...editingEntry, startTime: e.target.value })}
                          className="w-full text-sm border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="time"
                          value={editingEntry.endTime}
                          onChange={(e) => setEditingEntry({ ...editingEntry, endTime: e.target.value })}
                          className="w-full text-sm border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {calculateHours(editingEntry.startTime!, editingEntry.endTime!).toFixed(2)}h
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editingEntry.description}
                          onChange={(e) => setEditingEntry({ ...editingEntry, description: e.target.value })}
                          className="w-full text-sm border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {entry.status === 'draft' ? 'Rascunho' : 
                           entry.status === 'submitted' ? 'Enviado' :
                           entry.status === 'approved_pm' ? 'Aprovado PM' :
                           entry.status === 'approved_leader' ? 'Aprovado' : 'Rejeitado'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-1">
                          <button
                            onClick={handleSaveEdit}
                            className="text-green-600 hover:text-green-900 text-xs"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-900 text-xs"
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // Modo de visualização
                    <>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {format(new Date(entry.date), 'dd/MM/yyyy')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {entry.project.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {entry.task?.title || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {entry.startTime}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {entry.endTime}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {entry.totalHours.toFixed(2)}h
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {entry.description}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          entry.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                          entry.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                          entry.status === 'approved_pm' ? 'bg-yellow-100 text-yellow-800' :
                          entry.status === 'approved_leader' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {entry.status === 'draft' ? 'Rascunho' : 
                           entry.status === 'submitted' ? 'Enviado' :
                           entry.status === 'approved_pm' ? 'Aprovado PM' :
                           entry.status === 'approved_leader' ? 'Aprovado' : 'Rejeitado'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(entry)}
                            className="text-green-600 hover:text-green-900"
                            title="Duplicar"
                          >
                            <DocumentDuplicateIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteTimesheetEntry(entry.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

