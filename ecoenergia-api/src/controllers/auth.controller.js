const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({ message: 'Por favor, preencha todos os campos.' });
  }

  try {
    const { rows } = await db.query('SELECT email FROM users WHERE email = $1', [email]);
    if (rows.length > 0) {
      return res.status(409).send({ message: 'Este e-mail já está em uso.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const { rows: newUserRows } = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role',
      [name, email, hashedPassword]
    );

    return res.status(201).send({
      message: 'Usuário registrado com sucesso!',
      user: newUserRows[0],
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).send({ message: 'Erro interno do servidor.' });
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

    const result = await db.query(
    'SELECT id, name, email, password, role, avatar_url FROM users WHERE email = $1', 
    [email]
  );

    const payload = {
      id: user.id,
      role: user.role,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' } 
    );

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