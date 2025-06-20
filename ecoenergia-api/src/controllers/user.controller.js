const db = require('../config/database');
const fs = require('fs').promises; 
const path = require('path');

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { rows } = await db.query(
      'SELECT id, name, email, role, avatar_url FROM users WHERE id = $1',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).send({ message: 'Usuário não encontrado.' });
    }

    res.status(200).send(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.file) {
      return res.status(400).send({ message: 'Nenhum arquivo foi enviado.' });
    }

    const { filename } = req.file;
    const avatar_url = `${req.protocol}://${req.get('host')}/uploads/${filename}`;

    const { rows } = await db.query(
      'UPDATE users SET avatar_url = $1 WHERE id = $2 RETURNING avatar_url',
      [avatar_url, userId]
    );

    if (rows.length === 0) {
      return res.status(404).send({ message: 'Usuário não encontrado.' });
    }

    res.status(200).send({ avatar_url: rows[0].avatar_url });
  } catch (error) {
    console.error('Erro ao atualizar avatar:', error);
    res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).send({ message: 'Nome e email são obrigatórios.' });
    }

    const { rows } = await db.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role, avatar_url',
      [name, email, userId]
    );

    if (rows.length === 0) {
      return res.status(404).send({ message: 'Usuário não encontrado.' });
    }

    res.status(200).send(rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário:', error);
    if (error.code === '23505') {
      return res.status(409).send({ message: 'Este email já está em uso por outra conta.' });
    }
    res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};

exports.removeAvatar = async (req, res) => {
  const userId = req.userId;

  try {

    const { rows: userRows } = await db.query('SELECT avatar_url FROM users WHERE id = $1', [userId]);

    if (userRows.length === 0) {
      return res.status(404).send({ message: 'Usuário não encontrado.' });
    }

    const currentAvatarUrl = userRows[0].avatar_url;

    if (!currentAvatarUrl) {
      return res.status(200).send(userRows[0]);
    }

    try {
        const filename = path.basename(currentAvatarUrl);
        const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
        await fs.unlink(filePath); 
        console.log(`Arquivo de avatar removido: ${filePath}`);
    } catch (fileError) {

        console.error("Arquivo de avatar não encontrado para deleção, mas o processo continuará:", fileError.message);
    }

    const { rows: updatedUserRows } = await db.query(
      'UPDATE users SET avatar_url = NULL WHERE id = $1 RETURNING id, name, email, role, avatar_url',
      [userId]
    );

    res.status(200).send(updatedUserRows[0]);

  } catch (dbError) {
    console.error('Erro de banco de dados ao remover avatar:', dbError);
    res.status(500).send({ message: 'Erro interno do servidor ao remover avatar.' });
  }
};