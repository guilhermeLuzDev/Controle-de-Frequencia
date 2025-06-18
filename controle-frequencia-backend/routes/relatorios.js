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
  const { usuario_id, arquivo, data_envio, status } = req.body;
  connection.query(
    'INSERT INTO relatorio (usuario_id, arquivo, data_envio, status) VALUES (?, ?, ?, ?)',
    [usuario_id, arquivo, data_envio, status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, ...req.body });
    }
  );
});

router.get('/:id', (req, res) => {
  connection.query('SELECT * FROM relatorio WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Relatório não encontrado' });
    res.json(results[0]);
  });
});

router.put('/:id', (req, res) => {
  const { usuario_id, arquivo, data_envio, status } = req.body;
  connection.query(
    'UPDATE relatorio SET usuario_id=?, arquivo=?, data_envio=?, status=? WHERE id=?',
    [usuario_id, arquivo, data_envio, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: req.params.id, ...req.body });
    }
  );
});

router.delete('/:id', (req, res) => {
  connection.query('DELETE FROM relatorio WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
});

module.exports = router;
