const express = require('express');
const router = express.Router();
const connection = require('../db');

router.get('/', (req, res) => {
  connection.query('SELECT * FROM usuario', (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

router.post('/', (req, res) => {
  
  const { nome_usuario, email, senha, tipo_usuario, matricula_usuario, fk_bolsa_id } = req.body;

  
  const sql = 'INSERT INTO usuario (matricula_usuario, nome_usuario, email, senha, tipo_usuario, fk_bolsa_id) VALUES (?, ?, ?, ?, ?, ?)';
  const params = [matricula_usuario, nome_usuario, email, senha, tipo_usuario, tipo_usuario === 'bolsista' || tipo_usuario === 'professor' || tipo_usuario === 'coordenador' ? fk_bolsa_id : null]; 

  connection.query(sql, params, (err, result) => {
    if (err) {
      console.error('Erro ao inserir usuário:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ matricula_usuario, nome_usuario, email, senha, tipo_usuario, fk_bolsa_id });
  });
});

router.get('/:matricula_usuario', (req, res) => {
  connection.query('SELECT * FROM usuario WHERE matricula_usuario = ?', [req.params.matricula_usuario], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário por matrícula:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(results[0]);
  });
});

router.put('/:matricula_usuario', (req, res) => {
  
  const { nome_usuario, email, senha, tipo_usuario, fk_bolsa_id } = req.body;
  
 
  const sql = 'UPDATE usuario SET nome_usuario=?, email=?, senha=?, tipo_usuario=?, fk_bolsa_id=? WHERE matricula_usuario=?';
  const params = [nome_usuario, email, senha, tipo_usuario, tipo_usuario === 'bolsista' || tipo_usuario === 'professor' || tipo_usuario === 'coordenador' ? fk_bolsa_id : null, req.params.matricula_usuario]; 

  connection.query(sql, params, (err) => {
    if (err) {
      console.error('Erro ao atualizar usuário:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ matricula_usuario: req.params.matricula_usuario, nome_usuario, email, senha, tipo_usuario: tipo_usuario, fk_bolsa_id });
  });
});

router.delete('/:matricula_usuario', (req, res) => {
  connection.query('DELETE FROM usuario WHERE matricula_usuario = ?', [req.params.matricula_usuario], (err) => {
    if (err) {
      console.error('Erro ao deletar usuário:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(204).send();
  });
});


router.get('/por-professor/:matricula_professor_responsavel', (req, res) => {
  const matriculaProfessorResponsavel = req.params.matricula_professor_responsavel;

  const sql = `
    SELECT
      u.matricula_usuario,
      u.nome_usuario,
      u.email,
      b.nome_bolsa AS nome_bolsa_vinculada,
      b.carga_horaria
    FROM
      usuario u
    JOIN
      bolsa b ON u.fk_bolsa_id = b.id_bolsa
    WHERE
      b.fk_usuario_matricula_responsavel = ? AND u.tipo_usuario = 'bolsista';
  `;

  connection.query(sql, [matriculaProfessorResponsavel], (err, results) => {
    if (err) {
      console.error('Erro ao buscar bolsistas por professor responsável:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});



router.get('/por-bolsa/:id_bolsa', (req, res) => {
  const idBolsa = req.params.id_bolsa;

  const sql = `
    SELECT
      u.matricula_usuario,
      u.nome_usuario,
      u.email,
      u.tipo_usuario
    FROM
      usuario u
    WHERE
      u.fk_bolsa_id = ? AND u.tipo_usuario = 'bolsista';
  `;

  connection.query(sql, [idBolsa], (err, results) => {
    if (err) {
      console.error('Erro ao buscar bolsistas por bolsa:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

module.exports = router;