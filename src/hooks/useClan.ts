
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Clan, Challenge, User } from '@/types';

export const useClan = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [userClan, setUserClan] = useState<Clan | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch user's clan
  const { data: userClans, isLoading: isLoadingClan } = useQuery({
    queryKey: ['user-clan', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data: clanMemberships, error: membershipError } = await supabase
        .from('clan_members')
        .select('clan_id, role')
        .eq('user_id', user.id);
        
      if (membershipError) throw membershipError;
      
      if (!clanMemberships || clanMemberships.length === 0) {
        return [];
      }
      
      // Get clan details
      const { data: clans, error: clanError } = await supabase
        .from('clans')
        .select('*')
        .in('id', clanMemberships.map(cm => cm.clan_id));
        
      if (clanError) throw clanError;
      
      if (!clans || clans.length === 0) {
        return [];
      }
      
      // Enrich clan data with role
      return clans.map(clan => ({
        ...clan,
        userRole: clanMemberships.find(cm => cm.clan_id === clan.id)?.role
      }));
    },
    enabled: !!user?.id,
  });

  // Set first clan as active clan
  useEffect(() => {
    if (userClans && userClans.length > 0) {
      setUserClan(userClans[0] as unknown as Clan);
    }
  }, [userClans]);

  // Fetch clan members
  const { data: clanMembers = [], isLoading: isLoadingMembers } = useQuery({
    queryKey: ['clan-members', userClan?.id],
    queryFn: async () => {
      if (!userClan?.id) return [];
      
      const { data: memberships, error: membershipError } = await supabase
        .from('clan_members')
        .select('user_id, role, joined_at')
        .eq('clan_id', userClan.id);
        
      if (membershipError) throw membershipError;
      
      if (!memberships || memberships.length === 0) {
        return [];
      }
      
      // Get user profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', memberships.map(m => m.user_id));
        
      if (profileError) throw profileError;
      
      // Merge profile data with membership data
      return profiles.map(profile => {
        const membership = memberships.find(m => m.user_id === profile.id);
        return {
          ...profile,
          role: membership?.role,
          joined_at: membership?.joined_at,
          // Add required fields for User type
          badges: [],
          completedTasks: [],
          createdAt: new Date(profile.created_at)
        } as User;
      }).sort((a, b) => b.points - a.points);
    },
    enabled: !!userClan?.id,
  });

  // Fetch clan challenges
  const { data: clanChallenges = [], isLoading: isLoadingChallenges } = useQuery({
    queryKey: ['clan-challenges', userClan?.id],
    queryFn: async () => {
      if (!userClan?.id) return [];
      
      const { data: challenges, error } = await supabase
        .from('clan_challenges')
        .select(`
          *,
          clan_challenge_participants(*)
        `)
        .eq('clan_id', userClan.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return (challenges || []).map(challenge => ({
        ...challenge,
        assignedTo: challenge.clan_challenge_participants.map((p: any) => p.user_id)
      })) as unknown as Challenge[];
    },
    enabled: !!userClan?.id,
  });

  // Create a new clan
  const { mutate: createClan } = useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      setIsCreating(true);
      
      // Create clan
      const { data: clan, error: clanError } = await supabase
        .from('clans')
        .insert([
          {
            name,
            description,
            owner_id: user.id
          }
        ])
        .select()
        .single();
        
      if (clanError) throw clanError;
      
      // Add user as owner
      const { error: memberError } = await supabase
        .from('clan_members')
        .insert([
          {
            clan_id: clan.id,
            user_id: user.id,
            role: 'owner'
          }
        ]);
        
      if (memberError) throw memberError;
      
      return clan;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-clan'] });
      toast({
        title: 'Clan created',
        description: `Your clan "${data.name}" has been created successfully.`,
      });
      setIsCreating(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error creating clan',
        description: error.message,
        variant: 'destructive',
      });
      setIsCreating(false);
    },
  });

  // Create a new challenge
  const { mutate: createChallenge } = useMutation({
    mutationFn: async (challenge: { 
      title: string; 
      description: string; 
      category: string; 
      points: number; 
      deadline: Date | null;
      participants: string[];
    }) => {
      if (!user?.id || !userClan?.id) throw new Error('User not authenticated or no clan selected');
      
      // Create challenge with string deadline instead of Date object
      const { data: newChallenge, error: challengeError } = await supabase
        .from('clan_challenges')
        .insert({
          clan_id: userClan.id,
          title: challenge.title,
          description: challenge.description,
          category: challenge.category,
          points: challenge.points,
          created_by: user.id,
          deadline: challenge.deadline ? challenge.deadline.toISOString() : null
        })
        .select()
        .single();
        
      if (challengeError) throw challengeError;
      
      // Add participants
      if (challenge.participants.length > 0) {
        const participantsData = challenge.participants.map(userId => ({
          challenge_id: newChallenge.id,
          user_id: userId
        }));
        
        const { error: participantError } = await supabase
          .from('clan_challenge_participants')
          .insert(participantsData);
          
        if (participantError) throw participantError;
      }
      
      return newChallenge;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clan-challenges'] });
      toast({
        title: 'Challenge created',
        description: 'Your challenge has been created successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error creating challenge',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Invite a user to the clan
  const { mutate: inviteUser } = useMutation({
    mutationFn: async (email: string) => {
      if (!user?.id || !userClan?.id) throw new Error('User not authenticated or no clan selected');
      
      // Generate a unique invite code
      const inviteCode = Math.random().toString(36).substring(2, 10);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
      
      const { data, error } = await supabase
        .from('clan_invites')
        .insert([
          {
            clan_id: userClan.id,
            invited_email: email,
            invite_code: inviteCode,
            status: 'pending',
            expires_at: expiresAt.toISOString()
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    },
    onSuccess: (_, email) => {
      toast({
        title: 'Invitation sent',
        description: `An invitation has been sent to ${email}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error sending invitation',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    userClan,
    clanMembers,
    clanChallenges,
    isLoadingClan,
    isLoadingMembers,
    isLoadingChallenges,
    isCreating,
    createClan,
    createChallenge,
    inviteUser,
    hasClan: !!userClan
  };
};
