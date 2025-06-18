const express = require('express');
const router = express.Router();
const connection = require('../db');

router.get('/', (req, res) => {
  connection.query('SELECT * FROM usuario', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { nome_usuario, email, senha, po_usuario, matricula_usuario } = req.body;
  connection.query(
    'INSERT INTO usuario (matricula_usuario, nome_usuario, email, senha, po_usuario) VALUES (?, ?, ?, ?, ?)',
    [matricula_usuario, nome_usuario, email, senha, po_usuario],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ matricula_usuario, nome_usuario, email, senha, po_usuario });
    }
  );
});

router.get('/:matricula_usuario', (req, res) => {
  connection.query('SELECT * FROM usuario WHERE matricula_usuario = ?', [req.params.matricula_usuario], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(results[0]);
  });
});

router.put('/:matricula_usuario', (req, res) => {
  const { nome_usuario, email, senha, po_usuario } = req.body;
  connection.query(
    'UPDATE usuario SET nome_usuario=?, email=?, senha=?, po_usuario=? WHERE matricula_usuario=?',
    [nome_usuario, email, senha, po_usuario, req.params.matricula_usuario],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ matricula_usuario: req.params.matricula_usuario, nome_usuario, email, senha, po_usuario });
    }
  );
});

router.delete('/:matricula_usuario', (req, res) => {
  connection.query('DELETE FROM usuario WHERE matricula_usuario = ?', [req.params.matricula_usuario], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
});

module.exports = router;
