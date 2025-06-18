import React, { useState } from 'react';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !senha) {
      setErro('Preencha todos os campos!');
      return;
    }
    setErro('');
    try {
      const res = await fetch(`http://localhost:3001/usuarios`);
      const usuarios = await res.json();
      const usuario = usuarios.find(u => u.email === email && u.senha === senha);
      if (!usuario) {
        setErro('Usuário ou senha inválidos!');
        return;
      }
      if (usuario.po_usuario === 'coordenador') navigate('/dashboard-coordenador');
      else if (usuario.po_usuario === 'professor') navigate('/dashboard-professor');
      else navigate('/dashboard');
    } catch (err) {
      setErro('Erro ao conectar com o servidor.');
    }
  };

  const alternarVisibilidade = () => {
    setMostrarSenha(!mostrarSenha);
  };

  return (
    <div className="login-container">
      <h2>Login do Sistema</h2>
      {erro && <p className="erro">{erro}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">E-mail:</label>
        <input
          type="email"
          id="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="senha">Senha:</label>
        <input
          type={mostrarSenha ? 'text' : 'password'}
          id="senha"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <label>
          <input type="checkbox" onChange={alternarVisibilidade} />
          Mostrar senha
        </label>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default LoginForm;
