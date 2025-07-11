/**
 * Utilitários para cálculo automático de datas no Cronograma (Gantt)
 * Implementa funcionalidades similares ao Microsoft Project
 */

/**
 * Classe para representar um calendário de trabalho
 */
export class WorkCalendar {
  constructor(config = {}) {
    this.workdays = config.workdays || [1, 2, 3, 4, 5]; // Segunda a Sexta (1-7)
    this.holidays = config.holidays || []; // Array de datas em formato YYYY-MM-DD
    this.hoursPerDay = config.hoursPerDay || 8;
    this.name = config.name || 'Calendário Padrão';
  }

  /**
   * Verifica se uma data é dia útil
   */
  isWorkday(date) {
    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); // Domingo = 7
    const dateStr = date.toISOString().split('T')[0];
    
    return this.workdays.includes(dayOfWeek) && !this.holidays.includes(dateStr);
  }

  /**
   * Adiciona dias úteis a uma data
   */
  addWorkdays(startDate, days) {
    let currentDate = new Date(startDate);
    let daysAdded = 0;
    
    while (daysAdded < days) {
      currentDate.setDate(currentDate.getDate() + 1);
      if (this.isWorkday(currentDate)) {
        daysAdded++;
      }
    }
    
    return currentDate;
  }

  /**
   * Calcula dias úteis entre duas datas
   */
  getWorkdaysBetween(startDate, endDate) {
    let currentDate = new Date(startDate);
    let workdays = 0;
    
    while (currentDate < endDate) {
      currentDate.setDate(currentDate.getDate() + 1);
      if (this.isWorkday(currentDate)) {
        workdays++;
      }
    }
    
    return workdays;
  }

  /**
   * Ajusta uma data para o próximo dia útil
   */
  getNextWorkday(date) {
    let nextDate = new Date(date);
    
    while (!this.isWorkday(nextDate)) {
      nextDate.setDate(nextDate.getDate() + 1);
    }
    
    return nextDate;
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
 * Tipos de dependências entre tarefas
 */
export const DEPENDENCY_TYPES = {
  FS: 'Finish-to-Start',    // Fim para Início
  SS: 'Start-to-Start',     // Início para Início
  FF: 'Finish-to-Finish',   // Fim para Fim
  SF: 'Start-to-Finish'     // Início para Fim
};

/**
 * Modos de agendamento de tarefas
 */
export const SCHEDULING_MODES = {
  AUTOMATIC: 'automatic',
  MANUAL: 'manual'
};

/**
 * Classe principal para cálculos de cronograma
 */
export class GanttCalculator {
  constructor(defaultCalendar = null) {
    this.defaultCalendar = defaultCalendar || new WorkCalendar();
    this.calendars = new Map();
    this.tasks = new Map();
  }

  /**
   * Registra um calendário
   */
  registerCalendar(id, calendar) {
    this.calendars.set(id, calendar);
  }

  /**
   * Obtém calendário por ID ou retorna o padrão
   */
  getCalendar(calendarId) {
    return this.calendars.get(calendarId) || this.defaultCalendar;
  }

  /**
   * Calcula a data de início de uma tarefa
   */
  calculateStartDate(task, projectStartDate, allTasks = []) {
    // Se modo manual, não recalcula
    if (task.schedulingMode === SCHEDULING_MODES.MANUAL) {
      return task.startDate || projectStartDate;
    }

    // Se não tem predecessoras, usa data do projeto
    if (!task.predecessors || task.predecessors.length === 0) {
      const calendar = this.getCalendar(task.calendarId);
      return calendar.getNextWorkday(projectStartDate);
    }

    // Calcula baseado nas predecessoras
    let latestDate = projectStartDate;
    
    for (const predecessor of task.predecessors) {
      const predTask = allTasks.find(t => t.id === predecessor.taskId);
      if (!predTask) continue;

      const predDate = this.calculateDependencyDate(
        predTask,
        predecessor.type,
        predecessor.lag || 0,
        task.calendarId
      );

      if (predDate > latestDate) {
        latestDate = predDate;
      }
    }

    const calendar = this.getCalendar(task.calendarId);
    return calendar.getNextWorkday(latestDate);
  }

  /**
   * Calcula data baseada em dependência
   */
  calculateDependencyDate(predecessorTask, dependencyType, lag, calendarId) {
    const calendar = this.getCalendar(calendarId);
    let baseDate;

    switch (dependencyType) {
      case 'FS': // Finish-to-Start
        baseDate = predecessorTask.endDate || predecessorTask.startDate;
        break;
      case 'SS': // Start-to-Start
        baseDate = predecessorTask.startDate;
        break;
      case 'FF': // Finish-to-Finish
        baseDate = predecessorTask.endDate || predecessorTask.startDate;
        break;
      case 'SF': // Start-to-Finish
        baseDate = predecessorTask.startDate;
        break;
      default:
        baseDate = predecessorTask.endDate || predecessorTask.startDate;
    }

    // Aplica lag (positivo = atraso, negativo = adiantamento)
    if (lag !== 0) {
      if (lag > 0) {
        baseDate = calendar.addWorkdays(baseDate, lag);
      } else {
        // Para lag negativo, subtrai dias úteis
        let tempDate = new Date(baseDate);
        let daysToSubtract = Math.abs(lag);
        let daysSubtracted = 0;
        
        while (daysSubtracted < daysToSubtract) {
          tempDate.setDate(tempDate.getDate() - 1);
          if (calendar.isWorkday(tempDate)) {
            daysSubtracted++;
          }
        }
        baseDate = tempDate;
      }
    }

    return baseDate;
  }

  /**
   * Calcula a data de fim de uma tarefa
   */
  calculateEndDate(task, startDate = null) {
    const actualStartDate = startDate || task.startDate;
    if (!actualStartDate) return null;

    const calendar = this.getCalendar(task.calendarId);
    
    // Se tem duração definida
    if (task.duration && task.duration > 0) {
      return calendar.addWorkdays(actualStartDate, task.duration);
    }
    
    // Se tem trabalho (horas) definido
    if (task.work && task.work > 0) {
      const durationInDays = calendar.convertHoursToDays(task.work);
      return calendar.addWorkdays(actualStartDate, durationInDays);
    }
    
    // Se tem data de fim manual
    if (task.endDate) {
      return task.endDate;
    }
    
    // Padrão: 1 dia de duração
    return calendar.addWorkdays(actualStartDate, 1);
  }

  /**
   * Calcula a duração de uma tarefa baseada nas datas
   */
  calculateDuration(task, startDate = null, endDate = null) {
    const actualStartDate = startDate || task.startDate;
    const actualEndDate = endDate || task.endDate;
    
    if (!actualStartDate || !actualEndDate) return 0;

    const calendar = this.getCalendar(task.calendarId);
    return calendar.getWorkdaysBetween(actualStartDate, actualEndDate);
  }

  /**
   * Recalcula todas as datas de uma tarefa
   */
  recalculateTask(task, projectStartDate, allTasks = []) {
    const updatedTask = { ...task };

    // Calcula data de início
    updatedTask.startDate = this.calculateStartDate(task, projectStartDate, allTasks);
    
    // Calcula data de fim
    updatedTask.endDate = this.calculateEndDate(updatedTask);
    
    // Recalcula duração se necessário
    if (!updatedTask.duration && updatedTask.startDate && updatedTask.endDate) {
      updatedTask.duration = this.calculateDuration(updatedTask);
    }
    
    // Recalcula trabalho se necessário
    if (!updatedTask.work && updatedTask.duration) {
      const calendar = this.getCalendar(task.calendarId);
      updatedTask.work = calendar.convertDaysToHours(updatedTask.duration);
    }

    return updatedTask;
  }

  /**
   * Valida dependências circulares
   */
  validateDependencies(tasks) {
    const visited = new Set();
    const recursionStack = new Set();
    
    const hasCycle = (taskId) => {
      if (recursionStack.has(taskId)) {
        return true; // Ciclo detectado
      }
      
      if (visited.has(taskId)) {
        return false; // Já visitado, sem ciclo
      }
      
      visited.add(taskId);
      recursionStack.add(taskId);
      
      const task = tasks.find(t => t.id === taskId);
      if (task && task.predecessors) {
        for (const pred of task.predecessors) {
          if (hasCycle(pred.taskId)) {
            return true;
          }
        }
      }
      
      recursionStack.delete(taskId);
      return false;
    };
    
    for (const task of tasks) {
      if (hasCycle(task.id)) {
        return {
          isValid: false,
          error: `Dependência circular detectada envolvendo a tarefa ${task.id}`
        };
      }
    }
    
    return { isValid: true };
  }

  /**
   * Recalcula todas as tarefas de um projeto
   */
  recalculateProject(tasks, projectStartDate, projectCalendarId = null) {
    // Valida dependências
    const validation = this.validateDependencies(tasks);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Define calendário do projeto se fornecido
    if (projectCalendarId) {
      this.defaultCalendar = this.getCalendar(projectCalendarId);
    }

    // Ordena tarefas por dependências (topological sort)
    const sortedTasks = this.topologicalSort(tasks);
    const recalculatedTasks = [];

    for (const task of sortedTasks) {
      const updatedTask = this.recalculateTask(task, projectStartDate, recalculatedTasks);
      recalculatedTasks.push(updatedTask);
    }

    return recalculatedTasks;
  }

  /**
   * Ordenação topológica das tarefas baseada em dependências
   */
  topologicalSort(tasks) {
    const inDegree = new Map();
    const adjList = new Map();
    const result = [];
    
    // Inicializa estruturas
    tasks.forEach(task => {
      inDegree.set(task.id, 0);
      adjList.set(task.id, []);
    });
    
    // Constrói grafo de dependências
    tasks.forEach(task => {
      if (task.predecessors) {
        task.predecessors.forEach(pred => {
          if (adjList.has(pred.taskId)) {
            adjList.get(pred.taskId).push(task.id);
            inDegree.set(task.id, inDegree.get(task.id) + 1);
          }
        });
      }
    });
    
    // Fila com tarefas sem dependências
    const queue = [];
    inDegree.forEach((degree, taskId) => {
      if (degree === 0) {
        queue.push(taskId);
      }
    });
    
    // Processa fila
    while (queue.length > 0) {
      const currentTaskId = queue.shift();
      const currentTask = tasks.find(t => t.id === currentTaskId);
      if (currentTask) {
        result.push(currentTask);
      }
      
      // Reduz grau de entrada dos sucessores
      adjList.get(currentTaskId).forEach(successorId => {
        inDegree.set(successorId, inDegree.get(successorId) - 1);
        if (inDegree.get(successorId) === 0) {
          queue.push(successorId);
        }
      });
    }
    
    return result;
  }
}

/**
 * Função utilitária para criar calendário padrão brasileiro
 */
export function createBrazilianCalendar(holidays = []) {
  const defaultHolidays = [
    '2025-01-01', // Ano Novo
    '2025-04-21', // Tiradentes
    '2025-05-01', // Dia do Trabalho
    '2025-09-07', // Independência
    '2025-10-12', // Nossa Senhora Aparecida
    '2025-11-02', // Finados
    '2025-11-15', // Proclamação da República
    '2025-12-25', // Natal
    ...holidays
  ];

  return new WorkCalendar({
    workdays: [1, 2, 3, 4, 5], // Segunda a Sexta
    holidays: defaultHolidays,
    hoursPerDay: 8,
    name: 'Calendário Brasileiro'
  });
}

/**
 * Função utilitária para formatar datas
 */
export function formatDate(date, locale = 'pt-BR') {
  if (!date) return '';
  return new Date(date).toLocaleDateString(locale);
}

/**
 * Função utilitária para calcular diferença em dias
 */
export function daysDifference(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

