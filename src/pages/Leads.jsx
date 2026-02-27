import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import Header from "../components/Header";
import leadsMock from "../data/leadsMock";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [editandoId, setEditandoId] = useState(null);

  const [notificacao, setNotificacao] = useState(null);
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");

  const [novoLead, setNovoLead] = useState({
    escola: "",
    tipo: "Particular",
    status: "Novo",
    alunos: "",
    contato: "",
    responsavel: "",
    cargo: "Coordenador"
  });

  useEffect(() => {
    const handleThemeChange = () => {
      const isDark = localStorage.getItem("theme") === "dark";
      setDarkMode(isDark);
      document.body.style.backgroundColor = isDark ? "#0f172a" : "#f5f7fa";
    };
    window.addEventListener("storage", handleThemeChange);
    handleThemeChange();
    const dados = localStorage.getItem("leads");
    if (dados) {
      setLeads(JSON.parse(dados));
    }
    else {
      setLeads(leadsMock);
    }
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  // --- TELEFONE (xx) xxxxx-xxxx ---
  const formatarTelefone = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/(\={11})\d+?$/, "$1")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2");
  };

  const mostrarToast = (msg) => {
    setNotificacao(msg);
    setTimeout(() => setNotificacao(null), 3000);
  };

  const exportarCSV = () => {
    if (leads.length === 0) return mostrarToast("Nenhum dado para exportar");
    const cabecalho = "Escola,Tipo,Alunos,Status,Responsavel,Cargo,Contato\n";
    const linhas = leads.map(l => `${l.escola},${l.tipo},${l.alunos},${l.status},${l.responsavel},${l.cargo},${l.contato}`).join("\n");
    const blob = new Blob([cabecalho + linhas], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leads_revisao_online.csv');
    link.click();
    mostrarToast("CSV Exportado com sucesso!");
  };

  const dadosStatus = [
    { name: "Novo", value: leads.filter(l => l.status === "Novo").length },
    { name: "Em contato", value: leads.filter(l => l.status === "Em contato").length },
    { name: "Fechado", value: leads.filter(l => l.status === "Fechado").length },
  ];
  const COLORS_STATUS = ['#ef4444', '#f59e0b', '#10b981'];

  const prepararDadosBarras = () => {
    const tipos = ["Particular", "Pública", "Cursinho"];
    return tipos.map(t => ({
      tipo: t,
      alunos: leads.filter(l => l.tipo === t).reduce((acc, curr) => acc + Number(curr.alunos || 0), 0)
    }));
  };
  const dadosTipo = prepararDadosBarras();

  const salvarLead = (e) => {
    e.preventDefault();
    if (!novoLead.escola || !novoLead.alunos) return mostrarToast("⚠️ Preencha Escola e Alunos ⚠️");

    const leadFinal = { ...novoLead, id: editandoId || Date.now() };

    setLeads(prevLeads => {
      const novaLista = editandoId
        ? prevLeads.map(l => l.id === editandoId ? leadFinal : l)
        : [...prevLeads, leadFinal];

      localStorage.setItem("leads", JSON.stringify(novaLista));
      return novaLista;
    });

    mostrarToast(editandoId ? "✅ Instituição atualizada!" : "✅ Nova instituição cadastrada!");
    setEditandoId(null);
    setNovoLead({
      escola: "", tipo: "Particular", status: "Novo", alunos: "",
      contato: "", responsavel: "", cargo: "Coordenador"
    });
    window.dispatchEvent(new Event("storage"));
  };

  const removerLead = (id) => {
    if (window.confirm("Deseja remover esta instituição?")) {
      const lista = leads.filter(l => l.id !== id);
      setLeads(lista);
      localStorage.setItem("leads", JSON.stringify(lista));
      mostrarToast("✅ Instituição removida.");
      window.dispatchEvent(new Event("storage"));
    }
  };

  const prepararEdicao = (lead) => {
    setEditandoId(lead.id);
    setNovoLead({ ...lead });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const obterPlanoSugerido = (qtd) => {
    const n = Number(qtd);
    if (!n || n <= 0) return "Defina a quantidade...";
    if (n <= 50) return "Licença Turma";
    if (n <= 200) return "Pacote Escola";
    return "Plano Ilimitado";
  };

  const leadsFiltrados = leads.filter(l => {
    const matchBusca = l.escola.toLowerCase().includes(busca.toLowerCase());
    const matchTipo = filtroTipo === "Todos" || l.tipo === filtroTipo;
    return matchBusca && matchTipo;
  });

  const bgColor = darkMode ? "#1e293b" : "#fff";
  const borderColor = darkMode ? "#334155" : "#e1e4e8";
  const textColor = darkMode ? "#fff" : "#333";

  return (
    <div style={{
      minHeight: "100vh",
      transition: "0.3s ease",
      fontFamily: "'Segoe UI', sans-serif"
    }}
    >

      {notificacao && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          background: '#334155',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          zIndex: 9999,
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          fontWeight: '600',
          animation: 'fadeIn 0.3s ease'
        }}
        >

          {notificacao}
        </div>
      )}

      <Header />

      <div style={{
        padding: "30px",
        maxWidth: "1400px",
        margin: "0 auto",
        color: textColor
      }}
      >

        {/* TOP BAR */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px"
        }}
        >

          <div>
            <h1 style={{
              fontSize: "24px",
              fontWeight: "700",
              margin: 0
            }}
            >

              Dashboard Comercial</h1>
            <p style={{
              fontSize: "12px",
              opacity: 0.7
            }}
            >

              RevisãoOnline B2B - Prospecção</p>
          </div>

          <div style={{
            display: "flex",
            gap: "10px"
          }}
          >
            <button onClick={exportarCSV} style={{
              background: '#64748b',
              color: 'white',
              border: 'none',
              padding: '0 15px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
            >
              Exportar CSV</button>

            <input
              placeholder="Buscar escola..."
              style={{ ...inStyle(darkMode), width: "200px" }}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <select
              style={{ ...inStyle(darkMode), width: "140px" }}
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="Todos">Todos os Tipos</option>
              <option value="Particular">Particular</option>
              <option value="Pública">Pública</option>
              <option value="Cursinho">Cursinho</option>
            </select>
          </div>
        </div>

        {/* GRÁFICOS E KPIs */}
        <div style={{ 
          display: "grid",
           gridTemplateColumns: "1fr 1fr 1.5fr", 
           gap: "20px", 
           marginBottom: "30px" 
           }}
           >

          <div style={{ 
            display: "flex",
             flexDirection: "column", 
             gap: "15px" }}>
            <div style={kpiStyle(darkMode, "#6366f1")}>
              <span style={kpiLabel}>LEADS ATIVOS</span>
              <div style={kpiValue}>{leads.length}</div>
            </div>
            <div style={kpiStyle(darkMode, "#10b981")}>
              <span style={kpiLabel}>CONVERSÃO</span>
              <div style={kpiValue}>
                {leads.length > 0 ? ((leads.filter(l => l.status === "Fechado").length / leads.length) * 100).toFixed(0) : 0}%
              </div>
            </div>
          </div>

          <div style={{
            background: bgColor,
            padding: "20px",
            borderRadius: "8px",
            border: `1px solid ${borderColor}`,
            textAlign: "center"
          }}
          >

            <span style={kpiLabel}>DISTRIBUIÇÃO DE STATUS</span>
            <div style={{
              height: "180px",
              marginTop: "10px"
            }}
            >

              {leads.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                    data={dadosStatus} 
                    innerRadius={40} 
                    outerRadius={60} 
                    paddingAngle={5} 
                    dataKey="value">
                      {dadosStatus.map((entry, index) => <Cell key={`cell-${index}`} 
                      fill={COLORS_STATUS[index % COLORS_STATUS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div style={emptyStateStyle}>Sem dados</div>}
            </div>
          </div>

          <div style={{
            background: bgColor,
            padding: "20px",
            borderRadius: "8px",
            border: `1px solid ${borderColor}`
          }}
          >

            <span style={kpiLabel}>VOLUME DE ALUNOS POR TIPO</span>
            <div style={{
              height: "180px",
              marginTop: "10px"
            }}
            >
              {leads.length > 0 ? (
                <ResponsiveContainer 
                width="100%"
                 height="100%">
                  <BarChart 
                  data={dadosTipo}>
                    <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke={darkMode ? "#334155" : "#e1e4e8"} 
                    />
                    <XAxis 
                    dataKey="tipo" 
                    fontSize={10} 
                    tick={{ fill: textColor 

                    }}
                     />
                    <YAxis 
                    fontSize={10}
                     tick={{ fill: textColor 

                     }} 
                     />
                    <Tooltip 
                    cursor={{ fill: 'transparent' 

                    }}
                     />
                    <Bar dataKey="alunos" 
                    fill="#6366f1" 
                    radius={[4, 4, 0, 0]} 
                    barSize={40} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : <div style={emptyStateStyle}>
                Sem dados
                </div>}
            </div>
          </div>
        </div>

        {/* CRUD */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "380px 1fr",
          gap: "30px"
        }}
        >

          <div style={{
            background: bgColor,
            padding: "20px",
            borderRadius: "8px",
            border: `1px solid ${borderColor}`,
            height: "fit-content"
          }}>
            <h3 style={{
              marginBottom: "20px",
              fontSize: "16px",
              fontWeight: "600"
            }}
            >
              {editandoId ? "Editar Instituição" : "Cadastrar Instituição"}</h3>
            <form onSubmit={salvarLead}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px"
              }}
            >

              <input placeholder="Instituição" 
              style={inStyle(darkMode)} 
              value={novoLead.escola} 
              onChange={e => setNovoLead({ ...novoLead, 
              escola: e.target.value })} />

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px"
              }}
              >
                <input type="number"
                  placeholder="Alunos" style={inStyle(darkMode)}
                  value={novoLead.alunos}
                  onChange={e => setNovoLead({ ...novoLead, 
                  alunos: e.target.value })} />
                <select style={inStyle(darkMode)} 
                value={novoLead.tipo}
                  onChange={e => setNovoLead({ ...novoLead, 
                  tipo: e.target.value })}>
                  <option>Particular</option><option>Pública</option><option>Cursinho</option>
                </select>
              </div>

              <input placeholder="Responsável" 
              style={inStyle(darkMode)} 
              value={novoLead.responsavel} 
              onChange={e => setNovoLead({ ...novoLead, 
              responsavel: e.target.value })} />

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px"
              }}
              >

                <select style={inStyle(darkMode)}
                  value={novoLead.cargo}
                  onChange={e => setNovoLead({ ...novoLead, cargo: e.target.value })}>

                  <option value="Cargo">Cargo</option>
                  <option value="Diretor">Diretor</option>
                  <option value="Coordenador">Coordenador</option>
                  <option value="Professor">Professor</option>
                </select>
                <input
                  placeholder="(xx) xxxxx-xxxx"
                  style={inStyle(darkMode)}
                  value={novoLead.contato}
                  onChange={e => setNovoLead({ ...novoLead, contato: formatarTelefone(e.target.value) })}
                />
              </div>

              <div style={{
                background: darkMode ? "#0f172a" : "#f0f7ff",
                padding: "12px",
                borderRadius: "6px",
                border: `1px solid 
                 ${darkMode ? "#1e293b" : "#cce3ff"}`
              }}>
                <span style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  color: "#6366f1"
                }}>Plano SUGERIDO: {obterPlanoSugerido(novoLead.alunos)}</span>
              </div>
              <select style={inStyle(darkMode)}
                value={novoLead.status}
                onChange={e => setNovoLead({ ...novoLead, status: e.target.value })}>
                <option>Novo</option><option>Em contato</option><option>Fechado</option>
              </select>
              <button type="submit"
                style={{
                  background: editandoId ? "#10b981" : "#6366f1",
                  color: "#fff",
                  border: "none",
                  padding: "12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}>
                {editandoId ? "Salvar Alterações" : "Cadastrar Instituição"}
              </button>
              {editandoId && <button type="button"
                onClick={() => {
                  setEditandoId(null);
                  setNovoLead({ 
                    escola: "", 
                    tipo: "Particular", 
                    status: "Novo", 
                    alunos: "", 
                    contato: "", 
                    responsavel: "", 
                    cargo: "Coordenador" });
                }} 
                style={{
                   background: "none", 
                   border: "none", 
                   color: "#666", 
                   cursor: "pointer", 
                   fontSize: "12px" 
                   }}
                   >
                    Cancelar</button>}
            </form>
          </div>

          <div style={{
            background: bgColor,
            borderRadius: "8px",
            border: `1px solid 
            ${borderColor}`,
            overflow: "hidden"
          }}
          >
            <table style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
            >
              <thead style={{
                background: darkMode ? "#0f172a" : "#f8fafc",
                borderBottom: `2px solid ${borderColor}`
              }}>
                <tr>
                  <th style={pStyle}>Instituição</th>
                  <th style={pStyle}>Contato / Responsável</th>
                  <th style={pStyle}>Potencial</th>
                  <th style={pStyle}>Status</th>
                  <th style={pStyle}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {leadsFiltrados.length > 0 ? leadsFiltrados.map(l => (
                  <tr key={l.id} style={{
                    borderBottom: `1px solid ${borderColor}`
                  }}>
                    <td style={pStyle}><strong>{l.escola}</strong><br /><small 
                    style={{ opacity: 0.6 }}>{l.tipo}</small></td>
                    <td style={pStyle}>
                      <strong>{l.responsavel || "N/A"}</strong><br />
                      <small style={{ opacity: 0.7 }}>{l.cargo} • {l.contato || "Sem tel"}</small>
                    </td>
                    <td style={pStyle}>{Number(l.alunos).toLocaleString()} alunos<br /><small 
                    style={{ color: "#6366f1" }}>{obterPlanoSugerido(l.alunos)}</small></td>
                    <td style={pStyle}>
                      <span style={{
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "10px",
                        fontWeight: "800",
                        color: getStatusStyle(l.status).color,
                        background: getStatusStyle(l.status).bg
                      }}>
                        {l.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={pStyle}>
                      <button onClick={() => prepararEdicao(l)}
                        style={{
                          color: "#6366f1",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: "bold",
                          marginRight: "12px"
                        }}
                      >
                        EDITAR</button>
                      <button onClick={() => removerLead(l.id)}
                        style={{
                          color: "#ef4444",
                          background: "none",
                          border: "none",
                          cursor: "pointer"
                        }}
                      >
                        EXCLUIR</button>
                    </td>
                  </tr>
                )) : <tr><td colSpan="5" style={{
                  padding: "60px",
                  textAlign: "center",
                  opacity: 0.5
                }}
                >
                  Nenhum registro encontrado.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


const pStyle = {
  padding: "16px",
  textAlign: "left",
  fontSize: "13px"
};
const inStyle = (d) => ({
  padding: "10px 12px",
  borderRadius: "6px",
  border: d ? "1px solid #334155" : "1px solid #cbd5e1",
  background: d ? "#0f172a" : "#fff",
  color: d ? "#fff" : "#333",
  width: "100%",
  boxSizing: "border-box",
  fontSize: "14px"
});
const kpiStyle = (d, color) => ({
  background: d ? "#1e293b" : "#fff",
  padding: "20px",
  borderRadius: "8px",
  borderLeft: `6px solid ${color}`,
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  flex: 1
});
const kpiLabel = {
  fontSize: "10px",
  fontWeight: "800",
  color: "#64748b",
  display: "block",
  marginBottom: "5px"
};
const kpiValue = {
  fontSize: "28px",
  fontWeight: "800"
};
const emptyStateStyle = {
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  opacity: 0.5
};
const getStatusStyle = (s) => s === "Fechado" ? { 
  color: "#10b981", 
  bg: "#10b98115" } : s ===
  "Em contato" ? { 
    color: "#f59e0b", 
    bg: "#f59e0b15" } : 
    { color: "#ef4444", bg: "#ef444415" };