// src/app/server-test/page.tsx
import { Suspense } from "react";
import ClientComponent from "./client-component";

// Option 1: Pour le rendu SSR à chaque requête (comme getServerSideProps)
// export const dynamic = "force-dynamic";

// Option 2: Pour l'ISR (Incremental Static Regeneration)
export const revalidate = 10;

export default function ServerTestPage() {
  // Données générées côté serveur à chaque requête
  const now = new Date().toISOString();
  const randomId = Math.random().toString(36).substring(2, 10);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>Test des modes de rendu serveur</h1>

      <div
        style={{
          background: "#f0f7ff",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h2>Données côté serveur</h2>
        <p>
          Date du rendu serveur: <code>{now}</code>
        </p>
        <p>
          ID aléatoire: <code>{randomId}</code>
        </p>
        <p>
          <strong>
            👆 Ces valeurs changent uniquement lors d`un nouveau rendu serveur
          </strong>
        </p>
      </div>

      <Suspense fallback={<p>Chargement du composant client...</p>}>
        <ClientComponent serverTime={now} />
      </Suspense>

      <div
        style={{
          background: "#f5f5f5",
          padding: "20px",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <h2>Comment tester les différents modes</h2>
        <h3>1. Test du SSR</h3>
        <p>
          Configuration actuelle:{" "}
          <code>export const dynamic = `force-dynamic`;</code>
        </p>
        <ul>
          <li>
            Actualisez la page - l`ID aléatoire et l`heure changent à chaque
            fois
          </li>
        </ul>

        <h3>2. Test de l`ISR (Mise en cache)</h3>
        <p>
          Modifiez le code pour utiliser:{" "}
          <code>export const revalidate = 10;</code>
        </p>
        <ul>
          <li>
            Commentez la ligne <code>dynamic = `force-dynamic`</code>
          </li>
          <li>
            Décommentez la ligne <code>revalidate = 10</code>
          </li>
          <li>Actualisez la page et notez l`ID aléatoire</li>
          <li>Actualisez à nouveau - l`ID reste le même pendant 10 secondes</li>
          <li>Attendez plus de 10 secondes puis actualisez - nouvel ID</li>
        </ul>
      </div>
    </div>
  );
}
