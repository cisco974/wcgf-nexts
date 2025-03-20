-- Create functions for WCGF database

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables to automatically update updated_at
CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_games_updated_at
    BEFORE UPDATE ON games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_types_updated_at
    BEFORE UPDATE ON page_types
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_pages_updated_at
    BEFORE UPDATE ON game_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to get game pages by locale
CREATE OR REPLACE FUNCTION get_game_pages_by_locale(
    p_game_key TEXT,
    p_page_type_key TEXT,
    p_locale TEXT
)
RETURNS TABLE (
    content JSONB,
    meta JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        gp.content,
        gp.meta
    FROM game_pages gp
    JOIN games g ON g.id = gp.game_id
    JOIN page_types pt ON pt.id = gp.page_type_id
    WHERE g.key = p_game_key
    AND pt.key = p_page_type_key
    AND gp.is_published = true;
END;
$$ LANGUAGE plpgsql;