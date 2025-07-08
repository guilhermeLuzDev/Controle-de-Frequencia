# Sistema de Controle de Frequência - IFPE Campus Jaboatão

Este é um sistema web desenvolvido para gerenciar o controle de frequência de bolsistas no Instituto Federal de Pernambuco - Campus Jaboatão dos Guararapes.

## 🚀 Funcionalidades

- **Autenticação de usuários**
- **Controle de frequência de bolsistas**
- **Dashboard para diferentes perfis (Professor, Coordenador)**
- **Relatórios de frequência**
- **Gestão de bolsas**

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- MySQL
- CORS

### Frontend
- React.js
- CSS3
- JavaScript ES6+

## 📁 Estrutura do Projeto

```
front/
├── controle-frequencia-backend/    # Backend em Node.js/Express
│   ├── app.js                      # Configuração principal do servidor
│   ├── db.js                       # Configuração do banco de dados
│   ├── routes/                     # Definição das rotas da API
│   └── package.json
└── sistema-de-frequencia/          # Frontend em React
    ├── src/
    │   ├── components/             # Componentes React
    │   ├── App.js                  # Componente principal
    │   └── index.js                # Ponto de entrada
    └── package.json
```

## 🚀 Como Executar

### Backend
```bash
cd controle-frequencia-backend
npm install
node app.js
```

### Frontend
```bash
cd sistema-de-frequencia
npm install
npm start
```

## 📋 Rotas da API

### Usuários
- `GET /usuarios` - Listar todos os usuários
- `POST /usuarios` - Criar novo usuário
- `GET /usuarios/:matricula` - Buscar usuário por matrícula
- `PUT /usuarios/:matricula` - Atualizar usuário
- `DELETE /usuarios/:matricula` - Deletar usuário

### Frequência
- `GET /frequencia` - Listar registros de frequência
- `POST /frequencia` - Registrar nova frequência

### Relatórios
- `GET /relatorios` - Gerar relatórios de frequência

### Bolsas
- `GET /bolsas` - Listar bolsas disponíveis

## 📋 Funcionalidades

### Para Coordenadores
- Visualização geral de todas as bolsas ativas
- Cadastro de novas bolsas
- Filtro de bolsas por professor
- Gerenciamento de comunicados
- Acompanhamento de frequência dos bolsistas

### Para Professores
- Visualização das bolsas sob sua responsabilidade
- Acompanhamento de frequência dos seus bolsistas
- Gestão de relatórios

### Para Bolsistas
- Registro de frequência
- Visualização de comunicados
- Acesso aos relatórios

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Frontend (sistema-de-frequencia)

1. Entre na pasta do frontend:
```bash
cd sistema-de-frequencia
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000)

### Backend (controle-frequencia-backend)

1. Entre na pasta do backend:
```bash
cd controle-frequencia-backend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
node app.js
```

O servidor estará rodando em [http://localhost:3001](http://localhost:3001)

## 🔐 Autenticação

O sistema possui três níveis de acesso:
- Coordenador
- Professor
- Bolsista

Cada usuário terá acesso a funcionalidades específicas de acordo com seu nível de permissão.

## 📊 Estrutura do Projeto

```
front/
├── controle-frequencia-backend/    # Backend do sistema
│   ├── routes/                     # Rotas da API
│   │   ├── bolsas.js
│   │   ├── frequencia.js
│   │   ├── relatorios.js
│   │   └── usuarios.js
│   ├── app.js                      # Arquivo principal do backend
│   └── db.js                       # Configuração do banco de dados
│
└── sistema-de-frequencia/          # Frontend do sistema
    ├── public/
    └── src/
        ├── components/             # Componentes React
        │   ├── CadastroUsuario.js
        │   ├── Dashboard.js
        │   ├── DashboardCoordenador.js
        │   ├── DashboardProfessor.js
        │   ├── LoginForm.js
        │   └── Sidebar.js
        └── App.js                  # Componente principal
```

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📧 Contato

Para mais informações sobre o projeto, entre em contato com a coordenação do IFPE - Campus Jaboatão dos Guararapes.
