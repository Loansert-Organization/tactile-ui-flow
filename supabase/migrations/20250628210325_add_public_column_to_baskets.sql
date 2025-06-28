ALTER TABLE public.baskets ADD COLUMN IF NOT EXISTS public BOOLEAN DEFAULT FALSE;
ALTER TABLE public.baskets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS creator_or_member_read ON public.baskets;
DROP POLICY IF EXISTS creator_or_member_read_baskets ON public.baskets;

CREATE POLICY creator_or_member_read_baskets
  ON public.baskets
  FOR SELECT
  USING (
    creator_id = auth.uid() OR
    public = TRUE OR
    id IN (SELECT basket_id FROM public.basket_members WHERE user_id = auth.uid())
  );
