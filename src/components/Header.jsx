import { useNavigate, Link } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  function handleLogout() {
    localStorage.removeItem("auth");
    localStorage.removeItem("userEmail");
    navigate("/login");
  }

  return (
    <header style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <strong>{email}</strong>

      <nav style={{ marginTop: "10px" }}>
        <Link to="/dashboard">Dashboard</Link> |{" "}
        <Link to="/leads">Leads</Link>
      </nav>

      <button onClick={handleLogout} style={{ marginTop: "10px" }}>
        Sair
      </button>
    </header>
  );
}
