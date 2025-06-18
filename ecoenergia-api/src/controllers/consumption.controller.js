const db = require('../config/database');

exports.getConsumptionSummary = async (req, res) => {
  const userId = req.userId;

  try {
    const todayResult = await db.query(
      'SELECT consumption_kwh FROM consumption_history WHERE user_id = $1 AND record_date = CURRENT_DATE',
      [userId]
    );
    const today_kwh = todayResult.rows.length > 0 ? todayResult.rows[0].consumption_kwh : 0;

    const last7DaysResult = await db.query(
      `SELECT 
         record_date as date,
         consumption_kwh as consumo 
       FROM consumption_history 
       WHERE user_id = $1 AND record_date >= CURRENT_DATE - INTERVAL '6 days' 
       ORDER BY record_date ASC`,
      [userId]
    );

    const response = {
      today_kwh: parseFloat(today_kwh),
      last_7_days: last7DaysResult.rows,
    };

    res.status(200).send(response);

  } catch (error) {
    console.error('Erro ao buscar resumo de consumo:', error);
    res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};

exports.getFullHistory = async (req, res) => {
  const userId = req.userId;
  try {
    const { rows } = await db.query(
      `SELECT 
         TO_CHAR(record_date, 'YYYY-MM-DD') as date, 
         consumption_kwh as kwh 
       FROM consumption_history 
       WHERE user_id = $1 AND record_date >= CURRENT_DATE - INTERVAL '29 days' 
       ORDER BY record_date ASC`,
      [userId]
    );
    res.status(200).send(rows);
  } catch (error) {
    console.error('Erro ao buscar histórico completo:', error);
    res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};