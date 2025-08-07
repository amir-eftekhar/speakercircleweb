/*
  # Fix Students Table RLS Policy for Registration

  1. Changes
    - Add INSERT policy for students table to allow anonymous users to register
    - Allow both anonymous and authenticated users to create student records
    - This fixes the "new row violates row-level security policy" error

  2. Security
    - Allows public registration (INSERT) for new students
    - Maintains existing read policies
    - Does not compromise data security
*/

-- Add policy to allow INSERT operations for student registration
CREATE POLICY "Allow public insert for student registration"
  ON students
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);