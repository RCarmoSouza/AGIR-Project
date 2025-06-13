import { useDroppable } from '@dnd-kit/core';

interface DroppableColumnProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function DroppableColumn({ id, children, className = '' }: DroppableColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const style = {
    backgroundColor: isOver ? 'rgba(59, 130, 246, 0.1)' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${className} transition-colors`}
    >
      {children}
    </div>
  );
}

