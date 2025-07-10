import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './ControleFrequencia.css';

function ControleFrequencia() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [bolsistas, setBolsistas] = useState([]);
  const [bolsistaSelecionado, setBolsistaSelecionado] = useState(null);
  const [buscaBolsista, setBuscaBolsista] = useState('');
  const [historico, setHistorico] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtroData, setFiltroData] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    status: 'presente',
    observacoes: ''
  });

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  const registrosPorPagina = 10;

  // Pegar matrícula do professor logado
  const matriculaProfessor = localStorage.getItem('matricula_usuario');

  // Carregar bolsistas do professor
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
      setHistorico(data);
    } catch (err) {
      console.error('Erro ao carregar presenças:', err);
      setError(err.message);
    }
  };

  const bolsistasFiltrados = bolsistas.filter(bolsista =>
    bolsista.nome_usuario.toLowerCase().includes(buscaBolsista.toLowerCase()) ||
    bolsista.matricula_usuario.includes(buscaBolsista)
  );

  const historicoFiltrado = historico.filter(registro => {
    if (!bolsistaSelecionado) return false;
    
    const matchBolsista = registro.fk_usuario_matricula_usuario === bolsistaSelecionado.matricula_usuario;
    const matchData = !filtroData || registro.data_presenca === filtroData;
    const matchStatus = !filtroStatus || registro.status_presenca === filtroStatus;
    
    return matchBolsista && matchData && matchStatus;
  });

  const totalPaginas = Math.ceil(historicoFiltrado.length / registrosPorPagina);
  const indiceInicial = (paginaAtual - 1) * registrosPorPagina;
  const registrosPaginados = historicoFiltrado.slice(indiceInicial, indiceInicial + registrosPorPagina);

  const calcularFrequencia = () => {
    if (!bolsistaSelecionado) return 0;
    
    const registrosBolsista = historico.filter(r => r.fk_usuario_matricula_usuario === bolsistaSelecionado.matricula_usuario);
    if (registrosBolsista.length === 0) return 0;
    
    const presencas = registrosBolsista.filter(r => r.status_presenca === 'presente' || r.status_presenca === 'justificado').length;
    return Math.round((presencas / registrosBolsista.length) * 100);
  };

  const selecionarBolsista = (bolsista) => {
    setBolsistaSelecionado(bolsista);
    setPaginaAtual(1);
    setFiltroData('');
    setFiltroStatus('');
    carregarPresencasBolsista(bolsista.matricula_usuario);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bolsistaSelecionado) {
      alert('Selecione um bolsista primeiro!');
      return;
    }

    // Verificar duplicidade
    const jaExiste = historico.some(registro => 
      registro.fk_usuario_matricula_usuario === bolsistaSelecionado.matricula_usuario && 
      registro.data_presenca === formData.data
    );

    if (jaExiste) {
      alert('Já existe um registro para este aluno nesta data!');
      return;
    }

    try {
      const presencaData = {
        data_presenca: formData.data,
        status_presenca: formData.status,
        observacao: formData.observacoes,
        fk_usuario_matricula_usuario: bolsistaSelecionado.matricula_usuario
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
      await carregarPresencasBolsista(bolsistaSelecionado.matricula_usuario);
      
      // Limpar formulário
      setFormData({
        data: new Date().toISOString().split('T')[0],
        status: 'presente',
        observacoes: ''
      });

      alert('Presença registrada com sucesso!');
      
    } catch (err) {
      console.error('Erro ao registrar presença:', err);
      alert('Erro ao registrar presença: ' + err.message);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'presente': return 'status-presente';
      case 'justificado': return 'status-justificado';
      case 'ausente': return 'status-ausente';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'presente': return 'Presente';
      case 'justificado': return 'Justificado';
      case 'ausente': return 'Ausente';
      default: return status;
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
        <div className="controle-header">
          <h2>Controle de Frequência</h2>
          <p>Gerencie a frequência dos bolsistas de forma eficiente</p>
        </div>

        <div className="controle-layout">
          {/* Lista de Bolsistas */}
          <div className="secao-bolsistas">
            <div className="secao-header">
              <h3> Bolsistas Vinculados</h3>
              <div className="busca-container">
                <input
                  type="text"
                  placeholder="Buscar por nome ou matrícula..."
                  value={buscaBolsista}
                  onChange={(e) => setBuscaBolsista(e.target.value)}
                  className="input-busca"
                />
              </div>
            </div>

            <div className="lista-bolsistas">
              {bolsistasFiltrados.length === 0 ? (
                <div className="sem-bolsistas">
                  <p>Nenhum bolsista encontrado.</p>
                </div>
              ) : (
                bolsistasFiltrados.map(bolsista => (
                  <div
                    key={bolsista.matricula_usuario}
                    className={`card-bolsista ${bolsistaSelecionado?.matricula_usuario === bolsista.matricula_usuario ? 'selecionado' : ''}`}
                    onClick={() => selecionarBolsista(bolsista)}
                  >
                    <div className="bolsista-info">
                      <h4>{bolsista.nome_usuario}</h4>
                      <p>Matrícula: {bolsista.matricula_usuario}</p>
                      <div className="bolsista-detalhes">
                        <span className="tipo-bolsa">{bolsista.nome_bolsa_vinculada}</span>
                        <span className="carga-horaria">{bolsista.carga_horaria}h</span>
                      </div>
                    </div>
                    {bolsistaSelecionado?.matricula_usuario === bolsista.matricula_usuario && (
                      <div className="check-selecionado">✓</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Formulário e Histórico */}
          <div className="secao-principal">
            {bolsistaSelecionado ? (
              <>
                {/* Formulário de Registro */}
                <div className="secao-formulario">
                  <h3> Registrar Presença</h3>
                  <p className="aluno-selecionado">
                    <strong>Aluno Selecionado:</strong> {bolsistaSelecionado.nome_usuario}
                  </p>

                  <form onSubmit={handleSubmit} className="form-presenca">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Data:</label>
                        <input
                          type="date"
                          value={formData.data}
                          onChange={(e) => setFormData({...formData, data: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Status:</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          required
                        >
                          <option value="presente">Presente</option>
                          <option value="justificado">Justificado</option>
                          <option value="ausente">Ausente</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Observações:</label>
                      <textarea
                        value={formData.observacoes}
                        onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                        placeholder="Adicione observações sobre a presença (opcional)"
                        rows="3"
                      />
                    </div>

                    <button type="submit" className="btn-registrar">
                      Registrar Presença
                    </button>
                  </form>
                </div>

                {/* Indicador de Frequência */}
                <div className="indicador-frequencia">
                  <h4>Frequência Total</h4>
                  <div className="frequencia-valor">
                    <span className="percentual">{calcularFrequencia()}%</span>
                    <div className="barra-frequencia">
                      <div 
                        className="preenchimento-barra" 
                        style={{width: `${calcularFrequencia()}%`}}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Histórico de Presenças */}
                <div className="secao-historico">
                  <div className="historico-header">
                    <h3>Histórico de Presenças</h3>
                    <div className="filtros">
                      <input
                        type="date"
                        value={filtroData}
                        onChange={(e) => setFiltroData(e.target.value)}
                        placeholder="Filtrar por data"
                        className="filtro-data"
                      />
                      <select
                        value={filtroStatus}
                        onChange={(e) => setFiltroStatus(e.target.value)}
                        className="filtro-status"
                      >
                        <option value="">Todos os status</option>
                        <option value="presente">Presente</option>
                        <option value="justificado">Justificado</option>
                        <option value="ausente">Ausente</option>
                      </select>
                    </div>
                  </div>

                  <div className="tabela-historico">
                    {registrosPaginados.length > 0 ? (
                      <table>
                        <thead>
                          <tr>
                            <th>Data</th>
                            <th>Status</th>
                            <th>Observação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrosPaginados.map(registro => (
                            <tr key={registro.id_presenca}>
                              <td>{registro.data_formatada}</td>
                              <td>
                                <span className={`status-badge ${getStatusClass(registro.status_presenca)}`}>
                                  {getStatusText(registro.status_presenca)}
                                </span>
                              </td>
                              <td>{registro.observacao || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="sem-registros">
                        <p>Nenhum registro encontrado para os filtros selecionados.</p>
                      </div>
                    )}
                  </div>

                  {/* Paginação */}
                  {totalPaginas > 1 && (
                    <div className="paginacao">
                      <button
                        onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                        disabled={paginaAtual === 1}
                        className="btn-paginacao"
                      >
                        ‹ Anterior
                      </button>
                      
                      <span className="info-pagina">
                        Página {paginaAtual} de {totalPaginas}
                      </span>
                      
                      <button
                        onClick={() => setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))}
                        disabled={paginaAtual === totalPaginas}
                        className="btn-paginacao"
                      >
                        Próxima ›
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="selecione-bolsista">
                <div className="placeholder-content">
                  <h3> Selecione um Bolsista</h3>
                  <p>Escolha um bolsista da lista ao lado para registrar presença e visualizar o histórico.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControleFrequencia; 