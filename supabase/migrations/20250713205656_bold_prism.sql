/*
  # Add Payment Link Column to Classes Table

  1. Changes
    - Add `payment_link` column to `classes` table
    - Allow storing custom Stripe payment links for each class
    - Column is optional (nullable) for backward compatibility

  2. Security
    - No RLS changes needed (inherits existing policies)
    - Column is text type to store Stripe payment link URLs
*/

-- Add payment_link column to classes table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'classes' AND column_name = 'payment_link'
  ) THEN
    ALTER TABLE classes ADD COLUMN payment_link text;
  END IF;
END $$;

-- Add comment for documentation
COMMENT ON COLUMN classes.payment_link IS 'Custom Stripe payment link URL for this specific class';