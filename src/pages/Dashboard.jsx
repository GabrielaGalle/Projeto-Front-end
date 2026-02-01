import Header from "../components/Header";
import leadsMock from "../data/leadsMock";

export default function Dashboard() {
  // contagem por tipo
  const totalPublica = leadsMock.filter(l => l.tipo === "Pública").length;
  const totalParticular = leadsMock.filter(l => l.tipo === "Particular").length;
  const totalCursinho = leadsMock.filter(l => l.tipo === "Cursinho").length;

  const totalLeads = leadsMock.length;

  function Barra({ label, valor, cor }) {
    return (
      <div style={{ marginBottom: "16px" }}>
        <strong>{label} ({valor})</strong>

        <div
          style={{
            height: "14px",
            background: "#e5e7eb",
            borderRadius: "6px",
            overflow: "hidden",
            marginTop: "6px"
          }}
        >
          <div
            style={{
              width: `${valor * 20}px`,
              height: "100%",
              background: cor
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <div
        style={{
          padding: "30px",
          maxWidth: "900px",
          margin: "0 auto"
        }}
      >
        <h1>Dashboard</h1>

        {/* RESUMO */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "30px"
          }}
        >
          <div style={cardStyle}>
            <strong>Total de Leads</strong>
            <h2>{totalLeads}</h2>
          </div>

          <div style={cardStyle}>
            <strong>Públicas</strong>
            <h2>{totalPublica}</h2>
          </div>

          <div style={cardStyle}>
            <strong>Particulares</strong>
            <h2>{totalParticular}</h2>
          </div>

          <div style={cardStyle}>
            <strong>Cursinhos</strong>
            <h2>{totalCursinho}</h2>
          </div>
        </div>

        {/* GRÁFICO */}
        <h2>Leads por tipo</h2>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
          }}
        >
          <Barra label="Pública" valor={totalPublica} cor="#2563eb" />
          <Barra label="Particular" valor={totalParticular} cor="#16a34a" />
          <Barra label="Cursinho" valor={totalCursinho} cor="#7c3aed" />
        </div>
      </div>
    </>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "16px",
  borderRadius: "10px",
  minWidth: "140px",
  boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
};
