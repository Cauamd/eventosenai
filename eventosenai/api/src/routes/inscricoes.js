const router = require('express').Router();
const db = require('../db');

// POST /inscricoes  { evento_id, participante_id }
router.post('/', async (req, res) => {
  const { evento_id, participante_id } = req.body;
  if (!evento_id || !participante_id) {
    return res.status(400).json({ erro: 'evento_id e participante_id são obrigatórios' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // trava a linha do evento para evitar corrida na checagem de vagas
    const [ev] = await conn.query('SELECT id, vagas FROM eventos WHERE id = ? FOR UPDATE', [evento_id]);
    if (ev.length === 0) {
      await conn.rollback();
      return res.status(400).json({ erro: 'Evento inexistente' });
    }
    const [pa] = await conn.query('SELECT id FROM participantes WHERE id = ?', [participante_id]);
    if (pa.length === 0) {
      await conn.rollback();
      return res.status(400).json({ erro: 'Participante inexistente' });
    }

    const [[{ total }]] = await conn.query(
      'SELECT COUNT(*) AS total FROM inscricoes WHERE evento_id = ?', [evento_id]);
    if (total >= ev[0].vagas) {
      await conn.rollback();
      return res.status(409).json({ erro: 'Evento lotado' });
    }

    const [result] = await conn.query(
      'INSERT INTO inscricoes (evento_id, participante_id) VALUES (?, ?)',
      [evento_id, participante_id]);
    await conn.commit();
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    await conn.rollback();
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ erro: 'Participante já inscrito neste evento' });
    res.status(500).json({ erro: 'Erro ao realizar inscrição' });
  } finally {
    conn.release();
  }
});

// DELETE /inscricoes/:id
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM inscricoes WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Inscrição não encontrada' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cancelar inscrição' });
  }
});

module.exports = router;
