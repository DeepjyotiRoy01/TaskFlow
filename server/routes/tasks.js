const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { generateAISuggestions } = require('../services/aiService');

const router = express.Router();

// Get all tasks for user
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, category, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query = { createdBy: req.user.userId, isArchived: false };
    
    // Apply filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tasks = await Task.find(query)
      .sort(sortOptions)
      .populate('assignees.userId', 'username firstName lastName avatar')
      .populate('completedBy', 'username firstName lastName');

    res.json({
      success: true,
      tasks,
      total: tasks.length
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tasks'
    });
  }
});

// Get task by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignees.userId', 'username firstName lastName avatar')
      .populate('completedBy', 'username firstName lastName')
      .populate('dependencies.taskId', 'title status')
      .populate('notes.author', 'username firstName lastName avatar');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access to this task
    const hasAccess = task.createdBy.equals(req.user.userId) || 
                     task.assignees.some(assignee => assignee.userId.equals(req.user.userId));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      task
    });

  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching task'
    });
  }
});

// Create new task
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      category,
      tags,
      dueDate,
      estimatedTime,
      assignees,
      subtasks
    } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      category,
      tags,
      dueDate,
      estimatedTime,
      assignees: assignees || [{ userId: req.user.userId, role: 'owner' }],
      subtasks: subtasks || [],
      createdBy: req.user.userId
    });

    // Generate AI suggestions
    if (title && description) {
      const suggestions = await generateAISuggestions(title, description);
      task.aiSuggestions = suggestions;
    }

    await task.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { 'stats.totalTasks': 1 }
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignees.userId', 'username firstName lastName avatar');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: populatedTask
    });

  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating task'
    });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access to update this task
    const hasAccess = task.createdBy.equals(req.user.userId) || 
                     task.assignees.some(assignee => assignee.userId.equals(req.user.userId));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update fields
    const updateFields = ['title', 'description', 'priority', 'category', 'tags', 'dueDate', 'estimatedTime', 'progress'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    // Handle assignees update
    if (req.body.assignees) {
      task.assignees = req.body.assignees;
    }

    // Handle subtasks update
    if (req.body.subtasks) {
      task.subtasks = req.body.subtasks;
      task.calculateProgress();
    }

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignees.userId', 'username firstName lastName avatar')
      .populate('completedBy', 'username firstName lastName');

    res.json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask
    });

  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating task'
    });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Only creator can delete task
    if (!task.createdBy.equals(req.user.userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting task'
    });
  }
});

// Complete task
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access
    const hasAccess = task.createdBy.equals(req.user.userId) || 
                     task.assignees.some(assignee => assignee.userId.equals(req.user.userId));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await task.complete(req.user.userId);

    // Update user stats and gamification
    const user = await User.findById(req.user.userId);
    user.stats.completedTasks += 1;
    user.stats.totalTimeSpent += task.actualTime;
    
    // Add experience and points
    const experienceGained = Math.min(50, Math.floor(task.estimatedTime / 10) + 10);
    const pointsGained = Math.floor(experienceGained / 2);
    
    const levelUp = user.addExperience(experienceGained);
    user.gamification.points += pointsGained;
    user.gamification.streak += 1;

    await user.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignees.userId', 'username firstName lastName avatar')
      .populate('completedBy', 'username firstName lastName');

    res.json({
      success: true,
      message: 'Task completed successfully',
      task: updatedTask,
      gamification: {
        experienceGained,
        pointsGained,
        levelUp,
        newLevel: user.gamification.level,
        streak: user.gamification.streak
      }
    });

  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error completing task'
    });
  }
});

// Add time entry
router.post('/:id/time-entry', auth, async (req, res) => {
  try {
    const { startTime, endTime, notes } = req.body;
    
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await task.addTimeEntry(new Date(startTime), new Date(endTime), notes);

    res.json({
      success: true,
      message: 'Time entry added successfully',
      task
    });

  } catch (error) {
    console.error('Add time entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding time entry'
    });
  }
});

// Add note to task
router.post('/:id/notes', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.notes.push({
      content,
      author: req.user.userId
    });

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('notes.author', 'username firstName lastName avatar');

    res.json({
      success: true,
      message: 'Note added successfully',
      task: updatedTask
    });

  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding note'
    });
  }
});

// Get task statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $match: { createdBy: req.userData._id, isArchived: false } },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          completedTasks: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
          inProgressTasks: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          todoTasks: { $sum: { $cond: [{ $eq: ['$status', 'todo'] }, 1, 0] } },
          totalTimeSpent: { $sum: '$actualTime' },
          overdueTasks: {
            $sum: {
              $cond: [
                { $and: [{ $ne: ['$status', 'done'] }, { $lt: ['$dueDate', new Date()] }] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const categoryStats = await Task.aggregate([
      { $match: { createdBy: req.userData._id, isArchived: false } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      stats: stats[0] || {
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        todoTasks: 0,
        totalTimeSpent: 0,
        overdueTasks: 0
      },
      categoryStats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics'
    });
  }
});

module.exports = router; 