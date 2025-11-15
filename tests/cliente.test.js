// Carrega variáveis de ambiente do .env (garantia para NODE_ENV, DB etc.)
require('dotenv').config();

const request = require('supertest');
// Importa apenas o app (sem subir servidor) para uso pelo supertest
const { app } = require('../index.js');
// const db = require('../backend/database.js'); // Não utilizado neste arquivo

// Armazena dados do usuário padrão criado durante os testes
let testUserToken;
let testUserId;

// Armazena dados do usuário administrador criado durante os testes
let adminUserToken;
let adminUserId;

// ---------------------------------------------------------
// Testes relacionados a um usuário com cargo "padrao"
// ---------------------------------------------------------
describe('Testes de Usuário Padrão (/api/clientes)', () => {
  it('Deve registrar um novo cliente (POST /api/clientes/register)', async () => {
    // Dados do novo cliente padrão a ser criado
    const novoCliente = {
      nome: 'Usuario Teste',
      email: 'teste@email.com',
      senha: '123456',
      cargo: 'padrao',
    };

    const response = await request(app)
      .post('/api/clientes/register')
      .send(novoCliente);

    // Verifica se o cliente foi criado corretamente
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(novoCliente.email);

    // Guarda o id para ser usado em outros testes (buscar/deletar etc.)
    testUserId = response.body.id;
  });

  it('Deve fazer login com o cliente recém-criado (POST /api/clientes/login)', async () => {
    // Credenciais corretas do usuário padrão
    const credenciais = {
      email: 'teste@email.com',
      senha: '123456',
    };

    const response = await request(app)
      .post('/api/clientes/login')
      .send(credenciais);

    // Espera login bem-sucedido com token JWT retornado
    expect(response.statusCode).toBe(200);
    expect(response.body.auth).toBe(true);
    expect(response.body).toHaveProperty('token');

    // Guarda o token para testar rotas protegidas
    testUserToken = response.body.token;
  });

  it('Deve falhar ao tentar logar com senha errada', async () => {
    // Mesma conta, mas com senha incorreta
    const credenciais = {
      email: 'teste@email.com',
      senha: 'senhaerrada',
    };

    const response = await request(app)
      .post('/api/clientes/login')
      .send(credenciais);

    // Espera falha de autenticação
    expect(response.statusCode).toBe(401);
    expect(response.body.auth).toBe(false);
    expect(response.body.message).toContain('Senha inválida!');
  });

  it('Deve FALHAR ao acessar uma rota protegida SEM token', async () => {
    // Tentativa de acessar dados do cliente sem enviar Authorization
    const response = await request(app).get(`/api/clientes/${testUserId}`);

    // Espera erro de autorização por ausência de token
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toContain('Acesso negado. Token não fornecido.');
  });

  it('Deve ter SUCESSO ao acessar uma rota protegida COM token', async () => {
    // Acessa a mesma rota agora enviando o token JWT no header Authorization
    const response = await request(app)
      .get(`/api/clientes/${testUserId}`)
      .set('Authorization', `Bearer ${testUserToken}`);

    // Espera obter os dados do cliente autenticado
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(testUserId);
    expect(response.body.email).toBe('teste@email.com');
  });
});

// ---------------------------------------------------------
// Testes relacionados a um usuário com cargo "administrador"
// focando em funcionalidades restritas (ex.: delete de cliente)
// ---------------------------------------------------------
describe('Testes de Administrador (Rota Restrita)', () => {
  it('Deve registrar um novo administrador (POST /api/clientes/register)', async () => {
    // Dados do administrador a ser criado
    const novoAdmin = {
      nome: 'Admin Teste',
      email: 'admin@email.com',
      senha: '123456',
      cargo: 'administrador',
    };

    const response = await request(app)
      .post('/api/clientes/register')
      .send(novoAdmin);

    // Se criou agora: 201. Se já existia de execuções anteriores: 409 (conflito).
    expect([201, 409]).toContain(response.statusCode);

    if (response.statusCode === 201) {
      // Admin criado nesta execução de teste
      expect(response.body.cargo).toBe('administrador');
      adminUserId = response.body.id;
    } else {
      // Admin já existia: realiza login apenas para garantir token e acesso
      const loginRes = await request(app)
        .post('/api/clientes/login')
        .send({ email: novoAdmin.email, senha: novoAdmin.senha });

      expect(loginRes.statusCode).toBe(200);
      expect(loginRes.body).toHaveProperty('token');
      // Se for necessário o adminUserId, ele pode ser obtido por rota específica (/me, etc.)
    }
  });

  it('Deve fazer login como administrador (POST /api/clientes/login)', async () => {
    // Credenciais do administrador
    const credenciais = {
      email: 'admin@email.com',
      senha: '123456',
    };

    const response = await request(app)
      .post('/api/clientes/login')
      .send(credenciais);

    // Espera login bem-sucedido e token JWT de admin
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');

    // Salva token de administrador para usar em rotas protegidas de admin
    adminUserToken = response.body.token;
  });

  it('Deve FALHAR ao tentar deletar um cliente com um token de usuário "padrao"', async () => {
    // Tenta deletar o cliente usando o token do usuário padrão (sem permissão)
    const response = await request(app)
      .delete(`/api/clientes/${testUserId}`)
      .set('Authorization', `Bearer ${testUserToken}`);

    // Espera erro de autorização por falta de privilégios de administrador
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toContain('Acesso restrito a administradores');
  });

  it('Deve ter SUCESSO ao deletar um cliente com um token de "administrador"', async () => {
    // Agora executa o delete usando o token do administrador
    const response = await request(app)
      .delete(`/api/clientes/${testUserId}`)
      .set('Authorization', `Bearer ${adminUserToken}`);

    // Espera remoção bem-sucedida do cliente
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain('Cliente foi deletado com sucesso!');
  });
});
