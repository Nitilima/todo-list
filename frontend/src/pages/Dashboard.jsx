import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { taskService } from '../services/taskService';
import { CheckCircle, Clock, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, tasksData] = await Promise.all([
        taskService.getStats(),
        taskService.getTasks({ sortBy: 'createdAt', order: 'DESC' }),
      ]);

      setStats(statsData);
      setRecentTasks(tasksData.tasks.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  const statCards = [
    {
      title: 'Total de Tarefas',
      value: stats?.totalTasks || 0,
      icon: Clock,
      color: 'bg-blue-500',
    },
    {
      title: 'Concluídas',
      value: stats?.completedTasks || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      title: 'Pendentes',
      value: stats?.pendingTasks || 0,
      icon: AlertCircle,
      color: 'bg-yellow-500',
    },
    {
      title: 'Atrasadas',
      value: stats?.overdueTasks || 0,
      icon: AlertCircle,
      color: 'bg-red-500',
    },
  ];

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="card">
                <div className="flex items-center">
                  <div className={`${stat.color} rounded-lg p-3 mr-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Weekly Progress */}
        <div className="card mb-8">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Progresso Semanal</h2>
          </div>
          <p className="text-3xl font-bold text-primary-600 mb-2">
            {stats?.completedThisWeek || 0}
          </p>
          <p className="text-sm text-gray-600">Tarefas concluídas nos últimos 7 dias</p>
        </div>

        {/* Recent Tasks */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Tarefas Recentes</h2>
            <Link
              to="/tasks"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
            >
              Ver todas
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhuma tarefa criada ainda</p>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600">
                      {task.status === 'completed' && 'Concluída'}
                      {task.status === 'in_progress' && 'Em Progresso'}
                      {task.status === 'pending' && 'Pendente'}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {task.priority === 'high' && 'Alta'}
                    {task.priority === 'medium' && 'Média'}
                    {task.priority === 'low' && 'Baixa'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
