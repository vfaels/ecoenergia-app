exports.getFullHistory = async (req, res) => {
  const userId = req.userId;
  const period = req.query.period || '30d'; 

  let query;
  const queryParams = [userId];

  switch (period) {
    case '7d':
      query = `SELECT TO_CHAR(record_date, 'YYYY-MM-DD') as date, consumption_kwh as kwh 
               FROM consumption_history 
               WHERE user_id = $1 AND record_date >= CURRENT_DATE - INTERVAL '6 days'
               ORDER BY record_date ASC`;
      break;

    case 'this_month':
      query = `SELECT TO_CHAR(record_date, 'YYYY-MM-DD') as date, consumption_kwh as kwh 
               FROM consumption_history 
               WHERE user_id = $1 
               AND EXTRACT(MONTH FROM record_date) = EXTRACT(MONTH FROM CURRENT_DATE)
               AND EXTRACT(YEAR FROM record_date) = EXTRACT(YEAR FROM CURRENT_DATE)
               ORDER BY record_date ASC`;
      break;
      
    case '30d':
    default:
      query = `SELECT TO_CHAR(record_date, 'YYYY-MM-DD') as date, consumption_kwh as kwh 
               FROM consumption_history 
               WHERE user_id = $1 AND record_date >= CURRENT_DATE - INTERVAL '29 days'
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