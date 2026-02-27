import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Mude de "token" para "auth" para bater com o seu Login.jsx
  const isAuthenticated = localStorage.getItem("auth");

  if (!isAuthenticated) {
    return <Navigate to="/" />; // E mude para "/" se sua rota de login for a principal
  }

  return children;
}