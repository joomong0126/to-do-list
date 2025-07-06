import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://emoniavobqmvjmqwvsxf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtb25pYXZvYnFtdmptcXd2c3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MTEzOTAsImV4cCI6MjA2NzM4NzM5MH0.5VPmsQPjZYMM2uwMLwYEiNeSynMbw5alQxUq3xAgYB4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabase 테이블 타입 정의
export type Database = {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string
          title: string
          completed: boolean
          created_at: string
          user_id: string | null
          priority: 'low' | 'medium' | 'high'
          category: string
        }
        Insert: {
          id?: string
          title: string
          completed?: boolean
          created_at?: string
          user_id?: string | null
          priority?: 'low' | 'medium' | 'high'
          category?: string
        }
        Update: {
          id?: string
          title?: string
          completed?: boolean
          created_at?: string
          user_id?: string | null
          priority?: 'low' | 'medium' | 'high'
          category?: string
        }
      }
    }
  }
}

export type Todo = Database['public']['Tables']['todos']['Row']
