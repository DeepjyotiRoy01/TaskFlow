// AI Service for Task Manager Pro
// This service provides AI-powered features for task management

const generateAISuggestions = async (title, description = '') => {
  try {
    // Simple AI suggestions based on content analysis
    // In a real implementation, this would use OpenAI API or similar
    
    const text = `${title} ${description}`.toLowerCase();
    const suggestions = {
      estimatedTime: 30, // Default 30 minutes
      priority: 'medium',
      category: 'other',
      tags: [],
      similarTasks: []
    };

    // Priority suggestions based on keywords
    const urgentKeywords = ['urgent', 'asap', 'emergency', 'deadline', 'critical'];
    const highKeywords = ['important', 'priority', 'deadline', 'due'];
    const lowKeywords = ['sometime', 'when possible', 'low priority'];

    if (urgentKeywords.some(keyword => text.includes(keyword))) {
      suggestions.priority = 'urgent';
    } else if (highKeywords.some(keyword => text.includes(keyword))) {
      suggestions.priority = 'high';
    } else if (lowKeywords.some(keyword => text.includes(keyword))) {
      suggestions.priority = 'low';
    }

    // Category suggestions
    const categories = {
      work: ['meeting', 'project', 'report', 'presentation', 'client', 'business'],
      personal: ['family', 'home', 'personal', 'life'],
      shopping: ['buy', 'purchase', 'shopping', 'grocery', 'store'],
      health: ['doctor', 'medical', 'health', 'exercise', 'diet'],
      learning: ['study', 'learn', 'course', 'training', 'education'],
      finance: ['bill', 'payment', 'budget', 'finance', 'money']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        suggestions.category = category;
        break;
      }
    }

    // Time estimation based on keywords
    const timeKeywords = {
      'quick': 15,
      'short': 30,
      'brief': 20,
      'long': 120,
      'extensive': 180,
      'comprehensive': 240
    };

    for (const [keyword, minutes] of Object.entries(timeKeywords)) {
      if (text.includes(keyword)) {
        suggestions.estimatedTime = minutes;
        break;
      }
    }

    // Tag suggestions
    const commonTags = ['urgent', 'important', 'meeting', 'deadline', 'follow-up', 'review'];
    suggestions.tags = commonTags.filter(tag => text.includes(tag));

    return suggestions;

  } catch (error) {
    console.error('AI suggestions error:', error);
    return {
      estimatedTime: 30,
      priority: 'medium',
      category: 'other',
      tags: [],
      similarTasks: []
    };
  }
};

const processVoiceCommand = async (command, userId) => {
  try {
    const lowerCommand = command.toLowerCase();
    const result = {
      action: 'unknown',
      data: {},
      message: 'Command not recognized'
    };

    // Add task commands
    if (lowerCommand.includes('add task') || lowerCommand.includes('create task')) {
      const taskTitle = command.replace(/add task|create task/i, '').trim();
      if (taskTitle) {
        result.action = 'add_task';
        result.data = { title: taskTitle };
        result.message = `Task "${taskTitle}" will be created`;
      }
    }

    // Complete task commands
    if (lowerCommand.includes('complete task') || lowerCommand.includes('finish task')) {
      const taskTitle = command.replace(/complete task|finish task/i, '').trim();
      if (taskTitle) {
        result.action = 'complete_task';
        result.data = { title: taskTitle };
        result.message = `Task "${taskTitle}" will be completed`;
      }
    }

    // Show tasks commands
    if (lowerCommand.includes('show tasks') || lowerCommand.includes('list tasks')) {
      result.action = 'show_tasks';
      result.message = 'Showing your tasks';
    }

    // Show progress commands
    if (lowerCommand.includes('show progress') || lowerCommand.includes('my progress')) {
      result.action = 'show_progress';
      result.message = 'Showing your progress';
    }

    return result;

  } catch (error) {
    console.error('Voice command processing error:', error);
    return {
      action: 'error',
      data: {},
      message: 'Error processing voice command'
    };
  }
};

const generateTaskTemplate = async (context, taskType = 'general') => {
  try {
    const templates = {
      meeting: {
        title: 'Team Meeting',
        description: 'Weekly team sync meeting',
        subtasks: [
          'Prepare agenda',
          'Send meeting invite',
          'Review previous action items',
          'Take meeting notes',
          'Send follow-up email'
        ],
        estimatedTime: 60,
        category: 'work',
        tags: ['meeting', 'team', 'sync']
      },
      project: {
        title: 'Project Planning',
        description: 'Plan and organize project tasks',
        subtasks: [
          'Define project scope',
          'Create project timeline',
          'Identify team members',
          'Set milestones',
          'Create project documentation'
        ],
        estimatedTime: 120,
        category: 'work',
        tags: ['project', 'planning', 'management']
      },
      personal: {
        title: 'Personal Task',
        description: 'Personal task or errand',
        subtasks: [],
        estimatedTime: 30,
        category: 'personal',
        tags: ['personal']
      },
      learning: {
        title: 'Learning Session',
        description: 'Study or learning activity',
        subtasks: [
          'Review materials',
          'Take notes',
          'Practice exercises',
          'Review and reflect'
        ],
        estimatedTime: 90,
        category: 'learning',
        tags: ['learning', 'study']
      }
    };

    // Use context to determine template
    const contextLower = context.toLowerCase();
    let selectedTemplate = templates.general;

    if (contextLower.includes('meeting')) {
      selectedTemplate = templates.meeting;
    } else if (contextLower.includes('project')) {
      selectedTemplate = templates.project;
    } else if (contextLower.includes('personal') || contextLower.includes('errand')) {
      selectedTemplate = templates.personal;
    } else if (contextLower.includes('learn') || contextLower.includes('study')) {
      selectedTemplate = templates.learning;
    }

    // Customize template based on context
    if (context && !contextLower.includes('meeting') && !contextLower.includes('project')) {
      selectedTemplate.title = context;
      selectedTemplate.description = `Task related to: ${context}`;
    }

    return selectedTemplate;

  } catch (error) {
    console.error('Template generation error:', error);
    return {
      title: 'New Task',
      description: 'Task description',
      subtasks: [],
      estimatedTime: 30,
      category: 'other',
      tags: []
    };
  }
};

module.exports = {
  generateAISuggestions,
  processVoiceCommand,
  generateTaskTemplate
}; 