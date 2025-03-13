"use client";

import { useState } from "react";

export default function TestFirestore() {
  const [status, setStatus] = useState<string>("");
  const [collections, setCollections] = useState<string[]>([]);
  const [newCollectionName, setNewCollectionName] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // Tester la connexion
  const testConnection = async () => {
    setStatus("Connexion en cours...");

    try {
      const response = await fetch("/api/test-firestore");
      const data = await response.json();

      if (data.success) {
        setStatus("Connecté à Firestore ✅");
        setCollections(data.collections || []);
      } else {
        setStatus("Échec de connexion ❌");
        setMessage(data.error || "Erreur inconnue");
      }
    } catch (error) {
      setStatus("Erreur de connexion ❌");
      setMessage(error instanceof Error ? error.message : "Erreur inconnue");
    }
  };

  // Ajouter une collection
  const addCollection = async () => {
    if (!newCollectionName) {
      setMessage("Veuillez entrer un nom de collection");
      return;
    }

    setStatus("Ajout en cours...");
    setMessage("");

    try {
      const response = await fetch("/api/test-firestore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collectionName: newCollectionName,
          documentData: {
            name: "Document test",
            date: new Date().toISOString(),
            test: true,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`Collection ajoutée ! ID du document: ${data.documentId}`);
        testConnection(); // Rafraîchir la liste des collections
      } else {
        setMessage(data.error || "Erreur lors de l'ajout");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur inconnue");
    }
  };

  return (
    <div>
      <h1>Test de connexion Firestore</h1>

      <div>
        <button onClick={testConnection}>Tester la connexion</button>
        <p>{status}</p>

        {collections.length > 0 && (
          <div>
            <h3>Collections existantes:</h3>
            <ul>
              {collections.map((collection) => (
                <li key={collection}>{collection}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <h2>Ajouter une collection</h2>
        <input
          type="text"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          placeholder="Nom de la collection"
        />
        <button onClick={addCollection}>Ajouter</button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}
