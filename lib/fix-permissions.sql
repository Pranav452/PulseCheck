-- This script fixes permissions issues with the Supabase tables

-- First, make sure RLS is enabled for all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Team members can view team data" ON public.teams;
DROP POLICY IF EXISTS "Team owners can update team data" ON public.teams;
DROP POLICY IF EXISTS "Team members can view member data" ON public.team_members;
DROP POLICY IF EXISTS "Team admins can manage members" ON public.team_members;
DROP POLICY IF EXISTS "Team members can view activities" ON public.activities;
DROP POLICY IF EXISTS "Users can create activities for their teams" ON public.activities;

-- Allow anon and authenticated users to create their own user records
CREATE POLICY "Allow users to create their own record" ON public.users 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to view their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to view teams they belong to
CREATE POLICY "Team members can view team data" ON public.teams
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = teams.id
      AND team_members.user_id = auth.uid()
    )
  );

-- Allow authenticated users to insert teams
CREATE POLICY "Users can create teams" ON public.teams
  FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());

-- Allow authenticated users to update teams they own
CREATE POLICY "Team owners can update team data" ON public.teams
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = teams.id
      AND team_members.user_id = auth.uid()
      AND team_members.role = 'Owner'
    )
  );

-- Allow authenticated users to view team members for teams they belong to
CREATE POLICY "Team members can view member data" ON public.team_members
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.team_members as tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
    )
  );

-- Allow authenticated users to insert themselves as team members
CREATE POLICY "Users can join teams" ON public.team_members
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Allow team admins to insert other users as team members
CREATE POLICY "Admins can add team members" ON public.team_members
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members as tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
      AND (tm.role = 'Owner' OR tm.role = 'Admin')
    )
  );

-- Allow team admins to manage team members
CREATE POLICY "Team admins can manage members" ON public.team_members
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.team_members as tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
      AND (tm.role = 'Owner' OR tm.role = 'Admin')
    )
  );

-- Allow authenticated users to view activities for teams they belong to
CREATE POLICY "Team members can view activities" ON public.activities
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = activities.team_id
      AND team_members.user_id = auth.uid()
    )
  );

-- Allow authenticated users to create activities for their teams
CREATE POLICY "Users can create activities for their teams" ON public.activities
  FOR INSERT TO authenticated WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = activities.team_id
      AND team_members.user_id = auth.uid()
    )
  );

-- Grant additional permissions to the anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT ON public.users TO anon;
GRANT SELECT ON public.teams TO anon;
GRANT SELECT, INSERT ON public.team_members TO anon;
GRANT SELECT ON public.activities TO anon;

-- Grant permissions to the authenticated role
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.teams TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.team_members TO authenticated;
GRANT SELECT, INSERT ON public.activities TO authenticated; 