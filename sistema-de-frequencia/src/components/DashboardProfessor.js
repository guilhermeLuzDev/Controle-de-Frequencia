import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import {
  Menu,
  FileText,
  Users,
  Award,
  ClipboardList,
} from "lucide-react";
import './Dashboard.css';

function DashboardProfessor() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [relatoriosBolsistas, setRelatoriosBolsistas] = useState([]);
  const [bolsistasDoProfessor, setBolsistasDoProfessor] = useState([]);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  const nomeUsuario = localStorage.getItem('nome_usuario') || 'Usuário';
  const matriculaProfessorLogado = localStorage.getItem('matricula_usuario');

  const fetchRelatoriosBolsistas = async () => {
    if (!matriculaProfessorLogado) {
      setRelatoriosBolsistas([]);
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/relatorios/por-professor/${matriculaProfessorLogado}`);
      if (response.ok) {
        const data = await response.json();
        setRelatoriosBolsistas(data);
      } else {
        setRelatoriosBolsistas([]);
      }
    } catch (error) {
      setRelatoriosBolsistas([]);
    }
  };

  const fetchBolsistasDoProfessor = async () => {
    if (!matriculaProfessorLogado) {
      setBolsistasDoProfessor([]);
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/usuarios/por-professor/${matriculaProfessorLogado}`);
      if (response.ok) {
        const data = await response.json();
        setBolsistasDoProfessor(data);
      } else {
        setBolsistasDoProfessor([]);
      }
    } catch (error) {
      setBolsistasDoProfessor([]);
    }
  };

  useEffect(() => {
    fetchRelatoriosBolsistas();
    fetchBolsistasDoProfessor();
  }, [matriculaProfessorLogado]);

  const aprovarRelatorio = async (relatorioParaAtualizar) => {
    try {
      const response = await fetch(`http://localhost:3001/relatorios/${relatorioParaAtualizar.id_relatorio}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data_relatorio: relatorioParaAtualizar.data_relatorio,
          conteudo: relatorioParaAtualizar.conteudo,
          status_relatorio: 'aprovado',
          arquivo_relatorio: relatorioParaAtualizar.arquivo_relatorio,
          fk_usuario_matricula_usuario: relatorioParaAtualizar.fk_usuario_matricula_usuario
        }),
      });
      if (response.ok) {
        alert(`Relatório ${relatorioParaAtualizar.id_relatorio} aprovado com sucesso!`);
        fetchRelatoriosBolsistas();
      } else {
        const erro = await response.json();
        alert(`Erro ao aprovar relatório: ${erro.error}`);
      }
    } catch (error) {
      alert("Erro de conexão ao tentar aprovar o relatório.");
    }
  };

  const reprovarRelatorio = async (relatorioParaAtualizar) => {
    const observacao = prompt("Motivo da reprovação (opcional):");
    try {
      const response = await fetch(`http://localhost:3001/relatorios/${relatorioParaAtualizar.id_relatorio}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data_relatorio: relatorioParaAtualizar.data_relatorio,
          conteudo: observacao || relatorioParaAtualizar.conteudo,
          status_relatorio: 'reprovado',
          arquivo_relatorio: relatorioParaAtualizar.arquivo_relatorio,
          fk_usuario_matricula_usuario: relatorioParaAtualizar.fk_usuario_matricula_usuario
        }),
      });
      if (response.ok) {
        alert(`Relatório ${relatorioParaAtualizar.id_relatorio} reprovado com sucesso!`);
        fetchRelatoriosBolsistas();
      } else {
        const erro = await response.json();
        alert(`Erro ao reprovar relatório: ${erro.error}`);
      }
    } catch (error) {
      alert("Erro de conexão ao tentar reprovar o relatório.");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'aprovado': return 'status-aprovado';
      case 'reprovado': return 'status-reprovado';
      case 'pendente': return 'status-pendente';
      default: return '';
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario="professor" />
      <div className={`main-content ${sidebarVisible ? "sidebar-open" : ""}`}>
        <header className="top-header">
          <button className="menu-toggle" onClick={toggleSidebar} aria-label="Abrir menu">
            <Menu />
          </button>
        </header>
        <div className="dashboard-content">
          <div className="welcome-section">
            <div className="welcome-text">
              <h1>Olá, {nomeUsuario}! 👋</h1>
              <p>Acompanhe seus bolsistas e relatórios em um só lugar</p>
            </div>
          </div>
          <div className="metrics-grid">
            <div className="metric-card primary">
              <div className="metric-icon"><Users /></div>
              <div className="metric-content">
                <h3>{bolsistasDoProfessor.length}</h3>
                <p>Bolsistas Vinculados</p>
              </div>
            </div>
            <div className="metric-card secondary">
              <div className="metric-icon"><ClipboardList /></div>
              <div className="metric-content">
                <h3>{relatoriosBolsistas.length}</h3>
                <p>Relatórios Recebidos</p>
              </div>
            </div>
            
          </div>
          <div className="content-grid">
            <div className="progress-section">
              <div className="card">
                <div className="card-header">
                  <div className="header-content">
                    <Users className="header-icon" />
                    <h3>Bolsistas Vinculados</h3>
                  </div>
                </div>
                <div style={{ padding: '0 24px 24px 24px' }}>
                  {bolsistasDoProfessor.length === 0 ? (
                    <div className="empty-state">
                      <p>Nenhum bolsista vinculado a este professor encontrado.</p>
                    </div>
                  ) : (
                    <table className="tabela-frequencia">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Matrícula</th>
                          <th>Bolsa Vinculada</th>
                          <th>Carga Horária Bolsa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bolsistasDoProfessor.map((bolsista) => (
                          <tr key={bolsista.matricula_usuario}>
                            <td>{bolsista.nome_usuario}</td>
                            <td>{bolsista.matricula_usuario}</td>
                            <td>{bolsista.nome_bolsa_vinculada}</td>
                            <td>{bolsista.carga_horaria}h</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="header-content">
                    <FileText className="header-icon" />
                    <h3>Relatórios Enviados</h3>
                  </div>
                </div>
                <div style={{ padding: '0 24px 24px 24px' }}>
                  {relatoriosBolsistas.length === 0 ? (
                    <div className="empty-state">
                      <p>Nenhum relatório enviado pelos seus bolsistas ainda.</p>
                    </div>
                  ) : (
                    <table className="tabela-frequencia">
                      <thead>
                        <tr>
                          <th>Bolsista (Matrícula)</th>
                          <th>Bolsista (Nome)</th>
                          <th>Bolsa</th>
                          <th>Data</th>
                          <th>Status</th>
                          <th>Visualizar</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {relatoriosBolsistas.map((rel) => (
                          <tr key={rel.id_relatorio}>
                            <td>{rel.matricula_bolsista}</td>
                            <td>{rel.nome_bolsista}</td>
                            <td>{rel.nome_bolsa}</td>
                            <td>{new Date(rel.data_relatorio).toLocaleDateString('pt-BR')}</td>
                            <td className={getStatusClass(rel.status_relatorio)}>
                              {rel.status_relatorio.charAt(0).toUpperCase() + rel.status_relatorio.slice(1)}
                            </td>
                            <td>
                              {rel.arquivo_relatorio && (
                                <a
                                  href={`http://localhost:3001/relatorios/arquivo/${rel.arquivo_relatorio}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Abrir PDF
                                </a>
                              )}
                            </td>
                            <td>
                              <button className="aprovar" onClick={() => aprovarRelatorio(rel)}>✔ Aprovar</button>
                              <button className="reprovar" onClick={() => reprovarRelatorio(rel)}>✖ Reprovar</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardProfessor;