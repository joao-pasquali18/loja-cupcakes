const db = require('../database');

function listarTodos() {
  return db.prepare('SELECT * FROM produtos ORDER BY nome').all();
}

function buscarPorId(id) {
  return db.prepare('SELECT * FROM produtos WHERE id = ?').get(id);
}

module.exports = { listarTodos, buscarPorId };