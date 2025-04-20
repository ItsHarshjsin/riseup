
import { Task, Category, User, Clan, Badge, Challenge } from '@/types';

// Mock tasks with proper types
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete 3 Pomodoro Sessions',
    description: 'Focus for 3 sessions of 25 minutes each with short breaks',
    category: 'productivity' as Category,
    points: 20,
    completed: false,
    date: new Date(),
    task_date: new Date().toISOString().split('T')[0],
    completed_at: null,
    user_id: 'user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Morning Workout',
    description: '30 minute morning workout routine',
    category: 'fitness' as Category,
    points: 30,
    completed: true,
    date: new Date(),
    task_date: new Date().toISOString().split('T')[0],
    completed_at: new Date().toISOString(),
    user_id: 'user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Read 20 Pages',
    description: 'Read 20 pages from current book',
    category: 'learning' as Category,
    points: 15,
    completed: false,
    date: new Date(),
    task_date: new Date().toISOString().split('T')[0],
    completed_at: null,
    user_id: 'user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    title: '10-Minute Meditation',
    description: 'Mindfulness meditation practice',
    category: 'mindfulness' as Category,
    points: 10,
    completed: true,
    date: new Date(),
    task_date: new Date().toISOString().split('T')[0],
    completed_at: new Date().toISOString(),
    user_id: 'user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Journal Writing',
    description: 'Write in your journal for 15 minutes',
    category: 'creativity' as Category,
    points: 15,
    completed: false,
    date: new Date(),
    task_date: new Date().toISOString().split('T')[0],
    completed_at: null,
    user_id: 'user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock current user data
export const currentUser: User = {
  id: 'user-1',
  username: 'JaneDoe',
  avatar: '/images/avatar1.png',
  level: 5,
  points: 750,
  streak: 12,
  badges: [],
  completedTasks: [],
  createdAt: new Date()
};

// Mock users for leaderboard
export const users: User[] = [
  {
    id: 'user-1',
    username: 'JaneDoe',
    avatar: '/images/avatar1.png',
    level: 5,
    points: 750,
    streak: 12,
    badges: [],
    completedTasks: [],
    createdAt: new Date()
  },
  {
    id: 'user-2',
    username: 'JohnSmith',
    avatar: '/images/avatar2.png',
    level: 7,
    points: 950,
    streak: 21,
    badges: [],
    completedTasks: [],
    createdAt: new Date()
  },
  {
    id: 'user-3',
    username: 'SarahJones',
    avatar: '/images/avatar3.png',
    level: 4,
    points: 500,
    streak: 8,
    badges: [],
    completedTasks: [],
    createdAt: new Date()
  }
];

// Mock badges
export const badges: Badge[] = [
  {
    id: 'badge-1',
    name: 'Fitness Enthusiast',
    description: 'Complete 10 fitness tasks',
    icon: '🏃',
    category: 'fitness' as Category,
    unlockedAt: new Date()
  },
  {
    id: 'badge-2',
    name: 'Productivity Master',
    description: 'Complete 20 productivity tasks',
    icon: '⚡',
    category: 'productivity' as Category,
    unlockedAt: new Date()
  }
];

// Mock current clan
export const currentClan: Clan = {
  id: 'clan-1',
  name: 'Productivity Pirates',
  description: 'A clan focused on maximizing productivity and getting things done',
  members: users,
  challenges: [],
  points: 2500,
  createdAt: new Date()
};

// Mock clans for leaderboard
export const clans: Clan[] = [
  {
    id: 'clan-1',
    name: 'Productivity Pirates',
    description: 'A clan focused on maximizing productivity and getting things done',
    members: users.slice(0, 2),
    challenges: [],
    points: 2500,
    createdAt: new Date()
  },
  {
    id: 'clan-2',
    name: 'Fitness Warriors',
    description: 'A clan dedicated to fitness and health goals',
    members: users.slice(1, 3),
    challenges: [],
    points: 2200,
    createdAt: new Date()
  }
];

// Daily task templates that can be assigned as challenges
export const dailyTaskTemplates = [
  {
    id: 'template-1',
    title: 'Morning Workout',
    description: '30-minute workout routine to start your day',
    category: 'fitness' as Category,
    points: 30
  },
  {
    id: 'template-2',
    title: 'Meditation Session',
    description: '15 minutes of mindfulness meditation',
    category: 'mindfulness' as Category,
    points: 20
  },
  {
    id: 'template-3',
    title: 'Read a Book',
    description: 'Read for 30 minutes',
    category: 'learning' as Category,
    points: 25
  }
];
