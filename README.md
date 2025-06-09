# Conex Blog

🚀 Projeto em produção: [https://conex-blog.onrender.com/graphql](https://conex-blog.onrender.com/graphql)

Projeto de blog desenvolvido com [NestJS](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/) e [GraphQL](https://graphql.org/), com foco em arquitetura modular, validação, testes automatizados e boas práticas.

## Tecnologias Utilizadas

- **Node.js**
- **NestJS** (framework principal)
- **GraphQL** (API principal)
- **Prisma ORM** (acesso a banco de dados PostgreSQL)
- **TypeScript**
- **Jest** (testes)
- **Docker** (opcional)

## Estrutura do Projeto

```
├── src/
│   ├── authors/        # Módulo de autores
│   ├── posts/          # Módulo de posts
│   ├── database/       # Configuração do Prisma
│   ├── shared/         # Utilitários e filtros globais
│   ├── app.module.ts   # Módulo principal
│   └── main.ts         # Bootstrap da aplicação
├── prisma/
│   └── schema.prisma   # Schema do banco de dados
├── test/               # Testes automatizados
├── package.json        # Dependências e scripts
├── docker-compose.yml  # Subida de ambiente com Docker
└── README.md           # Documentação
```

## Modelos de Dados (Prisma)

```prisma
model Author {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  posts     Post[]
}

model Post {
  id        String   @id @default(uuid())
  title     String
  slug      String   @unique
  content   String
  published Boolean  @default(false)
  author    Author   @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId  String
  createdAt DateTime @default(now())
}
```

## API GraphQL

A API está disponível em `/graphql` (com playground habilitado em ambiente de produção e desenvolvimento).

### Principais Queries

- `authors(page, perPage, sort, sortDir, filter): SearchAuthorsResult!`
- `getAuthorById(id: String!): Author!`
- `getPostById(id: String!): Post!`

### Principais Mutations

- `createAuthor(data: CreateAuthorInput!): Author!`
- `updateAuthor(id: String!, data: UpdateAuthorInput!): Author!`
- `deleteAuthor(id: String!): Author!`
- `createPost(data: CreatePostInput!): Post!`
- `publishPost(id: String!): Post!`
- `unpublishPost(id: String!): Post!`

### Exemplo de Query

```graphql
query {
  authors(page: 1, perPage: 10) {
    items {
      id
      name
      email
      createdAt
    }
    total
    currentPage
    lastPage
  }
}
```

### Exemplo de Mutation

```graphql
mutation {
  createAuthor(data: { name: "João", email: "joao@email.com" }) {
    id
    name
    email
  }
}
```

---

## 👨‍💻 Autor

- Nome: _Cássio da Silva_
- LinkedIn: _(https://www.linkedin.com/in/c%C3%A1ssio-da-silva/)_

---

## Licença

Este projeto é distribuído sob a licença UNLICENSED.
