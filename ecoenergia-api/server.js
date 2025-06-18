const express = require('express');
const cors =require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes'); 
const tipRoutes = require('./src/routes/tip.routes');
const residenceRoutes = require('./src/routes/residence.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tips', tipRoutes);
app.use('/api/residence', residenceRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor da API rodando na porta ${PORT}`);
});