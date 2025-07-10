import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './DashboardCoordenador.css';
import { 
  Menu, 
  BookOpen, 
  Users, 
  GraduationCap, 
  MessageSquare, 
  Plus, 
  X, 
  ChevronDown, 
  ChevronRight,
  Search,
  Clock,
  User,
  Award
} from 'lucide-react';

function DashboardCoordenador() {
  const nomeUsuario = localStorage.getItem('nome_usuario') || 'Usuário';
  const matriculaUsuarioLogado = localStorage.getItem('matricula_usuario');

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [bolsasAtivas, setBolsasAtivas] = useState({});
  const [mostrarCadastroBolsa, setMostrarCadastroBolsa] = useState(false);
  const [mostrarComunicados, setMostrarComunicados] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para dados reais do backend
  const [professoresDisponiveis, setProfessoresDisponiveis] = useState([]);
  const [bolsasDisponiveis, setBolsasDisponiveis] = useState([]);
  const [bolsistasDaBolsa, setBolsistasDaBolsa] = useState({}); 
  const [filtroSelecionado, setFiltroSelecionado] = useState('');

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  const [novaBolsa, setNovaBolsa] = useState({
    nome: '',
    tipo: '',
    professor: '',
    cargaHoraria: '',
    relatorio: ''
  });

  const [comunicados, setComunicados] = useState([
    { id: 1, titulo: 'Entrega de Documentos', mensagem: 'Prazo até dia 20/06.', data: new Date().toLocaleDateString() }
  ]);

  const [novoComunicado, setNovoComunicado] = useState({
    titulo: '',
    mensagem: ''
  });

  // Função para buscar professores do backend
  const fetchProfessores = async () => {
    try {
      const response = await fetch('http://localhost:3001/usuarios');
      if (response.ok) {
        const usuarios = await response.json();
        const apenasProfessores = usuarios.filter(u => u.tipo_usuario === 'professor');
        setProfessoresDisponiveis(apenasProfessores);
      } else {
        console.error('Erro ao buscar professores:', response.statusText);
      }
    } catch (error) {
      console.error('Erro de conexão ao buscar professores:', error);
      setError('Erro ao carregar professores');
    }
  };

  // Função para buscar bolsas do backend
  const fetchBolsas = async () => {
    try {
      const response = await fetch('http://localhost:3001/bolsas');
      if (response.ok) {
        const data = await response.json();
        const bolsasComNomes = await Promise.all(data.map(async bolsa => {
          if (bolsa.fk_usuario_matricula_responsavel) {
            try {
              const resProf = await fetch(`http://localhost:3001/usuarios/${bolsa.fk_usuario_matricula_responsavel}`);
              const prof = await resProf.json();
              return { ...bolsa, professor_nome: prof.nome_usuario };
            } catch (err) {
              console.error(`Erro ao buscar nome do professor para matrícula ${bolsa.fk_usuario_matricula_responsavel}:`, err);
              return { ...bolsa, professor_nome: 'Desconhecido' };
            }
          }
          return { ...bolsa, professor_nome: 'Não Atribuído' };
        }));
        setBolsasDisponiveis(bolsasComNomes);
      } else {
        console.error('Erro ao buscar bolsas:', response.statusText);
      }
    } catch (error) {
      console.error('Erro de conexão ao buscar bolsas:', error);
      setError('Erro ao carregar bolsas');
    }
  };

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchProfessores(), fetchBolsas()]);
      } catch (err) {
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  // Para buscar bolsistas da bolsa clicada
  const toggleBolsa = async (idBolsa) => {
    // Primeiro, alternar o estado de visibilidade da bolsa
    setBolsasAtivas(prev => ({ ...prev, [idBolsa]: !prev[idBolsa] }));

    // Se a bolsa estiver sendo ativada e ainda não tivermos os bolsistas
    if (!bolsasAtivas[idBolsa]) {
      try {
        const response = await fetch(`http://localhost:3001/usuarios/por-bolsa/${idBolsa}`);
        if (response.ok) {
          const data = await response.json();
          setBolsistasDaBolsa(prev => ({ ...prev, [idBolsa]: data }));
        } else {
          console.error(`Erro ao buscar bolsistas para a bolsa ${idBolsa}:`, response.statusText);
        }
      } catch (error) {
        console.error(`Erro de conexão ao buscar bolsistas para a bolsa ${idBolsa}:`, error);
      }
    }
  };

  const enviarCadastroBolsa = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/bolsas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome_bolsa: novaBolsa.nome,
          tipo_bolsa: novaBolsa.tipo,
          carga_horaria: parseInt(novaBolsa.cargaHoraria),
          frequencia_relatorio: novaBolsa.relatorio,
          fk_usuario_matricula_responsavel: novaBolsa.professor
        }),
      });

      if (response.ok) {
        alert(`Bolsa "${novaBolsa.nome}" cadastrada com sucesso!`);
        setNovaBolsa({
          nome: '',
          tipo: '',
          professor: '',
          cargaHoraria: '',
          relatorio: ''
        });
        fetchBolsas();
        setMostrarCadastroBolsa(false);
      } else {
        const errorData = await response.json();
        alert(`Erro ao cadastrar bolsa: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Erro de conexão ao cadastrar bolsa:', error);
      alert('Erro de conexão com o servidor ao cadastrar bolsa.');
    }
  };

  const enviarComunicado = (e) => {
    e.preventDefault();
    if (!novoComunicado.titulo || !novoComunicado.mensagem) return;
    
    const novoItem = {
      id: Date.now(),
      titulo: novoComunicado.titulo,
      mensagem: novoComunicado.mensagem,
      data: new Date().toLocaleDateString()
    };
    
    setComunicados(prev => [novoItem, ...prev]);
    setNovoComunicado({ titulo: '', mensagem: '' });
    setMostrarComunicados(false);
    alert('Comunicado enviado com sucesso!');
  };

  const removerComunicado = (id) => {
    setComunicados(prev => prev.filter(c => c.id !== id));
  };

  const bolsasFiltradas = filtroSelecionado
    ? bolsasDisponiveis.filter(b => b.fk_usuario_matricula_responsavel === filtroSelecionado)
    : bolsasDisponiveis;

  const calcularEstatisticas = () => {
    const totalBolsas = bolsasDisponiveis.length;
    const totalBolsistas = Object.values(bolsistasDaBolsa).reduce((acc, bolsistas) => acc + bolsistas.length, 0);
    const totalProfessores = new Set(bolsasDisponiveis.map(b => b.fk_usuario_matricula_responsavel)).size;
    
    return { totalBolsas, totalBolsistas, totalProfessores };
  };

  const stats = calcularEstatisticas();

  if (loading) {
    return (
      <div className="dashboard-container">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario="coordenador" />
        <div className="content">
          <div className="loading">Carregando dados...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario="coordenador" />
        <div className="content">
          <div className="error">Erro: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <button className="menu-toggle" onClick={toggleSidebar}>
        <Menu size={20} />
      </button>
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario="coordenador" />

      <div className="content">
        {/* Header de Boas-vindas */}
        <div className="welcome-section">
          <div className="welcome-text">
            <h1>Bem-vindo, {nomeUsuario}!</h1>
            <p>Gerencie bolsas, professores e comunicados de forma eficiente</p>
          </div>
          <div className="welcome-stats">
            <div className="stat-badge">
              <BookOpen size={20} />
              <span className="stat-number">{stats.totalBolsas}</span>
              <span className="stat-label">Bolsas Ativas</span>
            </div>
            <div className="stat-badge">
              <Users size={20} />
              <span className="stat-number">{stats.totalBolsistas}</span>
              <span className="stat-label">Bolsistas</span>
            </div>
            <div className="stat-badge">
              <GraduationCap size={20} />
              <span className="stat-number">{stats.totalProfessores}</span>
              <span className="stat-label">Professores</span>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="metrics-grid">
          <div className="metric-card primary">
            <div className="metric-icon">
              <BookOpen size={24} />
            </div>
            <div className="metric-content">
              <h3>{stats.totalBolsas}</h3>
              <p>Bolsas Cadastradas</p>
            </div>
          </div>

          <div className="metric-card secondary">
            <div className="metric-icon">
              <Users size={24} />
            </div>
            <div className="metric-content">
              <h3>{stats.totalBolsistas}</h3>
              <p>Bolsistas Ativos</p>
            </div>
          </div>

          <div className="metric-card success">
            <div className="metric-icon">
              <GraduationCap size={24} />
            </div>
            <div className="metric-content">
              <h3>{stats.totalProfessores}</h3>
              <p>Professores Responsáveis</p>
            </div>
          </div>

          <div className="metric-card info">
            <div className="metric-icon">
              <MessageSquare size={24} />
            </div>
            <div className="metric-content">
              <h3>{comunicados.length}</h3>
              <p>Comunicados Ativos</p>
            </div>
          </div>
        </div>

        {/* Grid Principal */}
        <div className="content-grid">
          {/* Seção de Bolsas */}
          <div className="card bolsas-section">
            <div className="card-header">
              <div className="header-content">
                <div className="header-with-icon">
                  <BookOpen size={20} />
                  <h3>Gestão de Bolsas</h3>
                </div>
                <span className="badge">{bolsasFiltradas.length} bolsas</span>
              </div>
            </div>

            <div className="card-content">
              {/* Filtro de Professor */}
              <div className="filtro-container">
                <Search size={16} />
                <label>Filtrar por professor:</label>
                <select
                  value={filtroSelecionado}
                  onChange={(e) => setFiltroSelecionado(e.target.value)}
                  className="filtro-select"
                >
                  <option value="">Todos os professores</option>
                  {professoresDisponiveis.map((p) => (
                    <option key={p.matricula_usuario} value={p.matricula_usuario}>
                      {p.nome_usuario}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lista de Bolsas */}
              <div className="bolsas-lista">
                {bolsasFiltradas.length === 0 ? (
                  <div className="empty-state">
                    <BookOpen size={48} />
                    <p>Nenhuma bolsa encontrada.</p>
                  </div>
                ) : (
                  bolsasFiltradas.map((bolsa) => (
                    <div key={bolsa.id_bolsa} className="bolsa-card">
                      <button 
                        className="bolsa-header" 
                        onClick={() => toggleBolsa(bolsa.id_bolsa)}
                      >
                        <div className="bolsa-info">
                          <h4>{bolsa.nome_bolsa}</h4>
                          <span className="bolsa-tipo">
                            <Award size={12} />
                            {bolsa.tipo_bolsa}
                          </span>
                        </div>
                        <div className="bolsa-detalhes">
                          <span className="professor">
                            <User size={14} />
                            {bolsa.professor_nome}
                          </span>
                          <span className="carga-horaria">
                            <Clock size={12} />
                            {bolsa.carga_horaria}h
                          </span>
                          <span className="toggle-icon">
                            {bolsasAtivas[bolsa.id_bolsa] ? 
                              <ChevronDown size={16} /> : 
                              <ChevronRight size={16} />
                            }
                          </span>
                        </div>
                      </button>

                      {bolsasAtivas[bolsa.id_bolsa] && (
                        <div className="bolsistas-container">
                          {bolsistasDaBolsa[bolsa.id_bolsa] && bolsistasDaBolsa[bolsa.id_bolsa].length > 0 ? (
                            <div className="bolsistas-grid">
                              {bolsistasDaBolsa[bolsa.id_bolsa].map((bolsista) => (
                                <div key={bolsista.matricula_usuario} className="bolsista-card">
                                  <User size={16} />
                                  <h5>{bolsista.nome_usuario}</h5>
                                  <p>Matrícula: {bolsista.matricula_usuario}</p>
                                  <span className="status-badge ativo">Ativo</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="empty-bolsistas">
                              <Users size={32} />
                              <p>Nenhum bolsista vinculado a esta bolsa.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Botão para Nova Bolsa */}
              <button 
                className="btn-nova-bolsa"
                onClick={() => setMostrarCadastroBolsa(!mostrarCadastroBolsa)}
              >
                <Plus size={16} />
                Nova Bolsa
              </button>
            </div>
          </div>

          {/* Seção de Comunicados */}
          <div className="card comunicados-section">
            <div className="card-header">
              <div className="header-content">
                <div className="header-with-icon">
                  <MessageSquare size={20} />
                  <h3>Comunicados</h3>
                </div>
                <span className="badge">{comunicados.length} ativos</span>
              </div>
            </div>

            <div className="card-content">
              <button 
                className="btn-novo-comunicado"
                onClick={() => setMostrarComunicados(!mostrarComunicados)}
              >
                <Plus size={16} />
                Novo Comunicado
              </button>

              <div className="comunicados-lista">
                {comunicados.map((comunicado) => (
                  <div key={comunicado.id} className="comunicado-card">
                    <div className="comunicado-header">
                      <h4>{comunicado.titulo}</h4>
                      <button 
                        className="btn-remover"
                        onClick={() => removerComunicado(comunicado.id)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p>{comunicado.mensagem}</p>
                    <span className="comunicado-data">{comunicado.data}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Cadastro de Bolsa */}
        {mostrarCadastroBolsa && (
          <div className="modal-overlay" onClick={() => setMostrarCadastroBolsa(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="header-with-icon">
                  <Plus size={20} />
                  <h3>Cadastrar Nova Bolsa</h3>
                </div>
                <button 
                  className="btn-fechar"
                  onClick={() => setMostrarCadastroBolsa(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <form className="modal-form" onSubmit={enviarCadastroBolsa}>
                <div className="form-group">
                  <label>Nome da Bolsa:</label>
                  <input
                    type="text"
                    value={novaBolsa.nome}
                    onChange={(e) => setNovaBolsa({ ...novaBolsa, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo:</label>
                    <select
                      value={novaBolsa.tipo}
                      onChange={(e) => setNovaBolsa({ ...novaBolsa, tipo: e.target.value })}
                      required
                    >
                      <option value="">Selecione...</option>
                      <option value="Monitoria">Monitoria</option>
                      <option value="Tutoria de Pares">Tutoria de Pares</option>
                      <option value="Extensão">Extensão</option>
                      <option value="Iniciação Científica">Iniciação Científica</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Carga Horária (h):</label>
                    <input
                      type="number"
                      value={novaBolsa.cargaHoraria}
                      onChange={(e) => setNovaBolsa({ ...novaBolsa, cargaHoraria: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Professor Responsável:</label>
                  <select
                    value={novaBolsa.professor}
                    onChange={(e) => setNovaBolsa({ ...novaBolsa, professor: e.target.value })}
                    required
                  >
                    <option value="">Selecione...</option>
                    {professoresDisponiveis.map((p) => (
                      <option key={p.matricula_usuario} value={p.matricula_usuario}>
                        {p.nome_usuario}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Frequência de Relatório:</label>
                  <select
                    value={novaBolsa.relatorio}
                    onChange={(e) => setNovaBolsa({ ...novaBolsa, relatorio: e.target.value })}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="não exige">Não exige relatório</option>
                    <option value="mensal">Entrega mensal</option>
                    <option value="bimestral">Entrega bimestral</option>
                    <option value="semestral">Entrega semestral</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancelar" onClick={() => setMostrarCadastroBolsa(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-cadastrar">
                    <Plus size={16} />
                    Cadastrar Bolsa
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Novo Comunicado */}
        {mostrarComunicados && (
          <div className="modal-overlay" onClick={() => setMostrarComunicados(false)}>
            <div className="modal-content modal-comunicado" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="header-with-icon">
                  <MessageSquare size={20} />
                  <h3>Novo Comunicado</h3>
                </div>
                <button 
                  className="btn-fechar"
                  onClick={() => setMostrarComunicados(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <form className="modal-form" onSubmit={enviarComunicado}>
                <div className="form-group">
                  <label>Título:</label>
                  <input
                    type="text"
                    value={novoComunicado.titulo}
                    onChange={(e) => setNovoComunicado({ ...novoComunicado, titulo: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mensagem:</label>
                  <textarea
                    rows="4"
                    value={novoComunicado.mensagem}
                    onChange={(e) => setNovoComunicado({ ...novoComunicado, mensagem: e.target.value })}
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancelar" onClick={() => setMostrarComunicados(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-enviar">
                    <MessageSquare size={16} />
                    Enviar Comunicado
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardCoordenador;