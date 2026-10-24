const formLogin = document.getElementById('form-login');
const mensagemLogin = document.getElementById('mensagem');

const voltar = new URLSearchParams(window.location.search).get('voltar');
// Só aceita destinos dentro do próprio site, por segurança
const destino = voltar && voltar.startsWith('/') && !voltar.startsWith('//') ? voltar : '/';

if (voltar) {
  document.getElementById('link-cadastro').href = `/cadastro.html?voltar=${encodeURIComponent(voltar)}`;
}

function mostrarMensagem(texto, tipo) {
  mensagemLogin.textContent = texto;
  mensagemLogin.className = `mensagem ${tipo}`;
}

formLogin.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const botao = formLogin.querySelector('button');
  botao.disabled = true;
  mostrarMensagem('', '');

  try {
    const resposta = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value,
      }),
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarMensagem(dados.erro || 'Não foi possível entrar.', 'erro');
      botao.disabled = false;
      return;
    }

    window.location.href = destino;
  } catch (erro) {
    mostrarMensagem('Erro de conexão. Tente novamente.', 'erro');
    botao.disabled = false;
  }
});