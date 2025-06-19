const express = require('express');
const cors = require('cors');
const connection = require('./db');

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

const bolsasRouter = require('./routes/bolsas');
app.use('/bolsas', bolsasRouter);

const frequenciaRouter = require('./routes/frequencia');
app.use('/frequencia', frequenciaRouter);

const relatoriosRouter = require('./routes/relatorios');
app.use('/relatorios', relatoriosRouter);

// Exemplo de uso de rota
app.get('/exemplo', (req, res) => {
  res.send('Esta é uma rota de exemplo!');
});

