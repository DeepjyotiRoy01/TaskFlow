import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Notification {
  id: string
  type: 'task' | 'achievement' | 'team' | 'system'
  title: string
  message: string
  timestamp: Date
  read: boolean
  data?: any
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
  getRecentTasks: () => Notification[]
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('taskflow-notifications')
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications)
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })))
      } catch (error) {
        console.error('Error loading notifications:', error)
      }
    } else {
      // Add sample notifications for demonstration
      const sampleNotifications: Notification[] = [
        {
          id: '1',
          type: 'task',
          title: 'Task Completed',
          message: 'Task "Review project proposal" has been completed.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          read: false,
          data: { taskId: '1', taskTitle: 'Review project proposal', newStatus: 'done' }
        },
        {
          id: '2',
          type: 'achievement',
          title: 'Achievement Unlocked',
          message: 'You earned the "First Task" achievement!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          read: false,
          data: { achievementId: 'first-task', achievementName: 'First Task' }
        },
        {
          id: '3',
          type: 'team',
          title: 'Team Member Joined',
          message: 'Jane Smith has joined your team.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          read: true,
          data: { memberId: 'jane-smith', memberName: 'Jane Smith' }
        }
      ]
      setNotifications(sampleNotifications)
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('taskflow-notifications', JSON.stringify(notifications))
  }, [notifications])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]) // Keep only 50 most recent
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const getRecentTasks = () => {
    return notifications
      .filter(notification => notification.type === 'task')
      .slice(0, 5) // Get 5 most recent tasks
  }

  const unreadCount = notifications.filter(notification => !notification.read).length

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    getRecentTasks
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
} 