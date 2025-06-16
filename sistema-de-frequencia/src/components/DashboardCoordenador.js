import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './DashboardCoordenador.css';

function DashboardCoordenador() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [bolsasAtivas, setBolsasAtivas] = useState({});
  const [mostrarCadastroBolsa, setMostrarCadastroBolsa] = useState(false);
  const [mostrarComunicados, setMostrarComunicados] = useState(false);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  const professores = ['Prof. Jarbas', 'Prof. Diego', 'Prof. Josefa'];

  const [filtroProfessor, setFiltroProfessor] = useState('');

  const bolsas = [
    {
      id: 1,
      nome: 'Partiu IF',
      tipo: 'Monitoria',
      professor: 'Prof. Jarbas',
      bolsistas: [
        { nome: 'Hérik Thiury', matricula: '20242TADS2-JG0069', status: 'Ativo', frequencia: 78 },
        { nome: 'Maria do Carmo', matricula: '20242TADS2-MC0044', status: 'Inativo', frequencia: 55 },
      ],
    },
    {
      id: 2,
      nome: 'PIBIC',
      tipo: 'Iniciação Científica',
      professor: 'Prof. Diego',
      bolsistas: [
        { nome: 'João Barbosa', matricula: '20242TADS2-JB0010', status: 'Ativo', frequencia: 92 },
      ],
    },
    {
      id: 3,
      nome: 'Tutoria de Pares',
      tipo: 'Tutoria de Pares',
      professor: 'Prof. Josefa',
      bolsistas: [],
    },
  ];

  const [novaBolsa, setNovaBolsa] = useState({
    nome: '',
    tipo: '',
    professor: '',
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

  const toggleBolsa = (id) => {
    setBolsasAtivas(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const enviarCadastroBolsa = (e) => {
    e.preventDefault();
    alert(`Bolsa "${novaBolsa.nome}" cadastrada com sucesso!\nFrequência de relatório: ${novaBolsa.relatorio || 'Não exige relatório'}`);
    setNovaBolsa({
      nome: '',
      tipo: '',
      professor: '',
      cargaHoraria: '',
      relatorio: ''
    });
  };

  const enviarComunicado = (e) => {
    e.preventDefault();
    if (!novoComunicado.titulo || !novoComunicado.mensagem) return;
    setComunicados(prev => [...prev, novoComunicado]);
    setNovoComunicado({ titulo: '', mensagem: '' });
  };

  const bolsasFiltradas = filtroProfessor
    ? bolsas.filter(b => b.professor === filtroProfessor)
    : bolsas;

  return (
    <div className="dashboard-container">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} />

      <div className="content">
        <h2>Visão Geral das Bolsas</h2>

        <div className="filtro">
          <label>Filtrar por professor:</label>
          <select
            value={filtroProfessor}
            onChange={(e) => setFiltroProfessor(e.target.value)}
          >
            <option value="">Todos</option>
            {professores.map((p, i) => (
              <option key={i} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="tabela-hierarquica">
          {bolsasFiltradas.map((bolsa) => (
            <div key={bolsa.id} className="bloco-bolsa">
              <button className="toggle-bolsa" onClick={() => toggleBolsa(bolsa.id)}>
                {bolsasAtivas[bolsa.id] ? '▼' : '▶'} {bolsa.nome} ({bolsa.tipo}) — {bolsa.professor}
              </button>

              {bolsasAtivas[bolsa.id] && (
                bolsa.bolsistas.length > 0 ? (
                  <ul className="lista-bolsistas">
                    {bolsa.bolsistas.map((b, i) => (
                      <li key={i}>
                        <strong>{b.nome}</strong> — {b.matricula} — 
                        <span className={b.status === 'Ativo' ? 'ativo' : 'inativo'}>
                          {b.status}
                        </span> — {b.frequencia}%
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ paddingLeft: "20px", marginTop: "10px" }}>Nenhum bolsista vinculado.</p>
                )
              )}
            </div>
          ))}
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
                <option value="monitoria">Monitoria</option>
                <option value="tutoria de pares">Tutoria de Pares</option>
                <option value="extensão">Extensão</option>
                <option value="iniciação científica">Iniciação Científica</option>
              </select>

              <label>Professor Responsável:</label>
              <select
                value={novaBolsa.professor}
                onChange={(e) => setNovaBolsa({ ...novaBolsa, professor: e.target.value })}
                required
              >
                <option value="">Selecione...</option>
                {professores.map((p, i) => (
                  <option key={i} value={p}>{p}</option>
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
