const db = require('../database');

function buscarPorEmail(email) {
  return db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
}

function criar(nome, email, senhaHash) {
  const resultado = db
    .prepare('INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)')
    .run(nome, email, senhaHash);
  return resultado.lastInsertRowid;
}

module.exports = { buscarPorEmail, criar };