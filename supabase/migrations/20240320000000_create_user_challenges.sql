-- Add status field to profiles table if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS status text DEFAULT 'offline',
ADD COLUMN IF NOT EXISTS last_active timestamp with time zone DEFAULT now();

-- Create user_challenges table
CREATE TABLE IF NOT EXISTS user_challenges (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    challenger_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    challenged_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    category text,
    points integer DEFAULT 0,
    status text DEFAULT 'pending',
    deadline timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_challenges_updated_at
    BEFORE UPDATE ON user_challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenger_id ON user_challenges(challenger_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenged_id ON user_challenges(challenged_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_status ON user_challenges(status);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON profiles(last_active);

-- Add RLS policies
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own challenges"
ON user_challenges FOR SELECT
TO authenticated
USING (
    auth.uid() = challenger_id OR 
    auth.uid() = challenged_id
);

CREATE POLICY "Users can create challenges"
ON user_challenges FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = challenger_id AND
    challenger_id != challenged_id
);

CREATE POLICY "Users can update their own challenges"
ON user_challenges FOR UPDATE
TO authenticated
USING (
    auth.uid() = challenger_id OR 
    auth.uid() = challenged_id
)
WITH CHECK (
    auth.uid() = challenger_id OR 
    auth.uid() = challenged_id
);

-- Add function to update user status
CREATE OR REPLACE FUNCTION update_user_status()
RETURNS trigger AS $$
BEGIN
    UPDATE profiles
    SET status = 
        CASE 
            WHEN NEW.status = 'accepted' THEN 'in_challenge'
            WHEN NEW.status = 'completed' OR NEW.status = 'rejected' THEN 'online'
            ELSE status
        END
    WHERE id IN (NEW.challenger_id, NEW.challenged_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_status_on_challenge
    AFTER UPDATE OF status ON user_challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_user_status(); 