"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { Game, GamePage, PageType } from "@app/types";
import { fetchGameById, getGameDetails } from "@app/actions/server-actions";
import { updateGame } from "@app/actions/games";

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = Number(params.gameId);

  const [game, setGame] = useState<Game | null>(null);
  const [pageTypes] = useState<PageType[]>([]);
  const [gamePages] = useState<GamePage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getGameDetails(gameId); // ✅ Correct : on appelle la Server Action ici
        setGame(data.game);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (gameId) {
      fetchGameDetails();
    }
  }, [gameId]);
  // Fetch game details on component mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchGameById(gameId); // ✅ Correct : récupère un seul jeu
        setGame(data);
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

  // Handle updating the game
  const handleUpdateGame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      setSaveError(null);

      const formData = new FormData(e.currentTarget);
      const updatedGame = await updateGame(gameId, formData);

      setGame(updatedGame);
      setIsEditing(false);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error(err);
    } finally {
      setIsSaving(false);
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
          <hr />
          <Button
            variant="outline-danger"
            onClick={() => router.push("/admin/games")}
          >
            Back to Games
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!game) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Game Not Found</Alert.Heading>
          <p>The requested game could not be found.</p>
          <hr />
          <Button
            variant="outline-warning"
            onClick={() => router.push("/admin/games")}
          >
            Back to Games
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="h2 fw-bold mb-0">{game.title}</h1>
          <p className="text-muted mb-0">
            {game.subtitle || "Game Administration"}
          </p>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            onClick={() => router.push("/admin/games")}
          >
            Back to Games
          </Button>
          {!isEditing && (
            <Button
              variant="outline-primary"
              onClick={() => setIsEditing(true)}
            >
              <i className="bi bi-pencil me-1"></i>
              Edit Game
            </Button>
          )}
          <Link
            href={`/en/${game.key}`}
            target="_blank"
            className="btn btn-primary"
          >
            <i className="bi bi-eye me-1"></i>
            View Game
          </Link>
        </Col>
      </Row>

      <Tabs defaultActiveKey="details" id="game-tabs" className="mb-4">
        <Tab eventKey="details" title="Game Details">
          <Card>
            <Card.Header>
              <Card.Title>Game Information</Card.Title>
            </Card.Header>
            <Card.Body>
              {isEditing ? (
                <Form onSubmit={handleUpdateGame}>
                  {saveError && (
                    <Alert variant="danger" className="mb-3">
                      {saveError}
                    </Alert>
                  )}
                  <Form.Group className="mb-3">
                    <Form.Label>Key</Form.Label>
                    <Form.Control
                      type="text"
                      name="key"
                      defaultValue={game.key}
                      required
                    />
                    <Form.Text className="text-muted">
                      Unique identifier used in URLs. Use lowercase letters
                      without spaces.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      defaultValue={game.title}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Subtitle</Form.Label>
                    <Form.Control
                      type="text"
                      name="subtitle"
                      defaultValue={game.subtitle || ""}
                    />
                  </Form.Group>
                  <div className="d-flex gap-2 mt-4">
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </Form>
              ) : (
                <Row>
                  <Col md={6}>
                    <dl className="row">
                      <dt className="col-sm-3">ID</dt>
                      <dd className="col-sm-9">{game.id}</dd>

                      <dt className="col-sm-3">Key</dt>
                      <dd className="col-sm-9">
                        <code>{game.key}</code>
                      </dd>

                      <dt className="col-sm-3">Title</dt>
                      <dd className="col-sm-9">{game.title}</dd>

                      <dt className="col-sm-3">Subtitle</dt>
                      <dd className="col-sm-9">
                        {game.subtitle || <em className="text-muted">None</em>}
                      </dd>
                    </dl>
                  </Col>
                  <Col md={6}>
                    <dl className="row">
                      <dt className="col-sm-3">Created</dt>
                      <dd className="col-sm-9">
                        {new Date(game.createdAt).toLocaleString()}
                      </dd>

                      <dt className="col-sm-3">Updated</dt>
                      <dd className="col-sm-9">
                        {new Date(game.updatedAt).toLocaleString()}
                      </dd>

                      <dt className="col-sm-3">Pages</dt>
                      <dd className="col-sm-9">{gamePages.length} page(s)</dd>
                    </dl>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="pages" title="Game Pages">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title className="mb-0">Game Pages</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Page Type</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageTypes.map((pageType) => {
                    const gamePage = gamePages.find(
                      (gp) => gp.pageTypeId === pageType.id,
                    );

                    return (
                      <tr key={pageType.id}>
                        <td>{pageType.name}</td>
                        <td>
                          {gamePage ? (
                            <Badge
                              bg={
                                gamePage.isPublished ? "success" : "secondary"
                              }
                            >
                              {gamePage.isPublished ? "Published" : "Draft"}
                            </Badge>
                          ) : (
                            <Badge bg="danger">Not Created</Badge>
                          )}
                        </td>
                        <td>
                          {gamePage ? (
                            new Date(gamePage.updatedAt).toLocaleString()
                          ) : (
                            <em className="text-muted">N/A</em>
                          )}
                        </td>
                        <td className="text-end">
                          <Link
                            href={`/admin/games/${gameId}/${pageType.key}`}
                            className="btn btn-primary btn-sm"
                          >
                            {gamePage ? "Edit Page" : "Create Page"}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
}
