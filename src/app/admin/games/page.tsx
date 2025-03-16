// app/admin/games/page.tsx

import Link from "next/link";
import AddGameForm from "./add-game-form";
import gameService from "@services/gameService";

export default async function GamesAdminPage() {
  const games = await gameService.getGames();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Games Administration</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Game</h2>
        <AddGameForm />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">All Games</h2>

        {games.length === 0 ? (
          <p>No games found</p>
        ) : (
          <div className="grid gap-4">
            {games.map((game) => (
              <div
                key={game.id}
                className="border p-4 rounded shadow-sm flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-medium">{game.title}</h3>
                  <p className="text-gray-500">Key: {game.key}</p>
                  {game.subtitle && (
                    <p className="text-gray-500">{game.subtitle}</p>
                  )}
                </div>

                <div>
                  <Link
                    href={`/admin/games/${game.id}`}
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
