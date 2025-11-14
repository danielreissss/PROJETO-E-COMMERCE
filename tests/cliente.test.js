const request = require('supertest');
const app = require('../index.js');
const db = require('../backend/database.js');

// Variáveis para guardar os dados dos testes
let testUserToken, testUserId;
let adminUserToken, adminUserId;

describe('Testes de Usuário Padrão (/api/clientes)', () => {

    // --- TESTE 'CREATE' (Register) ---
    it('Deve registrar um novo cliente (POST /api/clientes/register)', async () => {
        const novoCliente = {
            nome: "Usuario Teste",
            email: "teste@email.com",
            senha: "123456",
            cargo: "padrao"
        };

        const response = await request(app)
            .post('/api/clientes/register')
            .send(novoCliente);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.email).toBe("teste@email.com");
        
        testUserId = response.body.id; 
    });

    // --- TESTE DE LOGIN ---
    it('Deve fazer login com o cliente recém-criado (POST /api/clientes/login)', async () => {
        const credenciais = {
            email: "teste@email.com",
            senha: "123456" 
        };

        const response = await request(app)
            .post('/api/clientes/login')
            .send(credenciais);

        expect(response.statusCode).toBe(200);
        expect(response.body.auth).toBe(true);
        expect(response.body).toHaveProperty('token');
        
        testUserToken = response.body.token; 
    });

    it('Deve falhar ao tentar logar com senha errada', async () => {
        const credenciais = {
            email: "teste@email.com",
            senha: "senhaerrada" 
        };

        const response = await request(app)
            .post('/api/clientes/login')
            .send(credenciais);

        expect(response.statusCode).toBe(401); 
        expect(response.body.auth).toBe(false);
        expect(response.body.message).toContain("Senha inválida!"); //
    });

    // --- TESTE DE ROTA PROTEGIDA (GET /:id) ---
    it('Deve FALHAR ao acessar uma rota protegida SEM token', async () => {
        const response = await request(app)
            .get(`/api/clientes/${testUserId}`); 

        expect(response.statusCode).toBe(401); 
        expect(response.body.message).toContain("Token não fornecido"); //
    });

    it('Deve ter SUCESSO ao acessar uma rota protegida COM token', async () => {
        const response = await request(app)
            .get(`/api/clientes/${testUserId}`)
            .set('Authorization', `Bearer ${testUserToken}`); // Envia o token

        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(testUserId);
        expect(response.body.email).toBe("teste@email.com");
    });
});

describe('Testes de Administrador (Rota Restrita)', () => {

    // Primeiro, precisamos criar e logar como admin
    it('Deve registrar um novo administrador (POST /api/clientes/register)', async () => {
        const novoAdmin = {
            nome: "Admin Teste",
            email: "admin@email.com",
            senha: "123456",
            cargo: "administrador" // Define o cargo
        };

        const response = await request(app)
            .post('/api/clientes/register')
            .send(novoAdmin);

        expect(response.statusCode).toBe(201);
        expect(response.body.cargo).toBe("administrador");
        adminUserId = response.body.id;
    });

    it('Deve fazer login como administrador (POST /api/clientes/login)', async () => {
        const credenciais = {
            email: "admin@email.com",
            senha: "123456"
        };

        const response = await request(app)
            .post('/api/clientes/login')
            .send(credenciais);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
        adminUserToken = response.body.token; // Salva o token do admin
    });

    // --- TESTE DE ROTA DE ADMIN (DELETE /:id) ---
    
    it('Deve FALHAR ao tentar deletar um cliente com um token de usuário "padrao"', async () => {
        // Tenta deletar o usuário 'teste@email.com' usando o token de 'teste@email.com'
        const response = await request(app)
            .delete(`/api/clientes/${testUserId}`)
            .set('Authorization', `Bearer ${testUserToken}`); // Token de usuário padrão

        expect(response.statusCode).toBe(403); // 403 Forbidden
        expect(response.body.message).toContain("Acesso restrito a administradores"); //
    });

    it('Deve ter SUCESSO ao deletar um cliente com um token de "administrador"', async () => {
        // Tenta deletar o usuário 'teste@email.com' (testUserId)
        // Usando o token do 'admin@email.com' (adminUserToken)
        const response = await request(app)
            .delete(`/api/clientes/${testUserId}`)
            .set('Authorization', `Bearer ${adminUserToken}`); // Token de ADMIN

        expect(response.statusCode).toBe(200); // 200 OK
        expect(response.body.message).toContain("Cliente foi deletado com sucesso!"); //
    });

});