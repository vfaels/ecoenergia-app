const express = require('express');
const cors =require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// --- Rotas ---
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes'); 

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// --- Iniciar o Servidor ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor da API rodando na porta ${PORT}`);
});