"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

type Game = {
  id: number;
  key: string;
  title: string;
  subtitle: string | null;
};

export default function GamesListPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/admin/games");
        if (!response.ok) throw new Error("Failed to fetch games");

        const data = await response.json();
        setGames(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 fw-bold mb-0">Games Administration</h1>
        <Link href="/admin" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>

      <div className="card">
        <Table responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Key</th>
              <th>Title</th>
              <th>Subtitle</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  No games found
                </td>
              </tr>
            ) : (
              games.map((game) => (
                <tr key={game.id}>
                  <td>{game.id}</td>
                  <td>{game.key}</td>
                  <td>{game.title}</td>
                  <td>{game.subtitle}</td>
                  <td className="text-end">
                    <Link
                      className="btn btn-outline-primary"
                      href={`/admin/games/${game.id}`}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}
