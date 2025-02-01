-- Create players table
create table if not exists public.players (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  nickname text,
  email text,
  phone text,
  community_id uuid not null references public.communities(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create function to update updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Create trigger for updated_at
create trigger handle_players_updated_at
  before update on public.players
  for each row
  execute function public.handle_updated_at();

-- Add RLS policies
alter table public.players enable row level security;

-- Allow users to select players from their communities
create policy "Users can view players from their communities" on public.players
  for select using (
    exists (
      select 1 from public.communities
      where communities.id = players.community_id
      and communities.user_id = auth.uid()
    )
  );

-- Allow users to insert players in their communities
create policy "Users can insert players in their communities" on public.players
  for insert with check (
    exists (
      select 1 from public.communities
      where communities.id = players.community_id
      and communities.user_id = auth.uid()
    )
  );

-- Allow users to update players from their communities
create policy "Users can update players from their communities" on public.players
  for update using (
    exists (
      select 1 from public.communities
      where communities.id = players.community_id
      and communities.user_id = auth.uid()
    )
  );

-- Allow users to delete players from their communities
create policy "Users can delete players from their communities" on public.players
  for delete using (
    exists (
      select 1 from public.communities
      where communities.id = players.community_id
      and communities.user_id = auth.uid()
    )
  );
