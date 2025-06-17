const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // O token virá no cabeçalho (header) da requisição, no formato "Bearer TOKEN"
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).send({ message: 'Acesso negado: nenhum token fornecido.' });
  }

  // O cabeçalho vem como "Bearer TOKEN", então separamos para pegar apenas o token
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).send({ message: 'Acesso negado: token mal formatado.' });
  }

  // Agora, verificamos se o token é válido
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Se o token for inválido ou expirado, o erro será capturado aqui
      return res.status(401).send({ message: 'Acesso não autorizado: token inválido ou expirado.' });
    }

    // Se o token for válido, o 'decoded' conterá o payload ({ id: ..., role: ... })
    // Adicionamos o ID e o role do usuário ao objeto 'req' para que as rotas
    // subsequentes possam usá-lo.
    req.userId = decoded.id;
    req.userRole = decoded.role;

    // Chama a próxima função na cadeia (o controller da rota)
    next();
  });
};

module.exports = { verifyToken };