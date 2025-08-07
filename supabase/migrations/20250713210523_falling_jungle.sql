/*
  # Add Intermediate Class Variations

  1. Changes
    - Add two versions of Intermediate classes (A for Mondays, B for Thursdays)
    - Both use the same payment link but different schedules
    - Update existing Intermediate class or add new ones

  2. Security
    - No RLS changes needed (inherits existing policies)
*/

-- Add Intermediate A and B classes if they don't exist
INSERT INTO classes (name, schedule, price, description, group_limit, payment_link, active) VALUES 
(
  'Intermediate Groups A', 
  'Mondays 5:30–6:45 PM (In-person)', 
  75.00, 
  'For Grades 5–12. Developing intermediate communication and leadership skills. Monday sessions.',
  18,
  'https://buy.stripe.com/6oU8wQ4mAejG1WW0KCeAg02',
  true
),
(
  'Intermediate Groups B', 
  'Thursdays 5:30–6:45 PM (In-person)', 
  75.00, 
  'For Grades 5–12. Developing intermediate communication and leadership skills. Thursday sessions.',
  18,
  'https://buy.stripe.com/6oU8wQ4mAejG1WW0KCeAg02',
  true
)
ON CONFLICT (name) DO UPDATE SET
  schedule = EXCLUDED.schedule,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  payment_link = EXCLUDED.payment_link,
  active = EXCLUDED.active;

-- Update existing classes with payment links if they don't have them
UPDATE classes SET payment_link = 'https://buy.stripe.com/9B628s2esa3qfNM3WOeAg00' 
WHERE name ILIKE '%advanced%' AND payment_link IS NULL;

UPDATE classes SET payment_link = 'https://buy.stripe.com/bJe6oI4mAb7u598alceAg01' 
WHERE name ILIKE '%induction%' AND payment_link IS NULL;

UPDATE classes SET payment_link = 'https://buy.stripe.com/fZu6oI2es6Rebxw0KCeAg03' 
WHERE name ILIKE '%ylc%' OR name ILIKE '%youth leadership%' AND payment_link IS NULL;