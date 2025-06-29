-- Create messages table for basket chat functionality
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    basket_id UUID NOT NULL REFERENCES baskets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (length(content) > 0 AND length(content) <= 500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_basket_id ON messages(basket_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_basket_created ON messages(basket_id, created_at);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages

-- Allow users to read messages from baskets they have access to
CREATE POLICY "Users can read messages from accessible baskets" ON messages
    FOR SELECT USING (
        -- Public baskets: anyone can read
        EXISTS (
            SELECT 1 FROM baskets 
            WHERE baskets.id = messages.basket_id 
            AND baskets.is_private = false
        )
        OR
        -- Private baskets: only members can read
        EXISTS (
            SELECT 1 FROM basket_members 
            WHERE basket_members.basket_id = messages.basket_id 
            AND basket_members.user_id = auth.uid()
        )
    );

-- Allow users to insert messages into baskets they have access to
CREATE POLICY "Users can send messages to accessible baskets" ON messages
    FOR INSERT WITH CHECK (
        auth.uid() = user_id
        AND (
            -- Public baskets: anyone can send messages
            EXISTS (
                SELECT 1 FROM baskets 
                WHERE baskets.id = messages.basket_id 
                AND baskets.is_private = false
            )
            OR
            -- Private baskets: only members can send messages
            EXISTS (
                SELECT 1 FROM basket_members 
                WHERE basket_members.basket_id = messages.basket_id 
                AND basket_members.user_id = auth.uid()
            )
        )
    );

-- Users can only update their own messages (for editing functionality if needed)
CREATE POLICY "Users can update their own messages" ON messages
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own messages
CREATE POLICY "Users can delete their own messages" ON messages
    FOR DELETE USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON messages TO anon; 