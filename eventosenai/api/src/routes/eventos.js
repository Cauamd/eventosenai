const router = require('express').Router();
const db = require('../db');

const CAMPOS_OK = (b) => b.titulo && b.data_evento && b.local && b.vagas && b.categoria_id;
const VAGAS_OK = (v) => Number.isInteger(Number(v)) && Number(v) > 0;

// GET /eventos?categoria=2
router.get('/', async (req, res) => {
  try {
    const params = [];
    let where = '';
    if (req.query.categoria) {
      where = 'WHERE e.categoria_id = ?';
      params.push(req.query.categoria);
    }
    const [rows] = await db.query(
      `SELECT e.id, e.titulo, e.descricao, e.data_evento, e.local, e.vagas,
              e.categoria_id, c.nome AS categoria,
              e.vagas - COUNT(i.id) AS vagas_restantes
       FROM eventos e
       JOIN categorias c ON c.id = e.categoria_id
       LEFT JOIN inscricoes i ON i.evento_id = e.id
       ${where}
       GROUP BY e.id
       ORDER BY e.data_evento`, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar eventos' });
  }
});

// GET /eventos/:id/inscritos
router.get('/:id/inscritos', async (req, res) => {
  try {
    const [ev] = await db.query('SELECT id FROM eventos WHERE id = ?', [req.params.id]);
    if (ev.length === 0) return res.status(404).json({ erro: 'Evento não encontrado' });
    const [rows] = await db.query(
      `SELECT p.id, p.nome, p.email, p.turma, i.id AS inscricao_id, i.data_inscricao
       FROM inscricoes i
       JOIN participantes p ON p.id = i.participante_id
       WHERE i.evento_id = ?
       ORDER BY p.nome`, [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar inscritos' });
  }
});

// GET /eventos/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT e.id, e.titulo, e.descricao, e.data_evento, e.local, e.vagas,
              e.categoria_id, c.nome AS categoria,
              e.vagas - COUNT(i.id) AS vagas_restantes
       FROM eventos e
       JOIN categorias c ON c.id = e.categoria_id
       LEFT JOIN inscricoes i ON i.evento_id = e.id
       WHERE e.id = ?
       GROUP BY e.id`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ erro: 'Evento não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar evento' });
  }
});

// POST /eventos
router.post('/', async (req, res) => {
  const { titulo, descricao, data_evento, local, vagas, categoria_id } = req.body;
  if (!CAMPOS_OK(req.body) || !VAGAS_OK(vagas)) {
    return res.status(400).json({ erro: 'Campos obrigatórios faltando ou vagas inválidas' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO eventos (titulo, descricao, data_evento, local, vagas, categoria_id) VALUES (?, ?, ?, ?, ?, ?)',
      [titulo, descricao, data_evento, local, vagas, categoria_id]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ erro: 'Categoria inexistente' });
    res.status(500).json({ erro: 'Erro ao criar evento' });
  }
});

// PUT /eventos/:id
router.put('/:id', async (req, res) => {
  const { titulo, descricao, data_evento, local, vagas, categoria_id } = req.body;
  if (!CAMPOS_OK(req.body) || !VAGAS_OK(vagas)) {
    return res.status(400).json({ erro: 'Campos obrigatórios faltando ou vagas inválidas' });
  }
  try {
    const [result] = await db.query(
      `UPDATE eventos SET titulo = ?, descricao = ?, data_evento = ?, local = ?, vagas = ?, categoria_id = ?
       WHERE id = ?`,
      [titulo, descricao, data_evento, local, vagas, categoria_id, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Evento não encontrado' });
    res.json({ id: Number(req.params.id) });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ erro: 'Categoria inexistente' });
    res.status(500).json({ erro: 'Erro ao atualizar evento' });
  }
});

// DELETE /eventos/:id
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM eventos WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Evento não encontrado' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover evento' });
  }
});

module.exports = router;
