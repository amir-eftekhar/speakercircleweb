/*
  # Comprehensive Fix for Students Table RLS Policy

  1. Changes
    - Drop any conflicting policies on students table
    - Recreate the INSERT policy for public registration
    - Ensure RLS is properly enabled
    - Add comprehensive policies for all operations

  2. Security
    - Allows anonymous users to INSERT (register)
    - Allows authenticated users full access
    - Maintains data security while enabling registration
*/

-- First, ensure RLS is enabled on students table
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts (if they exist)
DROP POLICY IF EXISTS "Allow public insert for student registration" ON students;
DROP POLICY IF EXISTS "Users can read own data" ON students;
DROP POLICY IF EXISTS "Enable insert for anon users" ON students;
DROP POLICY IF EXISTS "Enable read access for all users" ON students;

-- Create comprehensive RLS policies for students table

-- Allow anonymous and authenticated users to insert (for registration)
CREATE POLICY "Enable insert for registration"
  ON students
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all student data (for admin)
CREATE POLICY "Enable read for authenticated users"
  ON students
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update student data (for admin)
CREATE POLICY "Enable update for authenticated users"
  ON students
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete student data (for admin)
CREATE POLICY "Enable delete for authenticated users"
  ON students
  FOR DELETE
  TO authenticated
  USING (true);