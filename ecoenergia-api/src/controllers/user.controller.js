const db = require('../config/database');
const fs = require('fs'); 
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
  const userId = req.userId;

  if (!req.file) {
    return res.status(400).send({ message: 'Nenhum arquivo foi enviado.' });
  }

  const { filename } = req.file;
  const avatar_url = `${req.protocol}://${req.get('host')}/uploads/${filename}`;

  try {
    const { rows } = await db.query(
      'UPDATE users SET avatar_url = $1 WHERE id = $2 RETURNING avatar_url',
      [avatar_url, userId]
    );

    if (rows.length === 0) {
      return res.status(404).send({ message: 'Usuário não encontrado ao tentar atualizar avatar.' });
    }

    res.status(200).send({ avatar_url: rows[0].avatar_url });
  } catch (error) {
    console.error('Erro ao atualizar avatar:', error);
    res.status(500).send({ message: 'Erro interno do servidor ao atualizar avatar.' });
  }
};

exports.updateUserProfile = async (req, res) => {
  const userId = req.userId;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).send({ message: 'Nome e email são obrigatórios.' });
  }

  try {
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
  try {
    const userId = req.userId;

    const { rows: userRows } = await db.query(
      'SELECT avatar_url FROM users WHERE id = $1',
      [userId]
    );

    const currentAvatarUrl = userRows[0]?.avatar_url;

    const { rows: updatedUserRows } = await db.query(
      'UPDATE users SET avatar_url = NULL WHERE id = $1 RETURNING id, name, email, role, avatar_url',
      [userId]
    );

    if (currentAvatarUrl) {
      const filename = path.basename(currentAvatarUrl);
      const filePath = path.join(__dirname, '..', '..', 'uploads', filename);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Falha ao apagar o arquivo do avatar: ${filePath}`, err);
        } else {
          console.log(`Arquivo de avatar removido com sucesso: ${filePath}`);
        }
      });
    }

    res.status(200).send(updatedUserRows[0]);
  } catch (error) {
    console.error('Erro ao remover avatar:', error);
    res.status(500).send({ message: 'Erro interno do servidor ao remover avatar.' });
  }
};