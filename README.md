# Sistema de Gestão de Mercadorias

Este trabalho consiste na criação de um servidor com um **CRUD** (Create, Read, Update, Delete) em **Node.js** para gerir um conjunto de mercadorias. O objetivo principal é fornecer uma **API** que permita realizar operações sobre dados de mercadorias de forma eficiente e flexível.

As operações disponíveis incluem a consulta da lista completa de mercadorias armazenadas, bem como a adição de novas entradas. Os dados são persistidos localmente num ficheiro `mercadorias.json`, simulando uma base de dados.

Este servidor foi construído com o intuito de ser simples, modular e de fácil utilização, tanto em ambiente local como para testes em ferramentas como o Postman ou através da interface gráfica.

## Stack utilizada
- Node.js
- Express.js
- GraphQL
- gRPC
- REST
- SOAP
- Docker
- Postman

---

## Exemplos de Chamadas (Postman)

### GET REST - Listar Mercadorias
![GET REST - Listar Mercadorias](https://github.com/user-attachments/assets/6985e071-a7b1-4cfc-ac71-2e1fb04dfd83)

### POST REST - Criar Mercadoria
![POST REST - Criar Mercadoria](https://github.com/user-attachments/assets/9cab2123-c82c-4a0e-ab03-2da871f71d53)

### GET REST - Exportar XML
![GET REST - Exportar XML](https://github.com/user-attachments/assets/3613e09f-99e4-4ece-98e1-49803b36167a)

### DELETE REST - Remover Mercadoria
![DELETE REST - Remover Mercadoria](https://github.com/user-attachments/assets/66b76d73-00bb-4fe1-8194-e00e1892f6ce)

### POST GraphQL - Listar Mercadorias
![POST GraphQL - Listar Mercadorias](https://github.com/user-attachments/assets/a87cfd5b-fd75-4e37-a56c-c4abd3e79c8e)

### POST GraphQL - Adicionar Mercadoria
![POST GraphQL - Adicionar Mercadoria](https://github.com/user-attachments/assets/dff9cc99-9318-421c-981d-63876237967d)

### POST SOAP - Listar Mercadorias
![POST SOAP - Listar Mercadorias](https://github.com/user-attachments/assets/91ce97d2-dfd7-422b-bb2e-57d66ba240d1)

## Esquema de Validação
A estrutura de cada mercadoria segue este formato:
```
type Mercadoria {
  id: Int!
  descricao: String!
  origem: String!
  destino: String!
  peso: Float!
}
```

## Validações esperadas:
- **id:** gerado automaticamente pelo backend.
- **descricao:** deve ser uma string não vazia.
- **origem e destino:** strings representando cidades válidas.
- **peso:** número decimal maior que zero.

## Autor
João Coelho



