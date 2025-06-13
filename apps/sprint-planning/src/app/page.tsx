'use client';

import { useAppStore } from '@/stores/appStore';
import { ProjectCard } from '@/components/ProjectCard';
import { CreateProjectModal } from '@/components/CreateProjectModal';
import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { initializeSampleData } from '@/lib/sampleData';

export default function HomePage() {
  const { 
    projects, 
    selectedProject, 
    setProjects, 
    setTasks, 
    setUsers, 
    setTaskTypes,
    setCurrentUser 
  } = useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dataInitialized, setDataInitialized] = useState(false);

  // Inicializar dados de exemplo na primeira execução
  useEffect(() => {
    if (!dataInitialized && projects.length === 0) {
      const sampleData = initializeSampleData();
      setProjects(sampleData.projects);
      setTasks(sampleData.tasks);
      setUsers(sampleData.users);
      setTaskTypes(sampleData.taskTypes);
      setCurrentUser(sampleData.users[0]); // Ana Silva como usuário atual
      setDataInitialized(true);
    }
  }, [dataInitialized, projects.length, setProjects, setTasks, setUsers, setTaskTypes, setCurrentUser]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Projetos
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus projetos e sprints ágeis
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Novo Projeto
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Carregando projetos...
          </h3>
          <p className="mt-2 text-gray-500">
            Aguarde enquanto carregamos os dados de exemplo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}

