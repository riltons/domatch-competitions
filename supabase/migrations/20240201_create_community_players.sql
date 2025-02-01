create table if not exists public.community_players (
  id uuid not null default uuid_generate_v4(),
  community_id uuid not null references public.communities(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  created_by uuid not null references auth.users(id) on delete cascade,
  primary key (id),
  unique (community_id, player_id)
);

-- Permissões
alter table public.community_players enable row level security;

create policy "Usuários autenticados podem visualizar os jogadores das comunidades"
  on public.community_players for select
  to authenticated
  using (true);

create policy "Usuários autenticados podem adicionar jogadores às suas comunidades"
  on public.community_players for insert
  to authenticated
  with check (
    exists (
      select 1 from public.communities
      where id = community_id
      and created_by = auth.uid()
    )
  );

create policy "Usuários autenticados podem remover jogadores das suas comunidades"
  on public.community_players for delete
  to authenticated
  using (
    exists (
      select 1 from public.communities
      where id = community_id
      and created_by = auth.uid()
    )
  );
