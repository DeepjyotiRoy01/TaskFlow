import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Calendar, 
  Flame, 
  Crown,
  Medal,
  Award,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  Gift,
  Share2,
  Download
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'productivity' | 'streak' | 'milestone' | 'social' | 'special'
  points: number
  isUnlocked: boolean
  unlockedAt?: string
  progress?: number
  maxProgress?: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  isEarned: boolean
  earnedAt?: string
}

const AchievementsPage = () => {
  const [activeTab, setActiveTab] = useState('achievements')
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)

  // Sample achievements data
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first task',
      icon: '🎯',
      category: 'milestone',
      points: 50,
      isUnlocked: true,
      unlockedAt: '2024-01-15T10:30:00Z',
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Task Master',
      description: 'Complete 50 tasks',
      icon: '🏆',
      category: 'productivity',
      points: 200,
      isUnlocked: true,
      unlockedAt: '2024-01-20T14:15:00Z',
      progress: 50,
      maxProgress: 50,
      rarity: 'rare'
    },
    {
      id: '3',
      title: 'Streak Champion',
      description: 'Maintain a 7-day task completion streak',
      icon: '🔥',
      category: 'streak',
      points: 150,
      isUnlocked: true,
      unlockedAt: '2024-01-25T09:45:00Z',
      rarity: 'epic'
    },
    {
      id: '4',
      title: 'Team Player',
      description: 'Collaborate on 10 tasks with team members',
      icon: '👥',
      category: 'social',
      points: 100,
      isUnlocked: false,
      progress: 7,
      maxProgress: 10,
      rarity: 'common'
    },
    {
      id: '5',
      title: 'Speed Demon',
      description: 'Complete 5 tasks in a single day',
      icon: '⚡',
      category: 'productivity',
      points: 300,
      isUnlocked: false,
      progress: 3,
      maxProgress: 5,
      rarity: 'epic'
    },
    {
      id: '6',
      title: 'Legendary Worker',
      description: 'Complete 100 tasks',
      icon: '👑',
      category: 'milestone',
      points: 500,
      isUnlocked: false,
      progress: 52,
      maxProgress: 100,
      rarity: 'legendary'
    }
  ]

  const badges: Badge[] = [
    {
      id: '1',
      name: 'Early Bird',
      description: 'Complete tasks before 9 AM for 7 consecutive days',
      icon: '🌅',
      color: 'bg-yellow-500',
      isEarned: true,
      earnedAt: '2024-01-18T08:30:00Z'
    },
    {
      id: '2',
      name: 'Night Owl',
      description: 'Complete tasks after 10 PM for 5 consecutive days',
      icon: '🦉',
      color: 'bg-purple-500',
      isEarned: false
    },
    {
      id: '3',
      name: 'Weekend Warrior',
      description: 'Complete tasks on 4 consecutive weekends',
      icon: '🏋️',
      color: 'bg-green-500',
      isEarned: true,
      earnedAt: '2024-01-28T16:20:00Z'
    },
    {
      id: '4',
      name: 'Quality Focus',
      description: 'Complete 20 tasks with 100% accuracy',
      icon: '🎯',
      color: 'bg-blue-500',
      isEarned: false
    }
  ]

  const leaderboardData = [
    { rank: 1, name: 'John Doe', points: 1250, level: 8, avatar: 'JD' },
    { rank: 2, name: 'Jane Smith', points: 980, level: 6, avatar: 'JS' },
    { rank: 3, name: 'Mike Johnson', points: 1450, level: 9, avatar: 'MJ' },
    { rank: 4, name: 'Sarah Wilson', points: 720, level: 5, avatar: 'SW' },
    { rank: 5, name: 'Alex Brown', points: 890, level: 7, avatar: 'AB' }
  ]

  const userStats = {
    totalPoints: 1250,
    level: 8,
    experience: 750,
    nextLevelExp: 1000,
    achievementsUnlocked: 3,
    totalAchievements: 6,
    currentStreak: 5,
    longestStreak: 12,
    tasksCompleted: 52,
    rank: 1
  }

  const rarityColors = {
    common: 'bg-gray-500',
    rare: 'bg-blue-500',
    epic: 'bg-purple-500',
    legendary: 'bg-yellow-500'
  }

  const categoryIcons = {
    productivity: <Target className="w-5 h-5" />,
    streak: <Flame className="w-5 h-5" />,
    milestone: <Trophy className="w-5 h-5" />,
    social: <Users className="w-5 h-5" />,
    special: <Star className="w-5 h-5" />
  }

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-effect rounded-xl p-6 cursor-pointer transition-all duration-200 ${
        achievement.isUnlocked 
          ? 'hover:shadow-lg hover:-translate-y-1' 
          : 'opacity-60 hover:opacity-80'
      }`}
      onClick={() => setSelectedAchievement(achievement)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
            achievement.isUnlocked ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}>
            {achievement.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{achievement.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full text-white ${rarityColors[achievement.rarity]}`}>
            {achievement.rarity}
          </span>
          {achievement.isUnlocked && <CheckCircle className="w-5 h-5 text-green-500" />}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {categoryIcons[achievement.category]}
          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
            {achievement.category}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">{achievement.points}</span>
        </div>
      </div>

      {achievement.progress !== undefined && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {achievement.progress}/{achievement.maxProgress}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(achievement.progress / achievement.maxProgress!) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {achievement.isUnlocked && achievement.unlockedAt && (
        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}</span>
        </div>
      )}
    </motion.div>
  )

  const BadgeCard = ({ badge }: { badge: Badge }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-effect rounded-xl p-6 text-center transition-all duration-200 ${
        badge.isEarned 
          ? 'hover:shadow-lg hover:-translate-y-1' 
          : 'opacity-60 hover:opacity-80'
      }`}
    >
      <div className={`w-16 h-16 ${badge.color} rounded-full flex items-center justify-center text-2xl mx-auto mb-4`}>
        {badge.icon}
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{badge.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{badge.description}</p>
      {badge.isEarned && badge.earnedAt && (
        <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>Earned {new Date(badge.earnedAt).toLocaleDateString()}</span>
        </div>
      )}
    </motion.div>
  )

  const Modal = ({ isOpen, onClose, title, children }: {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
  }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          {children}
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Achievements & Gamification
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your progress and unlock achievements
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => toast.success('Sharing your achievements...')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button
            onClick={() => toast.success('Downloading achievement certificate...')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Points</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.totalPoints}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Level</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.level}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {userStats.experience}/{userStats.nextLevelExp}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                style={{ width: `${(userStats.experience / userStats.nextLevelExp) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.currentStreak} days</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rank</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">#{userStats.rank}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-effect rounded-xl p-4">
        <div className="flex space-x-4">
          {[
            { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
            { id: 'badges', label: 'Badges', icon: <Medal className="w-4 h-4" /> },
            { id: 'leaderboard', label: 'Leaderboard', icon: <TrendingUp className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Top Performers</h2>
            <div className="space-y-4">
              {leaderboardData.map((user, index) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {user.rank === 1 && <Crown className="w-5 h-5 text-yellow-500" />}
                      {user.rank === 2 && <Medal className="w-5 h-5 text-gray-400" />}
                      {user.rank === 3 && <Award className="w-5 h-5 text-orange-500" />}
                      <span className="text-lg font-bold text-gray-900 dark:text-white">#{user.rank}</span>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Level {user.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold text-gray-900 dark:text-white">{user.points}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievement Detail Modal */}
      <Modal
        isOpen={!!selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
        title={selectedAchievement ? selectedAchievement.title : ''}
      >
        {selectedAchievement && (
          <div className="space-y-4">
            <div className="text-center">
              <div className={`w-20 h-20 rounded-lg flex items-center justify-center text-4xl mx-auto mb-4 ${
                selectedAchievement.isUnlocked ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                {selectedAchievement.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {selectedAchievement.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {selectedAchievement.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedAchievement.points}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Points</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 capitalize">
                  {selectedAchievement.rarity}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Rarity</p>
              </div>
            </div>

            {selectedAchievement.progress !== undefined && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Progress</h4>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completion</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedAchievement.progress}/{selectedAchievement.maxProgress}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(selectedAchievement.progress / selectedAchievement.maxProgress!) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {selectedAchievement.isUnlocked && selectedAchievement.unlockedAt && (
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-green-700 dark:text-green-300 font-medium">Achievement Unlocked!</p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => {
                  toast.success('Sharing achievement...')
                  setSelectedAchievement(null)
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button
                onClick={() => setSelectedAchievement(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}

export default AchievementsPage 