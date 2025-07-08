import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './FrequenciaBolsista.css';

function FrequenciaBolsista() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  const [presencas, setPresencas] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pegar matrícula do usuário logado
  const matriculaUsuario = localStorage.getItem('matricula_usuario');

  useEffect(() => {
    const carregarDados = async () => {
      if (!matriculaUsuario) {
        setError('Usuário não identificado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Carregando dados para matrícula:', matriculaUsuario);
        
        // Buscar resumo da frequência
        const resumoResponse = await fetch(`http://localhost:3001/frequencia/resumo/${matriculaUsuario}`);
        console.log('Status da resposta resumo:', resumoResponse.status);
        
        if (!resumoResponse.ok) {
          const errorText = await resumoResponse.text();
          console.error('Erro na resposta resumo:', errorText);
          throw new Error(`Erro ao carregar resumo da frequência: ${resumoResponse.status}`);
        }
        
        const resumoData = await resumoResponse.json();
        console.log('Dados do resumo recebidos:', resumoData);
        setResumo(resumoData);

        // Buscar histórico de presenças
        const presencasResponse = await fetch(`http://localhost:3001/frequencia/usuario/${matriculaUsuario}`);
        console.log('Status da resposta presenças:', presencasResponse.status);
        
        if (!presencasResponse.ok) {
          const errorText = await presencasResponse.text();
          console.error('Erro na resposta presenças:', errorText);
          throw new Error(`Erro ao carregar histórico de presenças: ${presencasResponse.status}`);
        }
        
        const presencasData = await presencasResponse.json();
        console.log('Dados das presenças recebidos:', presencasData);
        setPresencas(presencasData);

      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [matriculaUsuario]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'presente':
        return 'status-presente';
      case 'ausente':
        return 'status-ausente';
      case 'justificado':
        return 'status-justificado';
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

  if (loading) {
    return (
      <div className="dashboard-container">
        <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
        <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario="bolsista" />
        <div className="content">
          <div className="loading">Carregando...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
        <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario="bolsista" />
        <div className="content">
          <div className="error">Erro: {error}</div>
        </div>
      </div>
    );
  }

  console.log('Renderizando componente com resumo:', resumo);

  return (
    <div className="dashboard-container">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario="bolsista" />

      <div className="content">
        <h2>Frequência</h2>

        {resumo ? (
          <>
            <div className="card info-bolsa">
              <h3>Informações da Bolsa</h3>
              <p><strong>Bolsa:</strong> {resumo.nome_bolsa || 'Não informado'}</p>
              <p><strong>Tipo:</strong> {resumo.tipo_bolsa || 'Não informado'}</p>
              <p><strong>Carga Horária:</strong> {resumo.carga_horaria || 0}h</p>
            </div>

            <div className="card circulo-progresso">
              <p>Progresso</p>
              <div className="grafico-circular">
                <svg viewBox="0 0 36 36">
                  <path
                    className="bg"
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="progress"
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831"
                    strokeDasharray={`${resumo.percentual || 0}, 100`}
                  />
                </svg>
                <span className="percentual">{resumo.percentual || 0}%</span>
              </div>
              <p>{resumo.horas_cumpridas || 0}h de {resumo.carga_horaria || 0}h cumpridas</p>
            </div>

            <div className="card resumo-frequencia">
              <h3>Resumo da Frequência</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">{resumo.dias_presente || 0}</span>
                  <span className="stat-label">Dias Presente</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{resumo.dias_ausente || 0}</span>
                  <span className="stat-label">Dias Ausente</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{resumo.dias_justificado || 0}</span>
                  <span className="stat-label">Dias Justificados</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{resumo.total_registros || 0}</span>
                  <span className="stat-label">Total de Registros</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="card">
            <p>Nenhuma informação de bolsa encontrada para este usuário.</p>
          </div>
        )}

        <h3>Histórico de Presenças</h3>
        {presencas.length === 0 ? (
          <div className="card">
            <p>Nenhuma presença registrada ainda.</p>
          </div>
        ) : (
          <div className="card">
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
                      <span className={`status-badge ${getStatusColor(presenca.status_presenca)}`}>
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
  );
}

export default FrequenciaBolsista;
