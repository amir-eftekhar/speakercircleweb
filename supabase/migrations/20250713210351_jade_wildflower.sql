/*
  # Enhance Student Registration Fields

  1. Changes
    - Add parent_name column to students table
    - Add student_email column to students table
    - Keep existing parent_email column
    - All new columns are optional for backward compatibility

  2. Security
    - No RLS changes needed (inherits existing policies)
    - Columns are text type for storing contact information
*/

-- Add parent_name column to students table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'parent_name'
  ) THEN
    ALTER TABLE students ADD COLUMN parent_name text;
  END IF;
END $$;

-- Add student_email column to students table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'student_email'
  ) THEN
    ALTER TABLE students ADD COLUMN student_email text;
  END IF;
END $$;

-- Add comments column to students table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'comments'
  ) THEN
    ALTER TABLE students ADD COLUMN comments text;
  END IF;
END $$;

-- Add comments for documentation
COMMENT ON COLUMN students.parent_name IS 'Full name of parent or guardian';
COMMENT ON COLUMN students.student_email IS 'Student email address (optional)';
COMMENT ON COLUMN students.comments IS 'Additional comments or notes about the student';