const express = require('express');
const pedidoController = require('../controllers/pedidoController');
const { exigirLogin } = require('../middlewares/autenticacao');

const router = express.Router();

router.use(exigirLogin);

router.get('/', pedidoController.listar);
router.post('/', pedidoController.criar);

module.exports = router;