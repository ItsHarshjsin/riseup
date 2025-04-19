
export interface User {
  id: string;
  username: string;
  avatar: string;
  level: number;
  points: number;
  streak: number;
  badges: Badge[];
  completedTasks: Task[];
  clanId?: string;
  createdAt: Date;
}

export interface Clan {
  id: string;
  name: string;
  description: string;
  members: User[];
  challenges: Challenge[];
  points: number;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  points: number;
  completed: boolean;
  date: Date;
  task_date?: string;
  completed_at?: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  assignedTo: string[];
  category: Category;
  points: number;
  deadline: Date;
  completed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: Category;
  unlockedAt: Date;
}

export type Category = 
  | 'fitness'
  | 'productivity'
  | 'learning'
  | 'mindfulness'
  | 'creativity'
  | 'social';
