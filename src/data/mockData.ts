
import { format } from 'date-fns';
import { Task, User, Clan, Category, Challenge, Badge } from '@/types';

// Update the mock tasks to include user_id, created_at, updated_at, task_date and completed_at
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Morning Meditation',
    description: 'Practice mindfulness for 15 minutes',
    category: 'mindfulness',
    points: 10,
    completed: true,
    date: new Date(),
    user_id: 'mock-user-1',
    created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    updated_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    task_date: format(new Date(), 'yyyy-MM-dd'),
    completed_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  },
  {
    id: '2',
    title: 'Read a Book',
    description: 'Read 30 pages of your current book',
    category: 'learning',
    points: 15,
    completed: false,
    date: new Date(),
    user_id: 'mock-user-1',
    created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    updated_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    task_date: format(new Date(), 'yyyy-MM-dd'),
    completed_at: null
  },
  {
    id: '3',
    title: 'Workout Session',
    description: 'Complete a 30-minute workout routine',
    category: 'fitness',
    points: 20,
    completed: false,
    date: new Date(),
    user_id: 'mock-user-1',
    created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    updated_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    task_date: format(new Date(), 'yyyy-MM-dd'),
    completed_at: null
  },
  {
    id: '4',
    title: 'Plan Your Day',
    description: 'Set goals and priorities for the day',
    category: 'productivity',
    points: 10,
    completed: true,
    date: new Date(),
    user_id: 'mock-user-1',
    created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    updated_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    task_date: format(new Date(), 'yyyy-MM-dd'),
    completed_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  },
  {
    id: '5',
    title: 'Learn a New Skill',
    description: 'Spend 20 minutes learning something new',
    category: 'learning',
    points: 15,
    completed: false,
    date: new Date(),
    user_id: 'mock-user-1',
    created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    updated_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    task_date: format(new Date(), 'yyyy-MM-dd'),
    completed_at: null
  },
  {
    id: '6',
    title: 'Connect with a Friend',
    description: 'Reach out to a friend you haven\'t spoken to in a while',
    category: 'social',
    points: 10,
    completed: false,
    date: new Date(),
    user_id: 'mock-user-1',
    created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    updated_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    task_date: format(new Date(), 'yyyy-MM-dd'),
    completed_at: null
  },
  {
    id: '7',
    title: 'Creative Project',
    description: 'Work on a creative project for 30 minutes',
    category: 'creativity',
    points: 15,
    completed: true,
    date: new Date(),
    user_id: 'mock-user-1',
    created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    updated_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    task_date: format(new Date(), 'yyyy-MM-dd'),
    completed_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  },
  {
    id: '8',
    title: 'Gratitude Journal',
    description: 'Write down three things you\'re grateful for',
    category: 'mindfulness',
    points: 10,
    completed: false,
    date: new Date(),
    user_id: 'mock-user-1',
    created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    updated_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    task_date: format(new Date(), 'yyyy-MM-dd'),
    completed_at: null
  }
].map(task => ({
  ...task,
  task_date: task.task_date || format(new Date(), 'yyyy-MM-dd'),
  completed_at: task.completed ? task.completed_at : null
}));

// Mock badges data
const mockBadges: Badge[] = [
  {
    id: 'badge1',
    name: 'Early Bird',
    description: 'Complete 5 tasks before 9 AM',
    icon: 'award',
    category: 'productivity',
    unlockedAt: new Date()
  },
  {
    id: 'badge2',
    name: 'Streak Master',
    description: 'Maintain a 7-day streak',
    icon: 'flame',
    category: 'productivity',
    unlockedAt: new Date()
  },
  {
    id: 'badge3',
    name: 'Fitness Enthusiast',
    description: 'Complete 10 fitness tasks',
    icon: 'dumbbell',
    category: 'fitness',
    unlockedAt: new Date()
  }
];

// Create mock users
export const currentUser: User = {
  id: 'mock-user-1',
  username: 'John Doe',
  avatar: '/images/avatar1.png',
  level: 5,
  points: 2500,
  streak: 7,
  badges: mockBadges,
  completedTasks: mockTasks.filter(task => task.completed),
  createdAt: new Date()
};

export const users: User[] = [
  currentUser,
  {
    id: 'mock-user-2',
    username: 'Jane Smith',
    avatar: '/images/avatar2.png',
    level: 7,
    points: 3200,
    streak: 12,
    badges: mockBadges.slice(0, 2),
    completedTasks: [],
    createdAt: new Date()
  },
  {
    id: 'mock-user-3',
    username: 'Alex Johnson',
    avatar: '/images/avatar3.png',
    level: 3,
    points: 1500,
    streak: 3,
    badges: mockBadges.slice(0, 1),
    completedTasks: [],
    createdAt: new Date()
  }
];

// Mock challenge
const mockChallenges: Challenge[] = [
  {
    id: 'challenge1',
    title: 'Morning Routine Challenge',
    description: 'Complete your morning routine tasks every day for a week',
    createdBy: currentUser.id,
    assignedTo: [currentUser.id, 'mock-user-2'],
    category: 'productivity',
    points: 100,
    deadline: new Date(new Date().setDate(new Date().getDate() + 7)),
    completed: false
  },
  {
    id: 'challenge2',
    title: 'Fitness Week',
    description: 'Complete at least 5 fitness tasks this week',
    createdBy: currentUser.id,
    assignedTo: [currentUser.id, 'mock-user-2', 'mock-user-3'],
    category: 'fitness',
    points: 150,
    deadline: new Date(new Date().setDate(new Date().getDate() + 7)),
    completed: false
  }
];

// Create mock clan
export const currentClan: Clan = {
  id: 'clan1',
  name: 'Productivity Warriors',
  description: 'A clan focused on boosting productivity and mindfulness',
  members: users,
  challenges: mockChallenges,
  points: 5000,
  createdAt: new Date()
};

export const clans: Clan[] = [
  currentClan,
  {
    id: 'clan2',
    name: 'Fitness Legends',
    description: 'Dedicated to fitness and health goals',
    members: users.slice(1),
    challenges: mockChallenges.slice(1),
    points: 3500,
    createdAt: new Date()
  },
  {
    id: 'clan3',
    name: 'Learning Enthusiasts',
    description: 'Focus on continuous learning and skill development',
    members: [users[2]],
    challenges: [],
    points: 2000,
    createdAt: new Date()
  }
];

// Task templates by category
export const dailyTaskTemplates: Record<Category, Task[]> = {
  productivity: [
    {
      id: 'prod1',
      title: 'Plan Your Day',
      description: 'Spend 10 minutes planning your day',
      category: 'productivity',
      points: 10,
      completed: false,
      date: new Date(),
      user_id: '',
      created_at: '',
      updated_at: '',
      task_date: '',
      completed_at: null
    },
    {
      id: 'prod2',
      title: 'Inbox Zero',
      description: 'Clear your email inbox',
      category: 'productivity',
      points: 15,
      completed: false,
      date: new Date(),
      user_id: '',
      created_at: '',
      updated_at: '',
      task_date: '',
      completed_at: null
    }
  ],
  fitness: [
    {
      id: 'fit1',
      title: '30-Minute Workout',
      description: 'Complete a 30-minute workout session',
      category: 'fitness',
      points: 20,
      completed: false,
      date: new Date(),
      user_id: '',
      created_at: '',
      updated_at: '',
      task_date: '',
      completed_at: null
    },
    {
      id: 'fit2',
      title: '10,000 Steps',
      description: 'Walk 10,000 steps today',
      category: 'fitness',
      points: 15,
      completed: false,
      date: new Date(),
      user_id: '',
      created_at: '',
      updated_at: '',
      task_date: '',
      completed_at: null
    }
  ],
  learning: [
    {
      id: 'learn1',
      title: 'Read for 30 Minutes',
      description: 'Read a book for at least 30 minutes',
      category: 'learning',
      points: 15,
      completed: false,
      date: new Date(),
      user_id: '',
      created_at: '',
      updated_at: '',
      task_date: '',
      completed_at: null
    },
    {
      id: 'learn2',
      title: 'Learn Something New',
      description: 'Spend time learning a new skill or concept',
      category: 'learning',
      points: 20,
      completed: false,
      date: new Date(),
      user_id: '',
      created_at: '',
      updated_at: '',
      task_date: '',
      completed_at: null
    }
  ],
  mindfulness: [
    {
      id: 'mind1',
      title: 'Meditation Session',
      description: 'Meditate for 10 minutes',
      category: 'mindfulness',
      points: 15,
      completed: false,
      date: new Date(),
      user_id: '',
      created_at: '',
      updated_at: '',
      task_date: '',
      completed_at: null
    },
    {
      id: 'mind2',
      title: 'Gratitude Journal',
      description: 'Write down 3 things you are grateful for',
      category: 'mindfulness',
      points: 10,
      completed: false,
      date: new Date(),
      user_id: '',
      created_at: '',
      updated_at: '',
      task_date: '',
      completed_at: null
    }
  ],
  creativity: [
    {
      id: 'create1',
      title: 'Creative Session',
      description: 'Spend 30 minutes on a creative project',
      category: 'creativity',
      points: 15,
      completed: false,
      date: new Date(),
      user_id: '',
      created_at: '',
      updated_at: '',
      task_date: '',
      completed_at: null
    },
    {
      id: 'create2',
      title: 'Journal Writing',
      description: 'Write a journal entry about your day',
      category: 'creativity',
      points: 10,
      completed: false,
      date: new Date(),
      user_id: '',
      created_at: '',
      updated_at: '',
      task_date: '',
      completed_at: null
    }
  ],
  social: [
    {
      id: 'social1',
      title: 'Connect with a Friend',
      description: 'Reach out to a friend you haven\'t talked to in a while',
      category: 'social',
      points: 10,
      completed: false,
      date: new Date(),
      user_id: '',
      created_at: '',
      updated_at: '',
      task_date: '',
      completed_at: null
    },
    {
      id: 'social2',
      title: 'Family Time',
      description: 'Spend quality time with family members',
      category: 'social',
      points: 15,
      completed: false,
      date: new Date(),
      user_id: '',
      created_at: '',
      updated_at: '',
      task_date: '',
      completed_at: null
    }
  ]
};
