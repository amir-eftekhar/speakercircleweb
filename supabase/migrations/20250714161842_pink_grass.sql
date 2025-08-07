/*
  # Add Pending Status to Students Table

  1. Changes
    - Update the status check constraint to include 'pending' status
    - This allows students to be in a pending approval state

  2. Security
    - No RLS changes needed (inherits existing policies)
    - Just expands the allowed status values
*/

-- Update the status constraint to include 'pending'
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_status_check;
ALTER TABLE students ADD CONSTRAINT students_status_check 
  CHECK (status IN ('pending', 'active', 'inactive', 'waitlist'));

-- Add comment for documentation
COMMENT ON COLUMN students.status IS 'Student status: pending (awaiting approval), active (enrolled), inactive (not enrolled), waitlist (waiting for spot)';