// =======================
// DASHBOARD PROFESSOR
// =======================

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './DashboardProfessor.css';
import { FileText, Plus, Calendar, Home } from "lucide-react"; // Importar ícones necessários

function DashboardProfessor() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [mostrarRelatorios, setMostrarRelatorios] = useState(false);
  const [mostrarComunicados, setMostrarComunicados] = useState(false);
  const [tituloComunicado, setTituloComunicado] = useState('');
  const [mensagemComunicado, setMensagemComunicado] = useState('');
  const [comunicados, setComunicados] = useState([
    { titulo: 'Reunião geral', mensagem: 'Acontecerá dia 18/06 às 14h.' },
  ]);

  const [relatoriosBolsistas, setRelatoriosBolsistas] = useState([]); // Estado para relatórios reais
  const [bolsistasDoProfessor, setBolsistasDoProfessor] = useState([]); // NOVO: Estado para bolsistas vinculados

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  const nomeUsuario = localStorage.getItem('nome_usuario') || 'Usuário';
  const matriculaProfessorLogado = localStorage.getItem('matricula_usuario');

  // Função para buscar relatórios dos bolsistas *deste professor*
  const fetchRelatoriosBolsistas = async () => {
    if (!matriculaProfessorLogado) {
      console.warn("Matrícula do professor não encontrada no localStorage.");
      setRelatoriosBolsistas([]);
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/relatorios/por-professor/${matriculaProfessorLogado}`);
      if (response.ok) {
        const data = await response.json();
        setRelatoriosBolsistas(data);
      } else {
        console.error("Erro ao buscar relatórios por professor:", response.statusText);
        setRelatoriosBolsistas([]);
      }
    } catch (error) {
      console.error("Erro de conexão ao buscar relatórios por professor:", error);
      setRelatoriosBolsistas([]);
    }
  };

  // NOVO: Função para buscar bolsistas vinculados a este professor
  const fetchBolsistasDoProfessor = async () => {
    if (!matriculaProfessorLogado) {
      console.warn("Matrícula do professor não encontrada no localStorage para buscar bolsistas.");
      setBolsistasDoProfessor([]);
      return;
    }
    try {
      // Usando a nova rota backend para buscar bolsistas específicos deste professor
      const response = await fetch(`http://localhost:3001/usuarios/por-professor/${matriculaProfessorLogado}`);
      if (response.ok) {
        const data = await response.json();
        setBolsistasDoProfessor(data);
      } else {
        console.error("Erro ao buscar bolsistas por professor:", response.statusText);
        setBolsistasDoProfessor([]);
      }
    } catch (error) {
      console.error("Erro de conexão ao buscar bolsistas por professor:", error);
      setBolsistasDoProfessor([]);
    }
  };

  useEffect(() => {
    fetchRelatoriosBolsistas(); // Busca relatórios ao carregar o componente
    fetchBolsistasDoProfessor(); // NOVO: Busca bolsistas ao carregar o componente
  }, [matriculaProfessorLogado]);

  const aprovarRelatorio = async (idRelatorio) => {
    try {
      const response = await fetch(`http://localhost:3001/relatorios/${idRelatorio}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status_relatorio: 'aprovado' }),
      });

      if (response.ok) {
        alert(`Relatório ${idRelatorio} aprovado com sucesso!`);
        fetchRelatoriosBolsistas(); // Recarrega a lista de relatórios
      } else {
        const erro = await response.json();
        alert(`Erro ao aprovar relatório: ${erro.error}`);
      }
    } catch (error) {
      console.error("Erro ao comunicar com a API:", error);
      alert("Erro de conexão ao tentar aprovar o relatório.");
    }
  };

  const reprovarRelatorio = async (idRelatorio) => {
    const observacao = prompt("Motivo da reprovação (opcional):");
    try {
      const response = await fetch(`http://localhost:3001/relatorios/${idRelatorio}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status_relatorio: 'reprovado', conteudo: observacao || 'Reprovado sem observação.' }),
      });

      if (response.ok) {
        alert(`Relatório ${idRelatorio} reprovado com sucesso!`);
        fetchRelatoriosBolsistas(); // Recarrega a lista de relatórios
      } else {
        const erro = await response.json();
        alert(`Erro ao reprovar relatório: ${erro.error}`);
      }
    } catch (error) {
      console.error("Erro ao comunicar com a API:", error);
      alert("Erro de conexão ao tentar reprovar o relatório.");
    }
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
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario="professor" />

      <div className="content">
        <h2>Bem-vindo, {nomeUsuario}!</h2>

        {/* Tabela de bolsistas vinculados - AGORA BUSCANDO DO BACKEND */}
        <div className="tabela-programas">
          <p className="subtitulo">Bolsistas Vinculados</p>
          {bolsistasDoProfessor.length === 0 ? (
            <p>Nenhum bolsista vinculado a este professor encontrado.</p>
          ) : (
            <table>
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

        {/* Aba: Relatórios */}
        <div className="aba">
          <button className="botao" onClick={() => setMostrarRelatorios(!mostrarRelatorios)}>
            {mostrarRelatorios ? '▼' : '▶'} Relatórios Enviados
          </button>

          {mostrarRelatorios && (
            relatoriosBolsistas.length === 0 ? (
                <p>Nenhum relatório enviado pelos seus bolsistas ainda.</p>
            ) : (
                <table className="subtabela">
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
                        <td>{rel.status_relatorio}</td>
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
                        <button className="aprovar" onClick={() => aprovarRelatorio(rel.id_relatorio)}>✔ Aprovar</button>
                        <button className="reprovar" onClick={() => reprovarRelatorio(rel.id_relatorio)}>✖ Reprovar</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )
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