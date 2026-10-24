const CHAVE_CARRINHO = 'carrinho';

function lerCarrinho() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || [];
  } catch {
    return [];
  }
}

function salvarCarrinho(itens) {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
  atualizarContador();
}

function adicionarAoCarrinho(produto) {
  const itens = lerCarrinho();
  const existente = itens.find((item) => item.id === produto.id);

  if (existente) {
    existente.quantidade += 1;
  } else {
    itens.push({ id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 });
  }

  salvarCarrinho(itens);
}

function atualizarContador() {
  const total = lerCarrinho().reduce((soma, item) => soma + item.quantidade, 0);
  const contador = document.getElementById('contador-carrinho');
  if (contador) contador.textContent = total;
}

function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

document.addEventListener('DOMContentLoaded', atualizarContador);

function alterarQuantidade(id, variacao) {
  const itens = lerCarrinho();
  const item = itens.find((i) => i.id === id);
  if (!item) return;

  item.quantidade += variacao;

  if (item.quantidade <= 0) {
    salvarCarrinho(itens.filter((i) => i.id !== id));
  } else {
    salvarCarrinho(itens);
  }
}

function removerDoCarrinho(id) {
  salvarCarrinho(lerCarrinho().filter((i) => i.id !== id));
}

function calcularTotal(itens) {
  return itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
}