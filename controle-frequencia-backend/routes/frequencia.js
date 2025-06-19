const express = require('express');
const router = express.Router();
const connection = require('../db');

router.get('/', (req, res) => {
  connection.query('SELECT * FROM presenca', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { data_presenca, status_presenca, observacao, fk_usuario_matricula_usuario } = req.body;
  connection.query(
    'INSERT INTO presenca (data_presenca, status_presenca, observacao, fk_usuario_matricula_usuario) VALUES (?, ?, ?, ?)',
    [data_presenca, status_presenca, observacao, fk_usuario_matricula_usuario],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id_presenca: result.insertId, ...req.body });
    }
  );
});

router.get('/:id_presenca', (req, res) => {
  connection.query('SELECT * FROM presenca WHERE id_presenca = ?', [req.params.id_presenca], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Presença não encontrada' });
    res.json(results[0]);
  });
});

router.put('/:id_presenca', (req, res) => {
  const { data_presenca, status_presenca, observacao, fk_usuario_matricula_usuario } = req.body;
  connection.query(
    'UPDATE presenca SET data_presenca=?, status_presenca=?, observacao=?, fk_usuario_matricula_usuario=? WHERE id_presenca=?',
    [data_presenca, status_presenca, observacao, fk_usuario_matricula_usuario, req.params.id_presenca],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id_presenca: req.params.id_presenca, ...req.body });
    }
  );
});

router.delete('/:id_presenca', (req, res) => {
  connection.query('DELETE FROM presenca WHERE id_presenca = ?', [req.params.id_presenca], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
});

module.exports = router;
