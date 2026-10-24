const express = require('express');
const session = require('express-session');
const path = require('path');
const produtoRoutes = require('./routes/produtoRoutes');
const authRoutes = require('./routes/authRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'segredo-de-desenvolvimento',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 8, // 8 horas
    },
  })
);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/produtos', produtoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidoRoutes);

module.exports = app;