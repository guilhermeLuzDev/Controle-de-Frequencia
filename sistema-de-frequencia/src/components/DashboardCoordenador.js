// src/components/DashboardCoordenador.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './DashboardCoordenador.css';

function DashboardCoordenador() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [bolsasAtivas, setBolsasAtivas] = useState({});

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

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
    tipo: 'Pesquisa',
    professor: 'Prof. Diego',
    bolsistas: [
      { nome: 'João Barbosa', matricula: '20242TADS2-JB0010', status: 'Ativo', frequencia: 92 },
    ],
  },
  {
    id: 3,
    nome: 'Tutoria',
    tipo: 'Tutoria de Pares',
    professor: 'Prof. Josefa',
    bolsistas: [],
  },
];


  const toggleBolsa = (id) => {
    setBolsasAtivas(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="dashboard-container">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} />

      <div className="content">
        <h2>Visão Geral das Bolsas</h2>

        <div className="tabela-hierarquica">
          {bolsas.map((bolsa) => (
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
                        <span className={b.status === 'Ativo' ? 'ativo' : 'inativo'}> {b.status}</span>
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
      </div>
    </div>
  );
}

export default DashboardCoordenador;
