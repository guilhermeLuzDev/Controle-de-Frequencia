import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './CadastroUsuario.css';

function CadastroUsuario() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [usuario, setUsuario] = useState({
    nome: '',
    matricula: '',
    email: '',
    tipo: '',
    bolsa: '',
    senha: '123456'
  });

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  // Simulação de bolsas cadastradas no sistema
  const bolsas = [
    'Partiu IF - Monitoria',
    'PIBIC - Iniciação Científica',
    'Extensão - Cultura Digital',
    'Tutoria de Pares - TADS'
  ];

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Usuário ${usuario.nome} (${usuario.tipo}) cadastrado com sucesso!`);
    setUsuario({
      nome: '',
      matricula: '',
      email: '',
      tipo: '',
      bolsa: '',
      senha: '123456'
    });
  };

  return (
    <div className="dashboard-container">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} />

      <div className="content">
        <h2>Cadastro de Usuário</h2>

        <form className="formulario" onSubmit={handleSubmit}>
          <label>Nome completo:</label>
          <input
            type="text"
            name="nome"
            value={usuario.nome}
            onChange={handleChange}
            required
          />

          <label>Matrícula:</label>
          <input
            type="text"
            name="matricula"
            value={usuario.matricula}
            onChange={handleChange}
            required
          />

          <label>E-mail:</label>
          <input
            type="email"
            name="email"
            value={usuario.email}
            onChange={handleChange}
            required
          />

          <label>Tipo de usuário:</label>
          <select
            name="tipo"
            value={usuario.tipo}
            onChange={handleChange}
            required
          >
            <option value="">Selecione...</option>
            <option value="coordenador">Coordenador</option>
            <option value="professor">Professor</option>
            <option value="bolsista">Bolsista</option>
          </select>

          {(usuario.tipo === 'professor' || usuario.tipo === 'bolsista') && (
            <>
              <label>Bolsa vinculada:</label>
              <select
                name="bolsa"
                value={usuario.bolsa}
                onChange={handleChange}
                required
              >
                <option value="">Selecione...</option>
                {bolsas.map((b, i) => (
                  <option key={i} value={b}>{b}</option>
                ))}
              </select>
            </>
          )}

          <label>Senha padrão:</label>
          <input
            type="text"
            name="senha"
            value={usuario.senha}
            readOnly
          />

          <button type="submit" className="botao-enviar">Cadastrar Usuário</button>
        </form>
      </div>
    </div>
  );
}

export default CadastroUsuario;
