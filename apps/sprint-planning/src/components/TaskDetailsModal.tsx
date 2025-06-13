'use client';

import { useState } from 'react';
import { Task, Comment, Attachment } from '@/types';
import { useAppStore } from '@/stores/appStore';
import { 
  ChatBubbleLeftIcon, 
  PaperClipIcon, 
  XMarkIcon,
  PlusIcon,
  DocumentIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskDetailsModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailsModal({ task, isOpen, onClose }: TaskDetailsModalProps) {
  const { addComment, addAttachment, removeAttachment, currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'attachments'>('details');
  const [newComment, setNewComment] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      content: newComment.trim(),
      authorId: currentUser.id,
      author: currentUser,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addComment(task.id, comment);
    setNewComment('');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    setIsUploading(true);

    try {
      // Simular upload (em produção, seria um upload real)
      const attachment: Attachment = {
        id: `attachment-${Date.now()}`,
        name: file.name,
        url: URL.createObjectURL(file), // Em produção seria a URL real
        size: file.size,
        type: file.type,
        uploadedBy: currentUser.id,
        uploadedAt: new Date(),
      };

      addAttachment(task.id, attachment);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    } finally {
      setIsUploading(false);
      event.target.value = ''; // Reset input
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{task.type.icon}</span>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {task.title}
              </h2>
              <p className="text-sm text-gray-500">
                {task.type.name} • {task.id}
                {task.epicName && (
                  <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                    Épico: {task.epicName}
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'details', label: 'Detalhes', icon: null },
              { id: 'comments', label: `Comentários (${task.comments.length})`, icon: ChatBubbleLeftIcon },
              { id: 'attachments', label: `Anexos (${task.attachments.length})`, icon: PaperClipIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon && <tab.icon className="h-4 w-4" />}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Informações básicas */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                    {task.status === 'todo' && 'A Fazer'}
                    {task.status === 'in-progress' && 'Em Progresso'}
                    {task.status === 'in-review' && 'Em Revisão'}
                    {task.status === 'done' && 'Concluído'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridade
                  </label>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'critical' && 'Crítica'}
                    {task.priority === 'high' && 'Alta'}
                    {task.priority === 'medium' && 'Média'}
                    {task.priority === 'low' && 'Baixa'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsável
                  </label>
                  <div className="flex items-center space-x-2">
                    {task.assignee ? (
                      <>
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {task.assignee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm text-gray-900">{task.assignee.name}</span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Não atribuído</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Story Points / Estimativa
                  </label>
                  <div className="flex items-center space-x-4">
                    {task.storyPoints && (
                      <span className="text-sm text-gray-900">{task.storyPoints} pts</span>
                    )}
                    {task.estimatedHours && (
                      <span className="text-sm text-gray-900">{task.estimatedHours}h</span>
                    )}
                    {!task.storyPoints && !task.estimatedHours && (
                      <span className="text-sm text-gray-500">Não estimado</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <div className="bg-gray-50 rounded-md p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {task.description || 'Nenhuma descrição fornecida.'}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {task.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              {/* Lista de comentários */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {task.comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Nenhum comentário ainda. Seja o primeiro a comentar!
                  </p>
                ) : (
                  task.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {comment.author.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(comment.createdAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Adicionar comentário */}
              <div className="border-t pt-4">
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Adicione um comentário..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Comentar
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attachments' && (
            <div className="space-y-4">
              {/* Lista de anexos */}
              <div className="space-y-3">
                {task.attachments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Nenhum anexo ainda. Faça upload de arquivos para compartilhar.
                  </p>
                ) : (
                  task.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DocumentIcon className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(attachment.size)} • {format(attachment.uploadedAt, 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={attachment.url}
                          download={attachment.name}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Download
                        </a>
                        <button
                          onClick={() => removeAttachment(task.id, attachment.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Upload de anexo */}
              <div className="border-t pt-4">
                <label className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <PlusIcon className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Clique para fazer upload</span> ou arraste arquivos
                    </p>
                    <p className="text-xs text-gray-500">
                      Qualquer tipo de arquivo
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </label>
                {isUploading && (
                  <p className="text-sm text-blue-600 mt-2">Fazendo upload...</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

