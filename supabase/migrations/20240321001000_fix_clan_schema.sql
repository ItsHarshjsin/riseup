-- Drop the existing clans table if it exists
DROP TABLE IF EXISTS public.clan_challenge_participants;
DROP TABLE IF EXISTS public.clan_challenges;
DROP TABLE IF EXISTS public.clan_invites;
DROP TABLE IF EXISTS public.clan_members;
DROP TABLE IF EXISTS public.clans;

-- Recreate clans table with proper structure
CREATE TABLE public.clans (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    invite_code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create clan_members table
CREATE TABLE public.clan_members (
    clan_id UUID REFERENCES public.clans(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (clan_id, user_id)
);

-- Create clan_challenges table
CREATE TABLE public.clan_challenges (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    clan_id UUID REFERENCES public.clans(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    deadline TIMESTAMP WITH TIME ZONE,
    completed BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create clan_challenge_participants table
CREATE TABLE public.clan_challenge_participants (
    challenge_id UUID REFERENCES public.clan_challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (challenge_id, user_id)
);

-- Create clan_invites table
CREATE TABLE public.clan_invites (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    clan_id UUID REFERENCES public.clans(id) ON DELETE CASCADE,
    invited_email VARCHAR(255) NOT NULL,
    invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    invite_code VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now() + interval '7 days') NOT NULL,
    UNIQUE(clan_id, invited_email, status)
);

-- Create function to generate unique clan invite codes
CREATE OR REPLACE FUNCTION generate_unique_clan_code() 
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
        -- Generate a 6-character code
        result := '';
        FOR i IN 1..6 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
        END LOOP;
        
        -- Check if it exists
        done := NOT EXISTS(SELECT 1 FROM public.clans WHERE invite_code = result);
    END LOOP;
    
    RETURN result;
END;
$$;

-- Create trigger to automatically generate invite code for new clans
CREATE OR REPLACE FUNCTION set_clan_invite_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invite_code IS NULL THEN
        NEW.invite_code := generate_unique_clan_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_clan_invite_code
    BEFORE INSERT ON public.clans
    FOR EACH ROW
    EXECUTE FUNCTION set_clan_invite_code();

-- Enable RLS
ALTER TABLE public.clans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clan_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clan_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clan_challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clan_invites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Clans are viewable by members" ON public.clans
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.clan_members
            WHERE clan_members.clan_id = clans.id
            AND clan_members.user_id = auth.uid()
        )
    );

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

-- Create index for faster invite code lookups
CREATE INDEX idx_clans_invite_code ON public.clans(invite_code); 