import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './PresencasProfessor.css';

function PresencasProfessor() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [presencas, setPresencas] = useState([]);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  // Aqui será implementado o fetch futuramente
  useEffect(() => {
    // Exemplo de como será futuramente:
    // fetch(`http://localhost:3001/professor/bolsistas/${matriculaProfessor}`)
    

    setPresencas([]); // Iniciar vazio por enquanto
  }, []);

  const marcarPresenca = (index) => {
    const atualizadas = [...presencas];
    atualizadas[index].presente = !atualizadas[index].presente;
    setPresencas(atualizadas);
  };

  const alterarObservacao = (index, texto) => {
    const atualizadas = [...presencas];
    atualizadas[index].observacao = texto;
    setPresencas(atualizadas);
  };

  const registrarPresencas = () => {
    // Envio para API será feito depois
    console.log('Enviar para API:', presencas);
    alert('Presenças registradas (simulado).');
  };

  return (
    <div className="dashboard-container">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} />

      <div className="content">
        <h2>Registro de Presenças</h2>

        {presencas.length === 0 ? (
          <p>Nenhum bolsista disponível.</p>
        ) : (
          <>
            <table className="tabela-presencas">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Matrícula</th>
                  <th>Bolsa</th>
                  <th>Presente</th>
                  <th>Observação</th>
                </tr>
              </thead>
              <tbody>
                {presencas.map((p, i) => (
                  <tr key={i}>
                    <td>{p.nome}</td>
                    <td>{p.matricula}</td>
                    <td>{p.bolsa}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={p.presente || false}
                        onChange={() => marcarPresenca(i)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={p.observacao || ''}
                        onChange={(e) => alterarObservacao(i, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="botao" onClick={registrarPresencas}>
              Registrar Presenças
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PresencasProfessor;
