require("dotenv").config(); // ADICIONADO: Apenas por segurança
const request = require('supertest'); 
const app = require('../index.js'); 
// const db = require('../backend/database.js'); // REMOVIDO: Não é usado aqui

let produtoIdCriado;

describe('Testes das Rotas de Produtos (/api/produtos)', () => {

    it('Deve listar todos os produtos (GET /api/produtos)', async () => {
        const response = await request(app).get('/api/produtos');

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array); 
        expect(response.body.length).toBe(60); 
    });

    it('Deve buscar um produto específico pelo ID (GET /api/produtos/1)', async () => {
        const response = await request(app).get('/api/produtos/1'); 

        expect(response.statusCode).toBe(200); 
        expect(response.body).toHaveProperty('id', 1); 
        expect(response.body.marca).toBe('Logitech'); 
    });

    it('Deve retornar 404 para um produto inexistente (GET /api/produtos/9999)', async () => {
        const response = await request(app).get('/api/produtos/9999'); 

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toContain('Produto não encontrado'); 
    });

    it('Deve criar um novo produto (POST /api/produtos)', async () => {
        const novoProduto = {
            marca: "Teste",
            modelo: "Produto Teste 1",
            tipo_produto: "Teste",
            preco: 100.00,
            estoque: 10
        };

        const response = await request(app)
            .post('/api/produtos')
            .send(novoProduto); 

        expect(response.statusCode).toBe(201); 
        expect(response.body).toHaveProperty('insertId'); 
        
        produtoIdCriado = response.body.insertId; 
    });

    it('Deve atualizar o produto recém-criado (PUT /api/produtos/:id)', async () => {
        const dadosAtualizados = {
            preco: 150.00,
            estoque: 5
        };

        const response = await request(app)
            .put(`/api/produtos/${produtoIdCriado}`) 
            .send(dadosAtualizados); 

        expect(response.statusCode).toBe(200);
        expect(Number(response.body.id)).toBe(produtoIdCriado);
        expect(response.body.preco).toBe(150); 
        expect(response.body.estoque).toBe(5);
    });

    it('Deve deletar o produto recém-criado (DELETE /api/produtos/:id)', async () => {
        const response = await request(app)
            .delete(`/api/produtos/${produtoIdCriado}`); 

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain('Produto foi deletado com sucesso!'); 
    });

    it('Deve retornar 404 ao tentar buscar o produto deletado', async () => {
        const response = await request(app)
            .get(`/api/produtos/${produtoIdCriado}`); 

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toContain('Produto não encontrado'); 
    });
});