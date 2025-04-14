const axios = require('axios');
const fs = require('fs');
const xml2js = require('xml2js');
const soapRequest = require('easy-soap-request');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = './transporte.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const transporteProto = grpc.loadPackageDefinition(packageDefinition).transporte;
const grpcClient = new transporteProto.Transporte('localhost:50051', grpc.credentials.createInsecure());

const REST_URL = 'http://localhost:3000';

const GRAPHQL_URL = 'http://localhost:4000/graphql';

const SOAP_URL = 'http://localhost:8000/soap?wsdl';

// FUNÇÕES

async function listarREST() {
    const res = await axios.get(`${REST_URL}/mercadorias`);
    console.log('\n[REST] Lista de mercadorias:');
    console.log(res.data);
}

async function listarGraphQL() {
    const res = await axios.post(GRAPHQL_URL, {
        query: `{ mercadorias { id descricao origem destino peso } }`
    });
    console.log('\n[GraphQL] Lista de mercadorias:');
    console.log(res.data.data.mercadorias);
}

async function listarSOAP() {
    const xml = `<?xml version="1.0"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tran="http://transporte">
      <soapenv:Header/>
      <soapenv:Body>
        <tran:ListarMercadorias/>
      </soapenv:Body>
    </soapenv:Envelope>`;

    const headers = {
        'Content-Type': 'text/xml',
        'SOAPAction': ''
    };

    const { response } = await soapRequest({ url: SOAP_URL, headers, xml });
    const { body } = response;
    console.log('\n[SOAP] Resposta:');
    console.log(body);
}

function listarGRPC() {
    grpcClient.ListarMercadorias({}, (err, response) => {
        if (err) {
            console.error('Erro no gRPC:', err);
        } else {
            console.log('\n[gRPC] Lista de mercadorias:');
            console.log(response.mercadorias);
        }
    });
}

// IMPORTAÇÃO / EXPORTAÇÃO
async function importarJSON() {
    const data = JSON.parse(fs.readFileSync('mercadorias.json', 'utf8'));
    for (const mercadoria of data) {
        await axios.post(`${REST_URL}/mercadorias`, mercadoria);
        console.log(`Importado JSON: ${mercadoria.descricao}`);
    }
}

async function exportarJSON() {
    const res = await axios.get(`${REST_URL}/mercadorias`);
    fs.writeFileSync('exportado.json', JSON.stringify(res.data, null, 2));
    console.log('Exportado para exportado.json');
}

async function importarXML() {
    const xml = fs.readFileSync('mercadorias.xml', 'utf8');
    const result = await xml2js.parseStringPromise(xml);
    const mercadorias = result.mercadorias.mercadoria.map(m => ({
        id: parseInt(m.id[0]),
        descricao: m.descricao[0],
        origem: m.origem[0],
        destino: m.destino[0],
        peso: parseFloat(m.peso[0])
    }));

    for (const mercadoria of mercadorias) {
        await axios.post(`${REST_URL}/mercadorias`, mercadoria);
        console.log(`Importado XML: ${mercadoria.descricao}`);
    }
}

async function exportarXML() {
    const res = await axios.get(`${REST_URL}/mercadorias`);
    const builder = new xml2js.Builder({ rootName: 'mercadorias' });
    const xml = builder.buildObject({ mercadoria: res.data });
    fs.writeFileSync('exportado.xml', xml);
    console.log('Exportado para exportado.xml');
}

// EXECUÇÃO

async function main() {
    console.log('\n--- Transporte de Mercadorias ---');

    await listarREST();
    await listarGraphQL();
    await listarSOAP();
    listarGRPC();

    await importarJSON();
    await exportarJSON();

    await importarXML();
    await exportarXML();
}

main();
