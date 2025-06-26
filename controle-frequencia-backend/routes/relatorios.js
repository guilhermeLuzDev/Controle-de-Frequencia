const express = require('express');
const router = express.Router();
const connection = require('../db');
const multer = require('multer');
const path = require('path');

// Configuração do multer (armazenamento de arquivos PDF)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // pasta onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    const nomeFinal = Date.now() + '-' + file.originalname;
    cb(null, nomeFinal);
  }
});

// Filtro para aceitar apenas arquivos PDF
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PDF são permitidos!'), false);
    }
  }
});

// POST com upload real
router.post('/', upload.single('arquivo'), (req, res) => {
  const { data_relatorio, conteudo, status_relatorio, fk_usuario_matricula_usuario } = req.body;
  const arquivo_relatorio = req.file ? req.file.filename : null;

  if (!arquivo_relatorio) {
    return res.status(400).json({ error: 'Arquivo PDF não enviado ou tipo inválido.' });
  }

  connection.query(
    'INSERT INTO relatorio (data_relatorio, conteudo, status_relatorio, arquivo_relatorio, fk_usuario_matricula_usuario) VALUES (?, ?, ?, ?, ?)',
    [data_relatorio, conteudo, status_relatorio, arquivo_relatorio, fk_usuario_matricula_usuario],
    (err, result) => {
      if (err) {
        console.error('Erro ao inserir relatório:', err); // Log mais detalhado
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id_relatorio: result.insertId, arquivo_relatorio });
    }
  );
});

// GET (listar todos ou filtrar por matrícula de usuário)
router.get('/', (req, res) => {
  const { matricula_usuario } = req.query;
  let sql = 'SELECT * FROM relatorio';
  let params = [];

  if (matricula_usuario) {
    sql += ' WHERE fk_usuario_matricula_usuario = ?';
    params = [matricula_usuario];
  }

  connection.query(sql, params, (err, results) => {
    if (err) {
      console.error('Erro ao buscar relatórios:', err); // Log mais detalhado
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET por ID
router.get('/:id_relatorio', (req, res) => {
  connection.query('SELECT * FROM relatorio WHERE id_relatorio = ?', [req.params.id_relatorio], (err, results) => {
    if (err) {
      console.error('Erro ao buscar relatório por ID:', err); // Log mais detalhado
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) return res.status(404).json({ error: 'Relatório não encontrado' });
    res.json(results[0]);
  });
});

// GET para baixar arquivo PDF
router.get('/arquivo/:nome_arquivo', (req, res) => {
  const nomeArquivo = req.params.nome_arquivo;
  const caminhoArquivo = path.join(__dirname, '..', 'uploads', nomeArquivo);

  res.download(caminhoArquivo, (err) => {
    if (err) {
      console.error('Erro ao baixar arquivo:', err); // Log mais detalhado
      // Se o arquivo não for encontrado ou houver outro erro, envie um 404
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'Arquivo não encontrado.' });
      }
      res.status(500).json({ error: 'Erro ao baixar o arquivo.' });
    }
  });
});


// PUT (atualização)
router.put('/:id_relatorio', (req, res) => {
  const { data_relatorio, conteudo, status_relatorio, arquivo_relatorio, fk_usuario_matricula_usuario } = req.body;
  connection.query(
    'UPDATE relatorio SET data_relatorio=?, conteudo=?, status_relatorio=?, arquivo_relatorio=?, fk_usuario_matricula_usuario=? WHERE id_relatorio=?',
    [data_relatorio, conteudo, status_relatorio, arquivo_relatorio, fk_usuario_matricula_usuario, req.params.id_relatorio],
    (err) => {
      if (err) {
        console.error('Erro ao atualizar relatório:', err); // Log mais detalhado
        return res.status(500).json({ error: err.message });
      }
      res.json({ id_relatorio: req.params.id_relatorio, ...req.body });
    }
  );
});

// DELETE
router.delete('/:id_relatorio', (req, res) => {
  connection.query('DELETE FROM relatorio WHERE id_relatorio = ?', [req.params.id_relatorio], (err) => {
    if (err) {
      console.error('Erro ao deletar relatório:', err); // Log mais detalhado
      return res.status(500).json({ error: err.message });
    }
    res.status(204).send();
  });
});

// NOVA ROTA: GET (listar relatórios por matrícula de professor responsável)
router.get('/por-professor/:matricula_professor', (req, res) => {
  const matriculaProfessor = req.params.matricula_professor;

  const sql = `
    SELECT
      r.*,
      u.nome_usuario AS nome_bolsista,
      u.matricula_usuario AS matricula_bolsista,
      b.nome_bolsa
    FROM
      relatorio r
    JOIN
      usuario u ON r.fk_usuario_matricula_usuario = u.matricula_usuario
    JOIN
      bolsa b ON u.fk_bolsa_id = b.id_bolsa
    WHERE
      b.fk_usuario_matricula_responsavel = ?;
  `;

  connection.query(sql, [matriculaProfessor], (err, results) => {
    if (err) {
      console.error('Erro ao buscar relatórios por professor:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

module.exports = router;