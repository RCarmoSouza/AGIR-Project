import React from 'react';
import { Zap, Edit3, Clock, Settings } from 'lucide-react';
import { SCHEDULING_MODES } from '../../utils/dateCalculationEngine';

/**
 * Componente para seleção do modo de agendamento de uma tarefa
 * 
 * Permite alternar entre:
 * - Automático: Datas calculadas automaticamente
 * - Manual: Usuário define datas manualmente
 */
const SchedulingModeSelector = ({ 
  value, 
  onChange, 
  disabled = false,
  size = 'normal' // 'small', 'normal', 'large'
}) => {
  const modes = [
    {
      value: SCHEDULING_MODES.AUTOMATIC,
      label: 'Automático',
      shortLabel: 'Auto',
      icon: Zap,
      color: 'blue',
      description: 'Datas calculadas automaticamente baseadas em dependências'
    },
    {
      value: SCHEDULING_MODES.MANUAL,
      label: 'Manual',
      shortLabel: 'Manual',
      icon: Edit3,
      color: 'gray',
      description: 'Usuário define datas manualmente'
    }
  ];

  const currentMode = modes.find(mode => mode.value === value) || modes[0];

  // Estilos baseados no tamanho
  const sizeClasses = {
    small: {
      container: 'text-xs',
      button: 'px-2 py-1',
      icon: 'w-3 h-3',
      text: 'hidden sm:inline'
    },
    normal: {
      container: 'text-sm',
      button: 'px-3 py-1.5',
      icon: 'w-4 h-4',
      text: 'inline'
    },
    large: {
      container: 'text-base',
      button: 'px-4 py-2',
      icon: 'w-5 h-5',
      text: 'inline'
    }
  };

  const classes = sizeClasses[size] || sizeClasses.normal;

  // Renderização como dropdown para espaços pequenos
  if (size === 'small') {
    return (
      <div className={`relative ${classes.container}`}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            ${classes.button}
            border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            appearance-none bg-white
            ${currentMode.color === 'blue' ? 'text-blue-700' : 'text-gray-700'}
          `}
          title={currentMode.description}
        >
          {modes.map(mode => (
            <option key={mode.value} value={mode.value}>
              {mode.shortLabel}
            </option>
          ))}
        </select>
        
        {/* Ícone indicador */}
        <div className="absolute left-1 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <currentMode.icon className={`${classes.icon} ${
            currentMode.color === 'blue' ? 'text-blue-600' : 'text-gray-500'
          }`} />
        </div>
      </div>
    );
  }

  // Renderização como toggle buttons para tamanhos normais e grandes
  return (
    <div className={`flex items-center ${classes.container}`}>
      <div className="flex bg-gray-100 rounded-lg p-1">
        {modes.map(mode => {
          const Icon = mode.icon;
          const isActive = value === mode.value;
          
          return (
            <button
              key={mode.value}
              onClick={() => onChange(mode.value)}
              disabled={disabled}
              className={`
                ${classes.button}
                flex items-center space-x-2 rounded-md transition-all duration-200
                ${isActive 
                  ? `bg-white shadow-sm ${
                      mode.color === 'blue' 
                        ? 'text-blue-700 border border-blue-200' 
                        : 'text-gray-700 border border-gray-200'
                    }`
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
              title={mode.description}
            >
              <Icon className={`${classes.icon} ${
                isActive && mode.color === 'blue' ? 'text-blue-600' : ''
              }`} />
              <span className={classes.text}>
                {size === 'large' ? mode.label : mode.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Componente de indicador visual simples (apenas leitura)
 */
export const SchedulingModeIndicator = ({ 
  value, 
  showLabel = true,
  size = 'small'
}) => {
  const mode = value === SCHEDULING_MODES.AUTOMATIC 
    ? { icon: Zap, label: 'Auto', color: 'blue' }
    : { icon: Edit3, label: 'Manual', color: 'gray' };

  const Icon = mode.icon;

  const sizeClasses = {
    small: 'w-3 h-3',
    normal: 'w-4 h-4',
    large: 'w-5 h-5'
  };

  const iconSize = sizeClasses[size] || sizeClasses.small;

  return (
    <div className="flex items-center space-x-1">
      <Icon className={`${iconSize} ${
        mode.color === 'blue' ? 'text-blue-600' : 'text-gray-500'
      }`} />
      {showLabel && (
        <span className={`text-xs ${
          mode.color === 'blue' ? 'text-blue-700' : 'text-gray-600'
        }`}>
          {mode.label}
        </span>
      )}
    </div>
  );
};

/**
 * Componente com informações detalhadas sobre o modo
 */
export const SchedulingModeInfo = ({ value }) => {
  const isAutomatic = value === SCHEDULING_MODES.AUTOMATIC;

  return (
    <div className={`p-3 rounded-lg border ${
      isAutomatic 
        ? 'bg-blue-50 border-blue-200' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center space-x-2 mb-2">
        {isAutomatic ? (
          <Zap className="w-4 h-4 text-blue-600" />
        ) : (
          <Edit3 className="w-4 h-4 text-gray-600" />
        )}
        <span className={`font-medium text-sm ${
          isAutomatic ? 'text-blue-800' : 'text-gray-800'
        }`}>
          Modo {isAutomatic ? 'Automático' : 'Manual'}
        </span>
      </div>
      
      <p className={`text-xs ${
        isAutomatic ? 'text-blue-700' : 'text-gray-600'
      }`}>
        {isAutomatic 
          ? 'As datas de início e fim são calculadas automaticamente com base nas dependências, duração e calendário de trabalho.'
          : 'Você define manualmente as datas de início e fim. O sistema não recalcula automaticamente essas datas.'
        }
      </p>

      {isAutomatic && (
        <div className="mt-2 flex items-center space-x-1 text-xs text-blue-600">
          <Clock className="w-3 h-3" />
          <span>Recalculado automaticamente quando dependências mudam</span>
        </div>
      )}
    </div>
  );
};

/**
 * Componente para configurações avançadas do modo de agendamento
 */
export const SchedulingModeSettings = ({ 
  task, 
  onUpdateTask,
  calendars = {}
}) => {
  const isAutomatic = task.schedulingMode === SCHEDULING_MODES.AUTOMATIC;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <Settings className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-medium text-gray-900">
          Configurações de Agendamento
        </h3>
      </div>

      {/* Modo de agendamento */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Modo de Agendamento
        </label>
        <SchedulingModeSelector
          value={task.schedulingMode || SCHEDULING_MODES.AUTOMATIC}
          onChange={(mode) => onUpdateTask({ ...task, schedulingMode: mode })}
          size="large"
        />
        <div className="mt-2">
          <SchedulingModeInfo value={task.schedulingMode || SCHEDULING_MODES.AUTOMATIC} />
        </div>
      </div>

      {/* Calendário (apenas para modo automático) */}
      {isAutomatic && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calendário de Trabalho
          </label>
          <select
            value={task.calendarId || 'default'}
            onChange={(e) => onUpdateTask({ ...task, calendarId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">Calendário Padrão do Projeto</option>
            {Object.values(calendars).map(calendar => (
              <option key={calendar.id} value={calendar.id}>
                {calendar.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Define os dias úteis e feriados para cálculo das datas
          </p>
        </div>
      )}
    </div>
  );
};

export default SchedulingModeSelector;

