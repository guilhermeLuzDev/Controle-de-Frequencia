// src/components/Dashboard.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './Dashboard.css';

function Dashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  const nomeBolsa = 'Partiu IF';
  const cargaHorariaTotal = 100;
  const horasCumpridas = 78;
  const percentual = Math.round((horasCumpridas / cargaHorariaTotal) * 100);

  const comunicados = [
    { titulo: 'Entrega de Relatório', mensagem: 'Não esquecer de enviar até dia 20/06' },
    { titulo: 'Presença obrigatória', mensagem: 'Reunião dia 18/06 com todos os bolsistas' }
  ];

  return (
    <div className="dashboard-container">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario="bolsista" />

      <div className="content">
        <h2>Bem-vindo, Hérik Thiury!</h2>

        <div className="info-cards">
          <div className="card">
            <p>Bolsa Atual</p>
            <strong>{nomeBolsa}</strong>
          </div>
          <div className="card">
            <p>Carga Horária Total</p>
            <strong>{cargaHorariaTotal} horas</strong>
          </div>
        </div>

        <div className="card circulo-progresso">
          <p>Frequência Atual</p>
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
                strokeDasharray={`${percentual}, 100`}
              />
            </svg>
            <span className="percentual">{percentual}%</span>
          </div>
          <p>{horasCumpridas}h de {cargaHorariaTotal}h cumpridas</p>
        </div>

        <div className="card">
          <h3>Comunicados</h3>
          <ul className="comunicados">
            {comunicados.map((c, i) => (
              <li key={i}>
                <strong>{c.titulo}:</strong> {c.mensagem}
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <button className="botao">Visualizar Presenças</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
