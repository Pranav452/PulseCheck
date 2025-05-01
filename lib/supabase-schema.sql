-- Enable Row Level Security (RLS)
alter table auth.users enable row level security;

-- Create schemas and tables
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null unique,
  name text not null,
  avatar_url text,
  created_at timestamp with time zone default now() not null
);

create table public.teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  invite_code text not null unique,
  created_at timestamp with time zone default now() not null,
  owner_id uuid not null references public.users(id) on delete cascade
);

create table public.team_members (
  id uuid default gen_random_uuid() primary key,
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null check (role in ('Owner', 'Admin', 'Member')),
  joined_at timestamp with time zone default now() not null,
  unique (team_id, user_id)
);

create table public.activities (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in ('commit', 'pull_request', 'message', 'blocker')),
  description text not null,
  timestamp timestamp with time zone default now() not null,
  user_id uuid not null references public.users(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  metadata jsonb
);

-- Create indexes for performance
create index team_members_team_id_idx on public.team_members(team_id);
create index team_members_user_id_idx on public.team_members(user_id);
create index activities_team_id_idx on public.activities(team_id);
create index activities_user_id_idx on public.activities(user_id);
create index activities_timestamp_idx on public.activities(timestamp);

-- Set up Row Level Security (RLS) policies
-- Users can only view/update their own data
create policy "Users can view own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own data" on public.users
  for update using (auth.uid() = id);

-- Team policies
create policy "Team members can view team data" on public.teams
  for select using (
    exists (
      select 1 from public.team_members
      where team_members.team_id = teams.id
      and team_members.user_id = auth.uid()
    )
  );

create policy "Team owners can update team data" on public.teams
  for update using (
    exists (
      select 1 from public.team_members
      where team_members.team_id = teams.id
      and team_members.user_id = auth.uid()
      and team_members.role = 'Owner'
    )
  );

-- Team Member policies
create policy "Team members can view member data" on public.team_members
  for select using (
    exists (
      select 1 from public.team_members as tm
      where tm.team_id = team_members.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team admins can manage members" on public.team_members
  for all using (
    exists (
      select 1 from public.team_members as tm
      where tm.team_id = team_members.team_id
      and tm.user_id = auth.uid()
      and (tm.role = 'Owner' or tm.role = 'Admin')
    )
  );

-- Activity policies
create policy "Team members can view activities" on public.activities
  for select using (
    exists (
      select 1 from public.team_members
      where team_members.team_id = activities.team_id
      and team_members.user_id = auth.uid()
    )
  );

create policy "Users can create activities for their teams" on public.activities
  for insert with check (
    exists (
      select 1 from public.team_members
      where team_members.team_id = activities.team_id
      and team_members.user_id = auth.uid()
    )
  );

-- Function to generate a random invite code
create or replace function generate_invite_code()
returns text as $$
declare
  chars text[] := '{A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0,1,2,3,4,5,6,7,8,9}';
  result text := '';
  i integer := 0;
begin
  for i in 1..8 loop
    result := result || chars[1+random()*(array_length(chars, 1)-1)];
  end loop;
  return result;
end;
$$ language plpgsql;

-- Trigger to automatically set invite_code on new teams
create or replace function set_invite_code()
returns trigger as $$
begin
  new.invite_code := generate_invite_code();
  return new;
end;
$$ language plpgsql;

create trigger trigger_set_invite_code
before insert on public.teams
for each row
when (new.invite_code is null)
execute function set_invite_code(); 