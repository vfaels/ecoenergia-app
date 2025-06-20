const db = require('../config/database');

exports.getTips = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM tips ORDER BY category, title');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar dicas.' });
  }
};

exports.createTip = async (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const { rows } = await db.query(
      'INSERT INTO tips (title, description, category) VALUES ($1, $2, $3) RETURNING *',
      [title, description, category]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erro ao criar dica:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};