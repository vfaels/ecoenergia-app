const db = require('../config/database');

exports.getAllTips = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM tips ORDER BY id');
    res.status(200).send(rows);
  } catch (error) {
    console.error('Erro ao buscar dicas:', error);
    res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};