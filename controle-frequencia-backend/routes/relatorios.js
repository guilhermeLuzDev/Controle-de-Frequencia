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

const upload = multer({ storage });

// POST com upload real
router.post('/', upload.single('arquivo'), (req, res) => {
  const { data_relatorio, conteudo, status_relatorio, fk_usuario_matricula_usuario } = req.body;
  const arquivo_relatorio = req.file ? req.file.filename : null;

  if (!arquivo_relatorio) {
    return res.status(400).json({ error: 'Arquivo PDF não enviado.' });
  }

  connection.query(
    'INSERT INTO relatorio (data_relatorio, conteudo, status_relatorio, arquivo_relatorio, fk_usuario_matricula_usuario) VALUES (?, ?, ?, ?, ?)',
    [data_relatorio, conteudo, status_relatorio, arquivo_relatorio, fk_usuario_matricula_usuario],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id_relatorio: result.insertId, arquivo_relatorio });
    }
  );
});

// GET (listar todos)
router.get('/', (req, res) => {
  connection.query('SELECT * FROM relatorio', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET por ID
router.get('/:id_relatorio', (req, res) => {
  connection.query('SELECT * FROM relatorio WHERE id_relatorio = ?', [req.params.id_relatorio], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Relatório não encontrado' });
    res.json(results[0]);
  });
});

// PUT (atualização)
router.put('/:id_relatorio', (req, res) => {
  const { data_relatorio, conteudo, status_relatorio, arquivo_relatorio, fk_usuario_matricula_usuario } = req.body;
  connection.query(
    'UPDATE relatorio SET data_relatorio=?, conteudo=?, status_relatorio=?, arquivo_relatorio=?, fk_usuario_matricula_usuario=? WHERE id_relatorio=?',
    [data_relatorio, conteudo, status_relatorio, arquivo_relatorio, fk_usuario_matricula_usuario, req.params.id_relatorio],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id_relatorio: req.params.id_relatorio, ...req.body });
    }
  );
});

// DELETE
router.delete('/:id_relatorio', (req, res) => {
  connection.query('DELETE FROM relatorio WHERE id_relatorio = ?', [req.params.id_relatorio], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
});

module.exports = router;
