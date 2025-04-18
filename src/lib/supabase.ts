
import { createClient } from '@supabase/supabase-js';
import type { User } from '@/types';

// Initialize Supabase client
// In a real app, these values would come from environment variables
// For demonstration purposes, we're using empty strings
// You'll need to connect the Lovable project to Supabase using the integration
const supabaseUrl = '';
const supabaseKey = '';

// If the Supabase integration is active, these values will be properly set
export const supabase = createClient(supabaseUrl, supabaseKey);

// User management functions
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data as User;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
      
    if (error) throw error;
    return data as User;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
};

export const uploadProfileImage = async (userId: string, file: File) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `profile-images/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
      
    // Update user profile with new avatar URL
    await updateUserProfile(userId, { avatar: data.publicUrl });
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return null;
  }
};

// Achievement functions
export const getUserAchievements = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_badges')
      .select('*, badges(*)')
      .eq('user_id', userId);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    return [];
  }
};

// Clan functions
export const getUserClans = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('clan_members')
      .select('*, clans(*)')
      .eq('user_id', userId);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user clans:', error);
    return [];
  }
};

export const inviteUserToClan = async (clanId: string, invitedEmail: string) => {
  try {
    // Generate a unique invite code
    const inviteCode = Math.random().toString(36).substring(2, 10);
    
    const { data, error } = await supabase
      .from('clan_invites')
      .insert({
        clan_id: clanId,
        invited_email: invitedEmail,
        invite_code: inviteCode,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // In a real app, we would send an email with the invite link
    console.log(`Invite created: ${inviteCode}`);
    
    return data;
  } catch (error) {
    console.error('Error inviting user to clan:', error);
    return null;
  }
};
