"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "react-bootstrap/Spinner";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";

import { GameData, PageType } from "../../../models/models";

// Import types from models.ts

// Types
type AdminGamePageData = {
  id: number;
  gameId: number;
  pageTypeId: number;
  content: Record<string, unknown>;
  meta: Record<string, Record<string, string>>;
  isPublished: boolean;
  pageType: PageType;
};

type FormFieldValue =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | Array<unknown>;

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
];

export default function GameAdminPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = Number(params.gameId);

  // States
  const [isLoading, setIsLoading] = useState(true);
  const [game, setGame] = useState<GameData | null>(null);
  const [pageTypes, setPageTypes] = useState<PageType[]>([]);
  const [selectedPageType, setSelectedPageType] = useState<string>("");
  const [gamePage, setGamePage] = useState<AdminGamePageData | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Résoudre les paramètres si c'est une promesse
        const resolvedParams = await Promise.resolve(params);
        const gameId = Number(resolvedParams.gameId);

        // Fetch game data
        const gameResponse = await fetch(`/api/admin/games/${gameId}`);
        if (!gameResponse.ok) throw new Error("Failed to load game data");
        const gameData = await gameResponse.json();
        setGame(gameData);

        // Fetch page types
        const pageTypesResponse = await fetch("/api/admin/page-types");
        if (!pageTypesResponse.ok) throw new Error("Failed to load page types");
        const pageTypesData = await pageTypesResponse.json();
        setPageTypes(pageTypesData);

        // Set default page type if available
        if (pageTypesData.length > 0) {
          setSelectedPageType(pageTypesData[0].key);
        }
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
      fetchData();
    }
  }, [params, gameId]);

  // Fetch game page when page type changes
  useEffect(() => {
    const fetchGamePage = async () => {
      if (!selectedPageType) return;

      try {
        setIsLoading(true);
        setError(null);

        // Résoudre les paramètres si c'est une promesse
        const resolvedParams = await Promise.resolve(params);
        const gameId = Number(resolvedParams.gameId);

        const response = await fetch(
          `/api/admin/games/${gameId}/pages/${selectedPageType}`,
        );

        if (response.status === 404) {
          // Page doesn't exist yet, create a new empty one
          setGamePage({
            id: 0,
            gameId,
            pageTypeId:
              pageTypes.find((pt) => pt.key === selectedPageType)?.id || 0,
            content: {},
            meta: {},
            isPublished: false,
            pageType: pageTypes.find((pt) => pt.key === selectedPageType) || {
              id: 0,
              key: "",
              name: "",
            },
          });
        } else if (!response.ok) {
          throw new Error("Failed to load game page");
        } else {
          const data = await response.json();
          setGamePage(data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (gameId && selectedPageType) {
      fetchGamePage();
    }
  }, [gameId, selectedPageType, pageTypes, params]);

  /**
   * Handles changes to content fields
   * Updates the appropriate field in the content structure for the current language
   */
  const handleContentChange = (path: string, value: FormFieldValue) => {
    if (!gamePage) return;

    setIsDirty(true);

    // Initialize content for current language if it doesn't exist
    const updatedContent = {
      ...gamePage.content,
      [currentLanguage]: {
        ...((gamePage.content[currentLanguage] as Record<string, unknown>) ||
          {}),
      },
    };

    // Navigate to the nested property using path and set the value
    const pathParts = path.split(".");
    let current: Record<string, unknown> = updatedContent[
      currentLanguage
    ] as Record<string, unknown>;

    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];

      // Handle array indices
      if (part.includes("[") && part.includes("]")) {
        const arrayName = part.substring(0, part.indexOf("["));
        const index = parseInt(
          part.substring(part.indexOf("[") + 1, part.indexOf("]")),
        );

        if (!current[arrayName]) {
          current[arrayName] = [];
        }

        const array = current[arrayName] as Array<unknown>;

        if (!array[index]) {
          array[index] = {};
        }

        current = array[index] as Record<string, unknown>;
      } else {
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part] as Record<string, unknown>;
      }
    }

    current[pathParts[pathParts.length - 1]] = value;

    setGamePage({
      ...gamePage,
      content: updatedContent,
    });
  };

  /**
   * Handles changes to metadata fields
   */
  const handleMetaChange = (field: string, value: string) => {
    if (!gamePage) return;

    setIsDirty(true);

    const updatedMeta = {
      ...gamePage.meta,
      [currentLanguage]: {
        ...(gamePage.meta[currentLanguage] || {}),
        [field]: value,
      },
    };

    setGamePage({
      ...gamePage,
      meta: updatedMeta,
    });
  };

  /**
   * Adds a new item to an array in the content structure
   */
  const handleAddArrayItem = (
    path: string,
    template: Record<string, unknown> = {},
  ) => {
    if (!gamePage) return;

    setIsDirty(true);

    // Initialize content for current language if it doesn't exist
    const updatedContent = {
      ...gamePage.content,
      [currentLanguage]: {
        ...((gamePage.content[currentLanguage] as Record<string, unknown>) ||
          {}),
      },
    };

    // Navigate to the array using path
    const pathParts = path.split(".");
    let current: Record<string, unknown> = updatedContent[
      currentLanguage
    ] as Record<string, unknown>;

    for (const part of pathParts) {
      if (!current[part]) {
        current[part] = [];
      }
      current = current[part] as Record<string, unknown>;
    }

    // Add new item to array
    if (Array.isArray(current)) {
      current.push(template);
    }

    setGamePage({
      ...gamePage,
      content: updatedContent,
    });
  };

  /**
   * Removes an item from an array in the content structure
   */
  const handleRemoveArrayItem = (path: string, index: number) => {
    if (!gamePage) return;

    setIsDirty(true);

    // Initialize content for current language if it doesn't exist
    const updatedContent = {
      ...gamePage.content,
      [currentLanguage]: {
        ...((gamePage.content[currentLanguage] as Record<string, unknown>) ||
          {}),
      },
    };

    // Navigate to the array using path
    const pathParts = path.split(".");
    let current: Record<string, unknown> = updatedContent[
      currentLanguage
    ] as Record<string, unknown>;

    for (const part of pathParts) {
      if (!current[part]) {
        return; // Array doesn't exist, nothing to remove
      }
      current = current[part] as Record<string, unknown>;
    }

    // Remove item from array
    if (Array.isArray(current) && index >= 0 && index < current.length) {
      current.splice(index, 1);
    }

    setGamePage({
      ...gamePage,
      content: updatedContent,
    });
  };

  /**
   * Copies content and metadata from another language
   */
  const handleCopyFromLanguage = (sourceLanguage: string) => {
    if (!gamePage || sourceLanguage === currentLanguage) return;

    setIsDirty(true);

    const updatedContent = {
      ...gamePage.content,
      [currentLanguage]: JSON.parse(
        JSON.stringify(gamePage.content[sourceLanguage] || {}),
      ),
    };

    const updatedMeta = {
      ...gamePage.meta,
      [currentLanguage]: JSON.parse(
        JSON.stringify(gamePage.meta[sourceLanguage] || {}),
      ),
    };

    setGamePage({
      ...gamePage,
      content: updatedContent,
      meta: updatedMeta,
    });
  };

  /**
   * Toggles publish status of the game page
   */
  const handleTogglePublish = () => {
    if (!gamePage) return;

    setIsDirty(true);
    setGamePage({
      ...gamePage,
      isPublished: !gamePage.isPublished,
    });
  };

  /**
   * Saves changes to the game page
   */
  const handleSave = async () => {
    if (!gamePage) return;

    try {
      setIsSaving(true);
      setError(null);

      // Résoudre les paramètres si c'est une promesse
      const resolvedParams = await Promise.resolve(params);
      const gameId = Number(resolvedParams.gameId);

      const response = await fetch(
        `/api/admin/games/${gameId}/pages/${selectedPageType}`,
        {
          method: gamePage.id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: gamePage.content,
            meta: gamePage.meta,
            isPublished: gamePage.isPublished,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save game page");
      }

      const updatedGamePage = await response.json();
      setGamePage(updatedGamePage);
      setIsDirty(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Renders a form field based on its data type
   */
  const renderField = (
    path: string,
    key: string,
    value: FormFieldValue,
    level = 0,
  ) => {
    // Skip rendering arrays - they'll be handled separately
    if (Array.isArray(value)) {
      return null;
    }

    // For objects, render nested fields
    if (typeof value === "object" && value !== null) {
      return (
        <div
          key={key}
          className="mb-4"
          style={{ marginLeft: `${level * 20}px` }}
        >
          <h4 className="fw-bold">{key}</h4>
          <div className="border-start border-2 ps-4 mt-2">
            {Object.entries(value as Record<string, unknown>).map(
              ([nestedKey, nestedValue]) =>
                renderField(
                  `${path}.${nestedKey}`,
                  nestedKey,
                  nestedValue as FormFieldValue,
                  level + 1,
                ),
            )}
          </div>
        </div>
      );
    }

    // For primitive values, render input fields
    return (
      <Form.Group
        key={key}
        className="mb-3"
        style={{ marginLeft: `${level * 20}px` }}
      >
        <Form.Label>{key}</Form.Label>
        {typeof value === "string" && value.length > 100 ? (
          <Form.Control
            as="textarea"
            rows={3}
            id={path}
            value={value}
            onChange={(e) => handleContentChange(path, e.target.value)}
          />
        ) : (
          <Form.Control
            type="text"
            id={path}
            value={String(value)}
            onChange={(e) => handleContentChange(path, e.target.value)}
          />
        )}
      </Form.Group>
    );
  };

  /**
   * Renders an array editor for array type fields
   */
  const renderArrayEditor = (
    path: string,
    key: string,
    items: Array<unknown>,
    level = 0,
  ) => {
    if (!items || items.length === 0) {
      // Empty array
      return (
        <div
          key={key}
          className="mb-4"
          style={{ marginLeft: `${level * 20}px` }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="fw-bold">{key}</h4>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleAddArrayItem(path, {})}
            >
              <i className="bi bi-plus-circle me-1"></i> Add Item
            </Button>
          </div>
          <p className="text-muted small">No items yet</p>
        </div>
      );
    }

    return (
      <div key={key} className="mb-4" style={{ marginLeft: `${level * 20}px` }}>
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="fw-bold">{key}</h4>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() =>
              handleAddArrayItem(path, {
                ...(items[0] as Record<string, unknown>),
              })
            }
          >
            <i className="bi bi-plus-circle me-1"></i> Add Item
          </Button>
        </div>
        <div className="mt-3">
          {items.map((item, index) => (
            <Card key={index} className="mb-3 shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <span className="fw-medium">
                  {key} #{index + 1}
                </span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveArrayItem(path, index)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </Card.Header>
              <Card.Body>
                {typeof item === "object" && item !== null ? (
                  <div>
                    {Object.entries(item as Record<string, unknown>).map(
                      ([itemKey, itemValue]) =>
                        renderField(
                          `${path}[${index}].${itemKey}`,
                          itemKey,
                          itemValue as FormFieldValue,
                          0,
                        ),
                    )}
                  </div>
                ) : (
                  <Form.Control
                    type="text"
                    value={String(item)}
                    onChange={(e) =>
                      handleContentChange(`${path}[${index}]`, e.target.value)
                    }
                  />
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renders content editor based on content structure
   */
  const renderContentEditor = () => {
    if (!gamePage) return null;

    const content =
      (gamePage.content[currentLanguage] as Record<string, unknown>) || {};

    if (Object.keys(content).length === 0) {
      return (
        <Alert variant="info">
          No content yet for this language. You can add content or copy from
          another language.
        </Alert>
      );
    }

    return (
      <div>
        {Object.entries(content).map(([key, value]) => {
          if (Array.isArray(value)) {
            return renderArrayEditor(key, key, value);
          } else {
            return renderField(key, key, value as FormFieldValue);
          }
        })}
      </div>
    );
  };

  /**
   * Renders metadata editor
   */
  const renderMetaEditor = () => {
    if (!gamePage) return null;

    const meta = gamePage.meta[currentLanguage] || {};
    const metaFields = [
      { key: "title", label: "Page Title" },
      { key: "description", label: "Description" },
      { key: "keywords", label: "Keywords" },
      { key: "og_title", label: "OG Title" },
      { key: "og_description", label: "OG Description" },
      { key: "og_image", label: "OG Image URL" },
    ];

    return (
      <div>
        {metaFields.map((field) => (
          <Form.Group key={field.key} className="mb-3">
            <Form.Label>{field.label}</Form.Label>
            {field.key === "description" || field.key === "og_description" ? (
              <Form.Control
                as="textarea"
                rows={3}
                id={field.key}
                value={meta[field.key] || ""}
                onChange={(e) => handleMetaChange(field.key, e.target.value)}
              />
            ) : (
              <Form.Control
                type="text"
                id={field.key}
                value={meta[field.key] || ""}
                onChange={(e) => handleMetaChange(field.key, e.target.value)}
              />
            )}
          </Form.Group>
        ))}
      </div>
    );
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
          <Link href="/admin/games" className="btn btn-outline-secondary">
            Back to Games
          </Link>
          <Link
            href={`/${currentLanguage}/${game.key}`}
            target="_blank"
            className="btn btn-outline-primary"
          >
            View Live Page
          </Link>
        </Col>
      </Row>

      <Row className="mb-4 g-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Page Type</Form.Label>
            <Form.Select
              value={selectedPageType}
              onChange={(e) => setSelectedPageType(e.target.value)}
            >
              {pageTypes.map((type) => (
                <option key={type.id} value={type.key}>
                  {type.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Language</Form.Label>
            <Form.Select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4} className="d-flex align-items-end">
          <div className="d-flex gap-2">
            {currentLanguage !== "en" && (
              <Button
                variant="outline-secondary"
                onClick={() => handleCopyFromLanguage("en")}
                size="sm"
              >
                Copy from English
              </Button>
            )}
            {currentLanguage !== "fr" && (
              <Button
                variant="outline-secondary"
                onClick={() => handleCopyFromLanguage("fr")}
                size="sm"
              >
                Copy from French
              </Button>
            )}
            {currentLanguage !== "es" && (
              <Button
                variant="outline-secondary"
                onClick={() => handleCopyFromLanguage("es")}
                size="sm"
              >
                Copy from Spanish
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {gamePage && (
        <>
          <Row className="mb-4 align-items-center">
            <Col>
              <div className="d-flex align-items-center gap-2">
                <Button
                  variant={gamePage.isPublished ? "outline-danger" : "success"}
                  onClick={handleTogglePublish}
                >
                  {gamePage.isPublished ? "Unpublish" : "Publish"}
                </Button>
                <Badge bg={gamePage.isPublished ? "success" : "secondary"}>
                  {gamePage.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </Col>
            <Col xs="auto">
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={!isDirty || isSaving}
              >
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
                  <>
                    <i className="bi bi-save me-2"></i>
                    Save Changes
                  </>
                )}
              </Button>
            </Col>
          </Row>

          <Tabs defaultActiveKey="content" id="content-tabs" className="mb-3">
            <Tab eventKey="content" title="Content">
              <Card>
                <Card.Header>
                  <Card.Title>
                    Content Editor - {currentLanguage.toUpperCase()}
                  </Card.Title>
                </Card.Header>
                <Card.Body>{renderContentEditor()}</Card.Body>
              </Card>
            </Tab>
            <Tab eventKey="meta" title="Meta Information">
              <Card>
                <Card.Header>
                  <Card.Title>
                    Meta Information - {currentLanguage.toUpperCase()}
                  </Card.Title>
                </Card.Header>
                <Card.Body>{renderMetaEditor()}</Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </>
      )}
    </Container>
  );
}
