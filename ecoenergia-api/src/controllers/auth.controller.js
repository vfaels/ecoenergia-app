const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({ message: 'Por favor, preencha todos os campos.' });
  }

  const client = await db.getClient();

  try {

    await client.query('BEGIN');

    const { rows: existingUser } = await client.query('SELECT email FROM users WHERE email = $1', [email]);
    if (existingUser.length > 0) {
      throw new Error('Este e-mail já está em uso.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { rows: newUserRows } = await client.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
      [name, email, hashedPassword]
    );
    const newUserId = newUserRows[0].id;

    await client.query(
      'INSERT INTO residences (user_id) VALUES ($1)',
      [newUserId]
    );

    await client.query('COMMIT');

    res.status(201).send({ message: 'Usuário registrado com sucesso!' });

  } catch (error) {
    await client.query('ROLLBACK');
    
    console.error('Erro no registro:', error);
    const message = error.message === 'Este e-mail já está em uso.' 
      ? error.message 
      : 'Erro interno do servidor.';
    res.status(error.message === 'Este e-mail já está em uso.' ? 409 : 500).send({ message });
  } finally {
    client.release();
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Por favor, forneça e-mail e senha.' });
  }

  try {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (rows.length === 0) {
      return res.status(401).send({ message: 'Credenciais inválidas.' });
    }
    
    const user = rows[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).send({ message: 'Credenciais inválidas.' });
    }

    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    delete user.password;

    return res.status(200).send({
      message: 'Login bem-sucedido!',
      user,
      token,
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};