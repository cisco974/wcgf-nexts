-- Create views for WCGF database

-- View for published game pages with related data
CREATE OR REPLACE VIEW vw_published_game_pages AS
SELECT 
    gp.id,
    g.key as game_key,
    g.title as game_title,
    pt.key as page_type_key,
    pt.name as page_type_name,
    gp.content,
    gp.meta,
    gp.created_at,
    gp.updated_at
FROM game_pages gp
JOIN games g ON g.id = gp.game_id
JOIN page_types pt ON pt.id = gp.page_type_id
WHERE gp.is_published = true;

-- View for game statistics
CREATE OR REPLACE VIEW vw_game_statistics AS
SELECT 
    g.key as game_key,
    g.title as game_title,
    COUNT(gp.id) as total_pages,
    SUM(CASE WHEN gp.is_published THEN 1 ELSE 0 END) as published_pages,
    MIN(gp.created_at) as first_page_created,
    MAX(gp.updated_at) as last_page_updated
FROM games g
LEFT JOIN game_pages gp ON g.id = gp.game_id
GROUP BY g.id, g.key, g.title;