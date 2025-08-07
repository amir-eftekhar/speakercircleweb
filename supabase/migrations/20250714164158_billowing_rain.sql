/*
  # Final Fix for Student Registration

  1. Changes
    - Ensure RLS policies are correctly set for students table
    - Add comprehensive policies for all operations
    - Fix any policy conflicts

  2. Security
    - Allow anonymous users to INSERT (for registration)
    - Allow authenticated users full access (for admin)
    - Ensure no policy conflicts exist
*/

-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "Allow public insert for student registration" ON students;
DROP POLICY IF EXISTS "Enable insert for registration" ON students;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON students;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON students;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON students;
DROP POLICY IF EXISTS "Users can read own data" ON students;
DROP POLICY IF EXISTS "Enable insert for anon users" ON students;
DROP POLICY IF EXISTS "Enable read access for all users" ON students;

-- Ensure RLS is enabled
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for students table

-- Allow anonymous and authenticated users to insert (for registration)
CREATE POLICY "students_insert_policy"
  ON students
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all student data (for admin)
CREATE POLICY "students_select_policy"
  ON students
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update student data (for admin)
CREATE POLICY "students_update_policy"
  ON students
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete student data (for admin)
CREATE POLICY "students_delete_policy"
  ON students
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comment for documentation
COMMENT ON TABLE students IS 'Student registration and enrollment data with RLS enabled for public registration and admin management';