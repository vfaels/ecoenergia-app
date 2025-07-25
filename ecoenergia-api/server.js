const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'http://localhost:5173',
  'https://snack-web-player.s3.us-west-1.amazonaws.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes'); 
const tipRoutes = require('./src/routes/tip.routes');
const residenceRoutes = require('./src/routes/residence.routes');
const consumptionRoutes = require('./src/routes/consumption.routes');
const applianceRoutes = require('./src/routes/appliance.routes.js');
const notificationRoutes = require('./src/routes/notification.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tips', tipRoutes);
app.use('/api/residence', residenceRoutes);
app.use('/api/consumption', consumptionRoutes);
app.use('/api/appliances', applianceRoutes);
app.use('/api/notifications', notificationRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor da API rodando na porta ${PORT}`);
});