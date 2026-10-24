const formCheckout = document.getElementById('form-checkout');
const mensagemCheckout = document.getElementById('mensagem');

function mostrarMensagem(texto, tipo) {
  mensagemCheckout.textContent = texto;
  mensagemCheckout.className = `mensagem ${tipo}`;
}

function irParaLogin() {
  window.location.href = `/login.html?voltar=${encodeURIComponent('/checkout.html')}`;
}

function mostrarResumo(itens) {
  const lista = document.getElementById('resumo-itens');
  lista.innerHTML = '';

  itens.forEach((item) => {
    const li = document.createElement('li');
    const descricao = document.createElement('span');
    const valor = document.createElement('span');
    descricao.textContent = `${item.quantidade}x ${item.nome}`;
    valor.textContent = formatarPreco(item.preco * item.quantidade);
    li.append(descricao, valor);
    lista.appendChild(li);
  });

  document.getElementById('resumo-total').textContent = formatarPreco(calcularTotal(itens));
}

async function iniciarCheckout() {
  const usuario = await obterUsuarioLogado();
  if (!usuario) {
    irParaLogin();
    return;
  }

  const itens = lerCarrinho();
  if (itens.length === 0) {
    document.getElementById('checkout-vazio').hidden = false;
    return;
  }

  document.getElementById('checkout-conteudo').hidden = false;
  mostrarResumo(itens);
}

formCheckout.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  mostrarMensagem('', '');

  const rua = document.getElementById('rua').value.trim();
  const complemento = document.getElementById('complemento').value.trim();
  const bairro = document.getElementById('bairro').value.trim();
  const cidade = document.getElementById('cidade').value.trim();
  const pagamento = document.querySelector('input[name="pagamento"]:checked');

  if (!rua || !bairro || !cidade) {
    mostrarMensagem('Preencha os dados de entrega.', 'erro');
    return;
  }
  if (!pagamento) {
    mostrarMensagem('Escolha uma forma de pagamento.', 'erro');
    return;
  }

  const endereco = [rua, complemento, bairro, cidade].filter(Boolean).join(', ');
  const itens = lerCarrinho().map((item) => ({ produto_id: item.id, quantidade: item.quantidade }));

  const botao = formCheckout.querySelector('button');
  botao.disabled = true;

  try {
    const resposta = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endereco, forma_pagamento: pagamento.value, itens }),
    });

    if (resposta.status === 401) {
      irParaLogin();
      return;
    }

    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarMensagem(dados.erro || 'Não foi possível finalizar o pedido.', 'erro');
      botao.disabled = false;
      return;
    }

    salvarCarrinho([]);
    document.getElementById('checkout-conteudo').hidden = true;
    document.getElementById('confirmacao-texto').textContent =
      `Pedido nº ${dados.id} no valor de ${formatarPreco(dados.total)} confirmado. Obrigado pela compra!`;
    document.getElementById('confirmacao').hidden = false;
  } catch (erro) {
    mostrarMensagem('Erro de conexão. Tente novamente.', 'erro');
    botao.disabled = false;
  }
});

iniciarCheckout();