-- Create tables for WCGF database

-- Users table
CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- Games table
CREATE TABLE IF NOT EXISTS "games" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- Create unique index on game key
CREATE UNIQUE INDEX IF NOT EXISTS "games_key_key" ON "games"("key");

-- Page types table
CREATE TABLE IF NOT EXISTS "page_types" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "page_types_pkey" PRIMARY KEY ("id")
);

-- Create unique index on page type key
CREATE UNIQUE INDEX IF NOT EXISTS "page_types_key_key" ON "page_types"("key");

-- Game pages table
CREATE TABLE IF NOT EXISTS "game_pages" (
    "id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "page_type_id" INTEGER NOT NULL,
    "content" JSONB NOT NULL DEFAULT '{}',
    "meta" JSONB NOT NULL DEFAULT '{}',
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "game_pages_pkey" PRIMARY KEY ("id")
);

-- Create unique composite index on game_id and page_type_id
CREATE UNIQUE INDEX IF NOT EXISTS "game_pages_game_id_page_type_id_key" 
ON "game_pages"("game_id", "page_type_id");

-- Add foreign key constraints
ALTER TABLE "game_pages" ADD CONSTRAINT "game_pages_game_id_fkey"
    FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "game_pages" ADD CONSTRAINT "game_pages_page_type_id_fkey"
    FOREIGN KEY ("page_type_id") REFERENCES "page_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;