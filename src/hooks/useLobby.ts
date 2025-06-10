import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  username: string;
  avatar: string | null;
  status: 'online' | 'offline' | 'in_challenge';
  last_active: string;
};

type Challenge = {
  id: string;
  challenger_id: string;
  challenged_id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  deadline: string | null;
  created_at: string;
};

export const useLobby = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Get all online users in the lobby
  const { data: onlineUsers = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['online-users'],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar, status, last_active')
        .neq('id', user.id) // Exclude current user
        .order('last_active', { ascending: false });

      if (error) throw error;
      return data as User[];
    },
    enabled: !!user?.id,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Get user's active challenges
  const { data: userChallenges = [], isLoading: isLoadingChallenges } = useQuery({
    queryKey: ['user-challenges', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_challenges')
        .select(`
          *,
          challenger:profiles!challenger_id(username, avatar),
          challenged:profiles!challenged_id(username, avatar)
        `)
        .or(`challenger_id.eq.${user.id},challenged_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Challenge[];
    },
    enabled: !!user?.id
  });

  // Create a challenge
  const createChallenge = useMutation({
    mutationFn: async ({
      challengedId,
      title,
      description,
      category,
      points,
      deadline
    }: {
      challengedId: string;
      title: string;
      description: string;
      category: string;
      points: number;
      deadline?: Date;
    }) => {
      if (!user?.id) throw new Error('Must be logged in to create a challenge');

      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('user_challenges')
          .insert({
            challenger_id: user.id,
            challenged_id: challengedId,
            title,
            description,
            category,
            points,
            status: 'pending',
            deadline: deadline?.toISOString() || null
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-challenges'] });
      toast({
        title: 'Challenge sent!',
        description: 'Your challenge has been sent successfully.'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create challenge',
        variant: 'destructive'
      });
    }
  });

  // Respond to challenge (accept/reject)
  const respondToChallenge = useMutation({
    mutationFn: async ({ challengeId, accept }: { challengeId: string; accept: boolean }) => {
      if (!user?.id) throw new Error('Must be logged in to respond to challenge');

      const { data, error } = await supabase
        .from('user_challenges')
        .update({
          status: accept ? 'accepted' : 'rejected'
        })
        .eq('id', challengeId)
        .eq('challenged_id', user.id) // Ensure only the challenged user can respond
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-challenges'] });
      toast({
        title: variables.accept ? 'Challenge accepted!' : 'Challenge rejected',
        description: variables.accept
          ? 'You have accepted the challenge. Good luck!'
          : 'You have rejected the challenge.'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to respond to challenge',
        variant: 'destructive'
      });
    }
  });

  // Complete a challenge
  const completeChallenge = useMutation({
    mutationFn: async (challengeId: string) => {
      if (!user?.id) throw new Error('Must be logged in to complete challenge');

      const { data, error } = await supabase
        .from('user_challenges')
        .update({
          status: 'completed'
        })
        .eq('id', challengeId)
        .or(`challenger_id.eq.${user.id},challenged_id.eq.${user.id}`)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-challenges'] });
      toast({
        title: 'Challenge completed!',
        description: 'Congratulations on completing the challenge!'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete challenge',
        variant: 'destructive'
      });
    }
  });

  // Update user status
  const updateStatus = useMutation({
    mutationFn: async (status: User['status']) => {
      if (!user?.id) throw new Error('Must be logged in to update status');

      const { error } = await supabase
        .from('profiles')
        .update({
          status,
          last_active: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
    }
  });

  return {
    onlineUsers,
    userChallenges,
    isLoading: loading || isLoadingUsers || isLoadingChallenges,
    createChallenge,
    respondToChallenge,
    completeChallenge,
    updateStatus
  };
}; 