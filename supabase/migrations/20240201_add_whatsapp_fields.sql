-- Add WhatsApp related fields
ALTER TABLE public.communities
ADD COLUMN IF NOT EXISTS whatsapp_group_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS admin_phone VARCHAR(20);

ALTER TABLE public.community_players
ADD COLUMN IF NOT EXISTS invitation_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS player_phone VARCHAR(20);

-- Add phone column to players if not exists
ALTER TABLE public.players
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_communities_whatsapp_group_id ON public.communities(whatsapp_group_id);
CREATE INDEX IF NOT EXISTS idx_community_players_invitation_status ON public.community_players(invitation_status);

-- Add RLS policies
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.communities
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.communities
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for admin" ON public.communities
    FOR UPDATE
    USING (auth.uid() = created_by);
