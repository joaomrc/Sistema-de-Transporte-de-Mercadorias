const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require('fs');

const app = express();
const databaseFile = 'mercadorias.json';

function loadData() {
    try {
        return JSON.parse(fs.readFileSync(databaseFile));
    } catch (error) {
        return [];
    }
}

function saveData(data) {
    fs.writeFileSync(databaseFile, JSON.stringify(data, null, 4));
}

const schema = buildSchema(`
    type Mercadoria {
        id: Int
        descricao: String
        origem: String
        destino: String
        peso: Float
    }
    type Query {
        listarMercadorias: [Mercadoria]
    }
    type Mutation {
        adicionarMercadoria(id: Int, descricao: String, origem: String, destino: String, peso: Float): Mercadoria
    }
`);

const root = {
    listarMercadorias: () => loadData(),
    adicionarMercadoria: ({ id, descricao, origem, destino, peso }) => {
        const data = loadData();
        const novaMercadoria = { id, descricao, origem, destino, peso };
        data.push(novaMercadoria);
        saveData(data);
        return novaMercadoria;
    }
};

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}));

app.listen(3002, () => {
    console.log('Servidor GraphQL rodando na porta 3002');
});
