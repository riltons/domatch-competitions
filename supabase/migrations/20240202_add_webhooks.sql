-- Create function to notify webhook
CREATE OR REPLACE FUNCTION notify_webhook()
RETURNS trigger AS $$
BEGIN
  -- Make HTTP request to n8n webhook
  PERFORM
    net.http_post(
      'http://n8n:5678/webhook/' || TG_TABLE_NAME,  -- URL do webhook
      CAST(row_to_json(NEW) as text),               -- Corpo da requisição
      '{}'::jsonb,                                  -- Headers
      0                                             -- Timeout
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for communities table
DROP TRIGGER IF EXISTS communities_webhook_trigger ON public.communities;
CREATE TRIGGER communities_webhook_trigger
  AFTER INSERT
  ON public.communities
  FOR EACH ROW
  EXECUTE FUNCTION notify_webhook();

-- Create trigger for community_players table
DROP TRIGGER IF EXISTS community_players_webhook_trigger ON public.community_players;
CREATE TRIGGER community_players_webhook_trigger
  AFTER INSERT
  ON public.community_players
  FOR EACH ROW
  EXECUTE FUNCTION notify_webhook();
