const db = require('../config/database');

exports.getUserProfile = async (req, res) => {
  
  try {
    const userId = req.userId;
    const query = 'SELECT id, name, email, role, avatar_url FROM users WHERE id = $1';

    const { rows } = await db.query(
      'SELECT id, name, email, role FROM users WHERE id = $1',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).send({ message: 'Usuário não encontrado.' });
    }

    const user = rows[0];
    return res.status(200).send(user);

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};

exports.updateAvatar = async (req, res) => {
  const userId = req.userId;

  if (!req.file) {
    return res.status(400).send({ message: 'Nenhum arquivo enviado.' });
  }

  const { filename } = req.file;
  const avatar_url = `${req.protocol}://${req.get('host')}/uploads/${filename}`;

  try {
    const result = await db.query(
      'UPDATE users SET avatar_url = $1 WHERE id = $2 RETURNING avatar_url',
      [avatar_url, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'Usuário não encontrado.' });
    }

    res.status(200).send({ avatar_url: result.rows[0].avatar_url });
  } catch (error) {
    console.error('Erro ao atualizar avatar:', error);
    res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};