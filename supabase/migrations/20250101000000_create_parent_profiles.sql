-- Create parent_profiles table
CREATE TABLE IF NOT EXISTS parent_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies for parent_profiles
ALTER TABLE parent_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON parent_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON parent_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON parent_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Add parent_id column to students table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='parent_id') THEN
        ALTER TABLE students ADD COLUMN parent_id UUID REFERENCES parent_profiles(id);
    END IF;
END $$;

-- Create RLS policies for students
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Parents can view and manage their own students
CREATE POLICY "Parents can view own students" ON students FOR SELECT USING (auth.uid() = parent_id);
CREATE POLICY "Parents can update own students" ON students FOR UPDATE USING (auth.uid() = parent_id);
CREATE POLICY "Parents can insert own students" ON students FOR INSERT WITH CHECK (auth.uid() = parent_id);

-- Admins can view all students (for admin panel)
CREATE POLICY "Admins can view all students" ON students FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM parent_profiles 
        WHERE id = auth.uid() 
        AND email = 'admin@speakerscircle.com'
    )
);

-- Create updated_at trigger for parent_profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_parent_profiles_updated_at BEFORE UPDATE ON parent_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();