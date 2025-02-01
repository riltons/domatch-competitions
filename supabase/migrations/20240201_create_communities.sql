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

-- Create communities table
create table if not exists public.communities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create trigger for updated_at
create trigger handle_communities_updated_at
  before update on public.communities
  for each row
  execute function public.handle_updated_at();

-- Add RLS policies
alter table public.communities enable row level security;

-- Allow users to select their own communities
create policy "Users can view their own communities" on public.communities
  for select using (
    user_id = auth.uid()
  );

-- Allow users to insert their own communities
create policy "Users can insert their own communities" on public.communities
  for insert with check (
    user_id = auth.uid()
  );

-- Allow users to update their own communities
create policy "Users can update their own communities" on public.communities
  for update using (
    user_id = auth.uid()
  );

-- Allow users to delete their own communities
create policy "Users can delete their own communities" on public.communities
  for delete using (
    user_id = auth.uid()
  );
