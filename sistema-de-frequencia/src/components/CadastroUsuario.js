import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './CadastroUsuario.css';

function CadastroUsuario() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [usuario, setUsuario] = useState({
    nome: '',
    matricula: '',
    email: '',
    tipo: '',
    bolsa: '', // Aqui será o id_bolsa selecionado
    senha: '123456'
  });
  const [usuarioLogadoTipo, setUsuarioLogadoTipo] = useState('');
  const [mensagemStatus, setMensagemStatus] = useState('');
  const [bolsasDisponiveis, setBolsasDisponiveis] = useState([]); // NOVO: Estado para bolsas reais

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  // NOVO: Função para buscar bolsas do backend
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

  // Efeito para carregar o tipo de usuário logado do localStorage e as bolsas
  useEffect(() => {
    const tipo = localStorage.getItem('tipo_usuario');
    setUsuarioLogadoTipo(tipo);
    if (tipo === 'professor') {
      setUsuario(prev => ({ ...prev, tipo: 'bolsista' }));
    }
    fetchBolsas(); // NOVO: Carrega as bolsas ao montar o componente
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

    // NOVO: Validação adicional para a bolsa baseada no tipo de usuário
    if (usuario.tipo === 'bolsista' && usuario.bolsa === '') {
        setMensagemStatus('Bolsistas devem ser vinculados a uma bolsa.');
        return;
    }

    try {
      const response = await fetch('http://localhost:3001/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matricula_usuario: usuario.matricula,
          nome_usuario: usuario.nome,
          email: usuario.email,
          senha: usuario.senha,
          tipo_usuario: usuario.tipo,
          // Condição para enviar fk_bolsa_id: apenas se uma bolsa foi selecionada.
          // Para Coordenador/Professor, o campo será opcional no front e pode ser null.
          // Para Bolsista, será obrigatório e terá um valor.
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
      console.error('Erro de conexão:', error);
      setMensagemStatus('Erro de conexão com o servidor ao cadastrar usuário.');
    }
  };

  return (
    <div className="dashboard-container">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario={usuarioLogadoTipo} />

      <div className="content">
        <h2>Cadastro de Usuário</h2>

        {mensagemStatus && <p className="mensagem-status">{mensagemStatus}</p>}

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
            disabled={usuarioLogadoTipo === 'professor'}
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

          {/* NOVO: Tornar o campo de bolsa opcional para Coordenador/Professor */}
          {/* Ele será visível para todos, mas a validação 'required' será condicional */}
          <>
            <label>Bolsa vinculada:</label>
            <select
              name="bolsa"
              value={usuario.bolsa}
              onChange={handleChange}
              // O atributo 'required' é removido ou tornado condicional para Coordenador/Professor
              // A validação é movida para o handleSubmit, mais explícita.
            >
              <option value="">Selecione...</option>
              {bolsasDisponiveis.map((b) => (
                <option key={b.id_bolsa} value={b.id_bolsa}>{b.nome_bolsa} (Professor: {b.fk_usuario_matricula_responsavel || 'Não Atribuído'})</option>
              ))}
            </select>
          </>

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