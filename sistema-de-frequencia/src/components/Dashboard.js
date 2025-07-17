"use client"

import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import {
  Menu,
  Award,
  Clock,
  Upload,
  BarChart3,
  FileText,
  Target,
  Activity,
} from "lucide-react"
import "./Dashboard.css"

function Dashboard() {
  const [arquivo, setArquivo] = useState(null)
  const [mensagemEnvio, setMensagemEnvio] = useState("")
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [animateProgress, setAnimateProgress] = useState(false)
  const [historicoRelatorios, setHistoricoRelatorios] = useState([])
  const [resumo, setResumo] = useState(null)
  const [loadingResumo, setLoadingResumo] = useState(true)
  const [erroResumo, setErroResumo] = useState(null)

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible)
  const closeSidebar = () => setSidebarVisible(false)

  const nomeUsuario = localStorage.getItem("nome_usuario") || "Usuário"
  const matriculaUsuario = localStorage.getItem("matricula_usuario")

  // Buscar resumo da bolsa e frequência
  useEffect(() => {
    const carregarResumo = async () => {
      if (!matriculaUsuario) {
        setErroResumo("Usuário não identificado")
        setLoadingResumo(false)
        return
      }
      try {
        setLoadingResumo(true)
        const resumoResponse = await fetch(`http://localhost:3001/frequencia/resumo/${matriculaUsuario}`)
        if (!resumoResponse.ok) {
          throw new Error("Erro ao carregar resumo da bolsa")
        }
        const resumoData = await resumoResponse.json()
        setResumo(resumoData)
      } catch (err) {
        setErroResumo(err.message)
      } finally {
        setLoadingResumo(false)
      }
    }
    carregarResumo()
  }, [matriculaUsuario])

  const enviarRelatorio = async () => {
    if (!arquivo) {
      setMensagemEnvio("Por favor, selecione um arquivo PDF.")
      return
    }

    if (!matriculaUsuario) {
      setMensagemEnvio("Erro: Matrícula do usuário não encontrada. Por favor, faça login novamente.")
      return
    }

    const formData = new FormData()
    formData.append("arquivo", arquivo)
    formData.append("data_relatorio", new Date().toISOString().split("T")[0])
    formData.append("conteudo", "Relatório enviado pelo sistema")
    formData.append("status_relatorio", "pendente")
    formData.append("fk_usuario_matricula_usuario", matriculaUsuario)

    try {
      const response = await fetch("http://localhost:3001/relatorios", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setMensagemEnvio("Relatório enviado com sucesso!")
        setArquivo(null)
        fetchHistoricoRelatorios()
      } else {
        const erro = await response.json()
        setMensagemEnvio(`Erro ao enviar: ${erro.error}`)
      }
    } catch (error) {
      console.error("Erro ao enviar:", error)
      setMensagemEnvio("Erro de conexão com o servidor.")
    }

    setTimeout(() => setMensagemEnvio(""), 5000)
  }

  const fetchHistoricoRelatorios = async () => {
    if (!matriculaUsuario) {
      setHistoricoRelatorios([])
      return
    }
    try {
      const response = await fetch(`http://localhost:3001/relatorios?matricula_usuario=${matriculaUsuario}`)
      if (response.ok) {
        const data = await response.json()
        setHistoricoRelatorios(data)
      } else {
        console.error("Erro ao buscar histórico de relatórios:", response.statusText)
        setHistoricoRelatorios([])
      }
    } catch (error) {
      console.error("Erro de conexão ao buscar histórico:", error)
      setHistoricoRelatorios([])
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setAnimateProgress(true), 500)
    fetchHistoricoRelatorios()
    return () => clearTimeout(timer)
  }, [matriculaUsuario])

  const getStatusClass = (status) => {
    switch (status) {
      case "aprovado":
        return "status-aprovado"
      case "reprovado":
        return "status-reprovado"
      case "pendente":
        return "status-pendente"
      default:
        return ""
    }
  }

  // Dados reais vindos do backend
  const nomeBolsa = resumo?.nome_bolsa || "Não informado"
  const cargaHorariaTotal = resumo?.carga_horaria || 0
  const horasCumpridas = resumo?.horas_cumpridas || 0
  const percentual = resumo?.percentual || 0

  return (
    <div className="dashboard-container">
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario="bolsista" />

      <div className={`main-content ${sidebarVisible ? "sidebar-open" : ""}`}>
        <header className="top-header">
          <button className="menu-toggle" onClick={toggleSidebar} aria-label="Abrir menu">
            <Menu />
          </button>
        </header>

        <div className="dashboard-content">
          <div className="welcome-section">
            <div className="welcome-text">
              <h1>Olá, {nomeUsuario}! 👋</h1>
              <p>Acompanhe seu progresso e mantenha-se atualizado com suas atividades</p>
            </div>
            <div className="welcome-stats">
              <div className="stat-badge">
                <Target className="stat-icon" />
                <span>{percentual}% Concluído</span>
              </div>
            </div>
          </div>

          {loadingResumo ? (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <span className="loading">Carregando informações da bolsa...</span>
            </div>
          ) : erroResumo ? (
            <div className="card error" style={{ textAlign: 'center', padding: 40 }}>
              <span>Erro: {erroResumo}</span>
            </div>
          ) : (
            <>
              <div className="metrics-grid">
                <div className="metric-card primary">
                  <div className="metric-icon">
                    <Award />
                  </div>
                  <div className="metric-content">
                    <h3>{nomeBolsa}</h3>
                    <p>Programa Ativo</p>
                  </div>
                </div>

                <div className="metric-card secondary">
                  <div className="metric-icon">
                    <Clock />
                  </div>
                  <div className="metric-content">
                    <h3>{cargaHorariaTotal}h</h3>
                    <p>Carga Total</p>
                  </div>
                </div>

                <div className="metric-card success">
                  <div className="metric-icon">
                    <Activity />
                  </div>
                  <div className="metric-content">
                    <h3>{horasCumpridas}h</h3>
                    <p>Horas Cumpridas</p>
                  </div>
                </div>
              </div>

              <div className="content-grid">
                <div className="progress-section">
                  <div className="card progress-card">
                    <div className="card-header">
                      <div className="header-content">
                        <BarChart3 className="header-icon" />
                        <h3>Progresso da Frequência</h3>
                      </div>
                    </div>
                    <div className="progress-content">
                      <div className="circular-progress">
                        <svg viewBox="0 0 36 36" className="circular-chart">
                          <path
                            className="circle-bg"
                            d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
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
                        <div className="progress-info">
                          <span className="hours-completed">{horasCumpridas}h</span>
                          <span className="hours-total">de {cargaHorariaTotal}h</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: animateProgress ? `${percentual}%` : "0%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card upload-card">
                    <div className="card-header">
                      <div className="header-content">
                        <Upload className="header-icon" />
                        <h3>Enviar Relatório</h3>
                      </div>
                    </div>
                    <div className="upload-content">
                      <div className="file-input-wrapper">
                        <input type="file" accept=".pdf" onChange={(e) => setArquivo(e.target.files[0])} id="file-input" />
                        <label htmlFor="file-input" className="file-label">
                          {arquivo ? arquivo.name : "Escolher arquivo PDF"}
                        </label>
                      </div>
                      <button className="upload-btn" onClick={enviarRelatorio}>
                        Enviar Relatório
                      </button>
                      {mensagemEnvio && <p className="upload-message">{mensagemEnvio}</p>}
                    </div>
                  </div>
                </div>

                <div className="info-section">
                  {/* Bloco de comunicados removido */}
                  <div className="card historico-card">
                    <div className="card-header">
                      <div className="header-content">
                        <FileText className="header-icon" />
                        <h3>Histórico de Relatórios</h3>
                      </div>
                    </div>
                    <div className="historico-content">
                      {historicoRelatorios.length === 0 ? (
                        <div className="empty-state">
                          <FileText className="empty-icon" />
                          <p>Nenhum relatório enviado ainda</p>
                        </div>
                      ) : (
                        <div className="relatorios-list">
                          {historicoRelatorios.map((relatorio) => (
                            <div key={relatorio.id_relatorio} className="relatorio-item">
                              <div className="relatorio-info">
                                <span className="relatorio-date">
                                  {new Date(relatorio.data_relatorio).toLocaleDateString("pt-BR")}
                                </span>
                                <span className={`relatorio-status ${getStatusClass(relatorio.status_relatorio)}`}>
                                  {relatorio.status_relatorio.charAt(0).toUpperCase() + relatorio.status_relatorio.slice(1)}
                                </span>
                              </div>
                              {relatorio.arquivo_relatorio && (
                                <a
                                  href={`http://localhost:3001/relatorios/arquivo/${relatorio.arquivo_relatorio}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="view-link"
                                >
                                  Ver PDF
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard