import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './DashboardProfessor.css';
import { FileText, Plus, Calendar, Home } from "lucide-react";

function DashboardProfessor() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [mostrarRelatorios, setMostrarRelatorios] = useState(false);
  const [mostrarComunicados, setMostrarComunicados] = useState(false);
  const [tituloComunicado, setTituloComunicado] = useState('');
  const [mensagemComunicado, setMensagemComunicado] = useState('');
  const [comunicados, setComunicados] = useState([
    { titulo: 'Reunião geral', mensagem: 'Acontecerá dia 18/06 às 14h.' },
  ]);

  const [relatoriosBolsistas, setRelatoriosBolsistas] = useState([]);
  const [bolsistasDoProfessor, setBolsistasDoProfessor] = useState([]);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  const nomeUsuario = localStorage.getItem('nome_usuario') || 'Usuário';
  const matriculaProfessorLogado = localStorage.getItem('matricula_usuario');

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

  const fetchBolsistasDoProfessor = async () => {
    if (!matriculaProfessorLogado) {
      console.warn("Matrícula do professor não encontrada no localStorage para buscar bolsistas.");
      setBolsistasDoProfessor([]);
      return;
    }
    try {
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
    fetchRelatoriosBolsistas();
    fetchBolsistasDoProfessor();
  }, [matriculaProfessorLogado]);

  // envia todos os campos necessários na atualização
  const aprovarRelatorio = async (relatorioParaAtualizar) => { // Recebe o objeto completo do relatório
    try {
      const response = await fetch(`http://localhost:3001/relatorios/${relatorioParaAtualizar.id_relatorio}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data_relatorio: relatorioParaAtualizar.data_relatorio, // Enviar data original
          conteudo: relatorioParaAtualizar.conteudo,           // Enviar conteúdo original
          status_relatorio: 'aprovado',                       
          arquivo_relatorio: relatorioParaAtualizar.arquivo_relatorio, // Enviar nome do arquivo original
          fk_usuario_matricula_usuario: relatorioParaAtualizar.fk_usuario_matricula_usuario // Enviar matrícula do bolsista
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
      console.error("Erro ao comunicar com a API:", error);
      alert("Erro de conexão ao tentar aprovar o relatório.");
    }
  };

  // Agora envia todos os campos necessários na atualização
  const reprovarRelatorio = async (relatorioParaAtualizar) => { // Recebe o objeto completo do relatório
    const observacao = prompt("Motivo da reprovação (opcional):");
    try {
      const response = await fetch(`http://localhost:3001/relatorios/${relatorioParaAtualizar.id_relatorio}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data_relatorio: relatorioParaAtualizar.data_relatorio, // Enviar data original
          conteudo: observacao || relatorioParaAtualizar.conteudo, // Conteúdo pode ser a observação ou o original
          status_relatorio: 'reprovado',                       
          arquivo_relatorio: relatorioParaAtualizar.arquivo_relatorio, // Enviar nome do arquivo original
          fk_usuario_matricula_usuario: relatorioParaAtualizar.fk_usuario_matricula_usuario // Enviar matrícula do bolsista
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

  // Função auxiliar para determinar a classe do status
  const getStatusClass = (status) => {
    switch (status) {
      case 'aprovado':
        return 'status-aprovado';
      case 'reprovado':
        return 'status-reprovado';
      case 'pendente':
        return 'status-pendente';
      default:
        return '';
    }
  };

  return (
    <div className="dashboard-container">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario="professor" />

      <div className="content">
        <h2>Bem-vindo, {nomeUsuario}!</h2>

        {/* Tabela de bolsistas vinculados */}
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
                       
                        <td className={getStatusClass(rel.status_relatorio)}>
                            {rel.status_relatorio}
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