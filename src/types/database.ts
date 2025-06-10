export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string;
          avatar: string | null;
          level: number;
          points: number;
          streak: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          username: string;
          avatar?: string | null;
          level?: number;
          points?: number;
          streak?: number;
          created_at?: string;
        };
        Update: {
          email?: string;
          username?: string;
          avatar?: string | null;
          level?: number;
          points?: number;
          streak?: number;
        };
      };
      clans: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          owner_id: string;
          points: number;
          invite_code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          owner_id: string;
          points?: number;
          invite_code: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          owner_id?: string;
          points?: number;
          invite_code?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      clan_members: {
        Row: {
          clan_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member';
          joined_at: string;
        };
        Insert: {
          clan_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member';
          joined_at?: string;
        };
        Update: {
          role?: 'owner' | 'admin' | 'member';
          joined_at?: string;
        };
      };
      clan_challenges: {
        Row: {
          id: string;
          clan_id: string;
          title: string;
          description: string | null;
          category: string;
          points: number;
          deadline: string | null;
          completed: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clan_id: string;
          title: string;
          description?: string;
          category: string;
          points: number;
          deadline?: string | null;
          completed?: boolean;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          category?: string;
          points?: number;
          deadline?: string | null;
          completed?: boolean;
          updated_at?: string;
        };
      };
      clan_challenge_participants: {
        Row: {
          challenge_id: string;
          user_id: string;
          completed: boolean;
          completed_at: string | null;
        };
        Insert: {
          challenge_id: string;
          user_id: string;
          completed?: boolean;
          completed_at?: string | null;
        };
        Update: {
          completed?: boolean;
          completed_at?: string | null;
        };
      };
      clan_invites: {
        Row: {
          id: string;
          clan_id: string;
          invited_email: string;
          invite_code: string;
          status: 'pending' | 'accepted' | 'rejected';
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          clan_id: string;
          invited_email: string;
          invite_code: string;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
          expires_at?: string;
        };
        Update: {
          status?: 'pending' | 'accepted' | 'rejected';
          expires_at?: string;
        };
      };
    };
    Functions: {
      accept_clan_invite: {
        Args: {
          p_invite_id: string;
          p_user_id: string;
        };
        Returns: void;
      };
      get_profile_id_by_email: {
        Args: {
          email_param: string;
        };
        Returns: { id: string } | null;
      };
    };
  };
}; 