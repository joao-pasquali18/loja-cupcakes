async function carregarProdutos() {
  const lista = document.getElementById('lista-produtos');
  const mensagem = document.getElementById('mensagem');

  try {
    const resposta = await fetch('/api/produtos');
    if (!resposta.ok) throw new Error('Falha na API');

    const produtos = await resposta.json();

    if (produtos.length === 0) {
      mensagem.textContent = 'Nenhum cupcake disponível no momento.';
      return;
    }

    produtos.forEach((produto) => lista.appendChild(criarCard(produto)));
  } catch (erro) {
    mensagem.textContent = 'Não foi possível carregar o catálogo. Tente novamente mais tarde.';
    mensagem.classList.add('erro');
  }
}

function criarCard(produto) {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <div class="card-imagem">🧁</div>
    <h2></h2>
    <p class="descricao"></p>
    <p class="preco"></p>
    <button class="botao">Adicionar ao carrinho</button>
  `;

  card.querySelector('h2').textContent = produto.nome;
  card.querySelector('.descricao').textContent = produto.descricao;
  card.querySelector('.preco').textContent = formatarPreco(produto.preco);

  const botao = card.querySelector('.botao');
  botao.addEventListener('click', () => {
    adicionarAoCarrinho(produto);
    botao.textContent = 'Adicionado! ✓';
    botao.disabled = true;
    setTimeout(() => {
      botao.textContent = 'Adicionar ao carrinho';
      botao.disabled = false;
    }, 1200);
  });

  return card;
}

carregarProdutos();