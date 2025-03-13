"use client";

import { useState } from "react";

// Types pour assurer la sécurité TypeScript
interface ResultState {
  success: boolean;
  message: string;
  documentId?: string;
}

export default function FirestoreTest() {
  // États pour gérer l'interface utilisateur
  const [collectionName, setCollectionName] = useState("test_collection");
  const [result, setResult] = useState<ResultState | null>(null);
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState<string[]>([]);
  const [responseStatus, setResponseStatus] = useState("");
  const [rawResponse, setRawResponse] = useState("");

  // Fonction pour vérifier la connexion à Firestore
  const testConnection = async () => {
    try {
      setLoading(true);
      setResult(null);
      setResponseStatus("");
      setRawResponse("");

      // Utiliser le nouvel endpoint
      const response = await fetch("/api/firestore-test");
      setResponseStatus(`Status: ${response.status}`);

      // Récupérer la réponse brute
      const responseText = await response.text();
      setRawResponse(responseText);

      // Essayer de parser la réponse JSON
      try {
        const data = JSON.parse(responseText);
        console.log("Réponse du test de connexion:", data);

        if (data.success) {
          setCollections(data.collections || []);
          setResult({
            success: true,
            message: `Connexion réussie! ${data.collections.length} collections trouvées.`,
          });
        } else {
          setResult({
            success: false,
            message: `Erreur: ${data.error || "Erreur inconnue"}`,
          });
        }
      } catch (error) {
        console.error("Erreur de parsing JSON:", error);
        setResult({
          success: false,
          message: `Erreur lors du parsing de la réponse: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
        });
      }
    } catch (error) {
      console.error("Erreur lors du test de connexion:", error);
      setResult({
        success: false,
        message: `Erreur: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour ajouter un document à Firestore
  const addDocument = async () => {
    if (!collectionName.trim()) {
      setResult({
        success: false,
        message: "Veuillez entrer un nom de collection valide",
      });
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      setResponseStatus("");
      setRawResponse("");

      // Créer un document de test simple
      const documentData = {
        title: "Document de test",
        timestamp: new Date().toISOString(),
        counter: Math.floor(Math.random() * 100),
        isActive: true,
        tags: ["test", "demo", "firestore-test"],
      };

      console.log("Envoi de données:", { collectionName, documentData });

      // Utiliser le nouvel endpoint
      const response = await fetch("/api/firestore-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collectionName,
          documentData,
        }),
      });

      setResponseStatus(`Status: ${response.status}`);

      // Récupérer la réponse brute
      const responseText = await response.text();
      setRawResponse(responseText);

      // Essayer de parser la réponse JSON
      try {
        const data = JSON.parse(responseText);
        console.log("Réponse reçue:", data);

        if (data.success) {
          setResult({
            success: true,
            message: `Document ajouté avec succès!`,
            documentId: data.documentId,
          });

          // Rafraîchir la liste des collections
          testConnection();
        } else {
          setResult({
            success: false,
            message: `Erreur: ${data.error || "Erreur inconnue"}`,
          });
        }
      } catch (error) {
        console.error("Erreur de parsing JSON:", error);
        setResult({
          success: false,
          message: `Erreur lors du parsing de la réponse: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
      setResult({
        success: false,
        message: `Erreur: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Test de Firestore (Nouvel Endpoint)</h1>

      {/* Section de test de connexion */}
      <div style={{ marginBottom: "30px" }}>
        <h2>1. Tester la connexion</h2>
        <button
          onClick={testConnection}
          disabled={loading}
          style={{
            padding: "10px 15px",
            backgroundColor: "#4285F4",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Chargement..." : "Tester la connexion"}
        </button>

        {collections.length > 0 && (
          <div style={{ marginTop: "15px" }}>
            <h3>Collections existantes:</h3>
            <ul>
              {collections.map((collection) => (
                <li key={collection}>{collection}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Section d'ajout de document */}
      <div style={{ marginBottom: "30px" }}>
        <h2>2. Ajouter un document</h2>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Nom de la collection:
          </label>
          <input
            type="text"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            style={{
              padding: "8px",
              width: "100%",
              maxWidth: "300px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <button
          onClick={addDocument}
          disabled={loading || !collectionName.trim()}
          style={{
            padding: "10px 15px",
            backgroundColor: "#34A853",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor:
              loading || !collectionName.trim() ? "not-allowed" : "pointer",
            opacity: loading || !collectionName.trim() ? 0.7 : 1,
          }}
        >
          {loading ? "Chargement..." : "Ajouter un document"}
        </button>
      </div>

      {/* Affichage des résultats */}
      {result && (
        <div
          style={{
            padding: "15px",
            backgroundColor: result.success ? "#E6F4EA" : "#FCE8E6",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              margin: "0 0 10px 0",
              color: result.success ? "#137333" : "#C5221F",
              fontWeight: "bold",
            }}
          >
            {result.success ? "Succès!" : "Erreur!"}
          </p>
          <p style={{ margin: "0 0 5px 0" }}>{result.message}</p>
          {result.documentId && (
            <p style={{ margin: "5px 0 0 0", fontFamily: "monospace" }}>
              ID du document: {result.documentId}
            </p>
          )}
        </div>
      )}

      {/* Affichage de la réponse brute pour le débogage */}
      {responseStatus && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#F0F4F8",
            borderRadius: "4px",
          }}
        >
          <h3>Détails de la réponse</h3>
          <p style={{ fontFamily: "monospace" }}>{responseStatus}</p>
          {rawResponse && (
            <div>
              <p style={{ fontWeight: "bold" }}>Réponse brute:</p>
              <pre
                style={{
                  backgroundColor: "#E8EAED",
                  padding: "10px",
                  borderRadius: "4px",
                  overflow: "auto",
                  maxHeight: "200px",
                }}
              >
                {rawResponse}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Documentation */}
      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          backgroundColor: "#F8F9FA",
          borderRadius: "4px",
        }}
      >
        <h3>Structure du document de test</h3>
        <pre
          style={{
            backgroundColor: "#F1F3F4",
            padding: "10px",
            borderRadius: "4px",
            overflow: "auto",
          }}
        >
          {`{
  "title": "Document de test",
  "timestamp": "${new Date().toISOString()}",
  "counter": ${Math.floor(Math.random() * 100)},
  "isActive": true,
  "tags": ["test", "demo", "firestore-test"],
  "createdAt": <Timestamp du serveur Firestore>
}`}
        </pre>
      </div>
    </div>
  );
}
