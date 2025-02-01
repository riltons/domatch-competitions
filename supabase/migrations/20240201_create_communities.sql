-- Create communities table
create table if not exists public.communities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  created_by uuid not null references auth.users(id),
  organizer_id uuid references auth.users(id),
  active boolean default true not null,
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
drop trigger if exists communities_handle_updated_at on public.communities;
create trigger communities_handle_updated_at
  before update on public.communities
  for each row
  execute function public.handle_updated_at();

-- Add RLS policies
alter table public.communities enable row level security;

-- Create select policy
create policy "Users can view their own communities or communities they organize"
  on public.communities for select
  using (
    auth.uid() = created_by
    or auth.uid() = organizer_id
  );

-- Create insert policy
create policy "Users can insert their own communities"
  on public.communities for insert
  with check (auth.uid() = created_by);

-- Create update policy
create policy "Users can update their own communities or communities they organize"
  on public.communities for update
  using (
    auth.uid() = created_by
    or auth.uid() = organizer_id
  );

-- Create delete policy
create policy "Users can delete their own communities or communities they organize"
  on public.communities for delete
  using (
    auth.uid() = created_by
    or auth.uid() = organizer_id
  );
