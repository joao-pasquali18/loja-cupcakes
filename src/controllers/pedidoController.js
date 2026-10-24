const pedidoModel = require('../models/pedidoModel');
const produtoModel = require('../models/produtoModel');

const FORMAS_PAGAMENTO = ['pix', 'cartao', 'dinheiro'];

function criar(req, res) {
  try {
    const { endereco = '', forma_pagamento = '', itens } = req.body || {};
    const enderecoLimpo = String(endereco).trim();

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ erro: 'Seu carrinho está vazio.' });
    }
    if (!enderecoLimpo) {
      return res.status(400).json({ erro: 'Preencha os dados de entrega.' });
    }
    if (!FORMAS_PAGAMENTO.includes(forma_pagamento)) {
      return res.status(400).json({ erro: 'Escolha uma forma de pagamento.' });
    }

    // Busca o preço de cada produto no banco (não confia no preço enviado pelo navegador)
    const itensValidados = [];
    for (const item of itens) {
      const quantidade = Number(item.quantidade);
      const produto = produtoModel.buscarPorId(Number(item.produto_id));

      if (!produto || !Number.isInteger(quantidade) || quantidade < 1 || quantidade > 99) {
        return res.status(400).json({
          erro: 'O carrinho contém itens inválidos. Atualize a página e tente novamente.',
        });
      }

      itensValidados.push({ produto_id: produto.id, quantidade, preco_unitario: produto.preco });
    }

    const soma = itensValidados.reduce((total, i) => total + i.preco_unitario * i.quantidade, 0);
    const total = Math.round(soma * 100) / 100;

    const pedidoId = pedidoModel.criar(
      req.session.usuario.id,
      enderecoLimpo,
      forma_pagamento,
      itensValidados,
      total
    );

    res.status(201).json({ id: pedidoId, total });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Não foi possível registrar o pedido.' });
  }
}

function listar(req, res) {
  try {
    res.json(pedidoModel.listarPorUsuario(req.session.usuario.id));
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Não foi possível carregar os pedidos.' });
  }
}

module.exports = { criar, listar };