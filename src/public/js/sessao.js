async function obterUsuarioLogado() {
  try {
    const resposta = await fetch('/api/auth/eu');
    if (!resposta.ok) return null;
    return await resposta.json();
  } catch {
    return null;
  }
}

async function atualizarMenuUsuario() {
  const nav = document.querySelector('.cabecalho nav');
  if (!nav) return;

  const usuario = await obterUsuarioLogado();
  const area = document.createElement('span');
  area.className = 'menu-usuario';

  if (usuario) {
        area.innerHTML = '<a href="/pedidos.html">Meus pedidos</a><span class="ola"></span><button type="button" class="botao-sair">Sair</button>';
    area.querySelector('.ola').textContent = `Olá, ${usuario.nome.split(' ')[0]}`;
    area.querySelector('.botao-sair').addEventListener('click', async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    });
  } else {
    area.innerHTML = '<a href="/login.html">Entrar</a>';
  }

  nav.prepend(area);
}

document.addEventListener('DOMContentLoaded', atualizarMenuUsuario);