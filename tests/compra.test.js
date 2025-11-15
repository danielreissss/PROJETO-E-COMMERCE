// tests/compra.test.js

// Garante que variáveis de ambiente do .env sejam carregadas (DB, NODE_ENV etc.)
require('dotenv').config();

const request = require('supertest');
// Usa apenas o app (sem subir servidor) para fazer requisições HTTP em memória
const { app } = require('../index.js');
// Pool de conexão com o MySQL usado para limpar dados de teste e encerrar o banco
const db = require('../backend/database.js');

// Armazena o id do cliente criado especificamente para os testes de compra
let testClienteId;

// Armazena o id da compra criada durante os testes
let testCompraId;

// ------------------------------------------------------------------
// Testes de integração das rotas de Compra (/api/compras)
// ------------------------------------------------------------------
describe('Testes das Rotas de Compra (/api/compras)', () => {
  // beforeAll: executa uma vez antes de todos os testes deste bloco
  // Cria um cliente específico que será usado como "dono" das compras
  beforeAll(async () => {
    const novoCliente = {
      nome: 'Cliente de Compras',
      email: 'compras@email.com',
      senha: '123',
    };

    const response = await request(app)
      .post('/api/clientes/register')
      .send(novoCliente);

    // Guarda o id do cliente retornado pela API
    testClienteId = response.body.id;
    expect(testClienteId).toBeDefined();
  });

  // afterAll: executa uma vez após todos os testes deste bloco
  // Limpa clientes de teste criados e encerra o pool do banco
  afterAll(async () => {
    const query = 'DELETE FROM cliente WHERE email IN (?, ?, ?)';
    await db.query(query, [
      'compras@email.com',
      'teste@email.com',
      'admin@email.com',
    ]);

    // Encerra o pool de conexões do MySQL após os testes
    await db.end();
  });

  it('Deve criar uma nova compra (POST /api/compras)', async () => {
    // Corpo da requisição para criação de compra com dois produtos
    const novaCompra = {
      cliente_id: testClienteId,
      produtos: [
        { produto_id: 1, quantidade: 2, preco_unitario: 1999.0 },
        { produto_id: 2, quantidade: 1, preco_unitario: 699.0 },
      ],
    };

    const response = await request(app)
      .post('/api/compras')
      .send(novaCompra);

    // Verifica se a compra foi criada e retornou um id
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');

    // Salva o id da compra para os próximos testes
    testCompraId = response.body.id;
  });

  it('Deve buscar a compra recém-criada (GET /api/compras/:id)', async () => {
    const response = await request(app).get(`/api/compras/${testCompraId}`);

    // Verifica se a compra retornada é a mesma criada anteriormente
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(testCompraId);
    expect(response.body.cliente_id).toBe(testClienteId);

    // Garante que a API está retornando também a lista de produtos
    expect(response.body.produtos).toBeInstanceOf(Array);
    expect(response.body.produtos.length).toBe(2);
  });

  it('Deve atualizar o status da compra (PUT /api/compras/:id)', async () => {
    // Novo status a ser aplicado na compra
    const statusUpdate = { status: 'Enviado' };

    const response = await request(app)
      .put(`/api/compras/${testCompraId}`)
      .send(statusUpdate);

    // Verifica se a atualização foi aceita pela API
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain('Compra atualizada com sucesso.');
  });

  it('Deve deletar a compra (DELETE /api/compras/:id)', async () => {
    const response = await request(app).delete(`/api/compras/${testCompraId}`);

    // Verifica se a compra foi removida com sucesso
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain('Compra deletada com sucesso!');
  });

  it('Deve retornar 404 ao tentar buscar a compra deletada', async () => {
    // Tenta consultar novamente a compra já deletada
    const response = await request(app).get(`/api/compras/${testCompraId}`);

    // Espera que a API sinalize que o recurso não existe mais
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toContain('Compra não encontrada.');
  });
});
