import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import leadsMock from "../data/leadsMock";

export default function Leads() {
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem("leads");
    return saved ? JSON.parse(saved) : leadsMock;
  });

  const [filtros, setFiltros] = useState([]);

  const [escola, setEscola] = useState("");
  const [contato, setContato] = useState("");
  const [cargo, setCargo] = useState("");
  const [tipo, setTipo] = useState("");
  const [alunos, setAlunos] = useState("");

  useEffect(() => {
    localStorage.setItem("leads", JSON.stringify(leads));
  }, [leads]);

  function toggleFiltro(valor) {
    setFiltros(prev =>
      prev.includes(valor)
        ? prev.filter(v => v !== valor)
        : [...prev, valor]
    );
  }

  function sugerirPlano(qtd) {
    if (qtd <= 50) return "Licença Turma";
    if (qtd <= 150) return "Pacote Escola";
    return "Plano Personalizado";
  }

  function corTipo(tipo) {
    if (tipo === "Pública") return "#2563eb";
    if (tipo === "Particular") return "#16a34a";
    if (tipo === "Cursinho") return "#7c3aed";
    return "#6b7280";
  }

  function handleAddLead(e) {
    e.preventDefault();

    if (!escola || !contato || !cargo || !tipo || !alunos) return;

    setLeads(prev => [
      ...prev,
      {
        id: Date.now(),
        escola,
        contato,
        cargo,
        tipo,
        alunos: Number(alunos)
      }
    ]);

    setEscola("");
    setContato("");
    setCargo("");
    setTipo("");
    setAlunos("");
  }

  function removerLead(id) {
    setLeads(prev => prev.filter(l => l.id !== id));
  }

  const leadsFiltrados =
    filtros.length === 0
      ? leads
      : leads.filter(l => filtros.includes(l.tipo));

  return (
    <div style={{ background: "#f3f4f6", minHeight: "100vh", padding: "40px" }}>
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#fff",
          padding: "30px",
          borderRadius: "10px"
        }}
      >
        {/* BOTÃO VOLTAR */}
        <Link
          to="/dashboard"
          style={{
            display: "inline-block",
            marginBottom: "20px",
            textDecoration: "none",
            background: "#2563eb",
            color: "#fff",
            padding: "8px 14px",
            borderRadius: "6px",
            fontWeight: "bold"
          }}
        >
          ← Voltar ao Dashboard
        </Link>

        <h1>Leads</h1>

        {/* FILTROS */}
        <div style={{ marginBottom: "20px" }}>
          {["Pública", "Particular", "Cursinho"].map(t => (
            <label key={t} style={{ marginRight: "12px" }}>
              <input
                type="checkbox"
                checked={filtros.includes(t)}
                onChange={() => toggleFiltro(t)}
              />{" "}
              {t}
            </label>
          ))}
        </div>

        {/* FORMULÁRIO */}
        <h2>Novo Lead</h2>
        <form onSubmit={handleAddLead} style={{ marginBottom: "30px" }}>
          <input placeholder="Escola" value={escola} onChange={e => setEscola(e.target.value)} />
          <br /><br />

          <input placeholder="Contato" value={contato} onChange={e => setContato(e.target.value)} />
          <br /><br />

          <select value={cargo} onChange={e => setCargo(e.target.value)}>
            <option value="">Cargo</option>
            <option>Professor</option>
            <option>Coordenador</option>
            <option>Diretor</option>
          </select>
          <br /><br />

          <select value={tipo} onChange={e => setTipo(e.target.value)}>
            <option value="">Tipo</option>
            <option>Pública</option>
            <option>Particular</option>
            <option>Cursinho</option>
          </select>
          <br /><br />

          <input
            type="number"
            placeholder="Alunos"
            value={alunos}
            onChange={e => setAlunos(e.target.value)}
          />
          <br /><br />

          <button
            type="submit"
            style={{
              background: "#16a34a",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px"
            }}
          >
            Salvar Lead
          </button>
        </form>

        {/* LISTA */}
        <div style={{ display: "grid", gap: "16px" }}>
          {leadsFiltrados.map(lead => (
            <div
              key={lead.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "16px"
              }}
            >
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>{lead.escola}</h3>

                <span
                  style={{
                    background: corTipo(lead.tipo),
                    color: "#fff",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontSize: "12px"
                  }}
                >
                  {lead.tipo}
                </span>
              </div>

              <p><strong>Contato:</strong> {lead.contato} ({lead.cargo})</p>
              <p><strong>Alunos:</strong> {lead.alunos}</p>
              <p><strong>Plano:</strong> {sugerirPlano(lead.alunos)}</p>

              <button
                onClick={() => removerLead(lead.id)}
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
