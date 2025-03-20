-- Create additional indexes for WCGF database

-- Index for faster game lookups by key
CREATE INDEX IF NOT EXISTS idx_games_key ON games USING btree (key);

-- Index for faster page type lookups by key
CREATE INDEX IF NOT EXISTS idx_page_types_key ON page_types USING btree (key);

-- Index for game pages published status
CREATE INDEX IF NOT EXISTS idx_game_pages_is_published ON game_pages USING btree (is_published);

-- Index for game pages content search (using GIN for JSONB)
CREATE INDEX IF NOT EXISTS idx_game_pages_content ON game_pages USING gin (content);

-- Index for game pages meta search (using GIN for JSONB)
CREATE INDEX IF NOT EXISTS idx_game_pages_meta ON game_pages USING gin (meta);

-- Composite index for game pages filtering
CREATE INDEX IF NOT EXISTS idx_game_pages_composite 
ON game_pages (game_id, page_type_id, is_published);

-- Index for updated_at timestamps (for sorting and filtering)
CREATE INDEX IF NOT EXISTS idx_game_pages_updated_at ON game_pages (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_games_updated_at ON games (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_types_updated_at ON page_types (updated_at DESC);