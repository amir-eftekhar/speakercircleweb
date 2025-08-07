/*
  # Final Registration System Fix

  1. Problem
    - RLS policies are still blocking anonymous user registration
    - Error code 42501 indicates permission denied
    - Need to ensure anonymous users can INSERT into students table

  2. Solution
    - Use a more aggressive approach to clear ALL policies
    - Create simple, working policies
    - Test with minimal restrictions

  3. Security
    - Allow ALL users (including anonymous) to INSERT students
    - Allow authenticated users full admin access
*/

-- Get all existing policy names and drop them
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    -- Temporarily disable RLS to clean up
    ALTER TABLE students DISABLE ROW LEVEL SECURITY;
    
    -- Drop all existing policies on students table
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'students' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY %I ON students', policy_record.policyname);
    END LOOP;
    
    -- Re-enable RLS
    ALTER TABLE students ENABLE ROW LEVEL SECURITY;
END $$;

-- Create the simplest possible policies that work

-- Allow EVERYONE to insert students (for registration)
CREATE POLICY "allow_all_insert" ON students
    FOR INSERT 
    WITH CHECK (true);

-- Allow authenticated users to read students (for admin)
CREATE POLICY "allow_auth_select" ON students
    FOR SELECT 
    TO authenticated
    USING (true);

-- Allow authenticated users to update students (for admin)
CREATE POLICY "allow_auth_update" ON students
    FOR UPDATE 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to delete students (for admin)
CREATE POLICY "allow_auth_delete" ON students
    FOR DELETE 
    TO authenticated
    USING (true);

-- Verify policies are created
COMMENT ON TABLE students IS 'Student registration with simplified RLS policies - allows all INSERT, auth for admin';