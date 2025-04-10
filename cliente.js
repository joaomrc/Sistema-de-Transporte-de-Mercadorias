const axios = require('axios');
const soap = require('soap');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');

const PROTO_PATH = './transporte.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const transporteProto = grpc.loadPackageDefinition(packageDefinition).transporte;

const grpcClient = new transporteProto.Transporte('localhost:50051', grpc.credentials.createInsecure());

async function testarREST() {
    console.log("\n[REST] Listando mercadorias...");
    const response = await axios.get('http://localhost:3000/mercadorias');
    console.log(response.data);
}

async function testarSOAP() {
    console.log("\n[SOAP] Listando mercadorias...");
    const url = 'http://localhost:3000/soap?wsdl';
    const client = await soap.createClientAsync(url);
    const result = await client.ListarMercadoriasAsync({});
    console.log(result);
}

function testarGRPC() {
    console.log("\n[gRPC] Listando mercadorias...");
    grpcClient.ListarMercadorias({}, (err, response) => {
        if (err) console.error(err);
        else console.log(response.mercadorias);
    });
}

async function testarGraphQL() {
    console.log("\n[GraphQL] Listando mercadorias...");
    const query = `{ listarMercadorias { id descricao origem destino peso } }`;
    const response = await axios.post('http://localhost:3000/graphql', { query });
    console.log(response.data);
}

async function testarTudo() {
    await testarREST();
    await testarSOAP();
    testarGRPC();
    await testarGraphQL();
}

testarTudo();