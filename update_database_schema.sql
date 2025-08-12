-- Update database schema for SpeakersCircle
-- Add payment_script_url and admin_password_hash columns to site_settings table

-- Add the new columns if they don't exist
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS payment_script_url TEXT;

ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS admin_password_hash TEXT;

-- Check if there's existing data and update schema
DO $$
BEGIN
    -- If no site_settings record exists, insert a default one
    IF NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1) THEN
        INSERT INTO site_settings (
            slogan,
            hero_text,
            footer_text,
            contact_email,
            payment_script_url,
            admin_password_hash
        ) VALUES (
            'Your Voice is your Superpower',
            'Empowering youth with the confidence to speak, the clarity to lead, and the courage to inspire.',
            '© 2025 SpeakersCircle. All rights reserved.',
            'shalini@speakerscircle.com',
            NULL,
            NULL
        );
    ELSE
        -- Update existing records to have the new columns (set to NULL initially)
        UPDATE site_settings 
        SET 
            payment_script_url = COALESCE(payment_script_url, NULL),
            admin_password_hash = COALESCE(admin_password_hash, NULL);
    END IF;
END $$;

-- Display current schema for verification
SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM information_schema.columns 
WHERE table_name = 'site_settings' 
ORDER BY ordinal_position;
