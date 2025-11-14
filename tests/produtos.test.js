// Importa o supertest (o "cliente" que faz as requisições)
const request = require('supertest'); 
// Importa o app (nosso servidor) que exportamos do index.js
const app = require('../index.js'); 
// Importa a conexão do banco para fechar no final
const db = require('../backend/database.js'); 

// Variável para guardar o ID do produto que vamos criar
let produtoIdCriado;

// 1. Bloco principal que agrupa os testes de "Produtos"
describe('Testes das Rotas de Produtos (/api/produtos)', () => {

    // 2. Hook do Jest: Roda UMA VEZ depois de TODOS os testes
    afterAll(done => {
        db.end(done); 
    });

    // --- TESTES 'READ' (Já tínhamos) ---

    it('Deve listar todos os produtos (GET /api/produtos)', async () => {
        const response = await request(app).get('/api/produtos');

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array); 
        expect(response.body.length).toBe(60); //
    });

    it('Deve buscar um produto específico pelo ID (GET /api/produtos/1)', async () => {
        const response = await request(app).get('/api/produtos/1'); 

        expect(response.statusCode).toBe(200); 
        expect(response.body).toHaveProperty('id', 1); 
        expect(response.body.marca).toBe('Logitech'); //
    });

    it('Deve retornar 404 para um produto inexistente (GET /api/produtos/9999)', async () => {
        const response = await request(app).get('/api/produtos/9999'); 

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toContain('Produto não encontrado com id 9999'); //
    });

    // --- TESTE 'CREATE' (Novo) ---

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
            .send(novoProduto); // Envia o objeto no corpo da requisição

        expect(response.statusCode).toBe(201); // 201 = Created
        expect(response.body).toHaveProperty('insertId'); // Verifica se o BD retornou um ID
        
        // Guarda o ID para usar nos testes de PUT e DELETE
        produtoIdCriado = response.body.insertId; 
    });

    // --- TESTE 'UPDATE' (Novo) ---

    it('Deve atualizar o produto recém-criado (PUT /api/produtos/:id)', async () => {
        const dadosAtualizados = {
            preco: 150.00,
            estoque: 5
        };

        const response = await request(app)
            .put(`/api/produtos/${produtoIdCriado}`) // Usa o ID salvo
            .send(dadosAtualizados); // Envia os novos dados

        expect(response.statusCode).toBe(200);
        expect(Number(response.body.id)).toBe(produtoIdCriado);
        expect(response.body.preco).toBe("150.00"); // Preços voltam como string de DECIMAL
        expect(response.body.estoque).toBe(5);
    });

    // --- TESTE 'DELETE' (Novo) ---

    it('Deve deletar o produto recém-criado (DELETE /api/produtos/:id)', async () => {
        const response = await request(app)
            .delete(`/api/produtos/${produtoIdCriado}`); // Usa o ID salvo

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain('Produto foi deletado com sucesso!'); //
    });

    it('Deve retornar 404 ao tentar buscar o produto deletado', async () => {
        const response = await request(app)
            .get(`/api/produtos/${produtoIdCriado}`); // Tenta buscar o ID que acabamos de deletar

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toContain('Produto não encontrado'); //
    });

});