const produtoModel = require('../models/produtoModel');

function listar(req, res) {
  try {
    const produtos = produtoModel.listarTodos();
    res.json(produtos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Não foi possível carregar os produtos.' });
  }
}

module.exports = { listar };
