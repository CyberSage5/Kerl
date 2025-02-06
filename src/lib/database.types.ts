export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_type: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_type: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_type?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      api_versions: {
        Row: {
          id: string
          project_id: string
          version_name: string
          spec_file: Json | null
          generated_docs: Json | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          version_name: string
          spec_file?: Json | null
          generated_docs?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          version_name?: string
          spec_file?: Json | null
          generated_docs?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      endpoints: {
        Row: {
          id: string
          api_version_id: string
          path: string
          method: string
          summary: string | null
          description: string | null
          request_body: Json | null
          response_schema: Json | null
          examples: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          api_version_id: string
          path: string
          method: string
          summary?: string | null
          description?: string | null
          request_body?: Json | null
          response_schema?: Json | null
          examples?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          api_version_id?: string
          path?: string
          method?: string
          summary?: string | null
          description?: string | null
          request_body?: Json | null
          response_schema?: Json | null
          examples?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          user_id: string
          endpoint_id: string | null
          api_version_id: string | null
          feedback_type: string
          content: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          endpoint_id?: string | null
          api_version_id?: string | null
          feedback_type: string
          content: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          endpoint_id?: string | null
          api_version_id?: string | null
          feedback_type?: string
          content?: string
          status?: string
          created_at?: string
        }
      }
    }
  }
}