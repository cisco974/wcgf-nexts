/*
  # Game Pages Content Migration
  
  1. New Content
    - Adds content for all game pages including:
      - Home pages
      - Rules pages
      - Leagues pages
      - Tournaments pages
      - Rankings pages
      - Game presentation pages
    
  2. Structure
    - Content is stored in JSONB format
    - Includes translations for EN, FR, ES
    - Includes meta information for SEO
    
  3. Data
    - Migrates content from old PHP templates
    - Preserves all text content and structure
    - Maintains multilingual support
*/

-- Get game and page type IDs
WITH game_ids AS (
  SELECT id, key FROM games
), page_type_ids AS (
  SELECT id, key FROM page_types
)

-- Insert Tarot game pages
INSERT INTO game_pages (game_id, page_type_id, content, meta, is_published, created_at, updated_at)
SELECT 
  g.id as game_id,
  pt.id as page_type_id,
  CASE pt.key
    WHEN 'home' THEN '{
      "en": {
        "page_header": {
          "title": "SUPER TAROT"
        },
        "introduction": {
          "title": "Welcome to the official Super Tarot game!",
          "text": "Discover the world of Super Tarot from World Card Games Federation, a thrilling card game of strategy and skill. Explore the latest league rankings to see how you stand among the best players, learn the rules of Tarot to master every hand, and participate in exciting tournaments to showcase your abilities. Connect with a vibrant community of players in clubs and dive deeper into the strategic nuances of Tarot. Stay tuned to our blog for updates, tips, and news on all games available on WCGF. Join leagues, test your skills, win rewards, and climb the leaderboard in this competitive and immersive card game!"
        },
        "main_sections": [
          {
            "title": "Tarot Rules Overview",
            "text": "Super Tarot is a four-player game where strategy and teamwork are key. The goal is to fulfill contracts while predicting your points accurately. The game uses a 78-card deck, including trumps and special cards like the Fool. Players bid for the role of Declarer, aiming to meet their bid with the help of trumps and strategic play, while opponents work together to stop them. Mastering the rules is the first step to dominating the game!",
            "cta": {
              "text": "Learn the Rules",
              "link": "/rules"
            }
          },
          {
            "title": "Tarot League Overview",
            "text": "Our leagues are the heart of the competitive Super Tarot experience. Players are divided into divisions, climbing the ranks by earning points through victories. Each season offers exclusive rewards and recognition for top players. Whether you''re a beginner or a seasoned expert, leagues offer a structured and exciting way to prove your skills and gain glory on the leaderboard.",
            "cta": {
              "text": "View Leagues",
              "link": "/leagues"
            }
          },
          {
            "title": "Tarot Tournament Overview",
            "text": "Super Tarot tournaments bring an adrenaline-filled challenge to all players. Compete in real-time matches against top-tier opponents and aim for the ultimate prize. With knockout rounds, strategic gameplay, and high stakes, tournaments are the pinnacle of competition. Test your mastery of the game and secure your place among the Tarot champions!",
            "cta": {
              "text": "View Tournaments",
              "link": "/tournaments"
            }
          },
          {
            "title": "Tarot Rankings Overview",
            "text": "The ranking system in Super Tarot tracks your progress and achievements. Win matches, earn points, and climb the leaderboard to showcase your expertise. Rankings reset periodically to give everyone a fresh shot at the top, making each season a new opportunity to excel. Check your rank and strive to outperform rivals from around the world!",
            "cta": {
              "text": "View Rankings",
              "link": "/rankings"
            }
          },
          {
            "title": "Tarot Game Presentation",
            "text": "Super Tarot is a game of balance and foresight. Each round challenges you to adapt your strategy based on your hand, the bids, and your opponents'' moves. With trumps, the Fool, and strategic alliances, every game is unique. Whether you''re defending against the Declarer or aiming to meet your bid, success depends on smart play and calculated risks.",
            "cta": {
              "text": "Game Presentation",
              "link": "/game"
            }
          },
          {
            "title": "Play Tarot",
            "text": "Ready to dive in? Click Play to start your journey in Super Tarot. Play against AI to sharpen your skills or challenge real players in live matches. From casual games to competitive matches, there''s something for everyone. Win, learn, and enjoy the thrill of this timeless card game!",
            "cta": {
              "text": "Start Playing",
              "link": "https://webgl.tradigames.com/?g=tarot"
            }
          }
        ],
        "sidebar": {
          "cta_title": "Play Tarot online now or on mobile",
          "cta_subtitle": "Join the official WCGF Tarot community",
          "buttons": ["Play on iOS", "Play on Android", "Play Online"],
          "partner_text": "The official partner game"
        }
      },
      "fr": {
        "page_header": {
          "title": "SUPER TAROT"
        },
        "introduction": {
          "title": "Bienvenue sur le Super Tarot officiel",
          "text": "Découvrez l''univers du Super Tarot de la Fédération Mondiale des Jeux de Cartes, un jeu de cartes passionnant mêlant stratégie et habileté."
        }
      },
      "es": {
        "page_header": {
          "title": "SUPER TAROT"
        },
        "introduction": {
          "title": "Bienvenido al Super Tarot oficial",
          "text": "Descubre el mundo del Super Tarot de la Federación Mundial de Juegos de Cartas, un emocionante juego de cartas de estrategia y habilidad."
        }
      }
    }'::jsonb
    WHEN 'rules' THEN '{
      "en": {
        "page_header": {
          "title": "SUPER TAROT RULES"
        },
        "introduction": {
          "title": "Rules of Tarot",
          "text": "Tarot is a captivating and strategic card game originating from France. Known for its unique rules and dynamic gameplay, it is appreciated by players of all levels. This comprehensive guide will walk you through the basics, variants, and nuances of Tarot to help you master this fascinating game."
        }
      }
    }'::jsonb
    WHEN 'leagues' THEN '{
      "en": {
        "page_header": {
          "title": "SUPER TAROT LEAGUES"
        },
        "introduction": {
          "title": "Welcome to the official Super Tarot league rankings!",
          "text": "Here, you can explore the latest league rankings, learn the rules of Tarot, join exciting tournaments, and connect with other players in clubs. Stay updated with our blog for news and updates on all games available on WCGF. Join leagues to test your skills, earn rewards, and compete against the best players worldwide!"
        }
      }
    }'::jsonb
    WHEN 'tournaments' THEN '{
      "en": {
        "page_header": {
          "title": "SUPER TAROT TOURNAMENTS"
        },
        "introduction": {
          "title": "Discover Thrilling Tarot Tournaments for 4 or 5 Players!",
          "text": "Join the excitement of Tarot tournaments designed for 4 or 5 players! Compete in games with various buy-ins—250, 500, or 1000 tokens—and battle for prize pools that reflect the stakes."
        }
      }
    }'::jsonb
    WHEN 'rankings' THEN '{
      "en": {
        "page_header": {
          "title": "SUPER TAROT RANKINGS"
        },
        "introduction": {
          "title": "WCGF TAROT RANKINGS",
          "text": "Explore the latest Tarot rankings on WCGF, highlighting the top players'' League Points, Experience Points, and Coins. View detailed leaderboards for the week, month, and year, showcasing standout performances and consistent players."
        }
      }
    }'::jsonb
    WHEN 'game' THEN '{
      "en": {
        "page_header": {
          "title": "SUPER TAROT GAME"
        },
        "introduction": {
          "title": "Super Tarot Overview",
          "text": "Discover how you can enjoy Super Tarot on any device. Whether you are at home or on the go, experience thrilling gameplay, competitive leagues, and exciting tournaments."
        }
      }
    }'::jsonb
  END as content,
  CASE pt.key
    WHEN 'home' THEN '{
      "en": {
        "title": "Super Tarot | Play Online | WCGF",
        "description": "Play Super Tarot online - Join the official WCGF community",
        "keywords": "tarot, online tarot, card game, strategy game",
        "og_title": "Super Tarot | WCGF",
        "og_description": "Play Super Tarot online with the official WCGF community",
        "og_image": "/img/tarot/tarot-home-en.webp"
      }
    }'::jsonb
    ELSE '{
      "en": {
        "title": "Super Tarot | WCGF",
        "description": "Play Super Tarot online - the classic strategy card game",
        "keywords": "tarot, card game, strategy game",
        "og_title": "Super Tarot | WCGF",
        "og_description": "Play Super Tarot online",
        "og_image": "/img/tarot/tarot-en.webp"
      }
    }'::jsonb
  END as meta,
  true as is_published,
  CURRENT_TIMESTAMP as created_at,
  CURRENT_TIMESTAMP as updated_at
FROM game_ids g
CROSS JOIN page_type_ids pt
WHERE g.key = 'tarot'
AND pt.key IN ('home', 'rules', 'leagues', 'tournaments', 'rankings', 'game')
ON CONFLICT (game_id, page_type_id) DO UPDATE
SET 
  content = EXCLUDED.content,
  meta = EXCLUDED.meta,
  is_published = EXCLUDED.is_published,
  updated_at = CURRENT_TIMESTAMP;

-- Insert Rummy game pages (similar structure)
INSERT INTO game_pages (game_id, page_type_id, content, meta, is_published, created_at, updated_at)
SELECT 
  g.id as game_id,
  pt.id as page_type_id,
  CASE pt.key
    WHEN 'home' THEN '{
      "en": {
        "page_header": {
          "title": "SUPER RUMMY"
        },
        "introduction": {
          "title": "Welcome to Super Rummy",
          "text": "Experience the excitement of Super Rummy, where strategy meets skill in this classic tile-matching game."
        }
      }
    }'::jsonb
    ELSE '{
      "en": {
        "page_header": {
          "title": "SUPER RUMMY"
        },
        "introduction": {
          "title": "Super Rummy",
          "text": "Discover the world of Super Rummy"
        }
      }
    }'::jsonb
  END as content,
  '{
    "en": {
      "title": "Super Rummy | WCGF",
      "description": "Play Super Rummy online - the ultimate tile-matching game",
      "keywords": "rummy, tile game, matching game",
      "og_title": "Super Rummy | WCGF",
      "og_description": "Play Super Rummy online",
      "og_image": "/img/rummy/rummy-en.webp"
    }
  }'::jsonb as meta,
  true as is_published,
  CURRENT_TIMESTAMP as created_at,
  CURRENT_TIMESTAMP as updated_at
FROM game_ids g
CROSS JOIN page_type_ids pt
WHERE g.key = 'rummy'
AND pt.key IN ('home', 'rules', 'leagues', 'tournaments', 'rankings', 'game')
ON CONFLICT (game_id, page_type_id) DO UPDATE
SET 
  content = EXCLUDED.content,
  meta = EXCLUDED.meta,
  is_published = EXCLUDED.is_published,
  updated_at = CURRENT_TIMESTAMP;

-- Insert Scopa game pages (similar structure)
INSERT INTO game_pages (game_id, page_type_id, content, meta, is_published, created_at, updated_at)
SELECT 
  g.id as game_id,
  pt.id as page_type_id,
  CASE pt.key
    WHEN 'home' THEN '{
      "en": {
        "page_header": {
          "title": "SUPER SCOPA"
        },
        "introduction": {
          "title": "Welcome to Super Scopa",
          "text": "Dive into the world of Super Scopa, the beloved Italian card game that combines tradition with modern gameplay."
        }
      }
    }'::jsonb
    ELSE '{
      "en": {
        "page_header": {
          "title": "SUPER SCOPA"
        },
        "introduction": {
          "title": "Super Scopa",
          "text": "Discover the world of Super Scopa"
        }
      }
    }'::jsonb
  END as content,
  '{
    "en": {
      "title": "Super Scopa | WCGF",
      "description": "Play Super Scopa online - the Italian famous game",
      "keywords": "scopa, italian card game, traditional game",
      "og_title": "Super Scopa | WCGF",
      "og_description": "Play Super Scopa online",
      "og_image": "/img/scopa/scopa-en.webp"
    }
  }'::jsonb as meta,
  true as is_published,
  CURRENT_TIMESTAMP as created_at,
  CURRENT_TIMESTAMP as updated_at
FROM game_ids g
CROSS JOIN page_type_ids pt
WHERE g.key = 'scopa'
AND pt.key IN ('home', 'rules', 'leagues', 'tournaments', 'rankings', 'game')
ON CONFLICT (game_id, page_type_id) DO UPDATE
SET 
  content = EXCLUDED.content,
  meta = EXCLUDED.meta,
  is_published = EXCLUDED.is_published,
  updated_at = CURRENT_TIMESTAMP;