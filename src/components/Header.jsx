import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const userEmail = localStorage.getItem("userEmail") || "vendedor@revisao.com";

  const toggleTheme = () => {
    const newTheme = !darkMode ? "dark" : "light";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);
  
    window.dispatchEvent(new Event("storage")); 
  };

  const linkStyle = (path) => ({
    textDecoration: "none",
    color: "#fff",
    fontSize: "14px",
    fontWeight: location.pathname === path ? "700" : "400",
    borderBottom: location.pathname === path ? "2px solid #fff" : "2px solid transparent",
    paddingBottom: "4px"
  });

  return (
    <header style={{
      
      background: darkMode 
        ? "linear-gradient(to right, #1e293b 0%, #1e293b 30%, #1e3a8a 100%)" 
        : "linear-gradient(to right, #f8fafc 0%, #f8fafc 30%, #007bff 100%)",
      padding: "12px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      fontFamily: "'Segoe UI', Arial, sans-serif"
    }}
    >
      
      <div 
      style={{ 
        display: "flex", 
        alignItems: "center" 
        }}
        >
        <img 
          src="https://revisaoonline.com.br/imagens/land/logoFundoClaro.png" 
          alt="RevisãoOnline" 
          style={{ 
            height: "35px", 
            cursor: "pointer", 
            filter: darkMode ? "brightness(0) invert(1)" : "none"
           }}
          onClick={() => navigate("/dashboard")}
        />
      </div>

      <div 
      style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "25px" }}>
        <button onClick={toggleTheme} 
        style={{
          background: "rgba(255,255,255,0.2)", 
          border: "1px solid #fff", 
          color: "#fff",
          padding: "5px 12px", 
          borderRadius: "20px", 
          cursor: "pointer", 
          fontSize: "12px"
        }}>
          {darkMode ? "☀️" : "🌙"}
        </button>

        <nav style={{ display: "flex", gap: "20px" }}>
          <Link to="/dashboard" 
          style={linkStyle("/dashboard")}
          >
            Dashboard
            </Link>
        
        </nav>

        <span 
        style={{ 
          color: "#fff", 
          fontSize: "13px" 
          }}
          >
            {userEmail}</span>
        
        <button onClick={() => { localStorage.removeItem("auth"); navigate("/"); }} 
          style={{
             background: "#dc3545",
              color: "#fff", 
              border: "none", 
              padding: "6px 12px", 
              borderRadius: "4px", 
              cursor: "pointer"
               }}
               >
          Sair
        </button>
      </div>
    </header>
  );
}