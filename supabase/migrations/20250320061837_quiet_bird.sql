-- Insert initial data for WCGF database

-- Insert games
INSERT INTO games (key, title, subtitle, created_at, updated_at) VALUES
('tarot', 'Super Tarot', 'A classic strategy card game', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('rummy', 'Super Rummy', 'The ultimate tile-matching game', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('scopa', 'Super Scopa', 'The Italian famous game', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert page types
INSERT INTO page_types (key, name, created_at, updated_at) VALUES
('home', 'Home Page', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('rules', 'Rules Page', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('leagues', 'Leagues Page', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tournaments', 'Tournaments Page', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('rankings', 'Rankings Page', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('game', 'Game Page', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert initial game pages for Tarot
INSERT INTO game_pages (game_id, page_type_id, content, meta, is_published, created_at, updated_at)
SELECT 
    g.id as game_id,
    pt.id as page_type_id,
    '{
        "en": {
            "page_header": {
                "title": "SUPER TAROT"
            },
            "introduction": {
                "title": "Welcome to Super Tarot",
                "text": "Discover the world of Super Tarot from World Card Games Federation, a thrilling card game of strategy and skill."
            }
        }
    }'::jsonb as content,
    '{
        "en": {
            "title": "Super Tarot | WCGF",
            "description": "Play Super Tarot online - the classic strategy card game",
            "keywords": "tarot, card game, strategy game",
            "og_title": "Super Tarot | WCGF",
            "og_description": "Play Super Tarot online",
            "og_image": "/img/tarot/tarot-en.webp"
        }
    }'::jsonb as meta,
    true as is_published,
    CURRENT_TIMESTAMP as created_at,
    CURRENT_TIMESTAMP as updated_at
FROM games g
CROSS JOIN page_types pt
WHERE g.key = 'tarot'
AND pt.key IN ('game', 'rules', 'leagues', 'tournaments', 'rankings');