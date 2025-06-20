const db = require('../config/database');

exports.getConsumptionSummary = async (req, res) => {
  const userId = req.userId;
  try {
    const monthResult = await db.query(
      `SELECT SUM(consumption_kwh) as current_month_kwh
       FROM consumption_history 
       WHERE user_id = $1 
       AND EXTRACT(MONTH FROM record_date) = EXTRACT(MONTH FROM CURRENT_DATE)
       AND EXTRACT(YEAR FROM record_date) = EXTRACT(YEAR FROM CURRENT_DATE)`,
      [userId]
    );

    const comparisonResult = await db.query(
      `SELECT 
         EXTRACT(MONTH FROM record_date) as month, 
         SUM(consumption_kwh) as total_kwh
       FROM consumption_history
       WHERE user_id = $1 AND record_date >= CURRENT_DATE - INTERVAL '3 months'
       GROUP BY EXTRACT(MONTH FROM record_date)
       ORDER BY month DESC`,
      [userId]
    );

    const summary = {
      current_month_kwh: parseFloat(monthResult.rows[0].current_month_kwh || 0),
      monthly_comparison: comparisonResult.rows
    };

    res.status(200).send(summary);
  } catch (error) {
    console.error('Erro ao buscar resumo de consumo:', error);
    res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};

exports.getFullHistory = async (req, res) => {
  const userId = req.userId;
  const period = req.query.period; 

  let dateCondition = "";

  if (period === '7d') {
    dateCondition = "record_date >= CURRENT_DATE - INTERVAL '6 days'";
  } else if (period === '30d') {
    dateCondition = "record_date >= CURRENT_DATE - INTERVAL '29 days'";
  } else if (period === 'this_month') {
    dateCondition = `
      EXTRACT(MONTH FROM record_date) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM record_date) = EXTRACT(YEAR FROM CURRENT_DATE)
    `;
  } else {
    dateCondition = "record_date >= CURRENT_DATE - INTERVAL '29 days'";
  }

  try {
    const { rows } = await db.query(
      `SELECT 
         TO_CHAR(record_date, 'YYYY-MM-DD') as date, 
         consumption_kwh as kwh 
       FROM consumption_history 
       WHERE user_id = $1 AND ${dateCondition} 
       ORDER BY record_date ASC`,
      [userId]
    );

    res.status(200).send(rows);
  } catch (error) {
    console.error('Erro ao buscar histórico completo:', error);
    res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};
