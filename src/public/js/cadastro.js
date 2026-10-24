const formCadastro = document.getElementById('form-cadastro');
const mensagemCadastro = document.getElementById('mensagem');

// Se o usuário veio do checkout, guarda para onde voltar depois do login
const voltar = new URLSearchParams(window.location.search).get('voltar');
const linkLogin = voltar ? `/login.html?voltar=${encodeURIComponent(voltar)}` : '/login.html';
document.getElementById('link-login').href = linkLogin;

function mostrarMensagem(texto, tipo) {
  mensagemCadastro.textContent = texto;
  mensagemCadastro.className = `mensagem ${tipo}`;
}

formCadastro.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const botao = formCadastro.querySelector('button');
  botao.disabled = true;
  mostrarMensagem('', '');

  try {
    const resposta = await fetch('/api/auth/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value,
      }),
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarMensagem(dados.erro || 'Não foi possível cadastrar.', 'erro');
      botao.disabled = false;
      return;
    }

    mostrarMensagem('Conta criada com sucesso! Redirecionando para o login...', 'sucesso');
    setTimeout(() => {
      window.location.href = linkLogin;
    }, 1800);
  } catch (erro) {
    mostrarMensagem('Erro de conexão. Tente novamente.', 'erro');
    botao.disabled = false;
  }
});