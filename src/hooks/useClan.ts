
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Clan, User, Challenge } from '@/types';

// Helper function to format the date for Supabase
const formatDateForSupabase = (date: Date): string => {
  return date.toISOString();
};

export const useClan = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  
  // Fetch user's clan
  const { data: userClan, isLoading: isLoadingClan } = useQuery({
    queryKey: ['user-clan', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      // Get user's clan membership
      const { data: membership, error: membershipError } = await supabase
        .from('clan_members')
        .select('clan_id, role')
        .eq('user_id', user.id)
        .single();
        
      if (membershipError && membershipError.code !== 'PGRST116') {
        throw membershipError;
      }
      
      if (!membership) return null;
      
      // Get clan details
      const { data: clan, error: clanError } = await supabase
        .from('clans')
        .select('*')
        .eq('id', membership.clan_id)
        .single();
        
      if (clanError) throw clanError;
      
      // Get clan members
      const { data: membersData, error: membersError } = await supabase
        .from('clan_members')
        .select(`
          *,
          profiles:user_id(*)
        `)
        .eq('clan_id', membership.clan_id);
        
      if (membersError) throw membersError;
      
      const members = membersData.map(member => {
        const profile = member.profiles;
        return {
          id: profile.id,
          username: profile.username,
          avatar: profile.avatar || "",
          level: profile.level || 1,
          points: profile.points || 0,
          streak: profile.streak || 0,
          badges: [],
          completedTasks: [],
          createdAt: new Date(profile.created_at),
          role: member.role
        } as User;
      });
      
      return {
        id: clan.id,
        name: clan.name,
        description: clan.description || "",
        points: clan.points,
        createdAt: new Date(clan.created_at),
        members,
        challenges: []
      } as Clan;
    },
    enabled: !!user?.id,
  });
  
  // Fetch clan challenges
  const { data: clanChallenges = [], isLoading: isLoadingChallenges } = useQuery({
    queryKey: ['clan-challenges', userClan?.id],
    queryFn: async () => {
      if (!userClan?.id) return [];
      
      const { data, error } = await supabase
        .from('clan_challenges')
        .select('*')
        .eq('clan_id', userClan.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Get the participants for each challenge
      const challengesWithParticipants = await Promise.all(
        data.map(async (challenge) => {
          const { data: participants, error: partError } = await supabase
            .from('clan_challenge_participants')
            .select('user_id, completed')
            .eq('challenge_id', challenge.id);
            
          if (partError) throw partError;
          
          return {
            id: challenge.id,
            title: challenge.title,
            description: challenge.description || "",
            category: challenge.category,
            points: challenge.points,
            deadline: challenge.deadline ? new Date(challenge.deadline) : new Date(),
            completed: challenge.completed,
            createdBy: challenge.created_by,
            assignedTo: participants.map(p => p.user_id),
            completedBy: participants.filter(p => p.completed).map(p => p.user_id)
          } as Challenge;
        })
      );
      
      return challengesWithParticipants;
    },
    enabled: !!userClan?.id,
  });
  
  // Create a new clan
  const createClan = useMutation({
    mutationFn: async ({ name, description }: { name: string, description: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      setLoading(true);
      
      try {
        // Create the clan
        const { data: clan, error: clanError } = await supabase
          .from('clans')
          .insert({
            name,
            description,
            owner_id: user.id
          })
          .select()
          .single();
          
        if (clanError) throw clanError;
        
        // Add the user as a member with the 'owner' role
        const { error: memberError } = await supabase
          .from('clan_members')
          .insert({
            clan_id: clan.id,
            user_id: user.id,
            role: 'owner'
          });
          
        if (memberError) throw memberError;
        
        return clan;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-clan'] });
      toast({ 
        title: 'Clan created',
        description: 'Your clan has been created successfully.' 
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error creating clan',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Create clan challenges
  const createChallenges = useMutation({
    mutationFn: async (challenges: {
      clan_id: string;
      title: string;
      description: string;
      category: string;
      points: number;
      created_by: string;
      deadline: Date;
    }[]) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      setLoading(true);
      
      try {
        // Format the deadline for each challenge
        const formattedChallenges = challenges.map(challenge => ({
          ...challenge,
          deadline: formatDateForSupabase(challenge.deadline)
        }));
        
        // Insert challenges in a batch
        const { data, error } = await supabase
          .from('clan_challenges')
          .insert(formattedChallenges)
          .select();
          
        if (error) throw error;
        
        return data;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clan-challenges'] });
      toast({ 
        title: 'Challenges created',
        description: 'The challenges have been created successfully.' 
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error creating challenges',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Join a challenge
  const joinChallenge = useMutation({
    mutationFn: async (challengeId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('clan_challenge_participants')
        .insert({
          challenge_id: challengeId,
          user_id: user.id
        })
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clan-challenges'] });
      toast({ 
        title: 'Joined challenge',
        description: 'You have joined the challenge successfully.' 
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error joining challenge',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Complete a challenge
  const completeChallenge = useMutation({
    mutationFn: async (challengeId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('clan_challenge_participants')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('challenge_id', challengeId)
        .eq('user_id', user.id)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clan-challenges'] });
      toast({ 
        title: 'Challenge completed',
        description: 'You have completed the challenge successfully.' 
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error completing challenge',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  return {
    userClan,
    clanChallenges,
    isLoadingClan,
    isLoadingChallenges,
    loading,
    createClan,
    createChallenges,
    joinChallenge,
    completeChallenge
  };
};
