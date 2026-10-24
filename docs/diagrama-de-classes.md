# Diagrama de Classes

## Classes de domínio (persistência)

```mermaid
classDiagram
    class Usuario {
        +int id
        +String nome
        +String email
        -String senhaHash
        +DateTime criadoEm
    }

    class Produto {
        +int id
        +String nome
        +String descricao
        +decimal preco
        +String imagem
    }

    class Pedido {
        +int id
        +String endereco
        +String formaPagamento
        +decimal total
        +DateTime criadoEm
        +calcularTotal() decimal
    }

    class ItemPedido {
        +int id
        +int quantidade
        +decimal precoUnitario
        +subtotal() decimal
    }

    Usuario "1" --> "0..*" Pedido : realiza
    Pedido "1" *-- "1..*" ItemPedido : contém
    ItemPedido "0..*" --> "1" Produto : refere-se a
```

**Relacionamentos**

- **Usuario → Pedido (associação, 1 para 0..\*):** um usuário pode realizar vários pedidos; cada pedido pertence a um único usuário.
- **Pedido ◆ ItemPedido (composição, 1 para 1..\*):** um pedido possui um ou mais itens. Os itens não existem sem o pedido.
- **ItemPedido → Produto (associação, 0..\* para 1):** cada item refere-se a um produto; um produto pode aparecer em vários itens.

**Observações de projeto**

- `senhaHash` é privado: a senha nunca é armazenada em texto puro, apenas o resultado da criptografia com bcrypt.
- `precoUnitario` guarda o preço no momento da compra, para que o histórico não mude se o preço do produto for alterado depois.
- O carrinho não é uma classe persistida: ele existe apenas no navegador (localStorage) até o pedido ser finalizado.

## Arquitetura MVC

```mermaid
flowchart LR
    U["Usuário<br/>(navegador)"] -->|Requisição HTTP| R["Routes"]
    R --> M1["Middleware<br/>exigirLogin"]
    M1 --> CT["Controllers"]
    CT <--> MD["Models"]
    MD <--> DB[("SQLite")]
    CT -->|JSON| V["View<br/>(HTML, CSS, JS)"]
    V --> U
```

| Camada | Arquivos | Responsabilidade |
| --- | --- | --- |
| Model | `src/models/*.js` | Acesso ao banco de dados (consultas e gravações) |
| View | `src/public/*` | Telas em HTML, CSS e JavaScript |
| Controller | `src/controllers/*.js` | Validações, regras de negócio e respostas da API |
| Routes | `src/routes/*.js` | Ligação entre endereços da API e controllers |
| Middleware | `src/middlewares/*.js` | Controle de acesso (exige login) |