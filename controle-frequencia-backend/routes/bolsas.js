const express = require('express');
const router = express.Router();
const connection = require('../db');

router.get('/', (req, res) => {
  connection.query('SELECT * FROM bolsa', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { nome, tipo } = req.body;
  connection.query(
    'INSERT INTO bolsa (nome, tipo) VALUES (?, ?)',
    [nome, tipo],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, ...req.body });
    }
  );
});

router.get('/:id', (req, res) => {
  connection.query('SELECT * FROM bolsa WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Bolsa não encontrada' });
    res.json(results[0]);
  });
});

router.put('/:id', (req, res) => {
  const { nome, tipo } = req.body;
  connection.query(
    'UPDATE bolsa SET nome=?, tipo=? WHERE id=?',
    [nome, tipo, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: req.params.id, ...req.body });
    }
  );
});

router.delete('/:id', (req, res) => {
  connection.query('DELETE FROM bolsa WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
});

module.exports = router;
