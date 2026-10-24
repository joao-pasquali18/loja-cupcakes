/**
 * @jest-environment jsdom
 */
const carrinho = require('../src/public/js/carrinho');

const chocolate = { id: 1, nome: 'Chocolate Belga', preco: 9.9 };
const redVelvet = { id: 2, nome: 'Red Velvet', preco: 10.9 };

beforeEach(() => {
  localStorage.clear();
});

describe('Carrinho (front-end)', () => {
  test('adiciona um produto novo com quantidade 1', () => {
    carrinho.adicionarAoCarrinho(chocolate);
    expect(carrinho.lerCarrinho()).toEqual([{ ...chocolate, quantidade: 1 }]);
  });

  test('soma a quantidade ao adicionar o mesmo produto', () => {
    carrinho.adicionarAoCarrinho(chocolate);
    carrinho.adicionarAoCarrinho(chocolate);
    expect(carrinho.lerCarrinho()[0].quantidade).toBe(2);
  });

  test('remove o item quando a quantidade chega a zero', () => {
    carrinho.adicionarAoCarrinho(chocolate);
    carrinho.alterarQuantidade(1, -1);
    expect(carrinho.lerCarrinho()).toHaveLength(0);
  });

  test('remove um item específico', () => {
    carrinho.adicionarAoCarrinho(chocolate);
    carrinho.adicionarAoCarrinho(redVelvet);
    carrinho.removerDoCarrinho(1);
    expect(carrinho.lerCarrinho().map((i) => i.id)).toEqual([2]);
  });

  test('calcula o total do carrinho', () => {
    const itens = [
      { ...chocolate, quantidade: 2 },
      { ...redVelvet, quantidade: 1 },
    ];
    expect(carrinho.calcularTotal(itens)).toBeCloseTo(30.7);
  });

  test('mantém os itens salvos no navegador (localStorage)', () => {
    carrinho.adicionarAoCarrinho(chocolate);
    const salvo = JSON.parse(localStorage.getItem('carrinho'));
    expect(salvo).toHaveLength(1);
  });

  test('formata preços em reais', () => {
    expect(carrinho.formatarPreco(9.9)).toMatch(/R\$\s?9,90/);
  });
});