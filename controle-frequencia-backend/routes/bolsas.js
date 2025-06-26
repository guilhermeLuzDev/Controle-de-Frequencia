const express = require('express');
const router = express.Router();
const connection = require('../db');

router.get('/', (req, res) => {
  connection.query('SELECT * FROM bolsa', (err, results) => {
    if (err) {
      console.error('Erro ao buscar bolsas:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { nome_bolsa, tipo_bolsa, carga_horaria, frequencia_relatorio, fk_usuario_matricula_responsavel } = req.body; // Adicionado fk_usuario_matricula_responsavel
  connection.query(
    'INSERT INTO bolsa (nome_bolsa, tipo_bolsa, carga_horaria, frequencia_relatorio, fk_usuario_matricula_responsavel) VALUES (?, ?, ?, ?, ?)', // Adicionado fk_usuario_matricula_responsavel
    [nome_bolsa, tipo_bolsa, carga_horaria, frequencia_relatorio, fk_usuario_matricula_responsavel],
    (err, result) => {
      if (err) {
        console.error('Erro ao inserir bolsa:', err.message);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id_bolsa: result.insertId, ...req.body });
    }
  );
});

router.get('/:id_bolsa', (req, res) => {
  connection.query('SELECT * FROM bolsa WHERE id_bolsa = ?', [req.params.id_bolsa], (err, results) => {
    if (err) {
      console.error('Erro ao buscar bolsa por ID:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) return res.status(404).json({ error: 'Bolsa não encontrada' });
    res.json(results[0]);
  });
});

router.put('/:id_bolsa', (req, res) => {
  const { nome_bolsa, tipo_bolsa, carga_horaria, frequencia_relatorio, fk_usuario_matricula_responsavel } = req.body; // Adicionado fk_usuario_matricula_responsavel
  connection.query(
    'UPDATE bolsa SET nome_bolsa=?, tipo_bolsa=?, carga_horaria=?, frequencia_relatorio=?, fk_usuario_matricula_responsavel=? WHERE id_bolsa=?', // Adicionado fk_usuario_matricula_responsavel
    [nome_bolsa, tipo_bolsa, carga_horaria, frequencia_relatorio, fk_usuario_matricula_responsavel, req.params.id_bolsa],
    (err) => {
      if (err) {
        console.error('Erro ao atualizar bolsa:', err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id_bolsa: req.params.id_bolsa, ...req.body });
    }
  );
});

router.delete('/:id_bolsa', (req, res) => {
  connection.query('DELETE FROM bolsa WHERE id_bolsa = ?', [req.params.id_bolsa], (err) => {
    if (err) {
      console.error('Erro ao deletar bolsa:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(204).send();
  });
});



module.exports = router;