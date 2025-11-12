const prisma = require('../config/prisma');
const { validationResult } = require('express-validator');

// Helper function to convert API status to Prisma enum
const convertStatus = (status) => {
  const statusMap = {
    'pending': 'PENDING',
    'in_progress': 'IN_PROGRESS',
    'completed': 'COMPLETED'
  };
  return statusMap[status] || status;
};

// Helper function to convert Prisma enum to API status
const convertStatusFromDb = (status) => {
  const statusMap = {
    'PENDING': 'pending',
    'IN_PROGRESS': 'in_progress',
    'COMPLETED': 'completed'
  };
  return statusMap[status] || status;
};

// Helper function to convert priority
const convertPriority = (priority) => {
  const priorityMap = {
    'low': 'LOW',
    'medium': 'MEDIUM',
    'high': 'HIGH'
  };
  return priorityMap[priority] || priority;
};

// Helper function to convert priority from DB
const convertPriorityFromDb = (priority) => {
  const priorityMap = {
    'LOW': 'low',
    'MEDIUM': 'medium',
    'HIGH': 'high'
  };
  return priorityMap[priority] || priority;
};

// Helper function to convert task from DB format to API format
const formatTask = (task) => {
  if (!task) return null;
  return {
    ...task,
    status: convertStatusFromDb(task.status),
    priority: convertPriorityFromDb(task.priority)
  };
};

// @desc    Get all tasks for current user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Build where clause
    const where = { userId: req.userId };

    if (status) {
      where.status = convertStatus(status);
    }

    if (priority) {
      where.priority = convertPriority(priority);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { [sortBy]: order.toLowerCase() }
    });

    const formattedTasks = tasks.map(formatTask);

    res.json({ tasks: formattedTasks, count: formattedTasks.length });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error while fetching tasks' });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task: formatTask(task) });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error while fetching task' });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, status, priority, dueDate } = req.body;

    const taskData = {
      title,
      description,
      status: status ? convertStatus(status) : 'PENDING',
      priority: priority ? convertPriority(priority) : 'MEDIUM',
      userId: req.userId
    };

    if (dueDate) {
      taskData.dueDate = new Date(dueDate);
    }

    const task = await prisma.task.create({
      data: taskData
    });

    res.status(201).json({
      message: 'Task created successfully',
      task: formatTask(task)
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error while creating task' });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, status, priority, dueDate } = req.body;

    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) {
      updateData.status = convertStatus(status);
      // Set completedAt if status is completed
      if (status === 'completed' && !task.completedAt) {
        updateData.completedAt = new Date();
      } else if (status !== 'completed') {
        updateData.completedAt = null;
      }
    }
    if (priority !== undefined) updateData.priority = convertPriority(priority);
    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    }

    const updatedTask = await prisma.task.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.json({
      message: 'Task updated successfully',
      task: formatTask(updatedTask)
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error while updating task' });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await prisma.task.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error while deleting task' });
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats/summary
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Total tasks
    const totalTasks = await prisma.task.count({ where: { userId } });

    // Tasks by status
    const completedTasks = await prisma.task.count({
      where: { userId, status: 'COMPLETED' }
    });
    const pendingTasks = await prisma.task.count({
      where: { userId, status: 'PENDING' }
    });
    const inProgressTasks = await prisma.task.count({
      where: { userId, status: 'IN_PROGRESS' }
    });

    // Overdue tasks
    const overdueTasks = await prisma.task.count({
      where: {
        userId,
        status: { not: 'COMPLETED' },
        dueDate: { lt: new Date() }
      }
    });

    // Tasks completed this week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const completedThisWeek = await prisma.task.count({
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: { gte: weekStart }
      }
    });

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      completedThisWeek
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};
