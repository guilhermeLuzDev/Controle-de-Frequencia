const express = require('express');
const router = express.Router();
const connection = require('../db');

router.get('/', (req, res) => {
  connection.query('SELECT * FROM relatorio', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { data_relatorio, conteudo, status_relatorio, arquivo_relatorio, fk_usuario_matricula_usuario } = req.body;
  connection.query(
    'INSERT INTO relatorio (data_relatorio, conteudo, status_relatorio, arquivo_relatorio, fk_usuario_matricula_usuario) VALUES (?, ?, ?, ?, ?)',
    [data_relatorio, conteudo, status_relatorio, arquivo_relatorio, fk_usuario_matricula_usuario],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id_relatorio: result.insertId, ...req.body });
    }
  );
});

router.get('/:id_relatorio', (req, res) => {
  connection.query('SELECT * FROM relatorio WHERE id_relatorio = ?', [req.params.id_relatorio], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Relatório não encontrado' });
    res.json(results[0]);
  });
});

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

router.delete('/:id_relatorio', (req, res) => {
  connection.query('DELETE FROM relatorio WHERE id_relatorio = ?', [req.params.id_relatorio], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
});

module.exports = router;
