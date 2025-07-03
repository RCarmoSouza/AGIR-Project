import React, { useState } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  CalendarDaysIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const CalendarsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState(null);
  const [activeTab, setActiveTab] = useState('general'); // general, workdays, holidays
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dailyHours: 8,
    startTime: '08:00',
    endTime: '17:00',
    lunchStart: '12:00',
    lunchEnd: '13:00',
    workDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    holidays: []
  });

  // Mock data - em produção viria de uma API
  const [calendars, setCalendars] = useState([
    {
      id: 1,
      name: 'Padrão Porto Alegre',
      description: 'Calendário padrão para a base de Porto Alegre',
      dailyHours: 8,
      startTime: '08:00',
      endTime: '17:00',
      lunchStart: '12:00',
      lunchEnd: '13:00',
      workDays: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false },
      holidays: [
        { date: '2025-01-01', name: 'Confraternização Universal' },
        { date: '2025-04-21', name: 'Tiradentes' },
        { date: '2025-09-07', name: 'Independência do Brasil' }
      ],
      peopleCount: 12,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Padrão São Paulo',
      description: 'Calendário padrão para a base de São Paulo',
      dailyHours: 8,
      startTime: '09:00',
      endTime: '18:00',
      lunchStart: '12:00',
      lunchEnd: '13:00',
      workDays: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false },
      holidays: [
        { date: '2025-01-01', name: 'Confraternização Universal' },
        { date: '2025-01-25', name: 'Aniversário de São Paulo' },
        { date: '2025-04-21', name: 'Tiradentes' }
      ],
      peopleCount: 8,
      createdAt: '2024-02-20'
    },
    {
      id: 3,
      name: 'Calendário Flexível',
      description: 'Calendário com horário flexível para consultores',
      dailyHours: 6,
      startTime: '10:00',
      endTime: '17:00',
      lunchStart: '12:30',
      lunchEnd: '13:30',
      workDays: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false },
      holidays: [
        { date: '2025-01-01', name: 'Confraternização Universal' },
        { date: '2025-04-21', name: 'Tiradentes' }
      ],
      peopleCount: 3,
      createdAt: '2024-03-10'
    }
  ]);

  const filteredCalendars = calendars.filter(calendar =>
    calendar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calendar.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      dailyHours: 8,
      startTime: '08:00',
      endTime: '17:00',
      lunchStart: '12:00',
      lunchEnd: '13:00',
      workDays: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
      },
      holidays: []
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCalendar) {
      setCalendars(calendars.map(calendar => 
        calendar.id === editingCalendar.id 
          ? { ...calendar, ...formData }
          : calendar
      ));
    } else {
      const newCalendar = {
        id: Date.now(),
        ...formData,
        peopleCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCalendars([...calendars, newCalendar]);
    }
    
    setShowModal(false);
    setEditingCalendar(null);
    resetForm();
    setActiveTab('general');
  };

  const handleEdit = (calendar) => {
    setEditingCalendar(calendar);
    setFormData({
      name: calendar.name,
      description: calendar.description,
      dailyHours: calendar.dailyHours,
      startTime: calendar.startTime,
      endTime: calendar.endTime,
      lunchStart: calendar.lunchStart,
      lunchEnd: calendar.lunchEnd,
      workDays: calendar.workDays,
      holidays: calendar.holidays
    });
    setShowModal(true);
  };

  const handleCopy = (calendar) => {
    setEditingCalendar(null);
    setFormData({
      name: `${calendar.name} (Cópia)`,
      description: calendar.description,
      dailyHours: calendar.dailyHours,
      startTime: calendar.startTime,
      endTime: calendar.endTime,
      lunchStart: calendar.lunchStart,
      lunchEnd: calendar.lunchEnd,
      workDays: calendar.workDays,
      holidays: calendar.holidays
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este calendário?')) {
      setCalendars(calendars.filter(calendar => calendar.id !== id));
    }
  };

  const openModal = () => {
    setEditingCalendar(null);
    resetForm();
    setActiveTab('general');
    setShowModal(true);
  };

  const addHoliday = () => {
    setFormData({
      ...formData,
      holidays: [...formData.holidays, { date: '', name: '' }]
    });
  };

  const updateHoliday = (index, field, value) => {
    const newHolidays = [...formData.holidays];
    newHolidays[index][field] = value;
    setFormData({ ...formData, holidays: newHolidays });
  };

  const removeHoliday = (index) => {
    setFormData({
      ...formData,
      holidays: formData.holidays.filter((_, i) => i !== index)
    });
  };

  const workDayLabels = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendários de Disponibilidade</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gerencie calendários com horários, dias úteis e feriados
            </p>
          </div>
          <button
            onClick={openModal}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Novo Calendário
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Calendars List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Calendários Cadastrados ({filteredCalendars.length})
          </h3>
        </div>
        
        {filteredCalendars.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum calendário encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece criando um novo calendário.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome do Calendário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horário de Trabalho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dias Úteis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feriados
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pessoas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCalendars.map((calendar) => (
                  <tr key={calendar.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{calendar.name}</div>
                        {calendar.description && (
                          <div className="text-sm text-gray-500">{calendar.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {calendar.startTime} - {calendar.endTime}
                      </div>
                      <div className="text-sm text-gray-500">
                        {calendar.dailyHours}h/dia (Almoço: {calendar.lunchStart}-{calendar.lunchEnd})
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {Object.entries(calendar.workDays)
                          .filter(([_, isWork]) => isWork)
                          .map(([day, _]) => workDayLabels[day].substring(0, 3))
                          .join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {calendar.holidays.length} feriados
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {calendar.peopleCount} pessoas
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleCopy(calendar)}
                        className="text-green-600 hover:text-green-900 mr-3"
                        title="Copiar calendário"
                      >
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(calendar)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Editar calendário"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(calendar.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir calendário"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingCalendar ? 'Editar Calendário' : 'Novo Calendário'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'general'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Geral
                  </button>
                  <button
                    onClick={() => setActiveTab('workdays')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'workdays'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Dias Úteis
                  </button>
                  <button
                    onClick={() => setActiveTab('holidays')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'holidays'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Feriados
                  </button>
                </nav>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Tab: Geral */}
                {activeTab === 'general' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome do Calendário *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ex: Padrão Porto Alegre"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Horas Diárias *
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="24"
                          value={formData.dailyHours}
                          onChange={(e) => setFormData({...formData, dailyHours: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Descrição opcional do calendário"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Início *
                        </label>
                        <input
                          type="time"
                          required
                          value={formData.startTime}
                          onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fim *
                        </label>
                        <input
                          type="time"
                          required
                          value={formData.endTime}
                          onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Almoço Início
                        </label>
                        <input
                          type="time"
                          value={formData.lunchStart}
                          onChange={(e) => setFormData({...formData, lunchStart: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Almoço Fim
                        </label>
                        <input
                          type="time"
                          value={formData.lunchEnd}
                          onChange={(e) => setFormData({...formData, lunchEnd: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Dias Úteis */}
                {activeTab === 'workdays' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Selecione os dias da semana que são considerados úteis para este calendário:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(workDayLabels).map(([key, label]) => (
                        <label key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.workDays[key]}
                            onChange={(e) => setFormData({
                              ...formData,
                              workDays: {
                                ...formData.workDays,
                                [key]: e.target.checked
                              }
                            })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-900">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Feriados */}
                {activeTab === 'holidays' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Adicione os feriados que devem ser considerados neste calendário:
                      </p>
                      <button
                        type="button"
                        onClick={addHoliday}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        <PlusIcon className="w-4 h-4 mr-1" />
                        Adicionar Feriado
                      </button>
                    </div>

                    {formData.holidays.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CalendarDaysIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm">Nenhum feriado adicionado</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {formData.holidays.map((holiday, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md">
                            <input
                              type="date"
                              value={holiday.date}
                              onChange={(e) => updateHoliday(index, 'date', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                            <input
                              type="text"
                              value={holiday.name}
                              onChange={(e) => updateHoliday(index, 'name', e.target.value)}
                              placeholder="Nome do feriado"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => removeHoliday(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    {editingCalendar ? 'Salvar' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarsManagement;

