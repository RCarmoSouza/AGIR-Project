import { useState, useRef, useCallback } from 'react';

/**
 * Hook personalizado para gerenciar o estado do sidebar colapsável
 * Implementa interação por hover com atraso no recolhimento
 */
export const useSidebar = (collapseDelay = 1000) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef(null);

  // Função para expandir o sidebar imediatamente
  const expandSidebar = useCallback(() => {
    // Cancelar qualquer timeout pendente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsExpanded(true);
  }, []);

  // Função para recolher o sidebar com atraso
  const collapseSidebar = useCallback(() => {
    // Cancelar timeout anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Definir novo timeout para recolher
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
      timeoutRef.current = null;
    }, collapseDelay);
  }, [collapseDelay]);

  // Função para alternar manualmente (para acessibilidade)
  const toggleSidebar = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsExpanded(prev => !prev);
  }, []);

  // Cleanup do timeout quando o componente for desmontado
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    isExpanded,
    expandSidebar,
    collapseSidebar,
    toggleSidebar,
    cleanup
  };
};

