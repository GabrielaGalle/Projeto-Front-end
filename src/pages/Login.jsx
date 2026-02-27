import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("auth");
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Preencha e-mail e senha");
      return;
    }

    setCarregando(true);

    // login
    setTimeout(() => {
      localStorage.setItem("auth", "true");
      localStorage.setItem("userEmail", email);
      navigate("/dashboard");
    }, 1500);
  }

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f5f7fa",
      fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      padding: "20px"
    },
    logo: {
      width: "220px",
      marginBottom: "30px",
      cursor: "pointer"
    },
    card: {
      width: "100%",
      maxWidth: "400px",
      backgroundColor: "#ffffff",
      padding: "35px 40px",
      borderRadius: "4px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
      textAlign: "center",
      border: "1px solid #e1e4e8"
    },
    title: {
      fontSize: "18px",
      color: "#333",
      marginBottom: "25px",
      fontWeight: "500"
    },
    input: {
      width: "100%",
      padding: "12px 15px",
      marginBottom: "15px",
      borderRadius: "4px",
      border: "1px solid #ced4da",
      fontSize: "15px",
      boxSizing: "border-box",
      outline: "none",
      transition: "border-color 0.2s"
    },
    options: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "14px",
      color: "#6c757d",
      marginBottom: "25px"
    },
    buttonLogin: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.2s"
    },
    blueLink: {
      color: "#007bff",
      textDecoration: "none",
      fontWeight: "500"
    }
  };

  return (
    <div style={styles.container}>
      <img
        src="https://revisaoonline.com.br/imagens/land/logoFundoClaro.png"
        alt="RevisãoOnline"
        style={styles.logo}
      />

      <div style={styles.card}>
        <h2 style={styles.title}>Gestão de Vendas</h2>

        {erro && (
          <div style={{
            color: "#721c24",
            backgroundColor: "#f8d7da",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "15px",
            fontSize: "14px"
          }}
          >
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={styles.input}
          />

          <div style={styles.options}>
            <label style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer"
            }}
            >

              <input
                type="checkbox"
                checked={lembrar}
                onChange={() => setLembrar(!lembrar)}
                style={{ marginRight: "8px" }}
              />
              Lembrar de mim
            </label>
            <a href="#" style={styles.blueLink}>Esqueceu a senha?</a>
          </div>

          <button
            type="submit"
            style={styles.buttonLogin}
            disabled={carregando}
          >
            {carregando ? "Autenticando..." : "Entrar"}
          </button>
        </form>
      </div>

      <div style={{
        marginTop: "40px",
        fontSize: "12px"
      }}
      >
        <span style={{
          color: "#adb5bd"
        }}
        >
          RevisãoOnline © 2026 - Painel Administrativo</span>
      </div>
    </div>
  );
}