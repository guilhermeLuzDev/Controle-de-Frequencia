import React, { useState } from 'react';
import './LoginForm.css';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [logado, setLogado] = useState(false); // Para simular navegação

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !senha) {
      setErro('Preencha todos os campos!');
      return;
    }

    // Simula login com sucesso
    setErro('');
    setLogado(true);
  };

  const alternarVisibilidade = () => {
    setMostrarSenha(!mostrarSenha);
  };

  if (logado) {
    return (
      <div className="login-container">
        <h2>Login bem-sucedido!</h2>
        <p>Redirecionando para o painel...</p>
      </div>
    );
  }

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
