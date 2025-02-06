/*
  # Initial Schema Setup for Kerl

  1. New Tables
    - `profiles`
      - Stores user profile information
      - Links to Supabase auth.users
    - `projects`
      - Stores API documentation projects
    - `api_versions`
      - Stores different versions of API documentation
    - `endpoints`
      - Stores API endpoint documentation
    - `feedback`
      - Stores user feedback on AI-generated documentation

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  user_type text NOT NULL CHECK (user_type IN ('developer', 'consumer')),
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  name text NOT NULL,
  description text,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create api_versions table
CREATE TABLE IF NOT EXISTS api_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) NOT NULL,
  version_name text NOT NULL,
  spec_file jsonb,
  generated_docs jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create endpoints table
CREATE TABLE IF NOT EXISTS endpoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_version_id uuid REFERENCES api_versions(id) NOT NULL,
  path text NOT NULL,
  method text NOT NULL,
  summary text,
  description text,
  request_body jsonb,
  response_schema jsonb,
  examples jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  endpoint_id uuid REFERENCES endpoints(id),
  api_version_id uuid REFERENCES api_versions(id),
  feedback_type text NOT NULL CHECK (feedback_type IN ('suggestion', 'improvement', 'error')),
  content text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'implemented')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- API Versions policies
CREATE POLICY "Users can view versions of their projects"
  ON api_versions FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create versions for their projects"
  ON api_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Endpoints policies
CREATE POLICY "Users can view endpoints of their versions"
  ON endpoints FOR SELECT
  TO authenticated
  USING (
    api_version_id IN (
      SELECT av.id FROM api_versions av
      JOIN projects p ON av.project_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- Feedback policies
CREATE POLICY "Users can view feedback on their projects"
  ON feedback FOR SELECT
  TO authenticated
  USING (
    api_version_id IN (
      SELECT av.id FROM api_versions av
      JOIN projects p ON av.project_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());