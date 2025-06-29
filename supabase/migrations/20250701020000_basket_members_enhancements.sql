-- Enhancement migration for basket membership functionality

-- Ensure basket_members table has proper indexes
CREATE INDEX IF NOT EXISTS idx_basket_members_user_basket ON basket_members(user_id, basket_id);
CREATE INDEX IF NOT EXISTS idx_basket_members_creator ON basket_members(basket_id, is_creator);

-- Add policy for basket creators to manage members
DROP POLICY IF EXISTS "Basket creators can manage members" ON basket_members;
CREATE POLICY "Basket creators can manage members" ON basket_members
  FOR ALL
  USING (
    auth.uid() IS NOT NULL AND (
      -- User is the basket creator
      basket_id IN (SELECT id FROM baskets WHERE creator_id = auth.uid()) OR
      -- User is an admin
      auth.uid() IN (SELECT id FROM users WHERE role = 'admin') OR
      -- User is managing their own membership
      user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND (
      -- User is the basket creator
      basket_id IN (SELECT id FROM baskets WHERE creator_id = auth.uid()) OR
      -- User is an admin
      auth.uid() IN (SELECT id FROM users WHERE role = 'admin') OR
      -- User is joining themselves
      user_id = auth.uid()
    )
  );

-- Create helper function to get member count for a basket
CREATE OR REPLACE FUNCTION get_basket_member_count(basket_id_param UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::INTEGER
  FROM basket_members
  WHERE basket_id = basket_id_param;
$$;

-- Create helper function to check if user is basket creator
CREATE OR REPLACE FUNCTION is_basket_creator(basket_id_param UUID, user_id_param UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM basket_members 
    WHERE basket_id = basket_id_param 
      AND user_id = user_id_param 
      AND is_creator = true
  );
$$;

-- Create helper function to get user's total contributions to a basket
CREATE OR REPLACE FUNCTION get_user_basket_contributions(basket_id_param UUID, user_id_param UUID)
RETURNS TABLE(
  contribution_count INTEGER,
  total_amount_local NUMERIC,
  total_amount_usd NUMERIC,
  latest_contribution_at TIMESTAMPTZ
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    COUNT(*)::INTEGER as contribution_count,
    COALESCE(SUM(amount_local), 0) as total_amount_local,
    COALESCE(SUM(amount_usd), 0) as total_amount_usd,
    MAX(created_at) as latest_contribution_at
  FROM contributions
  WHERE basket_id = basket_id_param 
    AND user_id = user_id_param 
    AND confirmed = true;
$$;

-- Update baskets table to automatically update participants_count
CREATE OR REPLACE FUNCTION update_basket_participants_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the participants count for the affected basket
  UPDATE baskets 
  SET participants_count = (
    SELECT COUNT(*) 
    FROM basket_members 
    WHERE basket_id = COALESCE(NEW.basket_id, OLD.basket_id)
  )
  WHERE id = COALESCE(NEW.basket_id, OLD.basket_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers to automatically update participants count
DROP TRIGGER IF EXISTS trigger_update_participants_count_insert ON basket_members;
CREATE TRIGGER trigger_update_participants_count_insert
  AFTER INSERT ON basket_members
  FOR EACH ROW
  EXECUTE FUNCTION update_basket_participants_count();

DROP TRIGGER IF EXISTS trigger_update_participants_count_delete ON basket_members;
CREATE TRIGGER trigger_update_participants_count_delete
  AFTER DELETE ON basket_members
  FOR EACH ROW
  EXECUTE FUNCTION update_basket_participants_count();

-- Grant execute permissions on the helper functions
GRANT EXECUTE ON FUNCTION get_basket_member_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_basket_creator(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_basket_contributions(UUID, UUID) TO authenticated; 