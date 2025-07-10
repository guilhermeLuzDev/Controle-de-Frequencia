# 📚 Sistema de Controle de Frequência - IFPE Campus Jaboatão

> Sistema web desenvolvido para gerenciar o controle de frequência de bolsistas no Instituto Federal de Pernambuco - Campus Jaboatão dos Guararapes.

[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4+-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8+-4479A1?logo=mysql&logoColor=white)](https://mysql.com/)

## 🎯 Visão Geral

Sistema completo para gestão de bolsistas acadêmicos com três níveis de acesso distintos, permitindo controle eficiente de frequência, geração de relatórios e administração de bolsas de estudo.

## ✨ Funcionalidades Principais

### 🔐 Sistema de Autenticação
- Login seguro com três perfis de usuário
- Controle de acesso baseado em permissões
- Autenticação via email e senha

### 👥 Gestão de Usuários
- **Coordenadores**: Acesso total ao sistema
- **Professores**: Gestão de seus bolsistas
- **Bolsistas**: Acesso às suas informações

### 📊 Controle de Frequência
- Registro de presença diária
- Status: Presente, Ausente, Justificado
- Histórico completo de frequência
- Cálculo automático de percentual
- Filtros por data e status

### 🎓 Gestão de Bolsas
- Cadastro e gerenciamento de bolsas
- Vinculação de bolsistas às bolsas
- Controle de carga horária
- Acompanhamento por professor responsável

### 📋 Sistema de Relatórios
- Upload de relatórios em PDF
- Histórico de relatórios por bolsista
- Download de arquivos
- Controle de status dos relatórios

## 🏗️ Arquitetura do Sistema

### Backend (Node.js + Express)
```
controle-frequencia-backend/
├── app.js                  # Configuração principal do servidor
├── db.js                   # Conexão com MySQL
├── routes/                 # Rotas da API REST
│   ├── usuarios.js         # CRUD de usuários
│   ├── bolsas.js          # Gestão de bolsas
│   ├── frequencia.js      # Controle de frequência
│   └── relatorios.js      # Upload e gestão de relatórios
├── uploads/               # Armazenamento de arquivos PDF
└── package.json
```

### Frontend (React)
```
sistema-de-frequencia/
├── public/
├── src/
│   ├── components/        # Componentes React
│   │   ├── LoginForm.js           # Formulário de login
│   │   ├── Dashboard.js           # Dashboard de bolsistas
│   │   ├── DashboardCoordenador.js # Dashboard de coordenadores
│   │   ├── DashboardProfessor.js  # Dashboard de professores
│   │   ├── CadastroUsuario.js     # Cadastro de usuários
│   │   ├── ControleFrequencia.js  # Controle de frequência
│   │   ├── FrequenciaBolsista.js  # Visualização de frequência
│   │   ├── PresencasProfessor.js  # Gestão de presenças
│   │   └── Sidebar.js             # Navegação lateral
│   ├── App.js             # Componente principal e rotas
│   └── index.js
└── package.json
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL2** - Driver para MySQL
- **CORS** - Habilitação de requisições cross-origin
- **Multer** - Upload de arquivos

### Frontend
- **React 19** - Biblioteca de interface
- **React Router DOM** - Roteamento
- **Lucide React** - Ícones modernos
- **CSS3** - Estilização

### Banco de Dados
- **MySQL** - Sistema de gerenciamento de banco de dados

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 16+ 
- MySQL 8+
- npm ou yarn

### 1. Clone o Repositório
```bash
git clone <url-do-repositorio>
cd front
```

### 2. Configuração do Banco de Dados
1. Instale e configure o MySQL
2. Crie o banco de dados `frequencia_bolsistas`
3. Configure as credenciais no arquivo `controle-frequencia-backend/db.js`

### 3. Backend Setup
```bash
cd controle-frequencia-backend
npm install
node app.js
```
🌐 **Servidor Backend**: http://localhost:3001

### 4. Frontend Setup
```bash
cd sistema-de-frequencia
npm install
npm start
```
🌐 **Aplicação Web**: http://localhost:3000

## 📡 Documentação da API

### 👤 Usuários (`/usuarios`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/usuarios` | Listar todos os usuários |
| `POST` | `/usuarios` | Criar novo usuário |
| `GET` | `/usuarios/:matricula` | Buscar usuário por matrícula |
| `PUT` | `/usuarios/:matricula` | Atualizar usuário |
| `DELETE` | `/usuarios/:matricula` | Deletar usuário |
| `GET` | `/usuarios/por-professor/:matricula` | Bolsistas de um professor |
| `GET` | `/usuarios/por-bolsa/:id_bolsa` | Usuários de uma bolsa |

### 🎓 Bolsas (`/bolsas`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/bolsas` | Listar todas as bolsas |
| `POST` | `/bolsas` | Criar nova bolsa |
| `GET` | `/bolsas/:id_bolsa` | Buscar bolsa por ID |
| `PUT` | `/bolsas/:id_bolsa` | Atualizar bolsa |
| `DELETE` | `/bolsas/:id_bolsa` | Deletar bolsa |

### 📊 Frequência (`/frequencia`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/frequencia` | Listar registros de frequência |
| `POST` | `/frequencia` | Registrar nova frequência |
| `PUT` | `/frequencia/:id_presenca` | Atualizar registro |
| `DELETE` | `/frequencia/:id_presenca` | Deletar registro |
| `GET` | `/frequencia/usuario/:matricula` | Frequência de um usuário |
| `GET` | `/frequencia/resumo/:matricula` | Resumo estatístico |

### 📋 Relatórios (`/relatorios`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/relatorios` | Listar relatórios |
| `POST` | `/relatorios` | Upload de relatório (PDF) |
| `GET` | `/relatorios/:id_relatorio` | Buscar relatório por ID |
| `PUT` | `/relatorios/:id_relatorio` | Atualizar relatório |
| `DELETE` | `/relatorios/:id_relatorio` | Deletar relatório |
| `GET` | `/relatorios/arquivo/:nome_arquivo` | Download do arquivo |
| `GET` | `/relatorios/por-professor/:matricula` | Relatórios por professor |

## 🎭 Perfis de Usuário

### 👑 Coordenador
- **Visão geral**: Dashboard com todas as bolsas ativas
- **Gestão completa**: Cadastro de usuários (todos os tipos)
- **Monitoramento**: Acompanhamento de frequência geral
- **Relatórios**: Acesso a todos os relatórios do sistema

### 👨‍🏫 Professor
- **Gestão de bolsistas**: Seus bolsistas vinculados
- **Controle de frequência**: Registro de presenças
- **Cadastro limitado**: Apenas bolsistas
- **Relatórios**: Seus bolsistas e suas atividades

### 🎓 Bolsista
- **Dashboard pessoal**: Informações da bolsa
- **Frequência**: Visualização do histórico pessoal
- **Relatórios**: Upload e gestão de seus relatórios
- **Estatísticas**: Percentual de frequência e horas cumpridas

## 🔧 Estrutura do Banco de Dados

### Principais Tabelas
- **usuario**: Dados dos usuários do sistema
- **bolsa**: Informações das bolsas disponíveis  
- **presenca**: Registros de frequência
- **relatorio**: Relatórios enviados pelos bolsistas

### Relacionamentos
- Usuários podem estar vinculados a bolsas
- Bolsas possuem professores responsáveis
- Presenças são vinculadas a usuários
- Relatórios são enviados por bolsistas

## 🔐 Segurança e Autenticação

- Controle de acesso baseado em perfil de usuário
- Validação de permissões por endpoint
- Armazenamento seguro de credenciais
- Upload restrito a arquivos PDF

## 📱 Interface do Usuário

- **Design responsivo**: Adaptável a diferentes dispositivos
- **Navegação intuitiva**: Sidebar contextual por perfil
- **Feedback visual**: Indicadores de status e carregamento
- **Filtros avançados**: Busca e filtros em tempo real

## 🚀 Scripts Disponíveis

### Backend
```bash
npm install    # Instalar dependências
node app.js    # Iniciar servidor
```

### Frontend
```bash
npm install    # Instalar dependências
npm start      # Servidor de desenvolvimento
npm build      # Build para produção
npm test       # Executar testes
```

## 🤝 Contribuição

1. **Fork** o repositório
2. Crie uma **branch** para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um **Pull Request**

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte técnico, entre em contato com a coordenação do IFPE - Campus Jaboatão dos Guararapes.

---

<div align="center">

**Desenvolvido para IFPE Campus Jaboatão dos Guararapes** 🎓

*Sistema de gestão acadêmica para controle de bolsistas*

</div>
