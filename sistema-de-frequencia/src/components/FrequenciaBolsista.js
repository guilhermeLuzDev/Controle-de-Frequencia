import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import {
  BarChart3,
  Calendar,
  UserCheck,
  UserX,
  UserMinus,
  List,
} from 'lucide-react';
import './Dashboard.css';

function FrequenciaBolsista() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [presencas, setPresencas] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  const matriculaUsuario = localStorage.getItem('matricula_usuario');
  const nomeUsuario = localStorage.getItem('nome_usuario') || 'Usuário';

  useEffect(() => {
    const carregarDados = async () => {
      if (!matriculaUsuario) {
        setError('Usuário não identificado');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Buscar resumo da frequência
        const resumoResponse = await fetch(`http://localhost:3001/frequencia/resumo/${matriculaUsuario}`);
        if (!resumoResponse.ok) {
          throw new Error('Erro ao carregar resumo da frequência');
        }
        const resumoData = await resumoResponse.json();
        setResumo(resumoData);
        // Buscar histórico de presenças
        const presencasResponse = await fetch(`http://localhost:3001/frequencia/usuario/${matriculaUsuario}`);
        if (!presencasResponse.ok) {
          throw new Error('Erro ao carregar histórico de presenças');
        }
        const presencasData = await presencasResponse.json();
        setPresencas(presencasData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, [matriculaUsuario]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'presente':
        return 'status-aprovado';
      case 'ausente':
        return 'status-reprovado';
      case 'justificado':
        return 'status-pendente';
      default:
        return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'presente':
        return 'Presente';
      case 'ausente':
        return 'Ausente';
      case 'justificado':
        return 'Justificado';
      default:
        return status;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario="bolsista" />
      <div className={`main-content ${sidebarVisible ? 'sidebar-open' : ''}`}>  
        <header className="top-header">
          <button className="menu-toggle" onClick={toggleSidebar} aria-label="Abrir menu">
            <List />
          </button>
        </header>
        <div className="dashboard-content">
          <div className="welcome-section">
            <div className="welcome-text">
              <h1>Olá, {nomeUsuario}! 👋</h1>
              <p>Acompanhe sua frequência e veja seu progresso na bolsa</p>
            </div>
          </div>

          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <span className="loading">Carregando...</span>
            </div>
          ) : error ? (
            <div className="card error" style={{ textAlign: 'center', padding: 40 }}>
              <span>Erro: {error}</span>
            </div>
          ) : (
            <div className="content-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div className="progress-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="card progress-card" style={{ minHeight: '340px' }}>
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
                          className="circle animate"
                          d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831"
                          strokeDasharray={`${resumo?.percentual || 0}, 100`}
                        />
                      </svg>
                      <div className="percentage">
                        <span className="number">{resumo?.percentual || 0}%</span>
                      </div>
                    </div>
                    <div className="progress-details">
                      <div className="progress-info">
                        <span className="hours-completed">{resumo?.horas_cumpridas || 0}h</span>
                        <span className="hours-total">de {resumo?.carga_horaria || 0}h</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${resumo?.percentual || 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card info-bolsa" style={{ minHeight: '340px' }}>
                  <div className="card-header">
                    <div className="header-content">
                      <Calendar className="header-icon" />
                      <h3>Informações da Bolsa</h3>
                    </div>
                  </div>
                  <div style={{ padding: '0 24px 24px 24px' }}>
                    <p><strong>Bolsa:</strong> {resumo?.nome_bolsa || 'Não informado'}</p>
                    <p><strong>Tipo:</strong> {resumo?.tipo_bolsa || 'Não informado'}</p>
                    <p><strong>Professor:</strong> {resumo?.nome_professor_responsavel || 'Não informado'}</p>
                    <p><strong>Carga Horária:</strong> {resumo?.carga_horaria || 0}h</p>
                  </div>
                </div>
              </div>

              <div className="info-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="card historico-card" style={{ minHeight: '340px' }}>
                  <div className="card-header">
                    <div className="header-content">
                      <BarChart3 className="header-icon" />
                      <h3>Histórico de Presenças</h3>
                    </div>
                  </div>
                  <div className="historico-content">
                    {presencas.length === 0 ? (
                      <div className="empty-state">
                        <p>Nenhuma presença registrada ainda.</p>
                      </div>
                    ) : (
                      <div className="relatorios-list">
                        <table className="tabela-frequencia">
                          <thead>
                            <tr>
                              <th>Data</th>
                              <th>Status</th>
                              <th>Observação</th>
                            </tr>
                          </thead>
                          <tbody>
                            {presencas.map((presenca) => (
                              <tr key={presenca.id_presenca}>
                                <td>{presenca.data_formatada}</td>
                                <td>
                                  <span className={`relatorio-status ${getStatusClass(presenca.status_presenca)}`}>
                                    {getStatusText(presenca.status_presenca)}
                                  </span>
                                </td>
                                <td>{presenca.observacao || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card resumo-frequencia" style={{ minHeight: '340px' }}>
                  <div className="card-header">
                    <div className="header-content">
                      <BarChart3 className="header-icon" />
                      <h3>Resumo da Frequência</h3>
                    </div>
                  </div>
                  <div className="stats-grid" style={{ padding: '0 24px 24px 24px' }}>
                    <div className="stat-item">
                      <UserCheck style={{ color: '#2e7d32', marginBottom: 8 }} />
                      <span className="stat-number">{resumo?.dias_presente || 0}</span>
                      <span className="stat-label">Dias Presente</span>
                    </div>
                    <div className="stat-item">
                      <UserX style={{ color: '#dc2626', marginBottom: 8 }} />
                      <span className="stat-number">{resumo?.dias_ausente || 0}</span>
                      <span className="stat-label">Dias Ausente</span>
                    </div>
                    <div className="stat-item">
                      <UserMinus style={{ color: '#d97706', marginBottom: 8 }} />
                      <span className="stat-number">{resumo?.dias_justificado || 0}</span>
                      <span className="stat-label">Dias Justificados</span>
                    </div>
                    <div className="stat-item">
                      <Calendar style={{ color: '#1e293b', marginBottom: 8 }} />
                      <span className="stat-number">{resumo?.total_registros || 0}</span>
                      <span className="stat-label">Total de Registros</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FrequenciaBolsista;
