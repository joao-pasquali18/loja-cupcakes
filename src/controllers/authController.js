const bcrypt = require('bcryptjs');
const usuarioModel = require('../models/usuarioModel');

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function cadastrar(req, res) {
  try {
    const { nome = '', email = '', senha = '' } = req.body || {};
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();

    if (!nomeLimpo || !emailLimpo || !senha) {
      return res.status(400).json({ erro: 'Preencha nome, e-mail e senha.' });
    }
    if (!EMAIL_VALIDO.test(emailLimpo)) {
      return res.status(400).json({ erro: 'Informe um e-mail válido.' });
    }
    if (senha.length < 6) {
      return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
    }
    if (usuarioModel.buscarPorEmail(emailLimpo)) {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const id = usuarioModel.criar(nomeLimpo, emailLimpo, senhaHash);

    res.status(201).json({ id, nome: nomeLimpo, email: emailLimpo });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Não foi possível concluir o cadastro.' });
  }
}

async function login(req, res) {
  try {
    const { email = '', senha = '' } = req.body || {};
    const usuario = usuarioModel.buscarPorEmail(email.trim().toLowerCase());
    const senhaConfere = usuario && (await bcrypt.compare(senha, usuario.senha_hash));

    // Mensagem genérica de propósito: não revela se o e-mail existe
    if (!senhaConfere) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    req.session.usuario = { id: usuario.id, nome: usuario.nome, email: usuario.email };
    res.json(req.session.usuario);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Não foi possível fazer o login.' });
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ mensagem: 'Sessão encerrada.' });
  });
}

function usuarioAtual(req, res) {
  if (!req.session.usuario) {
    return res.status(401).json({ erro: 'Não autenticado.' });
  }
  res.json(req.session.usuario);
}

module.exports = { cadastrar, login, logout, usuarioAtual };