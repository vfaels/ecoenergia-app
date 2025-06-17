const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Validação simples
  if (!name || !email || !password) {
    return res.status(400).send({ message: 'Por favor, preencha todos os campos.' });
  }

  try {
    // 2. Verificar se o usuário já existe
    const { rows } = await db.query('SELECT email FROM users WHERE email = $1', [email]);
    if (rows.length > 0) {
      return res.status(409).send({ message: 'Este e-mail já está em uso.' });
    }

    // 3. Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Inserir o novo usuário no banco
    const { rows: newUserRows } = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role',
      [name, email, hashedPassword]
    );

    // 5. Enviar resposta de sucesso
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

  // 1. Validação simples
  if (!email || !password) {
    return res.status(400).send({ message: 'Por favor, forneça e-mail e senha.' });
  }

  try {
    // 2. Encontrar o usuário pelo e-mail
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    // Se o usuário não for encontrado
    if (rows.length === 0) {
      // Usamos 401 para não informar se o e-mail existe ou não (mais seguro)
      return res.status(401).send({ message: 'Credenciais inválidas.' });
    }
    
    const user = rows[0];

    // 3. Comparar a senha fornecida com a senha 'hasheada' no banco
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).send({ message: 'Credenciais inválidas.' });
    }

    // 4. Gerar o Token JWT
    const payload = {
      id: user.id,
      role: user.role, // O role é importante para o controle de acesso (Admin vs User)
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token expira em 7 dias
    );
    
    // 5. Enviar resposta de sucesso com o token
    // Removemos a senha da resposta por segurança
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