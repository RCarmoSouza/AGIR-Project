'use client';

import { useAppStore } from '@/stores/appStore';
import { KanbanBoard } from '@/components/KanbanBoard';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function KanbanPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { getProjectById, setSelectedProject, selectedProject } = useAppStore();

  useEffect(() => {
    const project = getProjectById(projectId);
    if (project) {
      setSelectedProject(project);
    }
  }, [projectId, getProjectById, setSelectedProject]);

  if (!selectedProject) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Projeto não encontrado
          </h3>
          <p className="text-gray-500">
            O projeto solicitado não existe ou foi removido.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Voltar aos Projetos
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {selectedProject.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Quadro Kanban - Gerencie suas tarefas
            </p>
          </div>
        </div>
      </div>

      <KanbanBoard projectId={projectId} />
    </div>
  );
}

