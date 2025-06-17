// app.js
const express = require('express');
const cors = require('cors');
const connection = require('./db'); // importa a conexão com o MySQL

const app = express();
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// Inicia o servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const usuariosRouter = require('./routes/usuarios');
app.use('/usuarios', usuariosRouter);

