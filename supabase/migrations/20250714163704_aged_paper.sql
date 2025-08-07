/*
  # Create 1-on-1 Coaching Requests Table

  1. New Table
    - `one_on_one_requests` - Store 1-on-1 coaching interest form submissions
    - Includes all required fields for student and parent information
    - Tracks session preferences and learning goals
    - Supports approval workflow with status tracking

  2. Security
    - Enable RLS on the table
    - Allow anonymous users to INSERT (for form submissions)
    - Allow authenticated users full access (for admin management)

  3. Features
    - Complete contact information for both student and parent
    - Session preferences (subject, mode, availability)
    - Learning goals and additional notes
    - Status tracking (pending, approved, rejected)
    - Automatic timestamp tracking
*/

-- Create one_on_one_requests table
CREATE TABLE IF NOT EXISTS one_on_one_requests (
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

-- Enable RLS
ALTER TABLE one_on_one_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for public form submission
CREATE POLICY "Allow anonymous users to insert 1-on-1 requests"
  ON one_on_one_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policies for admin management
CREATE POLICY "Allow authenticated users to read all 1-on-1 requests"
  ON one_on_one_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update 1-on-1 requests"
  ON one_on_one_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete 1-on-1 requests"
  ON one_on_one_requests
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comments for documentation
COMMENT ON TABLE one_on_one_requests IS '1-on-1 coaching interest form submissions';
COMMENT ON COLUMN one_on_one_requests.student_name IS 'Full name of the student requesting coaching';
COMMENT ON COLUMN one_on_one_requests.parent_name IS 'Full name of parent or guardian';
COMMENT ON COLUMN one_on_one_requests.parent_email IS 'Parent/guardian email for notifications';
COMMENT ON COLUMN one_on_one_requests.student_email IS 'Student email for direct communication';
COMMENT ON COLUMN one_on_one_requests.preferred_subject IS 'Subject area for coaching sessions';
COMMENT ON COLUMN one_on_one_requests.goals IS 'Student learning goals and objectives';
COMMENT ON COLUMN one_on_one_requests.availability IS 'When the student is available for sessions';
COMMENT ON COLUMN one_on_one_requests.preferred_mode IS 'Preferred session delivery method';
COMMENT ON COLUMN one_on_one_requests.additional_notes IS 'Optional additional information';
COMMENT ON COLUMN one_on_one_requests.status IS 'Request status: pending, approved, or rejected';
COMMENT ON COLUMN one_on_one_requests.created_at IS 'When the request was submitted';