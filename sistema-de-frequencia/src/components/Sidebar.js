// src/components/Sidebar.js
import React from 'react';
import './Sidebar.css';

function Sidebar({ visible, onClose }) {
  if (!visible) return null;

  return (
    <div className="sidebar">
      <button className="close-btn" onClick={onClose}>×</button>
      <ul>
        <li>Dashboard</li>
        <li>Cadastro de Bolsistas</li>
        <li>Frequência</li>
        <li>Sair</li>
      </ul>
    </div>
  );
}

export default Sidebar;
