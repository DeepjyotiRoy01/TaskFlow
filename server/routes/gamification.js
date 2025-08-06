const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user achievements and badges
router.get('/achievements', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      achievements: user.gamification.achievements,
      badges: user.gamification.badges,
      level: user.gamification.level,
      experience: user.gamification.experience,
      points: user.gamification.points,
      streak: user.gamification.streak
    });

  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching achievements'
    });
  }
});

// Get leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const { type = 'points', limit = 10 } = req.query;
    
    let sortField = 'gamification.points';
    if (type === 'level') sortField = 'gamification.level';
    if (type === 'streak') sortField = 'gamification.streak';
    if (type === 'tasks') sortField = 'stats.completedTasks';

    const leaderboard = await User.find({ isActive: true })
      .select('username firstName lastName avatar gamification stats')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit));

    // Add rank to each user
    const leaderboardWithRank = leaderboard.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      level: user.gamification.level,
      experience: user.gamification.experience,
      points: user.gamification.points,
      streak: user.gamification.streak,
      completedTasks: user.stats.completedTasks
    }));

    res.json({
      success: true,
      leaderboard: leaderboardWithRank,
      type
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching leaderboard'
    });
  }
});

// Get user progress
router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate progress to next level
    const currentLevelExp = (user.gamification.level - 1) * 100;
    const expForNextLevel = user.gamification.level * 100;
    const progressToNextLevel = ((user.gamification.experience - currentLevelExp) / (expForNextLevel - currentLevelExp)) * 100;

    // Calculate weekly progress
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyStats = {
      tasksCompleted: 0,
      timeSpent: 0,
      experienceGained: 0,
      pointsEarned: 0
    };

    // This would typically come from a separate analytics collection
    // For now, we'll return basic stats

    const progress = {
      currentLevel: user.gamification.level,
      experience: user.gamification.experience,
      progressToNextLevel: Math.round(progressToNextLevel),
      points: user.gamification.points,
      streak: user.gamification.streak,
      achievements: user.gamification.achievements.length,
      badges: user.gamification.badges.length,
      weeklyStats
    };

    res.json({
      success: true,
      progress
    });

  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching progress'
    });
  }
});

// Award achievement
router.post('/award-achievement', auth, async (req, res) => {
  try {
    const { achievementId, name, description, icon } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if achievement already exists
    const existingAchievement = user.gamification.achievements.find(
      achievement => achievement.id === achievementId
    );

    if (existingAchievement) {
      return res.status(400).json({
        success: false,
        message: 'Achievement already earned'
      });
    }

    // Add achievement
    user.gamification.achievements.push({
      id: achievementId,
      name,
      description,
      icon,
      earnedAt: new Date()
    });

    // Add bonus experience for achievement
    const bonusExp = 25;
    const levelUp = user.addExperience(bonusExp);
    user.gamification.points += Math.floor(bonusExp / 2);

    await user.save();

    res.json({
      success: true,
      message: 'Achievement awarded successfully',
      achievement: {
        id: achievementId,
        name,
        description,
        icon
      },
      bonusExp,
      levelUp,
      newLevel: user.gamification.level
    });

  } catch (error) {
    console.error('Award achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error awarding achievement'
    });
  }
});

// Award badge
router.post('/award-badge', auth, async (req, res) => {
  try {
    const { badgeId, name, description, icon } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if badge already exists
    const existingBadge = user.gamification.badges.find(
      badge => badge.id === badgeId
    );

    if (existingBadge) {
      return res.status(400).json({
        success: false,
        message: 'Badge already earned'
      });
    }

    // Add badge
    user.gamification.badges.push({
      id: badgeId,
      name,
      description,
      icon,
      earnedAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: 'Badge awarded successfully',
      badge: {
        id: badgeId,
        name,
        description,
        icon
      }
    });

  } catch (error) {
    console.error('Award badge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error awarding badge'
    });
  }
});

module.exports = router; 