import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './ControleFrequencia.css';

function ControleFrequencia() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  const [bolsistas, setBolsistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBolsista, setSelectedBolsista] = useState(null);
  const [presencas, setPresencas] = useState([]);
  const [novaPresenca, setNovaPresenca] = useState({
    data_presenca: new Date().toISOString().split('T')[0],
    status_presenca: 'presente',
    observacao: ''
  });

  // Pegar matrícula do professor logado
  const matriculaProfessor = localStorage.getItem('matricula_usuario');

  useEffect(() => {
    carregarBolsistas();
  }, []);

  const carregarBolsistas = async () => {
    if (!matriculaProfessor) {
      setError('Professor não identificado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Carregando bolsistas para professor:', matriculaProfessor);
      
      // Buscar bolsistas vinculados ao professor
      const response = await fetch(`http://localhost:3001/usuarios/por-professor/${matriculaProfessor}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar bolsistas');
      }
      
      const data = await response.json();
      console.log('Bolsistas carregados:', data);
      setBolsistas(data);
      
    } catch (err) {
      console.error('Erro ao carregar bolsistas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const carregarPresencasBolsista = async (matriculaBolsista) => {
    try {
      const response = await fetch(`http://localhost:3001/frequencia/usuario/${matriculaBolsista}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar presenças');
      }
      
      const data = await response.json();
      setPresencas(data);
    } catch (err) {
      console.error('Erro ao carregar presenças:', err);
      setError(err.message);
    }
  };

  const handleBolsistaSelect = (bolsista) => {
    setSelectedBolsista(bolsista);
    carregarPresencasBolsista(bolsista.matricula_usuario);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovaPresenca(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const registrarPresenca = async (e) => {
    e.preventDefault();
    
    if (!selectedBolsista) {
      alert('Selecione um bolsista primeiro');
      return;
    }

    try {
      const presencaData = {
        ...novaPresenca,
        fk_usuario_matricula_usuario: selectedBolsista.matricula_usuario
      };

      const response = await fetch('http://localhost:3001/frequencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(presencaData)
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar presença');
      }

      // Recarregar presenças do bolsista
      await carregarPresencasBolsista(selectedBolsista.matricula_usuario);
      
      // Limpar formulário
      setNovaPresenca({
        data_presenca: new Date().toISOString().split('T')[0],
        status_presenca: 'presente',
        observacao: ''
      });

      alert('Presença registrada com sucesso!');
      
    } catch (err) {
      console.error('Erro ao registrar presença:', err);
      alert('Erro ao registrar presença: ' + err.message);
    }
  };

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
        <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario="professor" />
        <div className="content">
          <div className="loading">Carregando bolsistas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
        <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario="professor" />
        <div className="content">
          <div className="error">Erro: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario="professor" />

      <div className="content">
        <h2>Controle de Frequência</h2>

        <div className="controle-container">
          {/* Lista de Bolsistas */}
          <div className="bolsistas-section">
            <h3>Bolsistas Vinculados</h3>
            {bolsistas.length === 0 ? (
              <div className="card">
                <p>Nenhum bolsista vinculado encontrado.</p>
              </div>
            ) : (
              <div className="bolsistas-grid">
                {bolsistas.map((bolsista) => (
                  <div 
                    key={bolsista.matricula_usuario}
                    className={`bolsista-card ${selectedBolsista?.matricula_usuario === bolsista.matricula_usuario ? 'selected' : ''}`}
                    onClick={() => handleBolsistaSelect(bolsista)}
                  >
                    <h4>{bolsista.nome_usuario}</h4>
                    <p><strong>Matrícula:</strong> {bolsista.matricula_usuario}</p>
                    <p><strong>Bolsa:</strong> {bolsista.nome_bolsa_vinculada}</p>
                    <p><strong>Carga Horária:</strong> {bolsista.carga_horaria}h</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulário de Registro de Presença */}
          {selectedBolsista && (
            <div className="registro-section">
              <h3>Registrar Presença - {selectedBolsista.nome_usuario}</h3>
              
              <form onSubmit={registrarPresenca} className="form-presenca">
                <div className="form-group">
                  <label htmlFor="data_presenca">Data:</label>
                  <input
                    type="date"
                    id="data_presenca"
                    name="data_presenca"
                    value={novaPresenca.data_presenca}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status_presenca">Status:</label>
                  <select
                    id="status_presenca"
                    name="status_presenca"
                    value={novaPresenca.status_presenca}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="presente">Presente</option>
                    <option value="ausente">Ausente</option>
                    <option value="justificado">Justificado</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="observacao">Observação:</label>
                  <textarea
                    id="observacao"
                    name="observacao"
                    value={novaPresenca.observacao}
                    onChange={handleInputChange}
                    placeholder="Observações sobre a presença..."
                    rows="3"
                  />
                </div>

                <button type="submit" className="btn-registrar">
                  Registrar Presença
                </button>
              </form>
            </div>
          )}

          {/* Histórico de Presenças */}
          {selectedBolsista && (
            <div className="historico-section">
              <h3>Histórico de Presenças - {selectedBolsista.nome_usuario}</h3>
              
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
          )}
        </div>
      </div>
    </div>
  );
}

export default ControleFrequencia; 