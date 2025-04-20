
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/types';

export const useAchievements = () => {
  const { user } = useAuth();

  // Fetch all available badges
  const { data: allBadges = [], isLoading: isLoadingAllBadges } = useQuery({
    queryKey: ['badges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch user badges
  const { data: userBadges = [], isLoading: isLoadingUserBadges } = useQuery({
    queryKey: ['user-badges', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          *,
          badges(*)
        `)
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });
        
      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item.badges,
        unlocked_at: item.unlocked_at,
        // Set a default icon if none exists
        icon: item.badges.icon || 'award',
        id: item.badges.id,
        unlockedAt: new Date(item.unlocked_at)
      })) as Badge[];
    },
    enabled: !!user?.id
  });

  // Fetch leaderboard
  const { data: leaderboard = [], isLoading: isLoadingLeaderboard } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, level, points, avatar')
        .order('points', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      return data || [];
    }
  });

  return {
    allBadges,
    userBadges,
    leaderboard,
    isLoading: isLoadingAllBadges || isLoadingUserBadges || isLoadingLeaderboard,
    unlockedBadges: userBadges.length,
    totalBadges: allBadges.length
  };
};
