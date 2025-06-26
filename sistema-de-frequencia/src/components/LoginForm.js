"use client"

import { useState } from "react"
import "./LoginForm.css"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from "lucide-react"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [lembrar, setLembrar] = useState(false)
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !senha) {
      setErro("Preencha todos os campos!")
      return
    }

    setErro("")
    setCarregando(true)

    try {
      const res = await fetch(`http://localhost:3001/usuarios`) // Busca todos os usuários
      const usuarios = await res.json()
      const usuario = usuarios.find((u) => u.email === email && u.senha === senha)

      if (!usuario) {
        setErro("Usuário ou senha inválidos!")
        setCarregando(false)
        return
      }

      //Salvar nome_usuario, matricula_usuario e tipo_usuario no localStorage
      localStorage.setItem("nome_usuario", usuario.nome_usuario)
      localStorage.setItem("matricula_usuario", usuario.matricula_usuario)
      localStorage.setItem("tipo_usuario", usuario.tipo_usuario) 


      if (usuario.tipo_usuario === "coordenador") {
        navigate("/dashboard-coordenador")
      } else if (usuario.tipo_usuario === "professor") {
        navigate("/dashboard-professor")
      } else {
        navigate("/dashboard")
      }
    } catch (err) {
      console.error("Erro ao conectar com o servidor ou ao processar login:", err);
      setErro("Erro ao conectar com o servidor.");
      setCarregando(false);
    }
  }

  const alternarVisibilidade = () => {
    setMostrarSenha(!mostrarSenha)
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Área do Usuário</h1>
          <p>Faça login para acessar sua conta</p>
        </div>

        <div className="login-content">
          {erro && (
            <div className="erro-container">
              <AlertCircle className="erro-icon" />
              <span>{erro}</span>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-container">
                <Mail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={carregando}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <div className="input-container">
                <Lock className="input-icon" />
                <input
                  type={mostrarSenha ? "text" : "password"}
                  id="senha"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  disabled={carregando}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={alternarVisibilidade}
                  disabled={carregando}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  tabIndex={0}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {mostrarSenha ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" checked={lembrar} onChange={() => setLembrar(!lembrar)} disabled={carregando} />
                <span className="checkmark"></span>
                Lembrar-me
              </label>
            </div>

            <button className="login-button" type="submit" disabled={carregando}>
              {carregando ? (
                <>
                  <Loader2 className="loading-icon" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>
        </div>

        <div className="login-footer">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Instituto_Federal_de_Pernambuco_-_Marca_Vertical_2015.svg/1024px-Instituto_Federal_de_Pernambuco_-_Marca_Vertical_2015.svg.png"
            alt="Instituto Federal Pernambuco"
          />
          <p>Campus Jaboatão dos Guararapes</p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
