const db = require('../config/database');

exports.getConsumptionSummary = async (req, res) => {
  const userId = req.userId;
  try {
    const monthResult = await db.query(
      `SELECT SUM(ch.consumption_kwh) as current_month_kwh
       FROM consumption_history ch
       JOIN residences r ON ch.residence_id = r.id
       WHERE r.user_id = $1 
       AND EXTRACT(MONTH FROM ch.record_date) = EXTRACT(MONTH FROM CURRENT_DATE)
       AND EXTRACT(YEAR FROM ch.record_date) = EXTRACT(YEAR FROM CURRENT_DATE)`,
      [userId]
    );

    const comparisonResult = await db.query(
      `SELECT 
         EXTRACT(MONTH FROM ch.record_date) as month, 
         SUM(ch.consumption_kwh) as total_kwh
       FROM consumption_history ch
       JOIN residences r ON ch.residence_id = r.id
       WHERE r.user_id = $1 AND ch.record_date >= CURRENT_DATE - INTERVAL '3 months'
       GROUP BY EXTRACT(MONTH FROM ch.record_date)
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
  try {
    const { rows } = await db.query(
      `SELECT 
         TO_CHAR(ch.record_date, 'YYYY-MM-DD') as date, 
         ch.consumption_kwh as kwh 
       FROM consumption_history ch
       JOIN residences r ON ch.residence_id = r.id
       WHERE r.user_id = $1 AND ch.record_date >= CURRENT_DATE - INTERVAL '29 days' 
       ORDER BY ch.record_date ASC`,
      [userId]
    );
    res.status(200).send(rows);
  } catch (error) {
    console.error('Erro ao buscar histórico completo:', error);
    res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};

const createNotification = async (userId, type, message) => {
  const today = new Date().toISOString().slice(0, 10);
  const { rows } = await db.query(
    "SELECT 1 FROM notifications WHERE user_id = $1 AND type = $2 AND DATE(created_at) = $3",
    [userId, type, today]
  );

  if (rows.length === 0) {
    await db.query(
      'INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3)',
      [userId, type, message]
    );
  }
};

exports.addConsumption = async (req, res) => {
  const userId = req.userId;
  const { residence_id, date, consumption } = req.body;

  try {
    await db.query(
      'INSERT INTO consumptions (residence_id, date, consumption) VALUES ($1, $2, $3)',
      [residence_id, date, consumption]
    );

    const { rows: residenceRows } = await db.query('SELECT monthly_goal FROM residences WHERE id = $1 AND user_id = $2', [residence_id, userId]);
    const monthlyGoal = residenceRows[0]?.monthly_goal;

    if (monthlyGoal) {
      const startOfMonth = new Date(new Date(date).getFullYear(), new Date(date).getMonth(), 1);
      const { rows: consumptionRows } = await db.query(
        'SELECT SUM(consumption) as total FROM consumptions WHERE residence_id = $1 AND date >= $2',
        [residence_id, startOfMonth]
      );
      const totalMonthlyConsumption = consumptionRows[0].total || 0;

      if (totalMonthlyConsumption > monthlyGoal) {
        await createNotification(userId, 'GOAL_EXCEEDED', `Atenção! Você ultrapassou sua meta de consumo de ${monthlyGoal} kWh este mês.`);
      } 
      else if (totalMonthlyConsumption >= monthlyGoal * 0.8) {
        await createNotification(userId, 'GOAL_WARNING', `Você está perto de atingir sua meta de consumo mensal. Consumo atual: ${totalMonthlyConsumption.toFixed(1)} kWh.`);
      }
    }

    res.status(201).send({ message: 'Consumo adicionado com sucesso.' });
  } catch (error) {
    console.error('Erro ao buscar notificações existentes:', error);
    res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};