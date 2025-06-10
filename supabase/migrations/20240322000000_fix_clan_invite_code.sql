-- First, let's make sure we have the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in correct order)
DROP TABLE IF EXISTS public.clan_challenge_participants;
DROP TABLE IF EXISTS public.clan_challenges;
DROP TABLE IF EXISTS public.clan_invites;
DROP TABLE IF EXISTS public.clan_members;
DROP TABLE IF EXISTS public.clans;

-- Create the clans table with proper invite_code
CREATE TABLE public.clans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    invite_code VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create clan members table
CREATE TABLE public.clan_members (
    clan_id UUID REFERENCES public.clans(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (clan_id, user_id)
);

-- Create clan challenges/goals table
CREATE TABLE public.clan_challenges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clan_id UUID REFERENCES public.clans(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    points INTEGER DEFAULT 0 NOT NULL,
    deadline TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled'))
);

-- Create challenge participants table
CREATE TABLE public.clan_challenge_participants (
    challenge_id UUID REFERENCES public.clan_challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    completed_at TIMESTAMPTZ,
    PRIMARY KEY (challenge_id, user_id)
);

-- Function to generate unique invite codes
CREATE OR REPLACE FUNCTION generate_unique_invite_code()
RETURNS VARCHAR(10)
LANGUAGE plpgsql
AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result VARCHAR(10);
    done BOOLEAN;
BEGIN
    done := FALSE;
    WHILE NOT done LOOP
        -- Generate an 8-character code
        result := '';
        FOR i IN 1..8 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
        END LOOP;
        
        -- Check if it exists
        done := NOT EXISTS(SELECT 1 FROM public.clans WHERE invite_code = result);
    END LOOP;
    
    RETURN result;
END;
$$;

-- Trigger to automatically generate invite codes
CREATE OR REPLACE FUNCTION set_clan_invite_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invite_code IS NULL OR NEW.invite_code = 'TEMP' THEN
        NEW.invite_code := generate_unique_invite_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_clan_insert
    BEFORE INSERT ON public.clans
    FOR EACH ROW
    EXECUTE FUNCTION set_clan_invite_code();

-- Enable Row Level Security (RLS)
ALTER TABLE public.clans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clan_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clan_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clan_challenge_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Clans policies
CREATE POLICY "Clans are viewable by anyone" ON public.clans
    FOR SELECT USING (true);

CREATE POLICY "Clans can be created by authenticated users" ON public.clans
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Clans can be updated by owners and admins" ON public.clans
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.clan_members
            WHERE clan_members.clan_id = clans.id
            AND clan_members.user_id = auth.uid()
            AND clan_members.role IN ('owner', 'admin')
        )
    );

-- Clan members policies
CREATE POLICY "Members are viewable by anyone" ON public.clan_members
    FOR SELECT USING (true);

CREATE POLICY "Members can be added by authenticated users" ON public.clan_members
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Members can be updated by clan owners and admins" ON public.clan_members
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.clan_members AS cm
            WHERE cm.clan_id = clan_members.clan_id
            AND cm.user_id = auth.uid()
            AND cm.role IN ('owner', 'admin')
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_clan_members_user_id ON public.clan_members(user_id);
CREATE INDEX idx_clan_members_clan_id ON public.clan_members(clan_id);
CREATE INDEX idx_clans_invite_code ON public.clans(invite_code);

-- Add foreign key for profiles
ALTER TABLE public.clan_members
    ADD CONSTRAINT fk_clan_members_profile
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE; 