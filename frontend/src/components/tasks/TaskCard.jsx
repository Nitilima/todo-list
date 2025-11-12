import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Edit, Trash2, Clock } from 'lucide-react';
import { taskService } from '../../services/taskService';
import toast from 'react-hot-toast';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const handleStatusChange = async (newStatus) => {
    try {
      await taskService.updateTask(task.id, { ...task, status: newStatus });
      toast.success('Status atualizado!');
      onStatusChange();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    pending: 'Pendente',
    in_progress: 'Em Progresso',
    completed: 'Concluída',
  };

  const priorityLabels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
  };

  return (
    <div className={`card hover:shadow-md transition-shadow ${isOverdue ? 'border-l-4 border-l-red-500' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 text-sm mb-3">{task.description}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[task.status]} cursor-pointer`}
        >
          <option value="pending">Pendente</option>
          <option value="in_progress">Em Progresso</option>
          <option value="completed">Concluída</option>
        </select>

        <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
          {priorityLabels[task.priority]}
        </span>

        {task.dueDate && (
          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
            isOverdue ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
          }`}>
            <Calendar className="h-3 w-3 mr-1" />
            {format(new Date(task.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          Criada em {format(new Date(task.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
