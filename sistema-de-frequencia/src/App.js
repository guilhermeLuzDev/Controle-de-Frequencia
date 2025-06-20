// sistema-de-frequencia/src/App.js
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm'; //
import DashboardCoordenador from './components/DashboardCoordenador'; //
import DashboardProfessor from './components/DashboardProfessor'; //
import Dashboard from './components/Dashboard'; //
import CadastroUsuario from './components/CadastroUsuario'; //
import PresencasProfessor from './components/PresencasProfessor'; //
import FrequenciaBolsista from './components/FrequenciaBolsista'; //
import Sidebar from './components/Sidebar'; //

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  // Este 'tipoUsuario' deve ser gerenciado por um estado global real após o login.
  // Por enquanto, vamos mockar para 'bolsista' para testes.
  const [currentTipoUsuario, setCurrentTipoUsuario] = useState('bolsista');

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  return (
    <div className="app-layout-container"> {/* Novo container para o layout */}
      <Sidebar visible={sidebarVisible} onClose={closeSidebar} tipoUsuario={currentTipoUsuario} /> {/* */}
      <div className={`main-content-wrapper ${sidebarVisible ? 'sidebar-open' : ''}`}>
        <Routes>
          <Route path="/" element={<LoginForm />} /> {/* */}
          <Route path="/dashboard-coordenador" element={<DashboardCoordenador />} /> {/* */}
          <Route path="/dashboard-professor" element={<DashboardProfessor />} /> {/* */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* */}
          <Route path="/cadastro-usuario" element={<CadastroUsuario />} /> {/* */}
          <Route path="/presencas" element={<PresencasProfessor />} /> {/* */}
          <Route path="/frequencia" element={<FrequenciaBolsista />} /> {/* */}
        </Routes>
      </div>
    </div>
  );
}

export default App;