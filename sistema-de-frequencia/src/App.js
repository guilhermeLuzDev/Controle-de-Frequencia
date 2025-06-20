import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import DashboardCoordenador from './components/DashboardCoordenador';
import DashboardProfessor from './components/DashboardProfessor';
import Dashboard from './components/Dashboard';
import CadastroUsuario from './components/CadastroUsuario';
import PresencasProfessor from './components/PresencasProfessor';
import FrequenciaBolsista from './components/FrequenciaBolsista';


function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/dashboard-coordenador" element={<DashboardCoordenador />} />
      <Route path="/dashboard-professor" element={<DashboardProfessor />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/cadastro-usuario" element={<CadastroUsuario/>} />
      <Route path="/presencas" element={<PresencasProfessor />} />
      <Route path="/frequencia" element={<FrequenciaBolsista />} />
    </Routes>
  );
}

export default App;
