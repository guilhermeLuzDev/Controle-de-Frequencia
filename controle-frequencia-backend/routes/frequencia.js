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

// Nova rota para buscar frequência por matrícula do usuário
router.get('/usuario/:matricula_usuario', (req, res) => {
  const matriculaUsuario = req.params.matricula_usuario;
  
  const sql = `
    SELECT 
      p.id_presenca,
      p.data_presenca,
      p.status_presenca,
      p.observacao,
      p.fk_usuario_matricula_usuario,
      DATE_FORMAT(p.data_presenca, '%d/%m/%Y') as data_formatada
    FROM presenca p
    WHERE p.fk_usuario_matricula_usuario = ?
    ORDER BY p.data_presenca DESC
  `;
  
  connection.query(sql, [matriculaUsuario], (err, results) => {
    if (err) {
      console.error('Erro ao buscar frequência do usuário:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Nova rota para buscar informações da bolsa e horas cumpridas por matrícula
router.get('/resumo/:matricula_usuario', (req, res) => {
  const matriculaUsuario = req.params.matricula_usuario;
  console.log('Buscando resumo para matrícula:', matriculaUsuario);
  
  const sql = `
    SELECT 
      u.matricula_usuario,
      u.nome_usuario,
      b.id_bolsa,
      b.nome_bolsa,
      b.carga_horaria,
      b.tipo_bolsa,
      COALESCE(SUM(CASE WHEN p.status_presenca = 'presente' THEN 1 ELSE 0 END), 0) as dias_presente,
      COALESCE(SUM(CASE WHEN p.status_presenca = 'ausente' THEN 1 ELSE 0 END), 0) as dias_ausente,
      COALESCE(SUM(CASE WHEN p.status_presenca = 'justificado' THEN 1 ELSE 0 END), 0) as dias_justificado,
      COUNT(p.id_presenca) as total_registros
    FROM usuario u
    LEFT JOIN bolsa b ON u.fk_bolsa_id = b.id_bolsa
    LEFT JOIN presenca p ON u.matricula_usuario = p.fk_usuario_matricula_usuario
    WHERE u.matricula_usuario = ?
    GROUP BY u.matricula_usuario, u.nome_usuario, b.id_bolsa, b.nome_bolsa, b.carga_horaria, b.tipo_bolsa
  `;
  
  console.log('Executando SQL:', sql);
  console.log('Parâmetros:', [matriculaUsuario]);
  
  connection.query(sql, [matriculaUsuario], (err, results) => {
    if (err) {
      console.error('Erro ao buscar resumo da frequência:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('Resultados da consulta:', results);
    
    if (results.length === 0) {
      console.log('Nenhum resultado encontrado para matrícula:', matriculaUsuario);
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    const resumo = results[0];
    const horasCumpridas = resumo.dias_presente * 4; // Assumindo 4 horas por dia
    const percentual = resumo.carga_horaria > 0 ? Math.round((horasCumpridas / resumo.carga_horaria) * 100) : 0;
    
    const respostaFinal = {
      ...resumo,
      horas_cumpridas: horasCumpridas,
      percentual: percentual
    };
    
    console.log('Resposta final:', respostaFinal);
    
    res.json(respostaFinal);
  });
});

module.exports = router;
