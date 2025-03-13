"use client";

// src/app/server-test/client-component.tsx
import { useEffect, useState } from "react";

interface ClientComponentProps {
  serverTime: string;
}

export default function ClientComponent({ serverTime }: ClientComponentProps) {
  const [clientTime, setClientTime] = useState<string>("");
  const [clientRenders, setClientRenders] = useState<number>(0);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [timeDifference, setTimeDifference] =
    useState<string>("Calcul en cours...");

  useEffect(() => {
    // Marquer que nous sommes maintenant sur le client
    setIsClient(true);

    // Mettre à jour l'heure côté client
    const currentTime = new Date().toISOString();
    setClientTime(currentTime);

    // Calculer la différence entre le temps serveur et client
    const diffMs =
      new Date(currentTime).getTime() - new Date(serverTime).getTime();
    setTimeDifference(`${diffMs} ms`);

    // Incrémenter le compteur de rendus
    setClientRenders((prev) => prev + 1);

    // Mettre à jour l'heure toutes les secondes
    const interval = setInterval(() => {
      setClientTime(new Date().toISOString());
    }, 1000);

    return () => clearInterval(interval);
  }, [serverTime]);

  return (
    <div className="client-component">
      <p>
        Rendu côté: <strong>{isClient ? "Client (hydraté)" : "Serveur"}</strong>
      </p>
      <p>
        Nombre de rendus côté client: <code>{clientRenders}</code>
      </p>
      <p>
        Heure du client (mise à jour en temps réel):{" "}
        <code>{clientTime || "Chargement..."}</code>
      </p>
      <p>
        Différence de temps serveur-client: <code>{timeDifference}</code>
      </p>
    </div>
  );
}
