const NOMES_PAGAMENTO = {
  pix: 'Pix',
  cartao: 'Cartão',
  dinheiro: 'Dinheiro na entrega',
};

function formatarData(texto) {
  // O SQLite grava a data em horário UTC; aqui convertemos para o horário local
  const data = new Date(`${texto.replace(' ', 'T')}Z`);
  return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function criarCardPedido(pedido) {
  const card = document.createElement('article');
  card.className = 'card-pedido';
  card.innerHTML = `
    <div class="card-pedido-topo">
      <strong class="numero"></strong>
      <span class="data"></span>
    </div>
    <ul class="itens"></ul>
    <p class="detalhe endereco"></p>
    <p class="detalhe pagamento"></p>
    <p class="total-pedido"></p>
  `;

  card.querySelector('.numero').textContent = `Pedido nº ${pedido.id}`;
  card.querySelector('.data').textContent = formatarData(pedido.criado_em);
  card.querySelector('.endereco').textContent = `Entrega: ${pedido.endereco}`;
  card.querySelector('.pagamento').textContent =
    `Pagamento: ${NOMES_PAGAMENTO[pedido.forma_pagamento] || pedido.forma_pagamento}`;
  card.querySelector('.total-pedido').textContent = `Total: ${formatarPreco(pedido.total)}`;

  const listaItens = card.querySelector('.itens');
  pedido.itens.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.quantidade}x ${item.nome} (${formatarPreco(item.preco_unitario)} cada)`;
    listaItens.appendChild(li);
  });

  return card;
}

async function carregarPedidos() {
  const lista = document.getElementById('lista-pedidos');
  const mensagem = document.getElementById('mensagem');

  try {
    const resposta = await fetch('/api/pedidos');

    if (resposta.status === 401) {
      window.location.href = `/login.html?voltar=${encodeURIComponent('/pedidos.html')}`;
      return;
    }
    if (!resposta.ok) throw new Error('Falha na API');

    const pedidos = await resposta.json();

    if (pedidos.length === 0) {
      lista.innerHTML = `
        <div class="vazio">
          <p>Você ainda não fez nenhum pedido.</p>
          <a href="/" class="botao botao-link">Ver cupcakes</a>
        </div>
      `;
      return;
    }

    pedidos.forEach((pedido) => lista.appendChild(criarCardPedido(pedido)));
  } catch (erro) {
    mensagem.textContent = 'Não foi possível carregar seus pedidos. Tente novamente mais tarde.';
    mensagem.classList.add('erro');
  }
}

carregarPedidos();