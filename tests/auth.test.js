const request = require('supertest');
const app = require('../src/app');

const usuario = { nome: 'Maria Teste', email: 'maria@teste.com', senha: 'senha123' };

describe('Cadastro de usuário', () => {
  test('cadastra um usuário com dados válidos', async () => {
    const resposta = await request(app).post('/api/auth/cadastro').send(usuario);

    expect(resposta.status).toBe(201);
    expect(resposta.body.email).toBe('maria@teste.com');
    expect(resposta.body).not.toHaveProperty('senha_hash');
  });

  test('recusa cadastro com campos vazios', async () => {
    const resposta = await request(app).post('/api/auth/cadastro').send({});
    expect(resposta.status).toBe(400);
  });

  test('recusa e-mail inválido', async () => {
    const resposta = await request(app)
      .post('/api/auth/cadastro')
      .send({ ...usuario, email: 'email-sem-arroba' });
    expect(resposta.status).toBe(400);
  });

  test('recusa senha com menos de 6 caracteres', async () => {
    const resposta = await request(app)
      .post('/api/auth/cadastro')
      .send({ ...usuario, email: 'outro@teste.com', senha: '123' });
    expect(resposta.status).toBe(400);
  });

  test('recusa e-mail já cadastrado', async () => {
    const resposta = await request(app).post('/api/auth/cadastro').send(usuario);
    expect(resposta.status).toBe(409);
  });
});

describe('Login e sessão', () => {
  test('faz login com dados corretos e mantém a sessão', async () => {
    const agente = request.agent(app); // guarda o cookie, como um navegador

    const login = await agente
      .post('/api/auth/login')
      .send({ email: usuario.email, senha: usuario.senha });
    expect(login.status).toBe(200);

    const eu = await agente.get('/api/auth/eu');
    expect(eu.status).toBe(200);
    expect(eu.body.nome).toBe('Maria Teste');
  });

  test('recusa senha errada com mensagem genérica', async () => {
    const resposta = await request(app)
      .post('/api/auth/login')
      .send({ email: usuario.email, senha: 'errada' });

    expect(resposta.status).toBe(401);
    expect(resposta.body.erro).toBe('E-mail ou senha inválidos.');
  });

  test('encerra a sessão no logout', async () => {
    const agente = request.agent(app);
    await agente.post('/api/auth/login').send({ email: usuario.email, senha: usuario.senha });

    await agente.post('/api/auth/logout');
    const eu = await agente.get('/api/auth/eu');

    expect(eu.status).toBe(401);
  });
});