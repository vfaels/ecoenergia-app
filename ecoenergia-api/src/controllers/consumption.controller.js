const db = require('../db');


exports.getConsumptionSummary = async (req, res) => {
  const userId = req.userId;
  const query = `
    SELECT 
      SUM(consumption_kwh) as total_kwh,
      AVG(consumption_kwh) as daily_avg_kwh,
      (SELECT kwh_cost FROM residences WHERE user_id = $1) as kwh_cost
    FROM 
      consumption_history
    WHERE 
      user_id = $1 
      AND record_date >= (SELECT MAX(record_date) FROM consumption_history WHERE user_id = $1) - INTERVAL '29 days';
  `;

  try {
    const { rows } = await db.query(query, [userId]);
    const summary = rows[0];
    const totalCost = summary.total_kwh * summary.kwh_cost;

    res.status(200).send({
      totalKwh: parseFloat(summary.total_kwh) || 0,
      dailyAverageKwh: parseFloat(summary.daily_avg_kwh) || 0,
      totalCost: totalCost || 0,
    });
  } catch (error) {
    console.error('Erro ao buscar o resumo de consumo:', error);
    res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};

exports.getFullHistory = async (req, res) => {
  const userId = req.userId;
  const period = req.query.period || '30d'; 

  let query;
  const queryParams = [userId];

  const referenceDateQuery = `(SELECT MAX(record_date) FROM consumption_history WHERE user_id = $1)`;

  switch (period) {
    case '7d':
      query = `SELECT TO_CHAR(record_date, 'YYYY-MM-DD') as date, consumption_kwh as kwh 
               FROM consumption_history 
               WHERE user_id = $1 AND record_date >= ${referenceDateQuery} - INTERVAL '6 days'
               ORDER BY record_date ASC`;
      break;

    case 'this_month':
      query = `SELECT TO_CHAR(record_date, 'YYYY-MM-DD') as date, consumption_kwh as kwh 
               FROM consumption_history 
               WHERE user_id = $1 
               AND EXTRACT(MONTH FROM record_date) = EXTRACT(MONTH FROM ${referenceDateQuery})
               AND EXTRACT(YEAR FROM record_date) = EXTRACT(YEAR FROM ${referenceDateQuery})
               ORDER BY record_date ASC`;
      break;
      
    case '30d':
    default:
      query = `SELECT TO_CHAR(record_date, 'YYYY-MM-DD') as date, consumption_kwh as kwh 
               FROM consumption_history 
               WHERE user_id = $1 AND record_date >= ${referenceDateQuery} - INTERVAL '29 days'
               ORDER BY record_date ASC`;
      break;
  }

  try {
    const { rows } = await db.query(query, queryParams);
    res.status(200).send(rows);
  } catch (error) {
    console.error(`Erro ao buscar histórico para o período '${period}':`, error);
    res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};