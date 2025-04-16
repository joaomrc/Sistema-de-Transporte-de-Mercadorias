const express = require('express');
const fs = require('fs');
const path = require('path'); 
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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

app.get('/mercadorias', (req, res) => {
    res.json(loadData());
});

app.post('/mercadorias', (req, res) => {
    const data = loadData();

    const novoId = data.length > 0 ? Math.max(...data.map(m => m.id)) + 1 : 1;

    const novaMercadoria = {
        id: novoId,
        descricao: req.body.descricao,
        origem: req.body.origem,
        destino: req.body.destino,
        peso: req.body.peso
    };

    data.push(novaMercadoria);
    saveData(data);
    res.json({ message: 'Mercadoria adicionada', mercadoria: novaMercadoria });
});

app.put('/mercadorias/:id', (req, res) => {
    const data = loadData();
    const id = parseInt(req.params.id);
    const index = data.findIndex(m => m.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Mercadoria não encontrada' });
    }

    data[index] = {
        ...data[index],
        descricao: req.body.descricao,
        origem: req.body.origem,
        destino: req.body.destino,
        peso: req.body.peso
    };

    saveData(data);
    res.json({ message: 'Mercadoria atualizada com sucesso', mercadoria: data[index] });
});


app.delete('/mercadorias/:id', (req, res) => {
    let data = loadData();
    data = data.filter(m => m.id !== parseInt(req.params.id));
    saveData(data);
    res.json({ message: 'Mercadoria removida' });
});

function exportarParaXML() {
    const data = loadData();
    const builder = new xml2js.Builder();
    const xml = builder.buildObject({ Mercadorias: { Mercadoria: data } });
    fs.writeFileSync('mercadorias.xml', xml);
}

app.get('/exportar/xml', (req, res) => {
    exportarParaXML();
    res.json({ message: 'Exportação para XML concluída' });
});

// NOVA ROTA PARA FAZER DOWNLOAD DO XML
app.get('/download/xml', (req, res) => {
    const filePath = path.join(__dirname, 'mercadorias.xml');
    res.download(filePath, 'mercadorias.xml', (err) => {
        if (err) {
            res.status(500).send('Erro ao fazer download.');
        }
    });
});

function importarDeXML() {
    const xml = fs.readFileSync('mercadorias.xml', 'utf8');
    xml2js.parseString(xml, (err, result) => {
        if (err) throw err;
        saveData(result.Mercadorias.Mercadoria);
    });
}

app.get('/importar/xml', (req, res) => {
    importarDeXML();
    res.json({ message: 'Importação de XML concluída' });
});

const PROTO_PATH = './transporte.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const transporteProto = grpc.loadPackageDefinition(packageDefinition).transporte;

function listarMercadorias(call, callback) {
    const data = loadData();
    callback(null, { mercadorias: data });
}

const server = new grpc.Server();
server.addService(transporteProto.Transporte.service, { listarMercadorias });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});

app.listen(3000, () => console.log('Servidor REST a rodar na porta 3000'));
