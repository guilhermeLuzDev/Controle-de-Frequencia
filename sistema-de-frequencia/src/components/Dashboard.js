// src/components/Dashboard.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './Dashboard.css';

function Dashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  return (
    <div className="dashboard-container">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button>

      <Sidebar visible={sidebarVisible} onClose={closeSidebar} />

      <div className="content">
        <h2>Bem-vindo, Hérik Thiury!</h2>

        <div className="info-cards">
          <div className="card">
            <p>Nome do programa</p>
            <strong>Partiu IF</strong>
          </div>
          <div className="card">
            <p>Status da Bolsa</p>
            <strong>Ativo</strong>
          </div>
        </div>

        <div className="card">
          <p>Orientador</p>
          <strong>Prof. Jarbas</strong>
        </div>

        <div className="card">
          <p>Enviar Relatório</p>
          <button className="anexar">Anexar</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
