/*
  # Complete Schema Recreation for SpeakersCircle

  1. Drop and Recreate All Tables
    - Drop all existing tables to start fresh
    - Recreate with proper structure and data
    - Set up clean RLS policies that work

  2. Tables Created
    - `pages` - Static page content
    - `classes` - Class offerings and schedules
    - `students` - Student registrations
    - `events` - Workshops and special events
    - `site_settings` - Global site configuration
    - `one_on_one` - 1-on-1 service information
    - `one_on_one_requests` - 1-on-1 coaching requests
    - `registrations` - Registration tracking
    - `payments` - Payment records

  3. Security
    - Simple, working RLS policies
    - Public access for registration forms
    - Admin access for authenticated users
*/

-- Drop all existing tables to start fresh
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS one_on_one_requests CASCADE;
DROP TABLE IF EXISTS one_on_one CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS pages CASCADE;

-- Create pages table for static content
CREATE TABLE pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Create classes table for course management
CREATE TABLE classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  schedule text NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  description text NOT NULL,
  registration_link text,
  payment_link text,
  active boolean DEFAULT true,
  group_limit integer DEFAULT 18,
  current_enrolled integer DEFAULT 0,
  waitlist_enabled boolean DEFAULT true,
  waitlist_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create students table
CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  parent_name text,
  parent_email text NOT NULL,
  student_email text,
  class_id uuid REFERENCES classes(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'waitlist')),
  moved_to_class_id uuid REFERENCES classes(id),
  comments text,
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date timestamptz NOT NULL,
  duration text NOT NULL,
  location text NOT NULL,
  registration_link text,
  created_at timestamptz DEFAULT now()
);

-- Create site_settings table
CREATE TABLE site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url text,
  slogan text NOT NULL DEFAULT 'Your Voice is your Superpower',
  hero_text text NOT NULL,
  footer_text text NOT NULL,
  contact_email text NOT NULL DEFAULT 'gallantgaveliers@gmail.com',
  updated_at timestamptz DEFAULT now()
);

-- Create one_on_one table
CREATE TABLE one_on_one (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  booking_link text,
  email_contact text NOT NULL DEFAULT 'gallantgaveliers@gmail.com',
  active boolean DEFAULT true
);

-- Create one_on_one_requests table
CREATE TABLE one_on_one_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  parent_name text NOT NULL,
  parent_email text NOT NULL,
  student_email text NOT NULL,
  preferred_subject text NOT NULL CHECK (preferred_subject IN ('English', 'Coding', 'Debate', 'Interview Prep', 'Resume Boost', 'College Counseling')),
  goals text NOT NULL,
  availability text NOT NULL,
  preferred_mode text NOT NULL CHECK (preferred_mode IN ('In-person', 'Zoom', 'Either')),
  additional_notes text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Create registrations table
CREATE TABLE registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id),
  parent_email text NOT NULL,
  class_id uuid REFERENCES classes(id),
  timestamp timestamptz DEFAULT now(),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed'))
);

-- Create payments table
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  amount decimal(10,2) NOT NULL,
  stripe_payment_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz DEFAULT now(),
  receipt_url text,
  student_id uuid REFERENCES students(id),
  class_id uuid REFERENCES classes(id)
);

-- Enable RLS on all tables
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE one_on_one ENABLE ROW LEVEL SECURITY;
ALTER TABLE one_on_one_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create simple, working RLS policies

-- Pages: Public read access
CREATE POLICY "pages_public_read" ON pages FOR SELECT USING (true);

-- Classes: Public read access for active classes
CREATE POLICY "classes_public_read" ON classes FOR SELECT USING (active = true);

-- Students: Allow everyone to insert (registration), authenticated to manage
CREATE POLICY "students_public_insert" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "students_auth_all" ON students FOR ALL TO authenticated USING (true);

-- Events: Public read access
CREATE POLICY "events_public_read" ON events FOR SELECT USING (true);

-- Site Settings: Public read access
CREATE POLICY "site_settings_public_read" ON site_settings FOR SELECT USING (true);

-- One-on-one: Public read access for active services
CREATE POLICY "one_on_one_public_read" ON one_on_one FOR SELECT USING (active = true);

-- One-on-one requests: Allow everyone to insert, authenticated to manage
CREATE POLICY "one_on_one_requests_public_insert" ON one_on_one_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "one_on_one_requests_auth_all" ON one_on_one_requests FOR ALL TO authenticated USING (true);

-- Registrations: Allow everyone to insert, authenticated to manage
CREATE POLICY "registrations_public_insert" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "registrations_auth_all" ON registrations FOR ALL TO authenticated USING (true);

-- Payments: Allow everyone to insert, authenticated to manage
CREATE POLICY "payments_public_insert" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "payments_auth_all" ON payments FOR ALL TO authenticated USING (true);

-- Insert initial data
INSERT INTO site_settings (slogan, hero_text, footer_text, contact_email) VALUES (
  'Your Voice is your Superpower',
  'Empowering youth with the confidence to speak, the clarity to lead, and the courage to inspire.',
  '© 2025 SpeakersCircle. All rights reserved.',
  'gallantgaveliers@gmail.com'
);

INSERT INTO pages (slug, title, content) VALUES 
('home', 'Welcome to SpeakersCircle', 'At SpeakersCircle, we believe that your voice is your superpower. Join our community of young leaders learning to communicate confidently, lead effectively, and inspire others.'),
('about', 'About Us', 'Learn more about our mission, vision, and founder.'),
('mission', 'Our Mission', 'At SpeakersCircle, we believe that your voice is your superpower. By fostering strong communication, leadership, and life skills, we help individuals unlock their full potential, build meaningful connections, and create a lasting impact in their personal and professional lives.'),
('vision', 'Our Vision', 'SpeakersCircle is dedicated to equipping youth with essential communication skills—verbal, non-verbal, email, and phone etiquette, social media presence—while helping them build strong personal and professional networks. Beyond communication, it fosters the development of vital life skills, including confidence, punctuality, responsibility, teamwork, time management, and project management, preparing them for success in all aspects of life. SpeakersCircle provides the opportunities to learn and practice communication and leadership skills. Beyond communication, SpeakersCircle is a community where you make lifelong friends, build a strong network, and gain invaluable guidance from mentors.'),
('founder-bio', 'Founder Bio', 'Shalini Suravarjjala: Director and Founder of SpeakersCircle. I am a software engineer by profession. I teach youth to communicate confidently and effectively in speech, conversations, emails, phone calls, and social media. Helping them lead in their clubs, schools, job searches, interviews, and beyond.');

INSERT INTO one_on_one (description, email_contact) VALUES (
  'Speakers Circle one on one classes available on request. Subjects: English, coding, interview prep with customized projects for tech careers.',
  'gallantgaveliers@gmail.com'
);

INSERT INTO classes (name, schedule, price, description, group_limit, payment_link) VALUES 
('Youth Leadership Circle (YLC)', 'Mondays 5:30-6:45PM (Middle & High School)', 150.00, 'YLC flat fee: $150 for up to 6 weeks. After YLC completion: Monthly fee: $75, One-time registration fee: $150', 18, 'https://buy.stripe.com/fZu6oI2es6Rebxw0KCeAg03'),
('Children''s Interpersonal Communication Circle (CICC)', 'Mondays 4–5 PM (In-person only)', 75.00, 'Focused communication skills for younger students. Limited to 8 per class.', 8, 'https://buy.stripe.com/6oU8wQ4mAejG1WW0KCeAg02'),
('Intermediate Groups A', 'Mondays 5:30–6:45 PM (In-person)', 75.00, 'For Grades 5–12. Developing intermediate communication and leadership skills. Monday sessions.', 18, 'https://buy.stripe.com/6oU8wQ4mAejG1WW0KCeAg02'),
('Intermediate Groups B', 'Thursdays 5:30–6:45 PM (In-person)', 75.00, 'For Grades 5–12. Developing intermediate communication and leadership skills. Thursday sessions.', 18, 'https://buy.stripe.com/6oU8wQ4mAejG1WW0KCeAg02'),
('Advanced Groups', 'Fridays In-person 5:30–6:45 PM', 75.00, 'Advanced communication and leadership development. Limited to 21 students.', 21, 'https://buy.stripe.com/9B628s2esa3qfNM3WOeAg00');

INSERT INTO events (title, description, date, duration, location) VALUES 
('Navigating STEM Internships Workshop', 'Workshop: Navigating STEM Internships – 8 weeks, 2 hours per session – date, registration, and fee details coming soon.', '2025-03-01 10:00:00', '2 hours per session', 'TBD'),
('Intergavel Club Contest', 'Intergavel Club contest in Fremont on March 29th – interest & sign-up forms coming soon.', '2025-03-29 09:00:00', '6 hours', 'Fremont, CA');

-- Add helpful comments
COMMENT ON TABLE students IS 'Student registration data with simple RLS policies for public registration and admin management';
COMMENT ON TABLE one_on_one_requests IS '1-on-1 coaching interest form submissions with public insert access';