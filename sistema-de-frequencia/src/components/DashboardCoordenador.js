import React, { useState, useEffect } from 'react'; // Importar useEffect
import Sidebar from './Sidebar';
import './DashboardCoordenador.css';
import { Home, Plus, Calendar, FileText } from "lucide-react"; // Importar ícones necessários

function DashboardCoordenador() {
  const nomeUsuario = localStorage.getItem('nome_usuario') || 'Usuário';
  const matriculaUsuarioLogado = localStorage.getItem('matricula_usuario'); // Obter matrícula do coordenador logado

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [bolsasAtivas, setBolsasAtivas] = useState({});
  const [mostrarCadastroBolsa, setMostrarCadastroBolsa] = useState(false);
  const [mostrarComunicados, setMostrarComunicados] = useState(false);

  // Estados para dados reais do backend
  const [professoresDisponiveis, setProfessoresDisponiveis] = useState([]);
  const [bolsasDisponiveis, setBolsasDisponiveis] = useState([]); // Para armazenar bolsas reais

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  const [novaBolsa, setNovaBolsa] = useState({
    nome: '',
    tipo: '',
    professor: '', // Professor responsável (matricula)
    cargaHoraria: '',
    relatorio: ''
  });

  const [comunicados, setComunicados] = useState([
    { titulo: 'Entrega de Documentos', mensagem: 'Prazo até dia 20/06.' }
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
        // Filtra apenas os usuários do tipo 'professor'
        const apenasProfessores = usuarios.filter(u => u.tipo_usuario === 'professor');
        setProfessoresDisponiveis(apenasProfessores);
      } else {
        console.error('Erro ao buscar professores:', response.statusText);
      }
    } catch (error) {
      console.error('Erro de conexão ao buscar professores:', error);
    }
  };

  // Função para buscar bolsas do backend
  const fetchBolsas = async () => {
    try {
      const response = await fetch('http://localhost:3001/bolsas');
      if (response.ok) {
        const data = await response.json();
        // Mapear fk_usuario_matricula_responsavel para nome do professor
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
    }
  };

  useEffect(() => {
    fetchProfessores(); // Carrega professores ao montar o componente
    fetchBolsas();     // Carrega bolsas ao montar o componente
  }, []);

  const toggleBolsa = (id) => {
    setBolsasAtivas(prev => ({ ...prev, [id]: !prev[id] }));
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
          carga_horaria: parseInt(novaBolsa.cargaHoraria), // Converter para número
          frequencia_relatorio: novaBolsa.relatorio,
          fk_usuario_matricula_responsavel: novaBolsa.professor // Enviar a matrícula do professor
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
        fetchBolsas(); // Recarrega a lista de bolsas para exibir a nova
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
    setComunicados(prev => [...prev, novoComunicado]);
    setNovoComunicado({ titulo: '', mensagem: '' });
  };

  // Filtragem de bolsas (agora sobre bolsasDisponiveis)
  const bolsasFiltradas = novaBolsa.professor
    ? bolsasDisponiveis.filter(b => b.fk_usuario_matricula_responsavel === novaBolsa.professor)
    : bolsasDisponiveis;

  return (
    <div className="dashboard-container">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario="coordenador" />

      <div className="content">
        <h2>Bem-vindo, {nomeUsuario}!</h2>
        <h2>Visão Geral das Bolsas</h2>

        <div className="filtro">
          <label>Filtrar por professor:</label>
          <select
            value={novaBolsa.professor} // Usar novaBolsa.professor para o filtro
            onChange={(e) => setNovaBolsa({ ...novaBolsa, professor: e.target.value })}
          >
            <option value="">Todos</option>
            {professoresDisponiveis.map((p) => (
              <option key={p.matricula_usuario} value={p.matricula_usuario}>{p.nome_usuario}</option>
            ))}
          </select>
        </div>

        <div className="tabela-hierarquica">
          {bolsasFiltradas.length === 0 ? (
            <p>Nenhuma bolsa encontrada.</p>
          ) : (
            bolsasFiltradas.map((bolsa) => (
              <div key={bolsa.id_bolsa} className="bloco-bolsa">
                <button className="toggle-bolsa" onClick={() => toggleBolsa(bolsa.id_bolsa)}>
                  {bolsasAtivas[bolsa.id_bolsa] ? '▼' : '▶'} {bolsa.nome_bolsa} ({bolsa.tipo_bolsa}) — {bolsa.professor_nome} (Carga: {bolsa.carga_horaria}h)
                </button>

                {bolsasAtivas[bolsa.id_bolsa] && (
                  // Aqui você precisaria buscar os bolsistas vinculados a esta bolsa
                  // Exemplo com mock, mas precisaria de uma rota /usuarios?fk_bolsa_id=X
                  <p style={{ paddingLeft: "20px", marginTop: "10px" }}>
                    Bolsistas vinculados a esta bolsa (funcionalidade a ser implementada com busca no backend).
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="aba">
          <button className="botao" onClick={() => setMostrarCadastroBolsa(!mostrarCadastroBolsa)}>
            {mostrarCadastroBolsa ? '▼' : '▶'} Cadastrar Nova Bolsa
          </button>

          {mostrarCadastroBolsa && (
            <form className="formulario" onSubmit={enviarCadastroBolsa}>
              <label>Nome da Bolsa:</label>
              <input
                type="text"
                value={novaBolsa.nome}
                onChange={(e) => setNovaBolsa({ ...novaBolsa, nome: e.target.value })}
                required
              />

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

              <label>Professor Responsável:</label>
              <select
                value={novaBolsa.professor}
                onChange={(e) => setNovaBolsa({ ...novaBolsa, professor: e.target.value })}
                required
              >
                <option value="">Selecione...</option>
                {professoresDisponiveis.map((p) => (
                  <option key={p.matricula_usuario} value={p.matricula_usuario}>{p.nome_usuario}</option>
                ))}
              </select>

              <label>Carga Horária Total (h):</label>
              <input
                type="number"
                value={novaBolsa.cargaHoraria}
                onChange={(e) => setNovaBolsa({ ...novaBolsa, cargaHoraria: e.target.value })}
                required
              />

              <label>Frequência da entrega de relatório:</label>
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

              <button type="submit" className="botao-enviar">Cadastrar Bolsa</button>
            </form>
          )}
        </div>

        <div className="aba">
          <button className="botao" onClick={() => setMostrarComunicados(!mostrarComunicados)}>
            {mostrarComunicados ? '▼' : '▶'} Comunicados
          </button>

          {mostrarComunicados && (
            <div className="comunicado-form">
              <form onSubmit={enviarComunicado}>
                <input
                  type="text"
                  placeholder="Título"
                  value={novoComunicado.titulo}
                  onChange={(e) => setNovoComunicado({ ...novoComunicado, titulo: e.target.value })}
                  required
                /><br/><br/>
                <textarea
                  placeholder="Mensagem"
                  rows="3"
                  value={novoComunicado.mensagem}
                  onChange={(e) => setNovoComunicado({ ...novoComunicado, mensagem: e.target.value })}
                  required
                /> <br/> <br/>
                <button type="submit" className="botao-enviar">Enviar</button>
              </form>

              <ul className="lista-comunicados">
                {comunicados.map((c, i) => (
                  <li key={i}>
                    <strong>{c.titulo}:</strong> {c.mensagem}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardCoordenador;