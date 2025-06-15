import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './DashboardProfessor.css';

function DashboardProfessor() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [mostrarRelatorios, setMostrarRelatorios] = useState(false);

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

  return (
    <div className="dashboard-container">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} />

      <div className="content">
        <h2>Painel do Professor</h2>

        
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
      </div>
    </div>
  );
}

export default DashboardProfessor;
