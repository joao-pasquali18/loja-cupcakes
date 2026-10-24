const request = require('supertest');
const app = require('../src/app');

let agente;

beforeAll(async () => {
  agente = request.agent(app);
  await agente
    .post('/api/auth/cadastro')
    .send({ nome: 'João Teste', email: 'joao@teste.com', senha: 'senha123' });
  await agente.post('/api/auth/login').send({ email: 'joao@teste.com', senha: 'senha123' });
});

const pedidoValido = {
  endereco: 'Rua das Flores, 100, Centro, São Paulo',
  forma_pagamento: 'pix',
  itens: [
    { produto_id: 1, quantidade: 2 },
    { produto_id: 2, quantidade: 1 },
  ],
};

describe('Pedidos', () => {
  test('bloqueia pedido de quem não está logado', async () => {
    const resposta = await request(app).post('/api/pedidos').send(pedidoValido);
    expect(resposta.status).toBe(401);
  });

  test('recusa carrinho vazio', async () => {
    const resposta = await agente.post('/api/pedidos').send({ ...pedidoValido, itens: [] });
    expect(resposta.status).toBe(400);
  });

  test('recusa pedido sem endereço', async () => {
    const resposta = await agente.post('/api/pedidos').send({ ...pedidoValido, endereco: '' });
    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toBe('Preencha os dados de entrega.');
  });

  test('recusa forma de pagamento inválida', async () => {
    const resposta = await agente
      .post('/api/pedidos')
      .send({ ...pedidoValido, forma_pagamento: 'boleto' });
    expect(resposta.status).toBe(400);
  });

  test('recusa produto inexistente ou quantidade inválida', async () => {
    const produtoInexistente = await agente
      .post('/api/pedidos')
      .send({ ...pedidoValido, itens: [{ produto_id: 999, quantidade: 1 }] });
    const quantidadeZero = await agente
      .post('/api/pedidos')
      .send({ ...pedidoValido, itens: [{ produto_id: 1, quantidade: 0 }] });

    expect(produtoInexistente.status).toBe(400);
    expect(quantidadeZero.status).toBe(400);
  });

  test('cria o pedido calculando o total com os preços do banco', async () => {
    // O preço enviado pelo navegador é ignorado de propósito
    const itensComPrecoFalso = pedidoValido.itens.map((item) => ({ ...item, preco: 0.01 }));
    const resposta = await agente
      .post('/api/pedidos')
      .send({ ...pedidoValido, itens: itensComPrecoFalso });

    expect(resposta.status).toBe(201);
    expect(resposta.body).toHaveProperty('id');
    expect(resposta.body.total).toBe(30.7); // 2 x 9,90 + 1 x 10,90
  });

  test('mostra o pedido no histórico do usuário', async () => {
    const resposta = await agente.get('/api/pedidos');

    expect(resposta.status).toBe(200);
    expect(resposta.body).toHaveLength(1);
    expect(resposta.body[0].itens).toHaveLength(2);
    expect(resposta.body[0].forma_pagamento).toBe('pix');
  });
});