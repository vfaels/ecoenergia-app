// ecoenergia-api/src/middlewares/admin.middleware.js
const db = require('../config/database');

exports.verifyAdmin = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT role FROM users WHERE id = $1', [req.userId]);

    if (rows.length === 0) {
      return res.status(404).send({ message: 'Usuário não encontrado.' });
    }

    if (rows[0].role !== 'ADMIN') {
      return res.status(403).send({ message: 'Acesso negado. Requer privilégios de administrador.' });
    }

    next();
  } catch (error) {
    console.error('Erro na verificação de admin:', error);
    return res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};