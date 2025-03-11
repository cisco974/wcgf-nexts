// src/app/not-found.tsx
import Link from "next/link";

// Une seule page not-found pour toute l'application
export default function NotFound() {
  return (
    <div className="container my-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-lg p-5">
            <h1 className="display-1 fw-bold text-danger">404</h1>
            <h2 className="mb-4">Page non trouvée</h2>
            <p className="lead mb-5">
              Désolé, la page que vous recherchez n`existe pas.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link href="/" className="btn btn-primary btn-lg">
                Retour à l`accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
