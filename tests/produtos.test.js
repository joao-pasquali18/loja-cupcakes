const request = require('supertest');
const app = require('../src/app');

describe('Catálogo de produtos', () => {
  test('lista os cupcakes cadastrados', async () => {
    const resposta = await request(app).get('/api/produtos');

    expect(resposta.status).toBe(200);
    expect(resposta.body).toHaveLength(5);
    expect(resposta.body[0]).toHaveProperty('nome');
    expect(resposta.body[0]).toHaveProperty('preco');
  });
});