const db = require('../config/database');

// Esta função só será acessada por usuários autenticados
exports.getUserProfile = async (req, res) => {
  try {
    // Pegamos o ID do usuário que foi adicionado ao 'req' pelo nosso middleware
    const userId = req.userId;

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