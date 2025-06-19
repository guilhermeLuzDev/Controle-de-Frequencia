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
  const { nome_bolsa, tipo_bolsa, carga_horaria, frequencia_relatorio } = req.body;
  connection.query(
    'INSERT INTO bolsa (nome_bolsa, tipo_bolsa, carga_horaria, frequencia_relatorio) VALUES (?, ?, ?, ?)',
    [nome_bolsa, tipo_bolsa, carga_horaria, frequencia_relatorio],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id_bolsa: result.insertId, ...req.body });
    }
  );
});

router.get('/:id_bolsa', (req, res) => {
  connection.query('SELECT * FROM bolsa WHERE id_bolsa = ?', [req.params.id_bolsa], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Bolsa não encontrada' });
    res.json(results[0]);
  });
});

router.put('/:id_bolsa', (req, res) => {
  const { nome_bolsa, tipo_bolsa, carga_horaria, frequencia_relatorio } = req.body;
  connection.query(
    'UPDATE bolsa SET nome_bolsa=?, tipo_bolsa=?, carga_horaria=?, frequencia_relatorio=? WHERE id_bolsa=?',
    [nome_bolsa, tipo_bolsa, carga_horaria, frequencia_relatorio, req.params.id_bolsa],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id_bolsa: req.params.id_bolsa, ...req.body });
    }
  );
});

router.delete('/:id_bolsa', (req, res) => {
  connection.query('DELETE FROM bolsa WHERE id_bolsa = ?', [req.params.id_bolsa], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
});

module.exports = router;
