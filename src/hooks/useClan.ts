import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Clan, User, Challenge } from '@/types';

// Database types
type DBClanInvite = {
  id: string;
  clan_id: string;
  invited_email: string;
  invite_code: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  expires_at: string;
};

type DBPendingInvite = {
  id: string;
  clan_id: string;
  invite_code: string;
  created_at: string;
  clans: {
    name: string;
    description: string | null;
    points: number;
  };
};

// Helper function to format the date for Supabase
const formatDateForSupabase = (date: Date): string => {
  return date.toISOString();
};

// Helper function to generate invite code
const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 10);
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
          clan_id, role, user_id, 
          profiles:user_id(id, username, avatar, level, points, streak, created_at)
        `)
        .eq('clan_id', membership.clan_id);
        
      if (membersError) throw membersError;
      
      const members = membersData
        .filter(member => member.profiles)
        .map(member => {
          const profile = member.profiles as any;
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
  
  // Check if user has a clan
  const hasClan = !!userClan;
  
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
    mutationFn: async (challenge: {
      title: string;
      description: string;
      category: string;
      points: number;
      deadline: Date | null;
      participants: string[];
    }) => {
      if (!user?.id || !userClan?.id) throw new Error('User not authenticated or no clan');
      
      setLoading(true);
      
      try {
        // Format the challenge for Supabase
        const formattedChallenge = {
          clan_id: userClan.id,
          title: challenge.title,
          description: challenge.description,
          category: challenge.category,
          points: challenge.points,
          created_by: user.id,
          deadline: challenge.deadline ? formatDateForSupabase(challenge.deadline) : null
        };
        
        // Insert the challenge
        const { data, error } = await supabase
          .from('clan_challenges')
          .insert(formattedChallenge)
          .select();
          
        if (error) throw error;
        
        // Add participants if any
        if (challenge.participants && challenge.participants.length > 0 && data && data[0]) {
          const participantsData = challenge.participants.map(userId => ({
            challenge_id: data[0].id,
            user_id: userId,
            completed: false
          }));
          
          const { error: partError } = await supabase
            .from('clan_challenge_participants')
            .insert(participantsData);
            
          if (partError) throw partError;
        }
        
        return data;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clan-challenges'] });
      toast({ 
        title: 'Challenge created',
        description: 'The challenge has been created successfully.' 
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error creating challenge',
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
  
  // Invite user to clan
  const inviteUser = useMutation({
    mutationFn: async (email: string) => {
      if (!user?.id || !userClan?.id) throw new Error('User not authenticated or no clan');
      
      setLoading(true);
      
      try {
        // Check if user is already a member
        const { data: existingMember, error: memberError } = await supabase
          .from('clan_members')
          .select('user_id')
          .eq('clan_id', userClan.id)
          .eq('user_id', (
            await supabase
              .from('profiles')
              .select('id')
              .eq('email', email)
              .single()
          ).data?.id || '')
          .single();
          
        if (existingMember) {
          throw new Error('User is already a member of this clan');
        }
        
        // Check for existing pending invite
        const { data: existingInvite, error: inviteError } = await supabase
          .from('clan_invites')
          .select('id')
          .eq('clan_id', userClan.id)
          .eq('invited_email', email)
          .eq('status', 'pending')
          .single();
          
        if (existingInvite) {
          throw new Error('User already has a pending invite to this clan');
        }
        
        // Create invite
        const { error } = await supabase
          .from('clan_invites')
          .insert({
            clan_id: userClan.id,
            invited_email: email,
            invite_code: generateInviteCode(),
            status: 'pending',
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
          } satisfies Partial<DBClanInvite>);
          
        if (error) throw error;
        
        return true;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      toast({ 
        title: 'Invitation sent',
        description: 'The user has been invited to join your clan.' 
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error sending invitation',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Accept clan invite
  const acceptInvite = useMutation({
    mutationFn: async (inviteId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      setLoading(true);
      
      try {
        // Get the invite
        const { data: invite, error: inviteError } = await supabase
          .from('clan_invites')
          .select('*')
          .eq('id', inviteId)
          .eq('invited_email', user.email)
          .eq('status', 'pending')
          .single();
          
        if (inviteError || !invite) {
          throw new Error('Invalid or expired invite');
        }
        
        // Accept the invite
        const { error: transactionError } = await supabase
          .from('clan_invites')
          .update({ status: 'accepted' })
          .eq('id', inviteId)
          .select()
          .single();
        
        if (transactionError) throw transactionError;
        
        // Add user to clan
        const { error: memberError } = await supabase
          .from('clan_members')
          .insert({
            clan_id: invite.clan_id,
            user_id: user.id,
            role: 'member'
          });
          
        if (memberError) throw memberError;
        
        // Reject other pending invites
        await supabase
          .from('clan_invites')
          .update({ status: 'rejected' })
          .eq('invited_email', user.email)
          .eq('status', 'pending')
          .neq('id', inviteId);
        
        return true;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-clan'] });
      toast({ 
        title: 'Invite accepted',
        description: 'You have joined the clan successfully.' 
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error accepting invite',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Get pending invites
  const { data: pendingInvites = [], isLoading: isLoadingInvites } = useQuery<DBPendingInvite[]>({
    queryKey: ['pending-invites', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      
      const { data, error } = await supabase
        .from('clan_invites')
        .select(`
          id,
          clan_id,
          invite_code,
          created_at,
          clans (
            name,
            description,
            points
          )
        `)
        .eq('invited_email', user.email)
        .eq('status', 'pending')
        .lt('expires_at', new Date().toISOString());
        
      if (error) throw error;
      
      return data || [];
    },
    enabled: !!user?.email
  });
  
  // Return all functions and data
  return {
    userClan,
    clanChallenges,
    isLoadingClan,
    isLoadingChallenges,
    isLoadingMembers: isLoadingClan, // Use clan loading state for members too
    loading,
    hasClan,
    isCreating: loading,
    createClan,
    createChallenge: createChallenges,
    joinChallenge,
    completeChallenge,
    inviteUser,
    acceptInvite,
    pendingInvites,
    clanMembers: userClan?.members || []
  };
};
