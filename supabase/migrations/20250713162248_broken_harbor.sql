/*
  # Create SpeakersCircle Database Schema

  1. New Tables
    - `pages` - Store content for static pages (home, about, mission, etc.)
    - `classes` - Manage class offerings with enrollment limits
    - `students` - Track student enrollments and status
    - `events` - Manage workshops and special events
    - `site_settings` - Global site configuration
    - `one_on_one` - 1-on-1 service information
    - `registrations` - Track registration requests
    - `payments` - Payment tracking and receipts

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access where appropriate
    - Add admin-only policies for write operations

  3. Features
    - Class enrollment limits and waitlists
    - Student status tracking
    - Payment integration ready
    - Content management system
*/

-- Create pages table for static content
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Create classes table for course management
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  schedule text NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  description text NOT NULL,
  registration_link text,
  active boolean DEFAULT true,
  group_limit integer DEFAULT 18,
  current_enrolled integer DEFAULT 0,
  waitlist_enabled boolean DEFAULT true,
  waitlist_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  parent_email text NOT NULL,
  class_id uuid REFERENCES classes(id),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'waitlist')),
  moved_to_class_id uuid REFERENCES classes(id),
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
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
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url text,
  slogan text NOT NULL DEFAULT 'Your Voice is your Superpower',
  hero_text text NOT NULL,
  footer_text text NOT NULL,
  contact_email text NOT NULL DEFAULT 'shalini@speakerscircle.com',
  updated_at timestamptz DEFAULT now()
);

-- Create one_on_one table
CREATE TABLE IF NOT EXISTS one_on_one (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  booking_link text,
  email_contact text NOT NULL DEFAULT 'shalini@speakerscircle.com',
  active boolean DEFAULT true
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id),
  parent_email text NOT NULL,
  class_id uuid REFERENCES classes(id),
  timestamp timestamptz DEFAULT now(),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed'))
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
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

-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE one_on_one ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to pages"
  ON pages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to active classes"
  ON classes FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Allow public read access to events"
  ON events FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to site_settings"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to one_on_one"
  ON one_on_one FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to insert registrations"
  ON registrations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read their own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (user_email = auth.jwt() ->> 'email');

-- Insert initial data
INSERT INTO site_settings (slogan, hero_text, footer_text, contact_email) VALUES (
  'Your Voice is your Superpower',
  'Empowering youth with the confidence to speak, the clarity to lead, and the courage to inspire.',
  '© 2025 SpeakersCircle. All rights reserved.',
  'shalini@speakerscircle.com'
) ON CONFLICT DO NOTHING;

INSERT INTO pages (slug, title, content) VALUES 
('home', 'Welcome to SpeakersCircle', 'At SpeakersCircle, we believe that your voice is your superpower. Join our community of young leaders learning to communicate confidently, lead effectively, and inspire others.'),
('about', 'About Us', 'Learn more about our mission, vision, and founder.'),
('mission', 'Our Mission', 'At SpeakersCircle, we believe that your voice is your superpower. By fostering strong communication, leadership, and life skills, we help individuals unlock their full potential, build meaningful connections, and create a lasting impact in their personal and professional lives.'),
('vision', 'Our Vision', 'SpeakersCircle is dedicated to equipping youth with essential communication skills—verbal, non-verbal, email, and phone etiquette, social media presence—while helping them build strong personal and professional networks. Beyond communication, it fosters the development of vital life skills, including confidence, punctuality, responsibility, teamwork, time management, and project management, preparing them for success in all aspects of life. SpeakersCircle provides the opportunities to learn and practice communication and leadership skills. Beyond communication, SpeakersCircle is a community where you make lifelong friends, build a strong network, and gain invaluable guidance from mentors.'),
('founder-bio', 'Founder Bio', 'Shalini Suravarjjala: Director and Founder of SpeakersCircle. I am a software engineer by profession. I teach youth to communicate confidently and effectively in speech, conversations, emails, phone calls, and social media. Helping them lead in their clubs, schools, job searches, interviews, and beyond.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO one_on_one (description, email_contact) VALUES (
  'Speakers Circle one on one classes available on request. Subjects: English, coding, interview prep with customized projects for tech careers.',
  'shalini@speakerscircle.com'
) ON CONFLICT DO NOTHING;

INSERT INTO classes (name, schedule, price, description, group_limit) VALUES 
('Youth Leadership Circle (YLC)', 'Mondays 5:30-6:45PM (Middle & High School)', 150.00, 'YLC flat fee: $150 for up to 6 weeks. After YLC completion: Monthly fee: $75, One-time registration fee: $150', 18),
('Children''s Interpersonal Communication Circle (CICC)', 'Mondays 4–5 PM (In-person only)', 75.00, 'Focused communication skills for younger students. Limited to 8 per class.', 8),
('Intermediate Groups', 'Mondays or Thursdays 5:30–6:45 PM (In-person), Wednesdays 5:30–6:45 PM (Zoom)', 75.00, 'For Grades 5–12. Developing intermediate communication and leadership skills.', 18),
('Advanced Groups', 'Fridays In-person 5:30–6:45 PM', 75.00, 'Advanced communication and leadership development. Limited to 21 students.', 21)
ON CONFLICT DO NOTHING;

INSERT INTO events (title, description, date, duration, location) VALUES 
('Navigating STEM Internships Workshop', 'Workshop: Navigating STEM Internships – 8 weeks, 2 hours per session – date, registration, and fee details coming soon.', '2025-03-01 10:00:00', '2 hours per session', 'TBD'),
('Intergavel Club Contest', 'Intergavel Club contest in Fremont on March 29th – interest & sign-up forms coming soon.', '2025-03-29 09:00:00', '6 hours', 'Fremont, CA')
ON CONFLICT DO NOTHING;