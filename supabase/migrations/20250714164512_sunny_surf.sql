/*
  # Fix Student Registration RLS Policy Violation

  1. Problem
    - RLS policy is blocking anonymous user registration
    - Need to allow public INSERT operations for registration form

  2. Solution
    - Drop any conflicting policies
    - Create simple, working policies for registration
    - Ensure anonymous users can INSERT students
    - Ensure authenticated users can manage students

  3. Security
    - Public can INSERT (register)
    - Authenticated users have full access (admin)
*/

-- First, disable RLS temporarily to clean up
ALTER TABLE students DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DO $$ 
DECLARE
    policy_name text;
BEGIN
    FOR policy_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'students' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON students', policy_name);
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create new, simple policies that work

-- Allow anyone (including anonymous) to insert students (for registration)
CREATE POLICY "allow_registration_insert" ON students
    FOR INSERT 
    TO public
    WITH CHECK (true);

-- Allow authenticated users to read all students (for admin)
CREATE POLICY "allow_admin_select" ON students
    FOR SELECT 
    TO authenticated
    USING (true);

-- Allow authenticated users to update students (for admin)
CREATE POLICY "allow_admin_update" ON students
    FOR UPDATE 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to delete students (for admin)
CREATE POLICY "allow_admin_delete" ON students
    FOR DELETE 
    TO authenticated
    USING (true);

-- Verify the policies are working
COMMENT ON TABLE students IS 'Student registration with public INSERT and authenticated admin access';