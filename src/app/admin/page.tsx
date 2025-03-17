"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";

import { Game } from "@app/types";
import { getDashboardStats } from "@app/actions/server-actions";

// Interface pour le type des statistiques du dashboard
interface DashboardStats {
  gamesCount: number;
  pageTypesCount: number;
  totalPages: number;
  publishedPages: number;
  draftPages: number;
  recentGames: Game[];
}

export default function AdminDashboard() {
  // Utiliser l'interface DashboardStats pour le type de l'état
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getDashboardStats(); // ✅ Correct : on appelle la Server Action ici
        setStats(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
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
      <div className="mb-4">
        <h1 className="h2 fw-bold mb-0">WCGF Admin Dashboard</h1>
        <p className="text-muted">Manage your games, page types, and content</p>
      </div>

      {/* Statistics Cards */}
      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-controller fs-1 text-primary"></i>
              <h3 className="h2 fw-bold mt-2 mb-0">{stats?.gamesCount || 0}</h3>
              <p className="text-muted">Games</p>
              <Link href="/admin/games" className="btn btn-primary mt-2">
                Manage Games
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-grid-3x3-gap fs-1 text-success"></i>
              <h3 className="h2 fw-bold mt-2 mb-0">
                {stats?.pageTypesCount || 0}
              </h3>
              <p className="text-muted">Page Types</p>
              <Link href="/admin/page-types" className="btn btn-success mt-2">
                Manage Page Types
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-file-earmark-text fs-1 text-info"></i>
              <h3 className="h2 fw-bold mt-2 mb-0">{stats?.totalPages || 0}</h3>
              <p className="text-muted">Total Pages</p>
              <div className="d-flex justify-content-center gap-2 mt-2">
                <Badge bg="success">
                  {stats?.publishedPages || 0} Published
                </Badge>
                <Badge bg="secondary">{stats?.draftPages || 0} Drafts</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-globe fs-1 text-danger"></i>
              <h3 className="h2 fw-bold mt-2 mb-0">3</h3>
              <p className="text-muted">Languages</p>
              <div className="d-flex justify-content-center gap-2 mt-2">
                <Badge bg="primary">EN</Badge>
                <Badge bg="primary">FR</Badge>
                <Badge bg="primary">ES</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Links */}
      <Row className="mb-5">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-primary text-white">
              <h4 className="m-0">Quick Actions</h4>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Link href="/admin/games" className="btn btn-outline-primary">
                  <i className="bi bi-controller me-2"></i>
                  View All Games
                </Link>
                <Link
                  href="/admin/page-types"
                  className="btn btn-outline-success"
                >
                  <i className="bi bi-grid-3x3-gap me-2"></i>
                  Manage Page Types
                </Link>
                <Link href="/admin/games/new" className="btn btn-outline-info">
                  <i className="bi bi-plus-circle me-2"></i>
                  Add New Game
                </Link>
                <Link href="/" className="btn btn-outline-secondary">
                  <i className="bi bi-eye me-2"></i>
                  View Frontend
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-info text-white">
              <h4 className="m-0">Recently Updated Games</h4>
            </Card.Header>
            <Card.Body>
              {stats?.recentGames && stats.recentGames.length > 0 ? (
                <div className="list-group">
                  {stats.recentGames.map((game) => (
                    <Link
                      key={game.id}
                      href={`/admin/games/${game.id}`}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h5 className="mb-1">{game.title}</h5>
                        <p className="mb-1 text-muted small">
                          <code>{game.key}</code> -{" "}
                          {game.subtitle || "No subtitle"}
                        </p>
                      </div>
                      <small className="text-muted">
                        {new Date(game.updatedAt).toLocaleDateString()}
                      </small>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted my-4">No games found</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* System Information */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-secondary text-white">
          <h4 className="m-0">System Information</h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <dl className="row mb-0">
                <dt className="col-sm-4">Database</dt>
                <dd className="col-sm-8">PostgreSQL with Prisma</dd>

                <dt className="col-sm-4">Environment</dt>
                <dd className="col-sm-8">
                  {process.env.NODE_ENV || "development"}
                </dd>
              </dl>
            </Col>
            <Col md={6}>
              <dl className="row mb-0">
                <dt className="col-sm-4">Version</dt>
                <dd className="col-sm-8">1.0.0</dd>

                <dt className="col-sm-4">Last Update</dt>
                <dd className="col-sm-8">{new Date().toLocaleDateString()}</dd>
              </dl>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
