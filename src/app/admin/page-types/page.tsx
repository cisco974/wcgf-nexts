"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { PageType } from "@app/types";
import {
  checkPageTypeUsage,
  createPageType,
  deletePageType,
  getPageTypes,
} from "@app/actions/server-actions";

export default function PageTypesList() {
  const [pageTypes, setPageTypes] = useState<PageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pageTypeToDelete, setPageTypeToDelete] = useState<PageType | null>(
    null,
  );
  const [pageTypeUsageCount, setPageTypeUsageCount] = useState(0);
  const [addPageTypeError, setAddPageTypeError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch page types on component mount
  useEffect(() => {
    const fetchPageTypes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getPageTypes();
        setPageTypes(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageTypes();
  }, []);

  // Handle adding a new page type
  const handleAddPageType = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setAddPageTypeError(null);

      const formData = new FormData(e.currentTarget);
      const newPageType = await createPageType(formData);

      // Add the new page type to the list
      setPageTypes([...pageTypes, newPageType]);
      setShowAddModal(false);

      // Reset the form
      e.currentTarget.reset();
    } catch (err) {
      setAddPageTypeError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle confirming page type deletion
  const confirmDelete = async (pageType: PageType) => {
    try {
      setIsSubmitting(true);

      // Check if the page type is being used
      const usageCount = await checkPageTypeUsage(pageType.id);
      setPageTypeUsageCount(usageCount);

      // Set the page type to delete
      setPageTypeToDelete(pageType);
      setShowDeleteModal(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a page type
  const handleDeletePageType = async () => {
    if (!pageTypeToDelete) return;

    try {
      setIsSubmitting(true);

      // Only allow deletion if the page type is not being used
      if (pageTypeUsageCount > 0) {
        throw new Error(
          `Cannot delete page type: it is being used by ${pageTypeUsageCount} pages`,
        );
      }

      await deletePageType(pageTypeToDelete.id);

      // Remove the deleted page type from the list
      setPageTypes(pageTypes.filter((pt) => pt.id !== pageTypeToDelete.id));
      setShowDeleteModal(false);
      setPageTypeToDelete(null);
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
        <h1 className="h2 fw-bold mb-0">Page Types Administration</h1>
        <div className="d-flex gap-2">
          <Link href="/admin" className="btn btn-outline-secondary">
            Dashboard
          </Link>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <i className="bi bi-plus-circle me-2"></i>
            Add Page Type
          </Button>
        </div>
      </div>

      <div className="card">
        <Table responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Key</th>
              <th>Name</th>
              <th>Created</th>
              <th>Updated</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageTypes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  No page types found
                </td>
              </tr>
            ) : (
              pageTypes.map((pageType) => (
                <tr key={pageType.id}>
                  <td>{pageType.id}</td>
                  <td>
                    <code>{pageType.key}</code>
                  </td>
                  <td>{pageType.name}</td>
                  <td>{new Date(pageType.createdAt).toLocaleString()}</td>
                  <td>{new Date(pageType.updatedAt).toLocaleString()}</td>
                  <td className="text-end">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => confirmDelete(pageType)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Add Page Type Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Page Type</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddPageType}>
          <Modal.Body>
            {addPageTypeError && (
              <Alert variant="danger" className="mb-3">
                {addPageTypeError}
              </Alert>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Key</Form.Label>
              <Form.Control
                type="text"
                name="key"
                placeholder="e.g., game, rules, rankings"
                required
              />
              <Form.Text className="text-muted">
                Unique identifier used in URLs. Use lowercase letters without
                spaces.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="e.g., Game Page, Rules Page"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Page Type"}
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
            Are you sure you want to delete the page type{" "}
            <strong>{pageTypeToDelete?.name}</strong>?
          </p>

          {pageTypeUsageCount > 0 ? (
            <Alert variant="danger">
              <p>
                This page type is being used by {pageTypeUsageCount} page(s) and
                cannot be deleted.
              </p>
              <p>
                You must first delete or reassign all pages using this type.
              </p>
            </Alert>
          ) : (
            <Alert variant="warning">This action cannot be undone.</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeletePageType}
            disabled={isSubmitting || pageTypeUsageCount > 0}
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
