// src/components/DashboardProfessor.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './DashboardProfessor.css';

function DashboardProfessor() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [mostrarRelatorios, setMostrarRelatorios] = useState(false);
  const [mostrarComunicados, setMostrarComunicados] = useState(false);

  const [tituloComunicado, setTituloComunicado] = useState('');
  const [mensagemComunicado, setMensagemComunicado] = useState('');
  const [comunicados, setComunicados] = useState([
    { titulo: 'Reunião geral', mensagem: 'Acontecerá dia 18/06 às 14h.' },
  ]);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  const bolsistas = [
    { nome: 'Hérik Thiury', matricula: '20242TADS2-JG0069', bolsa: 'Partiu IF', frequencia: 78 },
    { nome: 'Maria do Carmo', matricula: '20242TADS2-MC0044', bolsa: 'Partiu IF', frequencia: 85 },
    { nome: 'João Barbosa', matricula: '20242TADS2-JB0010', bolsa: 'PIBIC', frequencia: 92 },
  ];

  const relatorios = [
    { nome: 'Hérik Thiury', data: '2025-06-12', status: 'Pendente!' },
    { nome: 'Maria do Carmo', data: '2025-06-13', status: 'Pendente!' },
  ];

  const aprovarRelatorio = (nome) => {
    alert(`Relatório de ${nome} aprovado!`);
  };

  const reprovarRelatorio = (nome) => {
    alert(`Relatório de ${nome} reprovado.`);
  };

  const enviarComunicado = (e) => {
    e.preventDefault();
    if (!tituloComunicado || !mensagemComunicado) return;

    setComunicados(prev => [...prev, {
      titulo: tituloComunicado,
      mensagem: mensagemComunicado
    }]);

    setTituloComunicado('');
    setMensagemComunicado('');
  };

  return (
    <div className="dashboard-container">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} />

      <div className="content">
        <h2>Painel do Professor</h2>

        {/* Tabela de bolsistas */}
        <div className="tabela-programas">
          <p className="subtitulo">Bolsistas Vinculados</p>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Matrícula</th>
                <th>Bolsa</th>
                <th>Frequência</th>
              </tr>
            </thead>
            <tbody>
              {bolsistas.map((b, i) => (
                <tr key={i}>
                  <td>{b.nome}</td>
                  <td>{b.matricula}</td>
                  <td>{b.bolsa}</td>
                  <td>{b.frequencia}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Aba: Relatórios */}
        <div className="aba">
          <button className="botao" onClick={() => setMostrarRelatorios(!mostrarRelatorios)}>
            {mostrarRelatorios ? '▼' : '▶'} Relatórios Enviados
          </button>

          {mostrarRelatorios && (
            <table className="subtabela">
              <thead>
                <tr>
                  <th>Bolsista</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {relatorios.map((r, i) => (
                  <tr key={i}>
                    <td>{r.nome}</td>
                    <td>{r.data}</td>
                    <td>{r.status}</td>
                    <td>
                      <button className="aprovar" onClick={() => aprovarRelatorio(r.nome)}>✔</button>
                      <button className="reprovar" onClick={() => reprovarRelatorio(r.nome)}>✖</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Aba: Comunicados */}
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
                  value={tituloComunicado}
                  onChange={(e) => setTituloComunicado(e.target.value)}
                />
                <textarea
                  placeholder="Mensagem"
                  rows="3"
                  value={mensagemComunicado}
                  onChange={(e) => setMensagemComunicado(e.target.value)}
                />
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

export default DashboardProfessor;
