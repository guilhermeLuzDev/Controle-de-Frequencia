import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './FrequenciaBolsista.css';

function FrequenciaBolsista() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  // Mock inicial (futuramente será com fetch)
  const [presencas, setPresencas] = useState([]);
  const horasCumpridas = 78;
  const cargaHoraria = 100;
  const percentual = Math.round((horasCumpridas / cargaHoraria) * 100);

  useEffect(() => {
    // Exemplo: carregar presença do usuário autenticado
    // fetch(`/api/presencas/${matricula}`).then(...)

    setPresencas([]); // deixamos vazio até conectar com API
  }, []);

  return (
    <div className="dashboard-container">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario="bolsista" />

      <div className="content">
        <h2>Frequência</h2>

        <div className="card circulo-progresso">
          <p>Progresso</p>
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
          <p>{horasCumpridas}h de {cargaHoraria}h cumpridas</p>
        </div>

        <h3>Histórico de Presenças</h3>
        {presencas.length === 0 ? (
          <p>Nenhuma presença registrada ainda.</p>
        ) : (
          <table className="tabela-frequencia">
            <thead>
              <tr>
                <th>Data</th>
                <th>Status</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              {presencas.map((p, i) => (
                <tr key={i}>
                  <td>{p.data}</td>
                  <td>{p.status}</td>
                  <td>{p.observacao || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default FrequenciaBolsista;
