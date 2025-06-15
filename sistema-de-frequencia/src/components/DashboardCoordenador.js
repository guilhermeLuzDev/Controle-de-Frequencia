import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './DashboardCoordenador.css';

function DashboardCoordenador() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [mostrarBolsistas, setMostrarBolsistas] = useState(false);
  const [mostrarOrientadores, setMostrarOrientadores] = useState(false);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  return (
    <div className="dashboard-container">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} />

      <div className="content">
        <h2>Painel do Administrador</h2>

        <div className="tabela-programas">
          <p className="subtitulo">Programas Recentes</p>
          <table>
            <thead>
              <tr>
                <th>Nome dos Programas</th>
                <th>Orientador vinculado</th>
                <th>Status do programa</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Partiu IF</td><td>Prof. Jarbas</td><td>Ativo</td></tr>
              <tr><td>PIBIC</td><td>Prof. Diego</td><td>Ativo</td></tr>
              <tr><td>PIBEX</td><td>Prof. Josefa</td><td>Ativo</td></tr>
            </tbody>
          </table>
        </div>

        <div className="acoes">
          <button className="nova-bolsa">+ Nova Bolsa</button>
        </div>

        {/* Abas expansíveis */}
        <div className="abas-coordenador">
          <div className="aba">
            <button onClick={() => setMostrarBolsistas(!mostrarBolsistas)}>
              {mostrarBolsistas ? '▼' : '▶'} Bolsistas Vinculados
            </button>
            {mostrarBolsistas && (
              <table className="subtabela">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Matrícula</th>
                    <th>Frequência</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Hérik Thiury</td><td>20242TADS2-JG0069</td><td>90%</td></tr>
                  <tr><td>Maria do Carmo</td><td>20242TADS2-MC0044</td><td>80%</td></tr>
                  <tr><td>João Barbosa</td><td>20242TADS2-JB0010</td><td>95%</td></tr>
                </tbody>
              </table>
            )}
          </div>

          <div className="aba">
            <button onClick={() => setMostrarOrientadores(!mostrarOrientadores)}>
              {mostrarOrientadores ? '▼' : '▶'} Orientadores Vinculados
            </button>
            {mostrarOrientadores && (
              <ul className="lista-orientadores">
                <li>Prof. Jarbas</li>
                <li>Prof. Diego</li>
                <li>Prof. Josefa</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCoordenador;
