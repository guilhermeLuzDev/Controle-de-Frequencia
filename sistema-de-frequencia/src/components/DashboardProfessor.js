// src/components/DashboardProfessor.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './DashboardProfessor.css';

function DashboardProfessor() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  return (
    <div className="dashboard-container">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} />

      <div className="content">
        <h2>Bem-vindo, Professor!</h2>

        <div className="info-cards">
          <div className="card">
            <p>Nome do programa</p>
            <strong>Partiu IF</strong>
          </div>
        </div>

        <div className="dados-professor">
          <div className="card tabela">
            <p><strong>Bolsistas</strong></p>
            <table>
              <thead>
                <tr>
                  <th>Alunos</th>
                  <th>Programa</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>João da Silva Barbosa</td><td>Partiu IF</td></tr>
                <tr><td>Jonas Sales Vieira do Amaral</td><td>Partiu IF</td></tr>
                <tr><td>Maria do Carmo dos Santos</td><td>Partiu IF</td></tr>
                <tr><td>Tiago Alberto Neves de Farias</td><td>Partiu IF</td></tr>
              </tbody>
            </table>
          </div>

          <div className="card grafico">
            <p><strong>Frequência de Bolsistas</strong></p>
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
                  strokeDasharray="80, 100"
                />
              </svg>
              <span className="percent">80%</span>
            </div>
          </div>
        </div>

        <div className="acoes">
          <button className="botao">Cadastro de Bolsistas</button>
          <button className="botao">Validar Relatórios</button>
        </div>
      </div>
    </div>
  );
}

export default DashboardProfessor;
