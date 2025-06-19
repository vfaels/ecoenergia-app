const db = require('../config/database');

exports.getResidenceData = async (req, res) => {
  const userId = req.userId; 

  try {
    const { rows } = await db.query('SELECT residents, rooms, kwh_cost, monthly_goal_kwh FROM residences WHERE user_id = $1', [userId]);

    if (rows.length === 0) {
      return res.status(404).send({ message: 'Dados de residência não encontrados para este usuário.' });
    }

    res.status(200).send(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar dados da residência:', error);
    res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};

exports.updateResidenceSettings = async (req, res) => {
    const userId = req.userId;
    const { residents, rooms, kwh_cost } = req.body;

    if (residents === undefined || rooms === undefined || kwh_cost === undefined) {
        return res.status(400).send({ message: 'Todos os campos (moradores, cômodos, custo por kWh) são obrigatórios.' });
    }

    try {
        const { rows } = await db.query(
            'UPDATE residences SET residents = $1, rooms = $2, kwh_cost = $3 WHERE user_id = $4 RETURNING *',
            [residents, rooms, kwh_cost, userId]
        );

        if (rows.length === 0) {
            return res.status(404).send({ message: 'Residência não encontrada para este usuário.' });
        }

        res.status(200).send({ message: 'Dados da residência atualizados com sucesso!', residence: rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar dados da residência:', error);
        res.status(500).send({ message: 'Erro interno do servidor.' });
    }
};