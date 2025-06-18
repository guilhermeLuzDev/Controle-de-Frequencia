const express = require('express');
const router = express.Router();
const connection = require('../db');

router.get('/', (req, res) => {
  connection.query('SELECT * FROM frequencia', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { usuario_id, data, status } = req.body;
  connection.query(
    'INSERT INTO frequencia (usuario_id, data, status) VALUES (?, ?, ?)',
    [usuario_id, data, status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, ...req.body });
    }
  );
});

router.get('/:id', (req, res) => {
  connection.query('SELECT * FROM frequencia WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Frequência não encontrada' });
    res.json(results[0]);
  });
});

router.put('/:id', (req, res) => {
  const { usuario_id, data, status } = req.body;
  connection.query(
    'UPDATE frequencia SET usuario_id=?, data=?, status=? WHERE id=?',
    [usuario_id, data, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: req.params.id, ...req.body });
    }
  );
});

router.delete('/:id', (req, res) => {
  connection.query('DELETE FROM frequencia WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
});

module.exports = router;
