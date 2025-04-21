const express = require('express');
const fs = require('fs');
const soap = require('soap');

const app = express();
const databaseFile = 'mercadorias.json';

function loadData() {
    try {
        return JSON.parse(fs.readFileSync(databaseFile));
    } catch (error) {
        return [];
    }
}

const service = {
    MercadoriaService: {
        MercadoriaPort: {
            ListarMercadorias: (args, callback) => {
                callback(null, { mercadorias: loadData() });
            }
        }
    }
};

const wsdl = `
<definitions name="MercadoriaService" targetNamespace="http://example.com/mercadoria"
    xmlns="http://schemas.xmlsoap.org/wsdl/" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
    xmlns:tns="http://example.com/mercadoria" xmlns:xsd="http://www.w3.org/2001/XMLSchema">

    <message name="ListarMercadoriasRequest"/>
    <message name="ListarMercadoriasResponse">
        <part name="mercadorias" type="xsd:string"/>
    </message>

    <portType name="MercadoriaPortType">
        <operation name="ListarMercadorias">
            <input message="tns:ListarMercadoriasRequest"/>
            <output message="tns:ListarMercadoriasResponse"/>
        </operation>
    </portType>

    <binding name="MercadoriaBinding" type="tns:MercadoriaPortType">
        <soap:binding style="rpc" transport="http://schemas.xmlsoap.org/soap/http"/>
        <operation name="ListarMercadorias">
            <soap:operation soapAction="http://example.com/mercadoria/ListarMercadorias"/>
            <input>
                <soap:body use="encoded" namespace="http://example.com/mercadoria" encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>
            </input>
            <output>
                <soap:body use="encoded" namespace="http://example.com/mercadoria" encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>
            </output>
        </operation>
    </binding>

    <service name="MercadoriaService">
        <port name="MercadoriaPort" binding="tns:MercadoriaBinding">
            <soap:address location="http://192.168.246.58:3001/soap"/>
        </port>
    </service>
</definitions>
`;

app.listen(3001, () => {
    console.log('Servidor SOAP rodando na porta 3001');
    soap.listen(app, '/soap', service, wsdl);
});
