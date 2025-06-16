import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ visible, onClose, tipoUsuario }) {
  if (!visible) return null;

  const linksComuns = (
    <>
      <li><button onClick={onClose}><Link to="/">Dashboard</Link></button></li>
      <li><button onClick={onClose}><Link to="/login">Sair</Link></button></li>
    </>
  );

  const linksPorTipo = {
    professor: (
      <>
        <li><button onClick={onClose}><Link to="/bolsistas">Bolsistas</Link></button></li>
        <li><button onClick={onClose}><Link to="/relatorios">Relatórios</Link></button></li>
        <li><button onClick={onClose}><Link to="/cadastro-bolsista">Cadastrar Bolsista</Link></button></li>
      </>
    ),
    coordenador: (
      <>
        <li><button onClick={onClose}><Link to="/professores">Professores e Bolsas</Link></button></li>
        <li><button onClick={onClose}><Link to="/cadastro-bolsa">Cadastrar Bolsa</Link></button></li>
        <li><button onClick={onClose}><Link to="/cadastro-usuario">Cadastrar Usuário</Link></button></li>
      </>
    ),
    bolsista: (
      <>
        <li><button onClick={onClose}><Link to="/frequencia">Frequência</Link></button></li>
        <li><button onClick={onClose}><Link to="/enviar-relatorio">Enviar Relatório</Link></button></li>
      </>
    )
  };

  return (
    <div className="sidebar">
      <button className="close-button" onClick={onClose}>×</button>
      <ul>
        {linksPorTipo[tipoUsuario]}
        {linksComuns}
      </ul>
    </div>
  );
}

export default Sidebar;