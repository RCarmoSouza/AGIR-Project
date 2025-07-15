/**
 * Motor de Cálculo de Datas para Cronograma (Gantt)
 * 
 * Este módulo implementa toda a lógica de cálculo automático de datas
 * para tarefas, incluindo dependências, calendários e validações.
 * 
 * Funcionalidades:
 * - Cálculo de datas de início e fim baseado em dependências
 * - Suporte a 4 tipos de dependência (FS, SS, FF, SF)
 * - Consideração de calendários de trabalho e feriados
 * - Validação de dependências circulares
 * - Algoritmos de agendamento automático
 */

// Tipos de dependência suportados
export const DEPENDENCY_TYPES = {
  FS: 'FS', // Finish to Start (Fim para Início)
  SS: 'SS', // Start to Start (Início para Início)
  FF: 'FF', // Finish to Finish (Fim para Fim)
  SF: 'SF'  // Start to Finish (Início para Fim)
};

// Modos de agendamento
export const SCHEDULING_MODES = {
  AUTOMATIC: 'automatic',
  MANUAL: 'manual'
};

/**
 * Classe para representar um calendário de trabalho
 */
export class WorkCalendar {
  constructor(options = {}) {
    this.id = options.id || 'default';
    this.name = options.name || 'Calendário Padrão';
    this.workdays = options.workdays || [1, 2, 3, 4, 5]; // Segunda a Sexta (1-7)
    this.hoursPerDay = options.hoursPerDay || 8;
    this.holidays = new Set(options.holidays || []); // Array de strings 'YYYY-MM-DD'
    this.startTime = options.startTime || '09:00';
    this.endTime = options.endTime || '18:00';
  }

  /**
   * Verifica se uma data é dia útil
   */
  isWorkday(date) {
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay() || 7; // Domingo = 7
    const dateString = dateObj.toISOString().split('T')[0];
    
    return this.workdays.includes(dayOfWeek) && !this.holidays.has(dateString);
  }

  /**
   * Adiciona dias úteis a uma data
   */
  addWorkdays(startDate, days) {
    if (days === 0) return new Date(startDate);
    
    let currentDate = new Date(startDate);
    let daysAdded = 0;
    const increment = days > 0 ? 1 : -1;
    const targetDays = Math.abs(days);

    while (daysAdded < targetDays) {
      currentDate.setDate(currentDate.getDate() + increment);
      if (this.isWorkday(currentDate)) {
        daysAdded++;
      }
    }

    return currentDate;
  }

  /**
   * Calcula dias úteis entre duas datas
   */
  calculateWorkdaysBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) return 0;

    let workdays = 0;
    let currentDate = new Date(start);

    while (currentDate < end) {
      if (this.isWorkday(currentDate)) {
        workdays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return workdays;
  }

  /**
   * Converte horas de trabalho em dias úteis
   */
  convertHoursToDays(hours) {
    return Math.ceil(hours / this.hoursPerDay);
  }

  /**
   * Converte dias úteis em horas de trabalho
   */
  convertDaysToHours(days) {
    return days * this.hoursPerDay;
  }
}

/**
 * Classe para validação de dependências
 */
export class DependencyValidator {
  /**
   * Detecta dependências circulares usando DFS
   */
  static detectCircularDependencies(tasks) {
    const visited = new Set();
    const recursionStack = new Set();
    const cycles = [];

    const dfs = (taskId, path = []) => {
      if (recursionStack.has(taskId)) {
        // Encontrou ciclo
        const cycleStart = path.indexOf(taskId);
        cycles.push([...path.slice(cycleStart), taskId]);
        return true;
      }

      if (visited.has(taskId)) {
        return false;
      }

      visited.add(taskId);
      recursionStack.add(taskId);
      path.push(taskId);

      const task = tasks.find(t => t.id === taskId);
      if (task && task.predecessors) {
        for (const pred of task.predecessors) {
          if (dfs(pred.taskId, [...path])) {
            return true;
          }
        }
      }

      recursionStack.delete(taskId);
      path.pop();
      return false;
    };

    // Verifica todos os nós
    for (const task of tasks) {
      if (!visited.has(task.id)) {
        dfs(task.id);
      }
    }

    return cycles;
  }

  /**
   * Valida uma nova dependência antes de adicionar
   */
  static validateNewDependency(tasks, fromTaskId, toTaskId) {
    // Não pode depender de si mesmo
    if (fromTaskId === toTaskId) {
      return { valid: false, error: 'Uma tarefa não pode depender de si mesma' };
    }

    // Simula a adição da dependência
    const testTasks = tasks.map(task => {
      if (task.id === toTaskId) {
        const predecessors = task.predecessors || [];
        return {
          ...task,
          predecessors: [...predecessors, { taskId: fromTaskId, type: 'FS', lag: 0 }]
        };
      }
      return task;
    });

    // Verifica se cria ciclo
    const cycles = this.detectCircularDependencies(testTasks);
    if (cycles.length > 0) {
      return { 
        valid: false, 
        error: 'Esta dependência criaria um ciclo circular',
        cycles 
      };
    }

    return { valid: true };
  }
}

/**
 * Classe principal do motor de cálculo
 */
export class DateCalculationEngine {
  constructor(calendars = {}) {
    this.calendars = calendars;
    this.defaultCalendar = new WorkCalendar();
  }

  /**
   * Obtém o calendário para uma tarefa
   */
  getTaskCalendar(task) {
    if (task.calendarId && this.calendars[task.calendarId]) {
      return this.calendars[task.calendarId];
    }
    return this.defaultCalendar;
  }

  /**
   * Calcula a data de início de uma tarefa baseada em predecessoras
   */
  calculateTaskStartDate(task, allTasks, projectStartDate) {
    const calendar = this.getTaskCalendar(task);

    // Se não tem predecessoras, usa data do projeto
    if (!task.predecessors || task.predecessors.length === 0) {
      return new Date(projectStartDate);
    }

    let latestDate = new Date(projectStartDate);

    // Processa cada predecessora
    for (const predecessor of task.predecessors) {
      const predTask = allTasks.find(t => t.id === predecessor.taskId);
      if (!predTask) continue;

      // Garante que a predecessora tem datas calculadas
      if (!predTask.startDate || !predTask.endDate) {
        this.calculateTaskDates(predTask, allTasks, projectStartDate);
      }

      let dependencyDate;
      
      // Calcula data baseada no tipo de dependência
      switch (predecessor.type) {
        case DEPENDENCY_TYPES.FS: // Finish to Start
          dependencyDate = new Date(predTask.endDate);
          // Para FS, adiciona 1 dia após o fim da predecessora
          dependencyDate = calendar.addWorkdays(dependencyDate, 1);
          break;
        case DEPENDENCY_TYPES.SS: // Start to Start
          dependencyDate = new Date(predTask.startDate);
          break;
        case DEPENDENCY_TYPES.FF: // Finish to Finish
          dependencyDate = new Date(predTask.endDate);
          break;
        case DEPENDENCY_TYPES.SF: // Start to Finish
          dependencyDate = new Date(predTask.startDate);
          break;
        default:
          dependencyDate = new Date(predTask.endDate);
          dependencyDate = calendar.addWorkdays(dependencyDate, 1);
      }

      // Aplica lag/lead
      if (predecessor.lag) {
        dependencyDate = calendar.addWorkdays(dependencyDate, predecessor.lag);
      }

      // Mantém a data mais tardia
      if (dependencyDate > latestDate) {
        latestDate = dependencyDate;
      }
    }

    // Garante que é um dia útil
    if (!calendar.isWorkday(latestDate)) {
      latestDate = calendar.addWorkdays(latestDate, 1);
    }

    return latestDate;
  }

  /**
   * Calcula a data de fim baseada na duração ou trabalho
   */
  calculateTaskEndDate(task, startDate) {
    const calendar = this.getTaskCalendar(task);
    let duration = task.duration;

    // Se tem trabalho em horas, converte para dias
    if (task.work && !duration) {
      duration = calendar.convertHoursToDays(task.work);
    }

    // Se não tem duração, assume 1 dia
    if (!duration || duration <= 0) {
      duration = 1;
    }

    return calendar.addWorkdays(startDate, duration);
  }

  /**
   * Calcula a duração baseada nas datas de início e fim
   */
  calculateTaskDuration(task, startDate, endDate) {
    const calendar = this.getTaskCalendar(task);
    return calendar.calculateWorkdaysBetween(startDate, endDate);
  }

  /**
   * Calcula todas as datas de uma tarefa
   */
  calculateTaskDates(task, allTasks, projectStartDate) {
    // Se está em modo manual, não recalcula
    if (task.schedulingMode === SCHEDULING_MODES.MANUAL) {
      return task;
    }

    const calendar = this.getTaskCalendar(task);

    // Calcula data de início
    const startDate = this.calculateTaskStartDate(task, allTasks, projectStartDate);
    
    // Calcula data de fim
    const endDate = this.calculateTaskEndDate(task, startDate);
    
    // Calcula duração
    const duration = this.calculateTaskDuration(task, startDate, endDate);

    // Atualiza a tarefa
    task.startDate = startDate;
    task.endDate = endDate;
    task.duration = duration;

    // Se tem trabalho definido, mantém; senão calcula
    if (!task.work) {
      task.work = calendar.convertDaysToHours(duration);
    }

    return task;
  }

  /**
   * Agenda todo o projeto automaticamente
   */
  scheduleProject(tasks, projectStartDate) {
    // Ordena tarefas topologicamente (predecessoras primeiro)
    const sortedTasks = this.topologicalSort(tasks);
    
    // Calcula datas para cada tarefa na ordem correta
    for (const task of sortedTasks) {
      if (task.schedulingMode === SCHEDULING_MODES.AUTOMATIC) {
        this.calculateTaskDates(task, tasks, projectStartDate);
      }
    }

    return tasks;
  }

  /**
   * Ordenação topológica das tarefas
   */
  topologicalSort(tasks) {
    const visited = new Set();
    const result = [];

    const visit = (taskId) => {
      if (visited.has(taskId)) return;
      
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      visited.add(taskId);

      // Visita predecessoras primeiro
      if (task.predecessors) {
        for (const pred of task.predecessors) {
          visit(pred.taskId);
        }
      }

      result.push(task);
    };

    // Visita todas as tarefas
    for (const task of tasks) {
      visit(task.id);
    }

    return result;
  }

  /**
   * Valida e recalcula projeto completo
   */
  validateAndScheduleProject(tasks, projectStartDate) {
    // Valida dependências circulares
    const cycles = DependencyValidator.detectCircularDependencies(tasks);
    if (cycles.length > 0) {
      throw new Error(`Dependências circulares detectadas: ${cycles.map(c => c.join(' → ')).join(', ')}`);
    }

    // Agenda o projeto
    return this.scheduleProject(tasks, projectStartDate);
  }
}

/**
 * Utilitários para formatação e conversão
 */
export class DateUtils {
  /**
   * Formata data para exibição
   */
  static formatDate(date, locale = 'pt-BR') {
    if (!date) return '';
    return new Date(date).toLocaleDateString(locale);
  }

  /**
   * Formata duração em dias
   */
  static formatDuration(days) {
    if (!days) return '0 dias';
    return `${days} ${days === 1 ? 'dia' : 'dias'}`;
  }

  /**
   * Converte string de data para objeto Date
   */
  static parseDate(dateString) {
    if (!dateString) return null;
    return new Date(dateString);
  }

  /**
   * Verifica se duas datas são iguais (apenas data, sem hora)
   */
  static isSameDate(date1, date2) {
    if (!date1 || !date2) return false;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.toDateString() === d2.toDateString();
  }
}

/**
 * Instância padrão do motor de cálculo
 */
export const defaultCalculationEngine = new DateCalculationEngine();

/**
 * Calendários padrão do sistema
 */
export const DEFAULT_CALENDARS = {
  default: new WorkCalendar({
    id: 'default',
    name: 'Calendário Padrão',
    workdays: [1, 2, 3, 4, 5], // Segunda a Sexta
    hoursPerDay: 8,
    holidays: [
      '2025-01-01', // Ano Novo
      '2025-04-21', // Tiradentes
      '2025-05-01', // Dia do Trabalho
      '2025-09-07', // Independência
      '2025-10-12', // Nossa Senhora Aparecida
      '2025-11-02', // Finados
      '2025-11-15', // Proclamação da República
      '2025-12-25'  // Natal
    ]
  }),
  
  intensive: new WorkCalendar({
    id: 'intensive',
    name: 'Calendário Intensivo',
    workdays: [1, 2, 3, 4, 5, 6], // Segunda a Sábado
    hoursPerDay: 10,
    holidays: [
      '2025-01-01',
      '2025-12-25'
    ]
  }),

  partTime: new WorkCalendar({
    id: 'partTime',
    name: 'Meio Período',
    workdays: [1, 2, 3, 4, 5],
    hoursPerDay: 4,
    holidays: [
      '2025-01-01',
      '2025-04-21',
      '2025-05-01',
      '2025-09-07',
      '2025-10-12',
      '2025-11-02',
      '2025-11-15',
      '2025-12-25'
    ]
  })
};

