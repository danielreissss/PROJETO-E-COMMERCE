// tests/compra.test.js

require('dotenv').config();

const request = require('supertest');
const { app } = require('../index.js');
const db = require('../backend/database.js');

let testClienteId;
let testCompraId;

describe('Testes das Rotas de Compra (/api/compras)', () => {
  beforeAll(async () => {
    const novoCliente = {
      nome: 'Cliente de Compras',
      email: 'compras@email.com',
      senha: '123',
    };

    const response = await request(app)
      .post('/api/clientes/register')
      .send(novoCliente);

    testClienteId = response.body.id;
    expect(testClienteId).toBeDefined();
  });

  afterAll(async () => {
    const query = 'DELETE FROM cliente WHERE email IN (?, ?, ?)';
    await db.query(query, [
      'compras@email.com',
      'teste@email.com',
      'admin@email.com',
    ]);
    await db.end();
  });

  it('Deve criar uma nova compra (POST /api/compras)', async () => {
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

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    testCompraId = response.body.id;
  });

  it('Deve buscar a compra recém-criada (GET /api/compras/:id)', async () => {
    const response = await request(app).get(`/api/compras/${testCompraId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(testCompraId);
    expect(response.body.cliente_id).toBe(testClienteId);
    expect(response.body.produtos).toBeInstanceOf(Array);
    expect(response.body.produtos.length).toBe(2);
  });

  it('Deve atualizar o status da compra (PUT /api/compras/:id)', async () => {
    const statusUpdate = { status: 'Enviado' };

    const response = await request(app)
      .put(`/api/compras/${testCompraId}`)
      .send(statusUpdate);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain('Compra atualizada com sucesso.');
  });

  it('Deve deletar a compra (DELETE /api/compras/:id)', async () => {
    const response = await request(app).delete(
      `/api/compras/${testCompraId}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain('Compra deletada com sucesso!');
  });

  it('Deve retornar 404 ao tentar buscar a compra deletada', async () => {
    const response = await request(app).get(
      `/api/compras/${testCompraId}`
    );

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toContain('Compra não encontrada.');
  });
});
