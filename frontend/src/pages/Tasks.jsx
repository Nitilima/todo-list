import { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import TaskModal from '../components/tasks/TaskModal';
import TaskList from '../components/tasks/TaskList';
import TaskFilters from '../components/tasks/TaskFilters';
import { taskService } from '../services/taskService';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
  });

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks(filters);
      setTasks(data.tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      return;
    }

    try {
      await taskService.deleteTask(taskId);
      toast.success('Tarefa excluída com sucesso!');
      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Erro ao excluir tarefa');
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, taskData);
        toast.success('Tarefa atualizada com sucesso!');
      } else {
        await taskService.createTask(taskData);
        toast.success('Tarefa criada com sucesso!');
      }
      setIsModalOpen(false);
      loadTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Erro ao salvar tarefa');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Tarefas</h1>
          <button onClick={handleCreateTask} className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </button>
        </div>

        <TaskFilters filters={filters} onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onStatusChange={loadTasks}
          />
        )}

        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
          task={editingTask}
        />
      </div>
    </Layout>
  );
};

export default Tasks;
