-- Add invite_code column to clans table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'clans' 
        AND column_name = 'invite_code'
    ) THEN
        ALTER TABLE public.clans
        ADD COLUMN invite_code VARCHAR(10) UNIQUE;

        -- Update existing clans with random invite codes
        UPDATE public.clans
        SET invite_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8))
        WHERE invite_code IS NULL;

        -- Make invite_code NOT NULL after updating existing records
        ALTER TABLE public.clans
        ALTER COLUMN invite_code SET NOT NULL;

        -- Create index for faster invite code lookups
        CREATE INDEX IF NOT EXISTS idx_clans_invite_code ON public.clans(invite_code);
    END IF;
END $$; 