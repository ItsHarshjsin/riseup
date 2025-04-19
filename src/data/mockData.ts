import { format } from 'date-fns';
import { Task } from '@/types';

// Update the mock tasks to include user_id, created_at, and updated_at
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
