const mysql = require('mysql2');

// Configuração da conexão com seu banco no WampServer
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'frequencia_bolsistas'
});

// Verifica se a conexão está funcionando
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar com o MySQL:', err.message);
  } else {
    console.log('Conexão com o banco de dados estabelecida!');
  }
});

module.exports = connection;
