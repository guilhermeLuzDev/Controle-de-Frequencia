import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import "./Dashboard.css"
import { Menu, Award, Clock, TrendingUp, Bell, Eye, Calendar, User, BarChart3 } from "lucide-react"

function Dashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [animateProgress, setAnimateProgress] = useState(false)

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible)
  const closeSidebar = () => setSidebarVisible(false)

  const nomeBolsa = "Partiu IF"
  const cargaHorariaTotal = 100
  const horasCumpridas = 78
  const percentual = Math.round((horasCumpridas / cargaHorariaTotal) * 100)

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
    {
      titulo: "Atualização do Sistema",
      mensagem: "Sistema será atualizado no final de semana",
      tipo: "info",
      data: "22/06",
    },
  ]

  const nomeUsuario = localStorage.getItem("nome_usuario") || "Usuário"

  // Animar progresso quando componente carrega
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateProgress(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

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

          <div className="card progress-card">
            <div className="card-header">
              <BarChart3 className="card-icon" />
              <h3>Frequência Atual</h3>
            </div>
            <div className="progress-content">
              <div className="circular-progress">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path
                    className="circle-bg"
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`circle ${animateProgress ? "animate" : ""}`}
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831"
                    strokeDasharray={`${animateProgress ? percentual : 0}, 100`}
                  />
                </svg>
                <div className="percentage">
                  <span className="number">{animateProgress ? percentual : 0}%</span>
                </div>
              </div>
              <div className="progress-details">
                <p>
                  <strong>{horasCumpridas}h</strong> de <strong>{cargaHorariaTotal}h</strong> cumpridas
                </p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: animateProgress ? `${percentual}%` : "0%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card comunicados-card">
            <div className="card-header">
              <Bell className="card-icon" />
              <h3>Comunicados</h3>
              <span className="badge">{comunicados.length}</span>
            </div>
            <div className="comunicados-list">
              {comunicados.map((comunicado, index) => (
                <div key={index} className={`comunicado-item ${comunicado.tipo}`}>
                  <div className="comunicado-header">
                    <h4>{comunicado.titulo}</h4>
                    <span className="comunicado-data">{comunicado.data}</span>
                  </div>
                  <p>{comunicado.mensagem}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card actions-card">
            <div className="card-header">
              <User className="card-icon" />
              <h3>Ações Rápidas</h3>
            </div>
            <div className="actions-grid">
              <button className="action-button primary">
                <Eye className="button-icon" />
                Visualizar Presenças
              </button>
              <button className="action-button secondary">
                <Calendar className="button-icon" />
                Agendar Reunião
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
