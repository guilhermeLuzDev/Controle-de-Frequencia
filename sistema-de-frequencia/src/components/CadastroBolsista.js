// src/components/CadastroBolsista.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './CadastroBolsista.css';

function CadastroBolsista() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  // Simulação de bolsas vinculadas (professor ou coordenador)
  const bolsasDisponiveis = [
    'Partiu IF: Monitoria',
    'PIBIC: Pesquisa',
    'Tutoria: Apoio entre Pares'
  ];

  const [form, setForm] = useState({
    nome: '',
    matricula: '',
    email: '',
    bolsa: '',
    senha: '123456',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Bolsista ${form.nome} cadastrado com sucesso na bolsa ${form.bolsa}!`);
    // Aqui entra o envio à API futuramente
    setForm({
      nome: '',
      matricula: '',
      email: '',
      bolsa: '',
      senha: '123456',
    });
  };

  return (
    <div className="dashboard-container">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} />

      <div className="content">
        <h2>Cadastro de Bolsista</h2>

        <form className="formulario" onSubmit={handleSubmit}>
          <label>Nome completo:</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />

          <label>Matrícula:</label>
          <input
            type="text"
            name="matricula"
            value={form.matricula}
            onChange={handleChange}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Selecione a bolsa:</label>
          <select
            name="bolsa"
            value={form.bolsa}
            onChange={handleChange}
            required
          >
            <option value="">Selecione...</option>
            {bolsasDisponiveis.map((bolsa, i) => (
              <option key={i} value={bolsa}>{bolsa}</option>
            ))}
          </select>

          <label>Senha padrão:</label>
          <input
            type="text"
            name="senha"
            value={form.senha}
            readOnly
          />

          <button type="submit" className="botao-enviar">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}

export default CadastroBolsista;
