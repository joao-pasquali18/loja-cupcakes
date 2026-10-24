const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const arquivoBanco = process.env.NODE_ENV === 'test' ? ':memory:' : path.join(__dirname, '..', 'loja.db');
const db = new Database(arquivoBanco);
db.pragma('foreign_keys = ON');

// Se as tabelas ainda não existem, cria tudo a partir do schema.sql
const tabelaExiste = db
  .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'produtos'")
  .get();

if (!tabelaExiste) {
  const schema = fs.readFileSync(path.join(__dirname, '..', 'banco', 'schema.sql'), 'utf-8');
  db.exec(schema);
  console.log('Banco de dados criado com os produtos iniciais.');
}

module.exports = db;