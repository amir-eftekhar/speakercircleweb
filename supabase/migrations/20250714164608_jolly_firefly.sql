/*
  # Fix Existing RLS Policy Conflict

  1. Problem
    - Policy "public_registration_insert" already exists
    - Need to handle existing policies gracefully

  2. Solution
    - Use IF EXISTS to safely drop existing policies
    - Create new policies with different names to avoid conflicts
    - Ensure anonymous users can register students

  3. Security
    - Allow public registration (INSERT)
    - Allow authenticated admin access (SELECT, UPDATE, DELETE)
*/

-- Safely drop existing policies if they exist
DROP POLICY IF EXISTS "public_registration_insert" ON students;
DROP POLICY IF EXISTS "admin_read_all" ON students;
DROP POLICY IF EXISTS "admin_update_all" ON students;
DROP POLICY IF EXISTS "admin_delete_all" ON students;

-- Also drop any other potential conflicting policies
DROP POLICY IF EXISTS "allow_registration_insert" ON students;
DROP POLICY IF EXISTS "allow_admin_select" ON students;
DROP POLICY IF EXISTS "allow_admin_update" ON students;
DROP POLICY IF EXISTS "allow_admin_delete" ON students;

-- Ensure RLS is enabled
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create new policies with unique names
CREATE POLICY "students_public_insert_v2"
  ON students
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "students_admin_select_v2"
  ON students
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "students_admin_update_v2"
  ON students
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "students_admin_delete_v2"
  ON students
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comment for documentation
COMMENT ON TABLE students IS 'Student registration with fixed RLS policies v2 - allows public registration and admin management';