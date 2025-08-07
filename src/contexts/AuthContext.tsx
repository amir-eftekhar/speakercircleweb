import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  students: Student[];
}

interface Student {
  id: string;
  name: string;
  parent_name: string;
  parent_email: string;
  student_email?: string;
  class_id?: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  students: Array<{
    name: string;
    age: number;
    grade: string;
  }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      // Get user info from Supabase Auth
      const { data: authUser } = await supabase.auth.getUser();
      
      if (!authUser.user) {
        throw new Error('No authenticated user');
      }

      // Get students for this parent email
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('parent_email', authUser.user.email);

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
      }

      // Set user with auth data and students
      setUser({
        id: authUser.user.id,
        email: authUser.user.email || '',
        name: authUser.user.user_metadata?.name || authUser.user.email?.split('@')[0] || 'Parent',
        phone: authUser.user.user_metadata?.phone,
        students: students || []
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await fetchUserProfile(data.user.id);
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signup = async (userData: SignupData): Promise<{ success: boolean; error?: string }> => {
    try {
      // Create auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone
          }
        }
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Failed to create user' };
      }

      // Create students with the existing table structure
      if (userData.students.length > 0) {
        const studentsToInsert = userData.students.map(student => ({
          name: student.name,
          parent_name: userData.name,
          parent_email: userData.email,
          student_email: `${student.name.toLowerCase().replace(/\s+/g, '.')}@student.example.com`, // temporary email
          status: 'active'
        }));

        const { error: studentsError } = await supabase
          .from('students')
          .insert(studentsToInsert);

        if (studentsError) {
          console.error('Error creating students:', studentsError);
          // Don't fail the signup if student creation fails
        }
      }

      await fetchUserProfile(authData.user.id);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      // Update auth user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          name: userData.name,
          phone: userData.phone
        }
      });

      if (error) throw error;

      setUser({ ...user, ...userData });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};