require("dotenv").config(); // ADICIONADO: Apenas por segurança
const request = require('supertest');
const { app } = require('../index.js');
// const db = require('../backend/database.js'); // REMOVIDO: Não é usado aqui

let testUserToken, testUserId;
let adminUserToken, adminUserId;

describe('Testes de Usuário Padrão (/api/clientes)', () => {

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
        expect(response.body.message).toContain("Senha inválida!"); 
    });

    it('Deve FALHAR ao acessar uma rota protegida SEM token', async () => {
        const response = await request(app)
            .get(`/api/clientes/${testUserId}`); 

        expect(response.statusCode).toBe(401); 
        expect(response.body.message).toContain("Acesso negado. Token não fornecido."); 
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

    it('Deve registrar um novo administrador (POST /api/clientes/register)', async () => {
  const novoAdmin = {
    nome: "Admin Teste",
    email: "admin@email.com",
    senha: "123456",
    cargo: "administrador"
  };

  const response = await request(app)
    .post('/api/clientes/register')
    .send(novoAdmin);

  // Se criou agora, 201. Se já existia de rodadas anteriores, 409.
  expect([201, 409]).toContain(response.statusCode);

  if (response.statusCode === 201) {
    // criado agora
    expect(response.body.cargo).toBe("administrador");
    adminUserId = response.body.id;
  } else {
    // já existia: busca o admin existente para pegar o id
    const loginRes = await request(app)
      .post('/api/clientes/login')
      .send({ email: novoAdmin.email, senha: novoAdmin.senha });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
    // se você precisar do adminUserId depois, pode buscar com /me ou por query direta
  }
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
        adminUserToken = response.body.token; 
    });
    
    it('Deve FALHAR ao tentar deletar um cliente com um token de usuário "padrao"', async () => {
        const response = await request(app)
            .delete(`/api/clientes/${testUserId}`)
            .set('Authorization', `Bearer ${testUserToken}`); 

        expect(response.statusCode).toBe(403); 
        expect(response.body.message).toContain("Acesso restrito a administradores"); 
    });

    it('Deve ter SUCESSO ao deletar um cliente com um token de "administrador"', async () => {
        const response = await request(app)
            .delete(`/api/clientes/${testUserId}`)
            .set('Authorization', `Bearer ${adminUserToken}`); 

        expect(response.statusCode).toBe(200); 
        expect(response.body.message).toContain("Cliente foi deletado com sucesso!"); 
    });
});