# Dicionário de Dados

**SGBD:** SQLite
**Script de criação:** [`banco/schema.sql`](../banco/schema.sql)

## Modelo lógico

- **usuarios** (<u>id</u>, nome, email, senha_hash, criado_em)
- **produtos** (<u>id</u>, nome, descricao, preco, imagem)
- **pedidos** (<u>id</u>, usuario_id → usuarios.id, endereco, forma_pagamento, total, criado_em)
- **itens_pedido** (<u>id</u>, pedido_id → pedidos.id, produto_id → produtos.id, quantidade, preco_unitario)

O modelo está na **terceira forma normal (3FN)**: cada tabela trata de um único assunto, e os campos dependem apenas da chave primária. O campo `preco_unitario` não é redundância: ele registra o preço praticado no momento da compra, que pode ser diferente do preço atual do produto.

## Tabela: usuarios

Armazena os clientes cadastrados.

| Campo | Tipo | Obrigatório | Chave | Restrições | Descrição |
| --- | --- | --- | --- | --- | --- |
| id | INTEGER | Sim | PK | Autoincremento | Identificador do usuário |
| nome | TEXT | Sim | | | Nome completo |
| email | TEXT | Sim | | UNIQUE | E-mail de login, armazenado em minúsculas |
| senha_hash | TEXT | Sim | | | Senha criptografada com bcrypt |
| criado_em | TEXT | Não | | Padrão: data/hora atual (UTC) | Data de cadastro |

## Tabela: produtos

Armazena os cupcakes do catálogo.

| Campo | Tipo | Obrigatório | Chave | Restrições | Descrição |
| --- | --- | --- | --- | --- | --- |
| id | INTEGER | Sim | PK | Autoincremento | Identificador do produto |
| nome | TEXT | Sim | | | Nome do cupcake |
| descricao | TEXT | Não | | | Descrição do sabor |
| preco | REAL | Sim | | CHECK (preco > 0) | Preço atual em reais |
| imagem | TEXT | Não | | | Nome do arquivo de imagem |

## Tabela: pedidos

Armazena os pedidos finalizados.

| Campo | Tipo | Obrigatório | Chave | Restrições | Descrição |
| --- | --- | --- | --- | --- | --- |
| id | INTEGER | Sim | PK | Autoincremento | Número do pedido |
| usuario_id | INTEGER | Sim | FK → usuarios.id | | Cliente que fez o pedido |
| endereco | TEXT | Sim | | | Endereço de entrega completo |
| forma_pagamento | TEXT | Sim | | CHECK: 'pix', 'cartao' ou 'dinheiro' | Forma de pagamento (simulada) |
| total | REAL | Sim | | | Valor total calculado pelo servidor |
| criado_em | TEXT | Não | | Padrão: data/hora atual (UTC) | Data e hora do pedido |

## Tabela: itens_pedido

Armazena os produtos de cada pedido.

| Campo | Tipo | Obrigatório | Chave | Restrições | Descrição |
| --- | --- | --- | --- | --- | --- |
| id | INTEGER | Sim | PK | Autoincremento | Identificador do item |
| pedido_id | INTEGER | Sim | FK → pedidos.id | | Pedido ao qual o item pertence |
| produto_id | INTEGER | Sim | FK → produtos.id | | Produto comprado |
| quantidade | INTEGER | Sim | | CHECK (quantidade > 0) | Quantidade comprada (a aplicação limita de 1 a 99) |
| preco_unitario | REAL | Sim | | | Preço do produto no momento da compra |

## Relacionamentos

| Tabela de origem | Campo | Tabela de destino | Cardinalidade |
| --- | --- | --- | --- |
| pedidos | usuario_id | usuarios | N:1 (vários pedidos para um usuário) |
| itens_pedido | pedido_id | pedidos | N:1 (vários itens para um pedido) |
| itens_pedido | produto_id | produtos | N:1 (vários itens podem referir o mesmo produto) |

A integridade referencial é garantida pelo comando `PRAGMA foreign_keys = ON`, executado sempre que a aplicação abre o banco.