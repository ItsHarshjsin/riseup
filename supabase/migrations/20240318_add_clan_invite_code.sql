-- Add invite_code column to clans table
ALTER TABLE clans
ADD COLUMN invite_code VARCHAR(10) UNIQUE;

-- Update existing clans with random invite codes
UPDATE clans
SET invite_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8))
WHERE invite_code IS NULL;

-- Make invite_code NOT NULL after updating existing records
ALTER TABLE clans
ALTER COLUMN invite_code SET NOT NULL;

-- Create index for faster invite code lookups
CREATE INDEX idx_clans_invite_code ON clans(invite_code); 