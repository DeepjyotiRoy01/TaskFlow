const express = require('express');
const auth = require('../middleware/auth');
const { generateAISuggestions, processVoiceCommand, generateTaskTemplate } = require('../services/aiService');

const router = express.Router();

// Get AI suggestions for task
router.post('/suggestions', auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    const suggestions = await generateAISuggestions(title, description);

    res.json({
      success: true,
      suggestions
    });

  } catch (error) {
    console.error('AI suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error generating suggestions'
    });
  }
});

// Process voice command
router.post('/voice-command', auth, async (req, res) => {
  try {
    const { command } = req.body;

    if (!command) {
      return res.status(400).json({
        success: false,
        message: 'Voice command is required'
      });
    }

    const result = await processVoiceCommand(command, req.user.userId);

    res.json({
      success: true,
      result
    });

  } catch (error) {
    console.error('Voice command error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing voice command'
    });
  }
});

// Generate task template
router.post('/template', auth, async (req, res) => {
  try {
    const { context, taskType } = req.body;

    if (!context) {
      return res.status(400).json({
        success: false,
        message: 'Context is required'
      });
    }

    const template = await generateTaskTemplate(context, taskType);

    res.json({
      success: true,
      template
    });

  } catch (error) {
    console.error('Template generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error generating template'
    });
  }
});

// Auto-categorize task
router.post('/categorize', auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    // Simple categorization logic (can be enhanced with AI)
    const categories = {
      work: ['meeting', 'project', 'report', 'presentation', 'deadline', 'client'],
      personal: ['family', 'home', 'personal', 'health', 'exercise'],
      shopping: ['buy', 'purchase', 'shopping', 'grocery', 'store'],
      health: ['doctor', 'medical', 'health', 'exercise', 'diet'],
      learning: ['study', 'learn', 'course', 'training', 'education'],
      finance: ['bill', 'payment', 'budget', 'finance', 'money']
    };

    const text = `${title} ${description || ''}`.toLowerCase();
    let bestCategory = 'other';
    let maxScore = 0;

    for (const [category, keywords] of Object.entries(categories)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (text.includes(keyword) ? 1 : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        bestCategory = category;
      }
    }

    res.json({
      success: true,
      category: bestCategory,
      confidence: maxScore > 0 ? Math.min(maxScore / 3, 1) : 0
    });

  } catch (error) {
    console.error('Categorization error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error categorizing task'
    });
  }
});

module.exports = router; 