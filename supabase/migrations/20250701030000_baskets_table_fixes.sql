-- Fix baskets table column naming for consistency

-- Option 1: Add name column as alias to title (safer approach)
ALTER TABLE baskets ADD COLUMN IF NOT EXISTS name TEXT;

-- Update existing records to copy title to name
UPDATE baskets SET name = title WHERE name IS NULL;

-- Create trigger to keep name and title in sync
CREATE OR REPLACE FUNCTION sync_basket_title_name()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- If title is updated, update name
  IF NEW.title IS DISTINCT FROM OLD.title THEN
    NEW.name = NEW.title;
  END IF;
  
  -- If name is updated, update title
  IF NEW.name IS DISTINCT FROM OLD.name THEN
    NEW.title = NEW.name;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_sync_basket_title_name ON baskets;
CREATE TRIGGER trigger_sync_basket_title_name
  BEFORE UPDATE ON baskets
  FOR EACH ROW
  EXECUTE FUNCTION sync_basket_title_name();

-- Ensure both columns are never null
ALTER TABLE baskets ALTER COLUMN title SET NOT NULL;
ALTER TABLE baskets ALTER COLUMN name SET NOT NULL; 