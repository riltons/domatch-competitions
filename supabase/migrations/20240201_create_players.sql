-- Create players table
create table if not exists public.players (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  nickname text,
  email text,
  phone text,
  active boolean default true not null,
  created_by uuid not null references auth.users(id),
  organizer_id uuid references auth.users(id),
  community_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create function to update updated_at if it doesn't exist
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
drop trigger if exists players_handle_updated_at on public.players;
create trigger players_handle_updated_at
  before update on public.players
  for each row
  execute function public.handle_updated_at();

-- Create players_communities table for many-to-many relationship
create table if not exists public.players_communities (
  player_id uuid not null references public.players(id) on delete cascade,
  community_id uuid not null references public.communities(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (player_id, community_id)
);

-- Create RLS policies for players
alter table public.players enable row level security;

-- Create select policy
create policy "Users can view their own players or players they organize"
  on public.players for select
  using (
    auth.uid() = created_by
    or auth.uid() = organizer_id
  );

-- Create insert policy
create policy "Users can insert their own players"
  on public.players for insert
  with check (auth.uid() = created_by);

-- Create update policy
create policy "Users can update their own players or players they organize"
  on public.players for update
  using (
    auth.uid() = created_by
    or auth.uid() = organizer_id
  );

-- Create delete policy
create policy "Users can delete their own players or players they organize"
  on public.players for delete
  using (
    auth.uid() = created_by
    or auth.uid() = organizer_id
  );

-- Create RLS policies for players_communities
alter table public.players_communities enable row level security;

-- Create select policy
create policy "Users can view players_communities they own or organize"
  on public.players_communities for select
  using (
    exists (
      select 1 from public.players
      where id = player_id
      and (
        created_by = auth.uid()
        or organizer_id = auth.uid()
      )
    )
    or
    exists (
      select 1 from public.communities
      where id = community_id
      and (
        created_by = auth.uid()
        or organizer_id = auth.uid()
      )
    )
  );

-- Create insert policy
create policy "Users can insert players_communities they own or organize"
  on public.players_communities for insert
  with check (
    exists (
      select 1 from public.players
      where id = player_id
      and (
        created_by = auth.uid()
        or organizer_id = auth.uid()
      )
    )
    or
    exists (
      select 1 from public.communities
      where id = community_id
      and (
        created_by = auth.uid()
        or organizer_id = auth.uid()
      )
    )
  );

-- Create delete policy
create policy "Users can delete players_communities they own or organize"
  on public.players_communities for delete
  using (
    exists (
      select 1 from public.players
      where id = player_id
      and (
        created_by = auth.uid()
        or organizer_id = auth.uid()
      )
    )
    or
    exists (
      select 1 from public.communities
      where id = community_id
      and (
        created_by = auth.uid()
        or organizer_id = auth.uid()
      )
    )
  );
