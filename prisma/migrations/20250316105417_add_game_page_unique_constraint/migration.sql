/*
  Warnings:

  - A unique constraint covering the columns `[game_id,page_type_id]` on the table `game_pages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "game_pages_game_id_page_type_id_key" ON "game_pages"("game_id", "page_type_id");
