const db = require('../config/database');
const supabase = require('../config/supabase');

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
        return res.status(400).send({ message: 'Nenhum arquivo enviado.' });
    }

    try {
        const { rows: userRows } = await db.query('SELECT avatar_url FROM users WHERE id = $1', [userId]);
        const currentAvatarUrl = userRows[0]?.avatar_url;

        if (currentAvatarUrl) {
            const oldFileName = currentAvatarUrl.split('/').pop();

            try {
                await supabase.storage.from('avatars').remove([oldFileName]);
            } catch (removeError) {
                console.warn("Aviso: Falha ao tentar remover o avatar antigo.", removeError.message);
            }
        }

        const file = req.file;
        const fileName = `${userId}-${Date.now()}-${file.originalname}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
            });

        if (uploadError) {
            throw new Error(`Erro do Supabase ao fazer upload: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        let avatar_url = publicUrlData.publicUrl;
        if (avatar_url.startsWith('http://')) {
            avatar_url = avatar_url.replace('http://', 'https://');
        }

        const { rows: updatedUser } = await db.query(
            'UPDATE users SET avatar_url = $1 WHERE id = $2 RETURNING avatar_url',
            [avatar_url, userId]
        );
            
        res.status(200).send({ avatar_url: updatedUser[0].avatar_url });

    } catch (error) {
        console.error('Erro no processo de atualização do avatar:', error);
        res.status(500).send({ message: 'Erro interno do servidor ao fazer upload.' });
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
        const currentAvatarUrl = userRows[0]?.avatar_url;

        if (currentAvatarUrl) {
            const fileName = currentAvatarUrl.split('/').pop();
            await supabase.storage.from('avatars').remove([fileName]);
        }

        const { rows: updatedUserRows } = await db.query(
            'UPDATE users SET avatar_url = NULL WHERE id = $1 RETURNING *',
            [userId]
        );

        delete updatedUserRows[0].password;
        res.status(200).send(updatedUserRows[0]);

    } catch (error) {
        console.error('Erro ao remover avatar:', error);
        res.status(500).send({ message: 'Erro interno do servidor.' });
    }
};