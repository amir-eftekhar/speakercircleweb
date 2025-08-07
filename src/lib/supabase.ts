import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      pages: {
        Row: {
          id: string
          slug: string
          title: string
          content: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          content: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          content?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          schedule: string
          price: number
          description: string
          registration_link: string | null
          active: boolean
          group_limit: number
          current_enrolled: number
          waitlist_enabled: boolean
          waitlist_count: number
        }
        Insert: {
          id?: string
          name: string
          schedule: string
          price: number
          description: string
          registration_link?: string | null
          active?: boolean
          group_limit?: number
          current_enrolled?: number
          waitlist_enabled?: boolean
          waitlist_count?: number
        }
        Update: {
          id?: string
          name?: string
          schedule?: string
          price?: number
          description?: string
          registration_link?: string | null
          active?: boolean
          group_limit?: number
          current_enrolled?: number
          waitlist_enabled?: boolean
          waitlist_count?: number
        }
      }
      site_settings: {
        Row: {
          id: string
          logo_url: string | null
          slogan: string
          hero_text: string
          footer_text: string
          contact_email: string
          updated_at: string
        }
        Insert: {
          id?: string
          logo_url?: string | null
          slogan: string
          hero_text: string
          footer_text: string
          contact_email: string
          updated_at?: string
        }
        Update: {
          id?: string
          logo_url?: string | null
          slogan?: string
          hero_text?: string
          footer_text?: string
          contact_email?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          name: string
          parent_email: string
          class_id: string | null
          status: string
          moved_to_class_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          parent_email: string
          class_id?: string | null
          status?: string
          moved_to_class_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          parent_email?: string
          class_id?: string | null
          status?: string
          moved_to_class_id?: string | null
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          duration: string
          location: string
          registration_link: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          date: string
          duration: string
          location: string
          registration_link?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date?: string
          duration?: string
          location?: string
          registration_link?: string | null
        }
      }
      one_on_one: {
        Row: {
          id: string
          description: string
          booking_link: string | null
          email_contact: string
          active: boolean
        }
        Insert: {
          id?: string
          description: string
          booking_link?: string | null
          email_contact: string
          active?: boolean
        }
        Update: {
          id?: string
          description?: string
          booking_link?: string | null
          email_contact?: string
          active?: boolean
        }
      }
      registrations: {
        Row: {
          id: string
          student_id: string
          parent_email: string
          class_id: string
          timestamp: string
          payment_status: string
        }
        Insert: {
          id?: string
          student_id: string
          parent_email: string
          class_id: string
          timestamp?: string
          payment_status?: string
        }
        Update: {
          id?: string
          student_id?: string
          parent_email?: string
          class_id?: string
          payment_status?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_email: string
          amount: number
          stripe_payment_id: string | null
          status: string
          created_at: string
          receipt_url: string | null
          student_id: string | null
          class_id: string | null
        }
        Insert: {
          id?: string
          user_email: string
          amount: number
          stripe_payment_id?: string | null
          status?: string
          created_at?: string
          receipt_url?: string | null
          student_id?: string | null
          class_id?: string | null
        }
        Update: {
          id?: string
          user_email?: string
          amount?: number
          stripe_payment_id?: string | null
          status?: string
          receipt_url?: string | null
          student_id?: string | null
          class_id?: string | null
        }
      }
    }
  }
}