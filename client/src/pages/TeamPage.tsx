import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Star, 
  Trophy,
  UserPlus,
  MoreVertical,
  Phone,
  Video,
  Share2,
  Filter,
  Crown
} from 'lucide-react'
import toast from 'react-hot-toast'

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  status: 'online' | 'offline' | 'away'
  tasksCompleted: number
  points: number
  level: number
  joinDate: string
  skills: string[]
  isAdmin: boolean
}

const TeamPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'Member',
    message: ''
  })

  // Sample team data
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@taskflow.com',
      role: 'Project Manager',
      avatar: 'JD',
      status: 'online',
      tasksCompleted: 45,
      points: 1250,
      level: 8,
      joinDate: '2024-01-15',
      skills: ['Project Management', 'Agile', 'Leadership'],
      isAdmin: true
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@taskflow.com',
      role: 'Designer',
      avatar: 'JS',
      status: 'online',
      tasksCompleted: 38,
      points: 980,
      level: 6,
      joinDate: '2024-01-20',
      skills: ['UI/UX Design', 'Figma', 'Prototyping'],
      isAdmin: false
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@taskflow.com',
      role: 'Developer',
      avatar: 'MJ',
      status: 'away',
      tasksCompleted: 52,
      points: 1450,
      level: 9,
      joinDate: '2024-01-10',
      skills: ['React', 'Node.js', 'TypeScript'],
      isAdmin: false
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah@taskflow.com',
      role: 'QA Engineer',
      avatar: 'SW',
      status: 'offline',
      tasksCompleted: 29,
      points: 720,
      level: 5,
      joinDate: '2024-02-01',
      skills: ['Testing', 'Automation', 'Quality Assurance'],
      isAdmin: false
    }
  ]

  const roles = ['all', 'Project Manager', 'Designer', 'Developer', 'QA Engineer', 'Member']
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500'
  }

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || member.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleInviteMember = () => {
    if (!inviteData.email) {
      toast.error('Email is required')
      return
    }
    
    // Simulate API call
    toast.success(`Invitation sent to ${inviteData.email}`)
    setInviteData({ email: '', role: 'Member', message: '' })
    setShowInviteModal(false)
  }

  const handleContactMember = (member: TeamMember, method: 'email' | 'call' | 'video') => {
    switch (method) {
      case 'email':
        window.open(`mailto:${member.email}`)
        break
      case 'call':
        toast.success(`Calling ${member.name}...`)
        break
      case 'video':
        toast.success(`Starting video call with ${member.name}...`)
        break
    }
  }

  const TeamMemberCard = ({ member }: { member: TeamMember }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl p-6 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {member.avatar}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColors[member.status]} rounded-full border-2 border-white`}></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <span>{member.name}</span>
              {member.isAdmin && <Crown className="w-4 h-4 text-yellow-500" />}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{member.tasksCompleted}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Tasks Completed</p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{member.points}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Points</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Level {member.level}</span>
          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              style={{ width: `${(member.level / 10) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</h4>
        <div className="flex flex-wrap gap-1">
          {member.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
          {member.skills.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{member.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleContactMember(member, 'email')}
            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
          >
            <Mail className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => handleContactMember(member, 'call')}
            className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4 text-green-600" />
          </button>
          <button
            onClick={() => handleContactMember(member, 'video')}
            className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg transition-colors"
          >
            <Video className="w-4 h-4 text-purple-600" />
          </button>
        </div>
        <button
          onClick={() => setSelectedMember(member)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          View Profile
        </button>
      </div>
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
            Team
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your team members and collaborate effectively
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{teamMembers.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Online Now</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {teamMembers.filter(m => m.status === 'online').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {teamMembers.reduce((sum, member) => sum + member.tasksCompleted, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Points</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {teamMembers.reduce((sum, member) => sum + member.points, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-effect rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {roles.map(role => (
              <option key={role} value={role}>
                {role === 'all' ? 'All Roles' : role}
              </option>
            ))}
          </select>

          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center">
            {filteredMembers.length} members
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>

      {/* Invite Member Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Team Member"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={inviteData.email}
              onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="colleague@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role
            </label>
            <select
              value={inviteData.role}
              onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="Member">Member</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Designer">Designer</option>
              <option value="Developer">Developer</option>
              <option value="QA Engineer">QA Engineer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Personal Message (Optional)
            </label>
            <textarea
              value={inviteData.message}
              onChange={(e) => setInviteData({ ...inviteData, message: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Hey! I'd love for you to join our team..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowInviteModal(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleInviteMember}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              Send Invitation
            </button>
          </div>
        </div>
      </Modal>

      {/* Member Profile Modal */}
      <Modal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title={selectedMember ? `${selectedMember.name}'s Profile` : ''}
      >
        {selectedMember && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl mx-auto mb-4">
                {selectedMember.avatar}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedMember.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{selectedMember.role}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedMember.tasksCompleted}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Tasks Completed</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{selectedMember.points}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Points</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selectedMember.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => handleContactMember(selectedMember, 'email')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </button>
              <button
                onClick={() => handleContactMember(selectedMember, 'video')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Video className="w-4 h-4" />
                <span>Video Call</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}

export default TeamPage 