import TaskCard from './TaskCard';
import { Task } from '../../types';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: () => void;
}

const TaskList = ({ tasks, onEdit, onDelete, onStatusChange }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500 text-lg">Nenhuma tarefa encontrada</p>
        <p className="text-gray-400 text-sm mt-2">Crie uma nova tarefa para começar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default TaskList;
