-- Add payment_script_url to site_settings table
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS payment_script_url TEXT;

-- Add admin password to site_settings table for secure admin authentication
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS admin_password_hash TEXT;

-- Update site_settings type definitions by setting defaults
UPDATE site_settings SET payment_script_url = '' WHERE payment_script_url IS NULL;
UPDATE site_settings SET admin_password_hash = '' WHERE admin_password_hash IS NULL;
