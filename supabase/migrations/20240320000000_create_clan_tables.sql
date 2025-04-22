-- Create clans table
CREATE TABLE IF NOT EXISTS public.clans (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create clan_members table
CREATE TABLE IF NOT EXISTS public.clan_members (
    clan_id UUID REFERENCES public.clans(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (clan_id, user_id)
);

-- Create clan_challenges table
CREATE TABLE IF NOT EXISTS public.clan_challenges (
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
CREATE TABLE IF NOT EXISTS public.clan_challenge_participants (
    challenge_id UUID REFERENCES public.clan_challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (challenge_id, user_id)
);

-- Create clan_invites table
CREATE TABLE IF NOT EXISTS public.clan_invites (
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

-- Create RLS policies
ALTER TABLE public.clans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clan_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clan_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clan_challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clan_invites ENABLE ROW LEVEL SECURITY;

-- Clans policies
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

-- Clan members policies
CREATE POLICY "Clan members are viewable by other members" ON public.clan_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.clan_members AS cm
            WHERE cm.clan_id = clan_members.clan_id
            AND cm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can join clans via invite" ON public.clan_members
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.clan_invites
            WHERE clan_invites.clan_id = clan_members.clan_id
            AND clan_invites.invited_email = (
                SELECT email FROM auth.users WHERE id = auth.uid()
            )
            AND clan_invites.status = 'pending'
        )
    );

-- Clan challenges policies
CREATE POLICY "Challenges are viewable by clan members" ON public.clan_challenges
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.clan_members
            WHERE clan_members.clan_id = clan_challenges.clan_id
            AND clan_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Challenges can be created by clan members" ON public.clan_challenges
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.clan_members
            WHERE clan_members.clan_id = clan_challenges.clan_id
            AND clan_members.user_id = auth.uid()
        )
    );

-- Challenge participants policies
CREATE POLICY "Challenge participants are viewable by clan members" ON public.clan_challenge_participants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.clan_members
            WHERE clan_members.clan_id = (
                SELECT clan_id FROM public.clan_challenges
                WHERE clan_challenges.id = clan_challenge_participants.challenge_id
            )
            AND clan_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can participate in their clan's challenges" ON public.clan_challenge_participants
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.clan_members
            WHERE clan_members.clan_id = (
                SELECT clan_id FROM public.clan_challenges
                WHERE clan_challenges.id = clan_challenge_participants.challenge_id
            )
            AND clan_members.user_id = auth.uid()
        )
    );

-- Clan invites policies
CREATE POLICY "Invites are viewable by clan members and invited users" ON public.clan_invites
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.clan_members
            WHERE clan_members.clan_id = clan_invites.clan_id
            AND clan_members.user_id = auth.uid()
        ) OR
        invited_email = (
            SELECT email FROM auth.users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Invites can be created by clan members" ON public.clan_invites
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.clan_members
            WHERE clan_members.clan_id = clan_invites.clan_id
            AND clan_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Invites can be updated by clan members or invited users" ON public.clan_invites
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.clan_members
            WHERE clan_members.clan_id = clan_invites.clan_id
            AND clan_members.user_id = auth.uid()
        ) OR
        invited_email = (
            SELECT email FROM auth.users WHERE id = auth.uid()
        )
    );

-- Create functions and triggers
CREATE OR REPLACE FUNCTION public.handle_clan_challenge_completion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.completed = TRUE AND OLD.completed = FALSE THEN
        -- Update clan points when a challenge is completed
        UPDATE public.clans
        SET points = points + (
            SELECT points FROM public.clan_challenges
            WHERE id = NEW.challenge_id
        )
        WHERE id = (
            SELECT clan_id FROM public.clan_challenges
            WHERE id = NEW.challenge_id
        );
        
        NEW.completed_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_challenge_completion
    BEFORE UPDATE ON public.clan_challenge_participants
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_clan_challenge_completion();

-- Create accept_clan_invite stored procedure
CREATE OR REPLACE FUNCTION public.accept_clan_invite(p_invite_id UUID, p_user_id UUID)
RETURNS void AS $$
DECLARE
    v_clan_id UUID;
    v_email VARCHAR;
BEGIN
    -- Get invite details
    SELECT clan_id, invited_email INTO v_clan_id, v_email
    FROM public.clan_invites
    WHERE id = p_invite_id
    AND status = 'pending'
    AND expires_at > NOW();
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid or expired invite';
    END IF;
    
    -- Verify user email matches invite
    IF NOT EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = p_user_id
        AND email = v_email
    ) THEN
        RAISE EXCEPTION 'User email does not match invite';
    END IF;
    
    -- Start transaction
    BEGIN
        -- Update invite status
        UPDATE public.clan_invites
        SET status = 'accepted'
        WHERE id = p_invite_id;
        
        -- Add user to clan
        INSERT INTO public.clan_members (clan_id, user_id, role)
        VALUES (v_clan_id, p_user_id, 'member');
        
        -- Update any other pending invites for this user to rejected
        UPDATE public.clan_invites
        SET status = 'rejected'
        WHERE invited_email = v_email
        AND status = 'pending'
        AND id != p_invite_id;
        
        -- Commit transaction
        COMMIT;
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 