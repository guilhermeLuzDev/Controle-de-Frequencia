import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import './Dashboard.css';

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
  const [usuarioLogadoTipo, setUsuarioLogadoTipo] = useState('');
  const [mensagemStatus, setMensagemStatus] = useState('');
  const [bolsasDisponiveis, setBolsasDisponiveis] = useState([]); 

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  const fetchBolsas = async () => {
    try {
      const response = await fetch('http://localhost:3001/bolsas');
      if (response.ok) {
        const data = await response.json();
        setBolsasDisponiveis(data);
      } else {
        console.error('Erro ao buscar bolsas:', response.statusText);
      }
    } catch (error) {
      console.error('Erro de conexão ao buscar bolsas:', error);
    }
  };

  useEffect(() => {
    const tipo = localStorage.getItem('tipo_usuario');
    setUsuarioLogadoTipo(tipo);
    if (tipo === 'professor') {
      setUsuario(prev => ({ ...prev, tipo: 'bolsista' }));
    }
    fetchBolsas(); 
  }, []);

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagemStatus('');
    if (usuarioLogadoTipo === 'professor' && usuario.tipo !== 'bolsista') {
        setMensagemStatus('Professores só podem cadastrar bolsistas.');
        return;
    }
    if (usuario.tipo === 'bolsista' && usuario.bolsa === '') {
        setMensagemStatus('Bolsistas devem ser vinculados a uma bolsa.');
        return;
    }
    try {
      const response = await fetch('http://localhost:3001/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matricula_usuario: usuario.matricula,
          nome_usuario: usuario.nome,
          email: usuario.email,
          senha: usuario.senha,
          tipo_usuario: usuario.tipo,
          fk_bolsa_id: usuario.bolsa !== '' ? parseInt(usuario.bolsa) : null,
        }),
      });
      if (response.ok) {
        setMensagemStatus(`Usuário ${usuario.nome} (${usuario.tipo}) cadastrado com sucesso!`);
        setUsuario({
          nome: '',
          matricula: '',
          email: '',
          tipo: (usuarioLogadoTipo === 'professor' ? 'bolsista' : ''),
          bolsa: '',
          senha: '123456'
        });
      } else {
        const errorData = await response.json();
        setMensagemStatus(`Erro ao cadastrar: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      setMensagemStatus('Erro de conexão com o servidor ao cadastrar usuário.');
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario={usuarioLogadoTipo} />
      <div className={`main-content${sidebarVisible ? ' sidebar-open' : ''}`}>  
        <header className="top-header">
          <button className="menu-toggle" onClick={toggleSidebar} aria-label="Abrir menu">
            <Menu />
          </button>
        </header>
        <div className="dashboard-content" style={{ maxWidth: 600, margin: '0 auto' }}>
          <div className="welcome-section" style={{ marginBottom: 32 }}>
            <div className="welcome-text">
              <h1>Cadastro de Usuário</h1>
              <p>Preencha os dados para cadastrar um novo usuário no sistema</p>
            </div>
          </div>
          <div className="card" style={{ padding: 32, maxWidth: 500, margin: '0 auto' }}>
            {mensagemStatus && <p className="mensagem-status" style={{ marginBottom: 16 }}>{mensagemStatus}</p>}
            <form className="formulario" onSubmit={handleSubmit} style={{ background: 'none', padding: 0, gap: 16 }}>
              <label>Nome completo:</label>
              <input
                type="text"
                name="nome"
                value={usuario.nome}
                onChange={handleChange}
                required
                className="file-label"
              />
              <label>Matrícula:</label>
              <input
                type="text"
                name="matricula"
                value={usuario.matricula}
                onChange={handleChange}
                required
                className="file-label"
              />
              <label>E-mail:</label>
              <input
                type="email"
                name="email"
                value={usuario.email}
                onChange={handleChange}
                required
                className="file-label"
              />
              <label>Tipo de usuário:</label>
              <select
                name="tipo"
                value={usuario.tipo}
                onChange={handleChange}
                required
                disabled={usuarioLogadoTipo === 'professor'}
                className="file-label"
              >
                <option value="">Selecione...</option>
                {usuarioLogadoTipo === 'coordenador' && (
                  <>
                    <option value="coordenador">Coordenador</option>
                    <option value="professor">Professor</option>
                  </>
                )}
                <option value="bolsista">Bolsista</option>
              </select>
              <label>Bolsa vinculada:</label>
              <select
                name="bolsa"
                value={usuario.bolsa}
                onChange={handleChange}
                className="file-label"
              >
                <option value="">Selecione...</option>
                {bolsasDisponiveis.map((b) => (
                  <option key={b.id_bolsa} value={b.id_bolsa}>{b.nome_bolsa} (Professor: {b.fk_usuario_matricula_responsavel || 'Não Atribuído'})</option>
                ))}
              </select>
              <label>Senha padrão:</label>
              <input
                type="text"
                name="senha"
                value={usuario.senha}
                readOnly
                className="file-label"
              />
              <button type="submit" className="upload-btn" style={{ marginTop: 12 }}>Cadastrar Usuário</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CadastroUsuario;