"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// Supprimé : import { useRouter } from "next/navigation";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Game } from "@app/types";
import prisma from "@root/lib/prisma";

// Server Action pour récupérer la liste des jeux
async function getGames() {
  try {
    return await prisma.game.findMany({
      orderBy: { title: "asc" },
    });
  } catch (err) {
    console.error("Error fetching games:", err);
    throw new Error(
      err instanceof Error ? err.message : "Error fetching games",
    );
  }
}

// Server Action pour créer un nouveau jeu
async function createGame(formData: FormData) {
  try {
    const key = formData.get("key") as string;
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;

    if (!key || !title) {
      throw new Error("Key and title are required");
    }

    return await prisma.game.create({
      data: {
        key,
        title,
        subtitle: subtitle || null,
      },
    });
  } catch (err) {
    console.error("Error creating game:", err);
    throw new Error(err instanceof Error ? err.message : "Error creating game");
  }
}

// Server Action pour supprimer un jeu
async function deleteGame(id: number) {
  try {
    // Supprimer d'abord toutes les pages associées
    await prisma.gamePage.deleteMany({
      where: { gameId: id },
    });

    // Puis supprimer le jeu
    return await prisma.game.delete({
      where: { id },
    });
  } catch (err) {
    console.error("Error deleting game:", err);
    throw new Error(err instanceof Error ? err.message : "Error deleting game");
  }
}

export default function GamesListPage() {
  // Supprimé : const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
  const [addGameError, setAddGameError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch games on component mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getGames();
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

  // Handle adding a new game
  const handleAddGame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setAddGameError(null);

      const formData = new FormData(e.currentTarget);
      const newGame = await createGame(formData);

      // Add the new game to the list
      setGames([...games, newGame]);
      setShowAddModal(false);

      // Reset the form
      e.currentTarget.reset();
    } catch (err) {
      setAddGameError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle confirming game deletion
  const confirmDelete = (game: Game) => {
    setGameToDelete(game);
    setShowDeleteModal(true);
  };

  // Handle deleting a game
  const handleDeleteGame = async () => {
    if (!gameToDelete) return;

    try {
      setIsSubmitting(true);

      await deleteGame(gameToDelete.id);

      // Remove the deleted game from the list
      setGames(games.filter((game) => game.id !== gameToDelete.id));
      setShowDeleteModal(false);
      setGameToDelete(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>
          Add New Game
        </Button>
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
                    <div className="d-flex gap-2 justify-content-end">
                      <Link
                        className="btn btn-outline-primary"
                        href={`/admin/games/${game.id}`}
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Edit
                      </Link>
                      <Button
                        variant="outline-danger"
                        onClick={() => confirmDelete(game)}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Add Game Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Game</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddGame}>
          <Modal.Body>
            {addGameError && (
              <Alert variant="danger" className="mb-3">
                {addGameError}
              </Alert>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Key</Form.Label>
              <Form.Control
                type="text"
                name="key"
                placeholder="e.g., tarot, rummy"
                required
              />
              <Form.Text className="text-muted">
                Unique identifier used in URLs. Use lowercase letters without
                spaces.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="e.g., Super Tarot"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subtitle</Form.Label>
              <Form.Control
                type="text"
                name="subtitle"
                placeholder="e.g., The popular French game"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Game"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete the game{" "}
            <strong>{gameToDelete?.title}</strong>?
          </p>
          <Alert variant="warning">
            This action cannot be undone. All pages associated with this game
            will also be deleted.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteGame}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
