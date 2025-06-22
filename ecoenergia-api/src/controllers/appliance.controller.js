const db = require('../config/database');

exports.getAppliances = async (req, res) => {
  const userId = req.userId;
  try {
    const { rows } = await db.query(
      `SELECT a.* FROM appliances a
       JOIN residences r ON a.residence_id = r.id
       WHERE r.user_id = $1 ORDER BY a.category, a.name`,
      [userId]
    );
    
    const groupedAppliances = rows.reduce((acc, current) => {
      const category = current.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(current);
      return acc;
    }, {});

    res.status(200).send(groupedAppliances);
  } catch (error) {
    console.error('Erro ao buscar aparelhos:', error);
    res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};

exports.addAppliance = async (req, res) => {
  const userId = req.userId;
  const { name, power_watts, category } = req.body;

  if (!name || !power_watts || !category) {
    return res.status(400).send({ message: 'Nome, potência e categoria são obrigatórios.' });
  }

  try {
    const residenceResult = await db.query('SELECT id FROM residences WHERE user_id = $1', [userId]);
    if (residenceResult.rows.length === 0) {
      return res.status(404).send({ message: 'Residência do usuário não encontrada.' });
    }
    const residenceId = residenceResult.rows[0].id;

    const { rows } = await db.query(
      'INSERT INTO appliances (name, power_watts, category, residence_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, power_watts, category, residenceId]
    );
    res.status(201).send({ message: 'Aparelho adicionado com sucesso!', appliance: rows[0] });
  } catch (error) {
    console.error('Erro ao adicionar aparelho:', error);
    res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};

exports.updateAppliance = async (req, res) => {
    const userId = req.userId;
    const applianceId = parseInt(req.params.id, 10);
    const { name, power_watts, category } = req.body;

    if (!name || !power_watts || !category) {
        return res.status(400).send({ message: 'Nome, potência e categoria são obrigatórios.' });
    }

    try {
        const { rows } = await db.query(
            `UPDATE appliances a SET name = $1, power_watts = $2, category = $3
             FROM residences r
             WHERE a.id = $4 AND a.residence_id = r.id AND r.user_id = $5
             RETURNING a.*`,
            [name, power_watts, category, applianceId, userId]
        );

        if (rows.length === 0) {
            return res.status(404).send({ message: 'Aparelho não encontrado ou não pertence a este usuário.' });
        }

        res.status(200).send({ message: 'Aparelho atualizado com sucesso!', appliance: rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar aparelho:', error);
        res.status(500).send({ message: 'Erro interno do servidor.' });
    }
};

exports.deleteAppliance = async (req, res) => {
  const userId = req.userId;
  const applianceId = parseInt(req.params.id, 10);

  if (isNaN(applianceId)) {
    return res.status(400).send({ message: 'ID do aparelho inválido.' });
  }

  try {
    const result = await db.query(
      `DELETE FROM appliances a
       USING residences r
       WHERE a.id = $1 AND a.residence_id = r.id AND r.user_id = $2`,
      [applianceId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send({ message: 'Aparelho não encontrado ou não pertence a este usuário.' });
    }

    res.status(200).send({ message: 'Aparelho deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar aparelho:', error);
    res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};