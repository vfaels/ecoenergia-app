const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).send({ message: 'Acesso negado: nenhum token fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).send({ message: 'Acesso negado: token mal formatado.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Acesso não autorizado: token inválido ou expirado.' });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  });
};

module.exports = { verifyToken };