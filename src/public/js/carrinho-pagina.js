function renderizarCarrinho() {
  const itens = lerCarrinho();
  const vazio = document.getElementById('carrinho-vazio');
  const conteudo = document.getElementById('carrinho-conteudo');
  const lista = document.getElementById('lista-itens');

  lista.innerHTML = '';

  if (itens.length === 0) {
    vazio.hidden = false;
    conteudo.hidden = true;
    return;
  }

  vazio.hidden = true;
  conteudo.hidden = false;

  itens.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `
      <div class="item-info">
        <strong class="item-nome"></strong>
        <span class="item-preco"></span>
      </div>
      <div class="item-quantidade">
        <button class="botao-qtd" data-acao="diminuir" aria-label="Diminuir quantidade">−</button>
        <span class="item-qtd"></span>
        <button class="botao-qtd" data-acao="aumentar" aria-label="Aumentar quantidade">+</button>
      </div>
      <span class="item-subtotal"></span>
      <button class="botao-remover" data-acao="remover">Remover</button>
    `;

    li.querySelector('.item-nome').textContent = item.nome;
    li.querySelector('.item-preco').textContent = `${formatarPreco(item.preco)} cada`;
    li.querySelector('.item-qtd').textContent = item.quantidade;
    li.querySelector('.item-subtotal').textContent = formatarPreco(item.preco * item.quantidade);

    li.querySelector('[data-acao="diminuir"]').addEventListener('click', () => {
      alterarQuantidade(item.id, -1);
      renderizarCarrinho();
    });

    li.querySelector('[data-acao="aumentar"]').addEventListener('click', () => {
      alterarQuantidade(item.id, 1);
      renderizarCarrinho();
    });

    li.querySelector('[data-acao="remover"]').addEventListener('click', () => {
      removerDoCarrinho(item.id);
      renderizarCarrinho();
    });

    lista.appendChild(li);
  });

  document.getElementById('total-carrinho').textContent = formatarPreco(calcularTotal(itens));
}

renderizarCarrinho();