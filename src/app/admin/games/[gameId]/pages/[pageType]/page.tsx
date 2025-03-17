"use client";

import { JSX, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Game, GamePageContent, GamePageMeta, LocalizedMeta } from "@app/types";
import { loadInitialData, saveGamePage } from "@app/actions/server-actions";

// Type pour les langues supportées
export type SupportedLocale = "en" | "fr" | "es";

// Type pour les données de page de jeu dans l'admin
interface AdminGamePageData {
  id: number;
  gameId: number;
  pageTypeId: number;
  content: GamePageContent;
  meta: GamePageMeta;
  isPublished: boolean;
  pageType: PageType;
}

// Type pour le type de page
interface PageType {
  id: number;
  key: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Type pour les valeurs des champs de formulaire
type FormFieldValue =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | Array<unknown>;

// Type pour les options de langue
interface LanguageOption {
  code: SupportedLocale;
  name: string;
}

// Type pour les champs de métadonnées
interface MetaField {
  key: string;
  label: string;
}

// Constantes
const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
];

const META_FIELDS: MetaField[] = [
  { key: "title", label: "Page Title" },
  { key: "description", label: "Description" },
  { key: "keywords", label: "Keywords" },
  { key: "og_title", label: "OG Title" },
  { key: "og_description", label: "OG Description" },
  { key: "og_image", label: "OG Image URL" },
];

export default function GamePageAdminPage(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const gameId = Number(params.gameId);
  const pageTypeKey = String(params.pageType);

  // States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [game, setGame] = useState<Game | null>(null);
  const [pageType, setPageType] = useState<PageType | null>(null);
  const [gamePage, setGamePage] = useState<AdminGamePageData | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLocale>("en");
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        // Résoudre les paramètres si c'est une promesse
        const resolvedParams = await Promise.resolve(params);
        const gameId = Number(resolvedParams.gameId);
        const pageTypeKey = String(resolvedParams.pageType);

        // Appeler le server action pour charger les données initiales
        const data = await loadInitialData(gameId, pageTypeKey);

        setGame(data.game);
        setPageType(data.pageType);
        setGamePage(data.gamePage);
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (gameId && pageTypeKey) {
      fetchData();
    }
  }, [params, gameId, pageTypeKey]);

  /**
   * Handles changes to content fields
   * Updates the appropriate field in the GameContent structure for the current language
   */
  const handleContentChange = (path: string, value: FormFieldValue): void => {
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
          10,
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

  // Handle meta changes
  const handleMetaChange = (field: string, value: string): void => {
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

  // Add array item
  const handleAddArrayItem = (
    path: string,
    template: Record<string, unknown> = {},
  ): void => {
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

  // Remove array item
  const handleRemoveArrayItem = (path: string, index: number): void => {
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

  // Copy content from another language
  const handleCopyFromLanguage = (sourceLanguage: SupportedLocale): void => {
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

  // Toggle publish status
  const handleTogglePublish = (): void => {
    if (!gamePage) return;

    setIsDirty(true);
    setGamePage({
      ...gamePage,
      isPublished: !gamePage.isPublished,
    });
  };

  // Save changes
  const handleSave = async (): Promise<void> => {
    if (!gamePage) return;

    try {
      setIsSaving(true);
      setErrorMessage(null);

      // ✅ Utilise la Server Action
      const updatedGamePage = await saveGamePage(
        gamePage.gameId,
        gamePage.pageTypeId,
        {
          content: gamePage.content,
          meta: gamePage.meta,
          isPublished: gamePage.isPublished,
        },
        gamePage.id,
      );

      // ✅ Corrige les types pour éviter l'erreur JSON
      setGamePage({
        ...updatedGamePage,
        content:
          typeof updatedGamePage.content === "string"
            ? JSON.parse(updatedGamePage.content)
            : updatedGamePage.content,
        meta:
          typeof updatedGamePage.meta === "string"
            ? JSON.parse(updatedGamePage.meta)
            : updatedGamePage.meta,
        pageType: gamePage.pageType,
      });

      setIsDirty(false);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Render a form field based on the data type
  const renderField = (
    path: string,
    key: string,
    value: FormFieldValue,
    level = 0,
  ): JSX.Element | null => {
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

  // Render an array editor
  const renderArrayEditor = (
    path: string,
    key: string,
    items: Array<unknown>,
    level = 0,
  ): JSX.Element => {
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

  // Render content editor based on content structure
  const renderContentEditor = (): JSX.Element | null => {
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

  // Render meta editor
  const renderMetaEditor = (): JSX.Element | null => {
    if (!gamePage) return null;

    return (
      <div>
        {META_FIELDS.map((field) => (
          <Form.Group key={field.key} className="mb-3">
            <Form.Label>{field.label}</Form.Label>
            {field.key === "description" || field.key === "og_description" ? (
              <Form.Control
                as="textarea"
                rows={3}
                id={field.key}
                value={
                  gamePage.meta[currentLanguage]?.[
                    field.key as keyof LocalizedMeta
                  ] || ""
                }
                onChange={(e) => handleMetaChange(field.key, e.target.value)}
              />
            ) : (
              <Form.Control
                type="text"
                id={field.key}
                value={
                  gamePage.meta[currentLanguage]?.[
                    field.key as keyof LocalizedMeta
                  ] || ""
                }
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

  if (errorMessage) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{errorMessage}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button
              variant="outline-danger"
              onClick={() => router.push(`/admin/games/${gameId}`)}
            >
              Back to Game
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!game || !pageType) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Resource Not Found</Alert.Heading>
          <p>The requested game or page type could not be found.</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button
              variant="outline-warning"
              onClick={() => router.push("/admin/games")}
            >
              Back to Games
            </Button>
          </div>
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
            {pageType.name} - {game.subtitle || "Game Administration"}
          </p>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            onClick={() => router.push(`/admin/games/${gameId}`)}
          >
            Back to Game
          </Button>
          <Button
            variant="outline-primary"
            onClick={() =>
              window.open(`/${currentLanguage}/${game.key}`, "_blank")
            }
          >
            View Live Page
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Language</Form.Label>
            <Form.Select
              value={currentLanguage}
              onChange={(e) =>
                setCurrentLanguage(e.target.value as SupportedLocale)
              }
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={8} className="d-flex align-items-end">
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
