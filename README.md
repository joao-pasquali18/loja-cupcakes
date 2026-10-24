# 🧁 Doce Cupcake – Loja Virtual

Loja virtual de cupcakes desenvolvida como Projeto Integrador Transdisciplinar em Engenharia de Software II (Cruzeiro do Sul Virtual).

🔗 **Acesse o sistema:** [https://loja-cupcakes.onrender.com/]

> O servidor está no plano gratuito do Render: o primeiro acesso após um período sem uso pode levar cerca de 1 minuto.

## Funcionalidades

- Catálogo de cupcakes
- Carrinho com alteração de quantidades, remoção de itens e total automático (salvo no navegador)
- Cadastro e login de usuários com senha criptografada
- Checkout com endereço de entrega e forma de pagamento (simulada)
- Histórico de pedidos do cliente
- Layout responsivo (computador e celular)

## Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Front-end | HTML, CSS e JavaScript |
| Back-end | Node.js com Express |
| Banco de dados | SQLite (better-sqlite3) |
| Autenticação | express-session e bcryptjs |
| Testes | Jest, Supertest e jsdom |
| Hospedagem | Render |

## Arquitetura

O back-end segue o padrão **MVC**:

- **Model** (`src/models`): acesso ao banco de dados
- **View** (`src/public`): telas da aplicação
- **Controller** (`src/controllers`): validações e regras de negócio

Detalhes em [docs/diagrama-de-classes.md](docs/diagrama-de-classes.md).

## Estrutura de pastas

```
loja-cupcakes/
├── banco/            # Script SQL do banco de dados
├── docs/             # Documentação do projeto
├── src/
│   ├── controllers/  # Regras de negócio
│   ├── middlewares/  # Controle de acesso
│   ├── models/       # Acesso ao banco
│   ├── public/       # Front-end (HTML, CSS, JS)
│   ├── routes/       # Rotas da API
│   ├── app.js        # Configuração da aplicação
│   ├── database.js   # Conexão com o banco
│   └── server.js     # Inicialização do servidor
└── tests/            # Testes automatizados
```

## Como executar localmente

Pré-requisito: [Node.js](https://nodejs.org) (versão LTS).

```bash
git clone https://github.com/joao-pasquali18/loja-cupcakes.git
cd loja-cupcakes
npm install
npm start
```

Acesse **http://localhost:3000**. O banco de dados é criado automaticamente na primeira execução, já com os produtos do catálogo.

## Testes

```bash
npm test
```

São 23 testes automatizados cobrindo catálogo, cadastro, login, sessão, pedidos (incluindo validações e cálculo do total no servidor) e as funções do carrinho no front-end.

## API

| Método | Rota | Descrição | Exige login |
| --- | --- | --- | --- |
| GET | `/api/produtos` | Lista os produtos | Não |
| POST | `/api/auth/cadastro` | Cria uma conta | Não |
| POST | `/api/auth/login` | Faz login | Não |
| POST | `/api/auth/logout` | Encerra a sessão | Não |
| GET | `/api/auth/eu` | Retorna o usuário logado | Sim |
| GET | `/api/pedidos` | Lista os pedidos do usuário | Sim |
| POST | `/api/pedidos` | Cria um pedido | Sim |

## Documentação

- [Requisitos](docs/requisitos.md)
- [Casos de uso](docs/casos-de-uso.md)
- [Diagrama de classes e arquitetura](docs/diagrama-de-classes.md)
- [Dicionário de dados](docs/dicionario-de-dados.md)

## Limitações conhecidas

- O pagamento é simulado, sem integração com meios de pagamento reais.
- Não há recuperação ou troca de senha.
- Não há painel administrativo para cadastrar produtos.
- No plano gratuito do Render, contas e pedidos são apagados quando o servidor reinicia ou fica inativo. Os produtos do catálogo são recriados automaticamente.

## Autor

[João Cardoso Mendes Pasquali] – RGM [34790071]