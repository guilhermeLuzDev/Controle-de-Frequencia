import { Link } from "react-router-dom";
import { X, Home, Users, FileText, UserPlus, GraduationCap, Plus, Calendar, Upload, LogOut, Award, ClipboardCheck } from 'lucide-react';
import "./Sidebar.css";

function Sidebar({ visible, onClose, tipoUsuario }) {
  const dashboardLinks = {
    coordenador: "/dashboard-coordenador",
    professor: "/dashboard-professor",
    bolsista: "/dashboard",
  };

  const menuItems = {
    professor: [
      {
        icon: Home,
        label: "Dashboard",
        path: dashboardLinks[tipoUsuario] || "/",
        category: "principal",
      },
      {
        icon: FileText,
        label: "Relatórios",
        path: "/relatorios",
        category: "gestao",
      },
      {
        icon: Plus,
        label: "Cadastrar Usuário",
        path: "/cadastro-usuario",
        category: "cadastro",
      },
      {
        icon: ClipboardCheck,
        label: "Controle de Frequência",
        path: "/controle-frequencia",
        category: "atividades",
      },
    ],
    coordenador: [
      {
        icon: Home,
        label: "Dashboard",
        path: dashboardLinks[tipoUsuario] || "/",
        category: "principal",
      },
      {
        icon: Plus,
        label: "Cadastrar Usuário",
        path: "/cadastro-usuario",
        category: "cadastro",
      },
      {
        icon: Calendar,
        label: "Frequência",
        path: "/frequencia",
        category: "atividades",
      },
    ],
    bolsista: [
      {
        icon: Home,
        label: "Dashboard",
        path: dashboardLinks[tipoUsuario] || "/",
        category: "principal",
      },
      {
        icon: Calendar,
        label: "Frequência",
        path: "/frequencia",
        category: "atividades",
      },
    ],
  };

  const currentMenuItems = menuItems[tipoUsuario] || [];

  const groupedItems = currentMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const categoryLabels = {
    principal: "Principal",
    gestao: "Gestão",
    atividades: "Atividades",
    cadastro: "Cadastros",
  };

  const userTypeLabels = {
    coordenador: "Coordenador",
    professor: "Professor",
    bolsista: "Bolsista",
  };

  return (
    <div className={`sidebar ${visible ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <div className="user-info">
          <div className="user-avatar">
            {userTypeLabels[tipoUsuario]?.charAt(0) || "U"}
          </div>
          <div className="user-details">
            <h3>Menu</h3>
            <span className="user-type">{userTypeLabels[tipoUsuario]}</span>
          </div>
        </div>
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <X />
        </button>
      </div>

      <nav className="sidebar-nav">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="nav-section">
            <h4 className="section-title">{categoryLabels[category]}</h4>
            <ul className="nav-list">
              {items.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <li key={index} className="nav-item">
                    <Link
                      to={item.path}
                      className="nav-link"
                      onClick={onClose}
                    >
                      <IconComponent className="nav-icon" />
                      <span className="nav-label">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="nav-section nav-footer">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link logout" onClick={onClose}>
                <LogOut className="nav-icon" />
                <span className="nav-label">Sair</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
