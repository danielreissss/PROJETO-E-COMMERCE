const request = require('supertest');
const app = require('../index.js');
const db = require('../backend/database.js');

// Variáveis para guardar IDs de teste
let testClienteId;
let testCompraId;

describe('Testes das Rotas de Compra (/api/compras)', () => {

    // --- SETUP (beforeAll) ---
    // CORREÇÃO: Convertido para async/await para garantir que termine antes dos testes
    beforeAll(async () => {
        const novoCliente = {
            nome: "Cliente de Compras",
            email: "compras@email.com",
            senha: "123"
        };
        
        // Usamos a API para registrar o cliente e esperamos a resposta
        const response = await request(app)
            .post('/api/clientes/register')
            .send(novoCliente);
            
        testClienteId = response.body.id; // Salva o ID do cliente
    });
    
    // --- TEARDOWN (afterAll) ---
    // CORREÇÃO: Convertido para async/await e usando .promise()
    afterAll(async () => {
        const query = 'DELETE FROM cliente WHERE email IN (?, ?, ?)';
        
        // Deleta os 3 clientes de teste
        await db.promise().query(query, ['compras@email.com', 'teste@email.com', 'admin@email.com']);
        
        await db.promise().end(); // Fecha a conexão principal
    });

    // --- TESTE 'CREATE' ---
    it('Deve criar uma nova compra (POST /api/compras)', async () => {
        const novaCompra = {
            cliente_id: testClienteId,
            produtos: [
                { produto_id: 1, quantidade: 2, preco_unitario: 1999.00 },
                { produto_id: 2, quantidade: 1, preco_unitario: 699.00 }
            ]
        };

        const response = await request(app)
            .post('/api/compras')
            .send(novaCompra);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.message).toContain("Compra registrada com sucesso!");
        
        testCompraId = response.body.id; // Salva o ID da compra
    });

    // --- TESTE 'READ ONE' ---
    it('Deve buscar a compra recém-criada (GET /api/compras/:id)', async () => {
        const response = await request(app)
            .get(`/api/compras/${testCompraId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(testCompraId);
        expect(response.body.cliente_id).toBe(testClienteId);
        expect(response.body.produtos).toBeInstanceOf(Array);
        expect(response.body.produtos.length).toBe(2);
        expect(response.body.produtos[0].produto_id).toBe(1);
    });

    // --- TESTE 'UPDATE' ---
    it('Deve atualizar o status da compra (PUT /api/compras/:id)', async () => {
        const statusUpdate = { status: "Enviado" };
        
        const response = await request(app)
            .put(`/api/compras/${testCompraId}`)
            .send(statusUpdate);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain("Compra atualizada com sucesso.");
    });

    // --- TESTE 'DELETE' ---
    it('Deve deletar a compra (DELETE /api/compras/:id)', async () => {
        const response = await request(app)
            .delete(`/api/compras/${testCompraId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain("Compra deletada com sucesso!");
    });

    // --- TESTE DE VERIFICAÇÃO ---
    it('Deve retornar 404 ao tentar buscar a compra deletada', async () => {
        const response = await request(app)
            .get(`/api/compras/${testCompraId}`);
            
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toContain("Compra não encontrada.");
    });
});