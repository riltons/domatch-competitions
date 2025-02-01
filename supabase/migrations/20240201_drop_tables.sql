-- Drop tables if they exist
drop table if exists public.players cascade;
drop table if exists public.communities cascade;

-- Drop function if exists
drop function if exists public.handle_updated_at;
