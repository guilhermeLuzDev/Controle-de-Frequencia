import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./Dashboard.css";
import {
  Menu,
  Award,
  Clock,
  TrendingUp,
  Bell,
  Upload,
  Calendar,
  BarChart3,
  FileText,
} from "lucide-react";

function Dashboard() {
  const [arquivo, setArquivo] = useState(null);
  const [mensagemEnvio, setMensagemEnvio] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [historicoRelatorios, setHistoricoRelatorios] = useState([]);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  const nomeBolsa = "Partiu IF"; 
  const cargaHorariaTotal = 100; 
  const horasCumpridas = 78; 
  const percentual = Math.round((horasCumpridas / cargaHorariaTotal) * 100);
  const nomeUsuario = localStorage.getItem("nome_usuario") || "Usuário";
  const matriculaUsuario = localStorage.getItem("matricula_usuario");


  const comunicados = [
    {
      titulo: "Entrega de Relatório",
      mensagem: "Não esquecer de enviar até dia 20/06",
      tipo: "urgente",
      data: "20/06",
    },
    {
      titulo: "Presença obrigatória",
      mensagem: "Reunião dia 18/06 com todos os bolsistas",
      tipo: "importante",
      data: "18/06",
    },
  ];

  const enviarRelatorio = async () => {
    if (!arquivo) {
      setMensagemEnvio("Por favor, selecione um arquivo PDF.");
      return;
    }

    if (!matriculaUsuario) {
      setMensagemEnvio("Erro: Matrícula do usuário não encontrada. Por favor, faça login novamente.");
      return;
    }

    const formData = new FormData();
    formData.append("arquivo", arquivo);
    formData.append("data_relatorio", new Date().toISOString().split("T")[0]);
    formData.append("conteudo", "Relatório enviado pelo sistema");
    formData.append("status_relatorio", "pendente");
    formData.append("fk_usuario_matricula_usuario", matriculaUsuario);

    try {
      const response = await fetch("http://localhost:3001/relatorios", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMensagemEnvio("Relatório enviado com sucesso!");
        setArquivo(null);
        fetchHistoricoRelatorios();
      } else {
        const erro = await response.json();
        setMensagemEnvio(`Erro ao enviar: ${erro.error}`);
      }
    } catch (error) {
      console.error("Erro ao enviar:", error);
      setMensagemEnvio("Erro de conexão com o servidor.");
    }

    setTimeout(() => setMensagemEnvio(""), 5000);
  };

  const fetchHistoricoRelatorios = async () => {
    if (!matriculaUsuario) {
        setHistoricoRelatorios([]);
        return;
    }
    try {
      const response = await fetch(`http://localhost:3001/relatorios?matricula_usuario=${matriculaUsuario}`);
      if (response.ok) {
        const data = await response.json();
        setHistoricoRelatorios(data);
      } else {
        console.error("Erro ao buscar histórico de relatórios:", response.statusText);
        setHistoricoRelatorios([]);
      }
    } catch (error) {
      console.error("Erro de conexão ao buscar histórico:", error);
      setHistoricoRelatorios([]);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setAnimateProgress(true), 500);
    fetchHistoricoRelatorios();
    return () => clearTimeout(timer);
  }, [matriculaUsuario]);

  // Função auxiliar para determinar a classe do status
  const getStatusClass = (status) => {
    switch (status) {
      case 'aprovado':
        return 'status-aprovado';
      case 'reprovado':
        return 'status-reprovado';
      case 'pendente':
        return 'status-pendente';
      default:
        return '';
    }
  };

  return (
    <div className="dashboard-container">
      <button className="menu-toggle" onClick={toggleSidebar} aria-label="Abrir menu">
        <Menu />
      </button>

      <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario="bolsista" />

      <div className="content">
        <header className="dashboard-header">
          <div className="welcome-section">
            <h1>Bem-vindo, {nomeUsuario}!</h1>
            <p>Acompanhe seu progresso e mantenha-se atualizado</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <Calendar className="stat-icon" />
              <span>Hoje: {new Date().toLocaleDateString("pt-BR")}</span>
            </div>
          </div>
        </header>

        <div className="dashboard-grid">
          {/* Cartões informativos */}
          <div className="info-cards">
            <div className="card info-card">
              <div className="card-header">
                <Award className="card-icon" />
                <span className="card-label">Bolsa Atual</span>
              </div>
              <div className="card-content">
                <h3>{nomeBolsa}</h3>
                <p>Programa ativo</p>
              </div>
            </div>

            <div className="card info-card">
              <div className="card-header">
                <Clock className="card-icon" />
                <span className="card-label">Carga Horária</span>
              </div>
              <div className="card-content">
                <h3>{cargaHorariaTotal}h</h3>
                <p>Total do programa</p>
              </div>
            </div>

            <div className="card info-card">
              <div className="card-header">
                <TrendingUp className="card-icon" />
                <span className="card-label">Progresso</span>
              </div>
              <div className="card-content">
                <h3>{percentual}%</h3>
                <p>Concluído</p>
              </div>
            </div>
          </div>

          {/* Progresso circular */}
          <div className="card progress-card">
            <div className="card-header">
              <BarChart3 className="card-icon" />
              <h3>Frequência Atual</h3>
            </div>
            <div className="progress-content">
              <div className="circular-progress">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg" d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path
                    className={`circle ${animateProgress ? "animate" : ""}`}
                    d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831"
                    strokeDasharray={`${animateProgress ? percentual : 0}, 100`}
                  />
                </svg>
                <div className="percentage">
                  <span className="number">{animateProgress ? percentual : 0}%</span>
                </div>
              </div>
              <div className="progress-details">
                <p><strong>{horasCumpridas}h</strong> de <strong>{cargaHorariaTotal}h</strong> cumpridas</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: animateProgress ? `${percentual}%` : "0%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Comunicados */}
          <div className="card comunicados-card">
            <div className="card-header">
              <Bell className="card-icon" />
              <h3>Comunicados</h3>
              <span className="badge">{comunicados.length}</span>
            </div>
            <div className="comunicados-list">
              {comunicados.map((c, i) => (
                <div key={i} className={`comunicado-item ${c.tipo}`}>
                  <div className="comunicado-header">
                    <h4>{c.titulo}</h4>
                    <span className="comunicado-data">{c.data}</span>
                  </div>
                  <p>{c.mensagem}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Enviar relatório */}
          <div className="card upload-card">
            <div className="card-header">
              <Upload className="card-icon" />
              <h3>Enviar Relatório</h3>
            </div>
            <div className="upload-section">
              <input type="file" accept=".pdf" onChange={(e) => setArquivo(e.target.files[0])} />
              <button className="botao" onClick={enviarRelatorio}>Enviar PDF</button>
              {mensagemEnvio && <p className="mensagem-envio">{mensagemEnvio}</p>}
            </div>
          </div>

          {/* Histórico de Relatórios */}
          <div className="card historico-relatorios-card">
            <div className="card-header">
              <FileText className="card-icon" />
              <h3>Histórico de Relatórios</h3>
            </div>
            <div className="relatorios-list">
              {historicoRelatorios.length === 0 ? (
                <p>Nenhum relatório enviado ainda.</p>
              ) : (
                <table className="tabela-relatorios">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Status</th>
                      <th>Visualizar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicoRelatorios.map((relatorio) => (
                      <tr key={relatorio.id_relatorio}>
                        <td>{new Date(relatorio.data_relatorio).toLocaleDateString('pt-BR')}</td>
                        {/* Aplica classe CSS baseada no status */}
                        <td className={getStatusClass(relatorio.status_relatorio)}>
                          {relatorio.status_relatorio}
                        </td>
                        <td>
                          {relatorio.arquivo_relatorio && (
                            <a
                              href={`http://localhost:3001/relatorios/arquivo/${relatorio.arquivo_relatorio}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Abrir PDF
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;