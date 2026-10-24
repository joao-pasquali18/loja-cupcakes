const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/cadastro', authController.cadastrar);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/eu', authController.usuarioAtual);

module.exports = router;