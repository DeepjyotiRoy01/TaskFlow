const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sound: { type: Boolean, default: true }
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  // Gamification fields
  gamification: {
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    achievements: [{
      id: String,
      name: String,
      description: String,
      earnedAt: { type: Date, default: Date.now },
      icon: String
    }],
    badges: [{
      id: String,
      name: String,
      description: String,
      earnedAt: { type: Date, default: Date.now },
      icon: String
    }]
  },
  // Statistics
  stats: {
    totalTasks: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }, // in minutes
    averageCompletionTime: { type: Number, default: 0 },
    productivityScore: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate level based on experience
userSchema.methods.calculateLevel = function() {
  return Math.floor(this.gamification.experience / 100) + 1;
};

// Add experience and update level
userSchema.methods.addExperience = function(amount) {
  this.gamification.experience += amount;
  const newLevel = this.calculateLevel();
  
  if (newLevel > this.gamification.level) {
    this.gamification.level = newLevel;
    return { leveledUp: true, newLevel };
  }
  
  return { leveledUp: false, newLevel: this.gamification.level };
};

module.exports = mongoose.model('User', userSchema); 