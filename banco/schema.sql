-- Banco de dados da Loja de Cupcakes (SQLite)

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  criado_em TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco REAL NOT NULL CHECK (preco > 0),
  imagem TEXT
);

CREATE TABLE IF NOT EXISTS pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  endereco TEXT NOT NULL,
  forma_pagamento TEXT NOT NULL CHECK (forma_pagamento IN ('pix', 'cartao', 'dinheiro')),
  total REAL NOT NULL,
  criado_em TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS itens_pedido (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido_id INTEGER NOT NULL REFERENCES pedidos(id),
  produto_id INTEGER NOT NULL REFERENCES produtos(id),
  quantidade INTEGER NOT NULL CHECK (quantidade > 0),
  preco_unitario REAL NOT NULL
);

-- Produtos iniciais do catálogo
INSERT INTO produtos (nome, descricao, preco, imagem) VALUES
  ('Chocolate Belga', 'Massa de chocolate com cobertura de ganache', 9.90, 'chocolate.jpg'),
  ('Red Velvet', 'Massa aveludada com cobertura de cream cheese', 10.90, 'redvelvet.jpg'),
  ('Baunilha com Morango', 'Massa de baunilha com chantilly e morango fresco', 9.50, 'morango.jpg'),
  ('Limão Siciliano', 'Massa de limão com merengue maçaricado', 9.90, 'limao.jpg'),
  ('Doce de Leite', 'Massa amanteigada recheada com doce de leite', 8.90, 'docedeleite.jpg');
