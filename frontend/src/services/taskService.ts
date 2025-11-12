import api from './api';
import { Task, TaskFilters, TaskStats } from '../types';

interface TasksResponse {
  tasks: Task[];
  count: number;
}

interface TaskResponse {
  task: Task;
}

export const taskService = {
  // Get all tasks
  getTasks: async (filters: TaskFilters = {}): Promise<TasksResponse> => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.order) params.append('order', filters.order);

    const response = await api.get<TasksResponse>(`/tasks?${params.toString()}`);
    return response.data;
  },

  // Get single task
  getTask: async (id: string): Promise<TaskResponse> => {
    const response = await api.get<TaskResponse>(`/tasks/${id}`);
    return response.data;
  },

  // Create task
  createTask: async (taskData: Partial<Task>): Promise<TaskResponse> => {
    const response = await api.post<TaskResponse>('/tasks', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id: string, taskData: Partial<Task>): Promise<TaskResponse> => {
    const response = await api.put<TaskResponse>(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/tasks/${id}`);
    return response.data;
  },

  // Get statistics
  getStats: async (): Promise<TaskStats> => {
    const response = await api.get<TaskStats>('/tasks/stats/summary');
    return response.data;
  },
};
