const db = require('../config/database');

exports.getResidenceData = async (req, res) => {
  const userId = req.userId; 

  try {
    const { rows } = await db.query('SELECT residents, rooms, kwh_cost FROM residences WHERE user_id = $1', [userId]);

    if (rows.length === 0) {
      return res.status(404).send({ message: 'Dados de residência não encontrados para este usuário.' });
    }

    res.status(200).send(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar dados da residência:', error);
    res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};