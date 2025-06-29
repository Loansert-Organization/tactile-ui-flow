-- up: create notification_preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    setting_id text NOT NULL,
    enabled boolean DEFAULT true,
    PRIMARY KEY (user_id, setting_id)
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_prefs" ON notification_preferences;
CREATE POLICY "own_prefs" ON notification_preferences
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- down intentionally empty 