const db = require('../database');

const inserirPedido = db.prepare(
  'INSERT INTO pedidos (usuario_id, endereco, forma_pagamento, total) VALUES (?, ?, ?, ?)'
);
const inserirItem = db.prepare(
  'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)'
);

const criar = db.transaction((usuarioId, endereco, formaPagamento, itens, total) => {
  const resultado = inserirPedido.run(usuarioId, endereco, formaPagamento, total);
  const pedidoId = resultado.lastInsertRowid;

  for (const item of itens) {
    inserirItem.run(pedidoId, item.produto_id, item.quantidade, item.preco_unitario);
  }

  return pedidoId;
});

function listarPorUsuario(usuarioId) {
  const pedidos = db
    .prepare(
      'SELECT id, endereco, forma_pagamento, total, criado_em FROM pedidos WHERE usuario_id = ? ORDER BY id DESC'
    )
    .all(usuarioId);

  const buscarItens = db.prepare(`
    SELECT ip.quantidade, ip.preco_unitario, p.nome
    FROM itens_pedido ip
    JOIN produtos p ON p.id = ip.produto_id
    WHERE ip.pedido_id = ?
  `);

  return pedidos.map((pedido) => ({ ...pedido, itens: buscarItens.all(pedido.id) }));
}

module.exports = { criar, listarPorUsuario };