-- Enable http extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "http";

-- Create function to notify webhook (commented out for now)
CREATE OR REPLACE FUNCTION notify_webhook()
RETURNS trigger AS $$
BEGIN
  -- For now, just return NEW without making HTTP request
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers
DROP TRIGGER IF EXISTS communities_webhook_trigger ON public.communities;
DROP TRIGGER IF EXISTS community_players_webhook_trigger ON public.community_players;

-- Create trigger for communities table
-- CREATE TRIGGER communities_webhook_trigger
--   AFTER INSERT
--   ON public.communities
--   FOR EACH ROW
--   EXECUTE FUNCTION notify_webhook();

-- Create trigger for community_players table
-- CREATE TRIGGER community_players_webhook_trigger
--   AFTER INSERT
--   ON public.community_players
--   FOR EACH ROW
--   EXECUTE FUNCTION notify_webhook();

-- Cria a tabela de profiles se não existir
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    name TEXT NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Cria política de acesso para a tabela profiles
CREATE POLICY "Usuários podem ver todos os perfis"
    ON profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Usuários podem atualizar seus próprios perfis"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seus próprios perfis"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Habilita RLS na tabela profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Adiciona coluna admin_id na tabela communities se não existir
ALTER TABLE communities ADD COLUMN IF NOT EXISTS admin_id UUID REFERENCES auth.users(id);

-- Atualiza o admin_id com o usuário que criou a comunidade
UPDATE communities SET admin_id = created_by WHERE admin_id IS NULL;

-- Torna o admin_id obrigatório
ALTER TABLE communities ALTER COLUMN admin_id SET NOT NULL;

-- Adiciona webhook para atualizar o telefone do admin da comunidade
CREATE OR REPLACE FUNCTION update_community_admin_phone()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE communities 
    SET admin_phone = (
        SELECT phone 
        FROM profiles 
        WHERE id = NEW.admin_id
    )
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o telefone do admin ao criar/atualizar uma comunidade
DROP TRIGGER IF EXISTS update_community_admin_phone_trigger ON communities;
CREATE TRIGGER update_community_admin_phone_trigger
    AFTER INSERT OR UPDATE OF admin_id ON communities
    FOR EACH ROW
    EXECUTE FUNCTION update_community_admin_phone();
