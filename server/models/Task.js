const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done', 'archived'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'shopping', 'health', 'learning', 'finance', 'other'],
    default: 'other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  dueDate: {
    type: Date
  },
  estimatedTime: {
    type: Number, // in minutes
    default: 0
  },
  actualTime: {
    type: Number, // in minutes
    default: 0
  },
  timeEntries: [{
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    duration: { type: Number }, // in minutes
    notes: String
  }],
  // Dependencies
  dependencies: [{
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    type: {
      type: String,
      enum: ['blocks', 'blocked-by', 'related'],
      default: 'blocks'
    }
  }],
  // File attachments
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  // AI suggestions
  aiSuggestions: {
    estimatedTime: Number,
    priority: String,
    category: String,
    tags: [String],
    similarTasks: [{
      taskId: mongoose.Schema.Types.ObjectId,
      similarity: Number
    }]
  },
  // Collaboration
  assignees: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['owner', 'assignee', 'watcher'],
      default: 'assignee'
    },
    assignedAt: { type: Date, default: Date.now }
  }],
  // Progress tracking
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  subtasks: [{
    title: String,
    completed: { type: Boolean, default: false },
    completedAt: Date
  }],
  // Completion tracking
  completedAt: Date,
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Recurring tasks
  recurring: {
    enabled: { type: Boolean, default: false },
    pattern: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly', 'custom']
    },
    interval: Number,
    nextDue: Date,
    endDate: Date
  },
  // Notes and comments
  notes: [{
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: { type: Date, default: Date.now }
  }],
  // Reminders
  reminders: [{
    time: Date,
    type: {
      type: String,
      enum: ['email', 'push', 'sms']
    },
    sent: { type: Boolean, default: false }
  }],
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace'
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: Date
}, {
  timestamps: true
});

// Indexes for better performance
taskSchema.index({ createdBy: 1, status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ category: 1 });
taskSchema.index({ tags: 1 });
taskSchema.index({ 'assignees.userId': 1 });

// Virtual for time spent
taskSchema.virtual('totalTimeSpent').get(function() {
  return this.timeEntries.reduce((total, entry) => {
    return total + (entry.duration || 0);
  }, 0);
});

// Method to add time entry
taskSchema.methods.addTimeEntry = function(startTime, endTime, notes = '') {
  const duration = Math.round((endTime - startTime) / (1000 * 60)); // Convert to minutes
  
  this.timeEntries.push({
    startTime,
    endTime,
    duration,
    notes
  });
  
  this.actualTime = this.totalTimeSpent;
  return this.save();
};

// Method to complete task
taskSchema.methods.complete = function(userId) {
  this.status = 'done';
  this.progress = 100;
  this.completedAt = new Date();
  this.completedBy = userId;
  
  // Complete all subtasks
  this.subtasks.forEach(subtask => {
    subtask.completed = true;
    subtask.completedAt = new Date();
  });
  
  return this.save();
};

// Method to calculate progress based on subtasks
taskSchema.methods.calculateProgress = function() {
  if (this.subtasks.length === 0) return this.progress;
  
  const completedSubtasks = this.subtasks.filter(subtask => subtask.completed).length;
  this.progress = Math.round((completedSubtasks / this.subtasks.length) * 100);
  return this.progress;
};

module.exports = mongoose.model('Task', taskSchema); 