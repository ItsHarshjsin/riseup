import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Clan as ClanType, User, Challenge } from '@/types';
import { Database } from '@/types/database';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

// Define a simpler type for profile queries
type ProfileWithEmail = {
  id: string;
  email: string;
};

// Add these type definitions for database responses
type ProfileResponse = {
  data: Pick<Database['public']['Tables']['profiles']['Row'], 'id'> | null;
  error: any;
};

type ClanResponse = {
  id: string;
  name: string;
  description: string;
  points: number;
  invite_code: string;
  created_at: string;
  updated_at: string;
  members: {
    user_id: string;
    role: 'owner' | 'admin' | 'member';
    user: {
      id: string;
      username: string;
      avatar: string | null;
    };
  }[];
};

// Simplified type definitions
type ClanRow = Database['public']['Tables']['clans']['Row'];
type ClanMemberRow = Database['public']['Tables']['clan_members']['Row'];
type ClanChallengeRow = Database['public']['Tables']['clan_challenges']['Row'];
type ClanChallengeParticipantRow = Database['public']['Tables']['clan_challenge_participants']['Row'];
type ClanInviteRow = Database['public']['Tables']['clan_invites']['Row'];

// Flattened interface for pending invites
interface PendingInvite {
  id: string;
  clan_id: string;
  invite_code: string;
  created_at: string;
  clan_name: string;
  clan_description: string | null;
  clan_points: number;
}

// Add these type definitions near the top with other type definitions
type DbResult<T> = {
  data: T | null;
  error: any;
};

type DbProfile = Database['public']['Tables']['profiles']['Row'];
type DbClan = Database['public']['Tables']['clans']['Row'];

// Helper function to format the date for Supabase
const formatDateForSupabase = (date: Date): string => {
  return date.toISOString();
};

// Helper function to generate invite code
const generateClanInviteCode = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Type-safe database query helper
async function queryProfiles(client: SupabaseClient<Database>, email: string) {
  return client
    .from('profiles')
    .select('id')
    .eq('email', email);
}

type ClanMember = {
  id: string;
  username: string;
  avatar_url?: string;
  role: 'owner' | 'admin' | 'member';
};

type Clan = {
  id: string;
  name: string;
  description: string | null;
  points: number;
  invite_code: string;
  created_at: string;
  updated_at: string;
  members?: ClanMember[];
};

type ProfilesResponse = {
  id: string;
  username: string;
  avatar: string | null;
};

type ClanMemberWithProfile = {
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  profiles: ProfilesResponse;
};

export const useClan = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  
  // Create a new clan
  const createClan = useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      if (!user?.id) throw new Error('Must be logged in to create a clan');
      
      setLoading(true);
      
      try {
        // Create the clan
        const { data: clan, error: clanError } = await supabase
          .from('clans')
          .insert({
            name: name.trim(),
            description: description?.trim(),
            owner_id: user.id,
            points: 0,
            invite_code: 'TEMP' // Will be replaced by trigger
          })
          .select('*')
          .single();

        if (clanError) {
          console.error('Clan creation error:', clanError);
          throw new Error(clanError.message);
        }
        if (!clan) throw new Error('Failed to create clan - no data returned');

        // Add creator as owner
        const { error: memberError } = await supabase
          .from('clan_members')
          .insert({
            clan_id: clan.id,
            user_id: user.id,
            role: 'owner'
          });

        if (memberError) {
          console.error('Member creation error:', memberError);
          // Cleanup if member creation fails
          await supabase.from('clans').delete().eq('id', clan.id);
          throw new Error(memberError.message);
        }

        // Get the updated clan with the generated invite code
        const { data: updatedClan, error: fetchError } = await supabase
          .from('clans')
          .select('*')
          .eq('id', clan.id)
          .single();

        if (fetchError || !updatedClan) {
          throw new Error('Failed to fetch updated clan');
        }

        return updatedClan;
      } catch (error) {
        console.error('Error in createClan:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (clan) => {
      queryClient.invalidateQueries({ queryKey: ['user-clan'] });
      toast({
        title: 'Success!',
        description: `Your clan has been created successfully. Invite code: ${clan.invite_code}`
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error creating clan',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  });
  
  // Join a clan
  const joinClan = useMutation({
    mutationFn: async (inviteCode: string) => {
      if (!user?.id) throw new Error('Must be logged in to join a clan');

      // Find clan by invite code
      const { data: clan, error: clanError } = await supabase
        .from('clans')
        .select()
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

      if (clanError) throw new Error('Invalid invite code');
      if (!clan) throw new Error('Clan not found');

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('clan_members')
        .select()
        .eq('clan_id', clan.id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) throw new Error('Already a member of this clan');

      // Join the clan
      const { error: joinError } = await supabase
        .from('clan_members')
        .insert({
          clan_id: clan.id,
          user_id: user.id,
          role: 'member'
        });

      if (joinError) throw joinError;

      return clan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-clan'] });
      toast({
        title: 'Welcome!',
        description: 'You have successfully joined the clan.'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to join clan',
        variant: 'destructive'
      });
    }
  });
  
  // Get user's current clan
  const { data: userClan, isLoading: isLoadingClan } = useQuery({
    queryKey: ['user-clan', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data: membership } = await supabase
        .from('clan_members')
        .select('clan_id, role')
        .eq('user_id', user.id)
        .single();

      if (!membership) return null;

      const { data: clan } = await supabase
        .from('clans')
        .select(`
          id,
          name,
          description,
          points,
          invite_code,
          created_at,
          updated_at,
          members:clan_members(
            user_id,
            role,
            user:profiles(
              id,
              username,
              avatar
            )
          )
        `)
        .eq('id', membership.clan_id)
        .single<ClanResponse>();

      if (!clan) return null;

      return {
        id: clan.id,
        name: clan.name,
        description: clan.description,
        points: clan.points,
        inviteCode: clan.invite_code,
        created_at: clan.created_at,
        updated_at: clan.updated_at,
        members: clan.members.map(member => ({
          id: member.user.id,
          username: member.user.username,
          avatar_url: member.user.avatar,
          role: member.role
        }))
      };
    },
    enabled: !!user?.id
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
        // First, get the user's profile ID
        // @ts-ignore: Type instantiation is excessively deep
        const profileQuery: DbResult<Pick<DbProfile, 'id'>> = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .limit(1)
          .then(result => ({
            data: result.data?.[0] ?? null,
            error: result.error
          }));
          
        if (profileQuery.error) throw profileQuery.error;
        if (!profileQuery.data) throw new Error('User not found');
        
        const profileId = profileQuery.data.id;
        
        // Then check if user is already a member
        const { data: members } = await supabase
          .from('clan_members')
          .select('user_id')
          .eq('clan_id', userClan.id)
          .eq('user_id', profileId);
          
        if (members?.length) {
          throw new Error('User is already a member of this clan');
        }
        
        // Check for existing pending invite
        const { data: invites } = await supabase
          .from('clan_invites')
          .select('id')
          .eq('clan_id', userClan.id)
          .eq('invited_email', email)
          .eq('status', 'pending');
          
        if (invites?.length) {
          throw new Error('User already has a pending invite to this clan');
        }
        
        // Create invite
        const { error: createError } = await supabase
          .from('clan_invites')
          .insert({
            clan_id: userClan.id,
            invited_email: email,
            invite_code: generateClanInviteCode(),
            status: 'pending',
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
          } satisfies Partial<ClanInviteRow>);
          
        if (createError) throw createError;
        
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
  const { data: pendingInvites = [], isLoading: isLoadingInvites } = useQuery<PendingInvite[]>({
    queryKey: ['pending-invites', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      
      type InviteResponse = {
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
      
      return ((data || []) as InviteResponse[]).map(invite => ({
        id: invite.id,
        clan_id: invite.clan_id,
        invite_code: invite.invite_code,
        created_at: invite.created_at,
        clan_name: invite.clans.name,
        clan_description: invite.clans.description,
        clan_points: invite.clans.points
      }));
    },
    enabled: !!user?.email
  });
  
  // Return all functions and data
  return {
    createClan,
    joinClan,
    userClan,
    isLoading: loading || isLoadingClan,
    clanChallenges,
    isLoadingChallenges,
    isLoadingInvites,
    createChallenge: createChallenges,
    inviteUser,
    acceptInvite,
    pendingInvites,
    clanMembers: userClan?.members || []
  };
};
